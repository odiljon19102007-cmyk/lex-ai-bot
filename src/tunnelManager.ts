import { spawn, ChildProcess, execSync } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let tunnelProcess: ChildProcess | null = null;
let activeTunnelUrl: string | null = null;
let currentPort: number = 3000;
let healthCheckFailures = 0;
let watchdogInterval: any = null;
const listeners: Array<(url: string) => void> = [];

export function getActiveTunnelUrl(): string | null {
  return activeTunnelUrl || process.env.APP_URL || null;
}

export function onTunnelReady(callback: (url: string) => void) {
  if (activeTunnelUrl) {
    try {
      callback(activeTunnelUrl);
    } catch (e) {}
  }
  listeners.push(callback);
}

function notifyListeners(url: string) {
  activeTunnelUrl = url;
  for (const cb of listeners) {
    try {
      cb(url);
    } catch (e) {
      console.error("[Tunnel] Listener error:", e);
    }
  }
}

function findCloudflaredBinary(): string | null {
  const candidates = [
    path.resolve(process.cwd(), 'bin', 'cloudflared'),
    path.resolve(__dirname, '..', 'bin', 'cloudflared'),
    '/tmp/cloudflared',
  ];

  for (const c of candidates) {
    try {
      if (fs.existsSync(c)) {
        try {
          fs.chmodSync(c, 0o755);
        } catch (e) {}
        return c;
      }
    } catch (e) {}
  }

  // Auto-download cloudflared if missing
  try {
    const target = path.resolve(process.cwd(), 'bin', 'cloudflared');
    fs.mkdirSync(path.dirname(target), { recursive: true });
    console.log("[Tunnel] Auto-downloading static cloudflared binary...");
    execSync(`curl -sL https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64 -o "${target}" && chmod +x "${target}"`, { timeout: 30000 });
    if (fs.existsSync(target)) {
      console.log("[Tunnel] Cloudflared downloaded successfully!");
      return target;
    }
  } catch (err: any) {
    console.warn("[Tunnel] Auto-download error:", err.message);
  }

  return null;
}

export function startTunnel(port: number = 3000): Promise<string> {
  currentPort = port;
  const fallbackUrl = process.env.APP_URL || '';

  return new Promise((resolve) => {
    if (activeTunnelUrl && tunnelProcess && !tunnelProcess.killed) {
      return resolve(activeTunnelUrl);
    }

    const binPath = findCloudflaredBinary();

    if (!binPath) {
      console.warn("[Tunnel 24/7] cloudflared binary not found, using platform APP_URL fallback.");
      const resolvedFallback = fallbackUrl || `http://localhost:${port}`;
      activeTunnelUrl = resolvedFallback;
      notifyListeners(resolvedFallback);
      return resolve(resolvedFallback);
    }

    console.log(`[Tunnel 24/7] Launching cloudflared (${binPath}) on port ${port}...`);

    try {
      tunnelProcess = spawn(binPath, [
        'tunnel',
        '--protocol', 'http2',
        '--no-autoupdate',
        '--url', `http://127.0.0.1:${port}`
      ]);

      let resolved = false;

      const handleData = (chunk: Buffer | string) => {
        const text = chunk.toString();
        const match = text.match(/https:\/\/[a-zA-Z0-9-]+\.trycloudflare\.com/);
        if (match && !resolved) {
          resolved = true;
          const url = match[0];
          console.log(`[Tunnel 24/7] ✅ Public HTTPS URL active: ${url}`);
          healthCheckFailures = 0;
          notifyListeners(url);
          resolve(url);
        }
      };

      tunnelProcess.stdout?.on('data', handleData);
      tunnelProcess.stderr?.on('data', handleData);

      tunnelProcess.on('error', (err) => {
        console.warn("[Tunnel 24/7] Process notice:", err.message);
        if (!resolved) {
          resolved = true;
          const resolvedFallback = fallbackUrl || `http://localhost:${port}`;
          activeTunnelUrl = resolvedFallback;
          notifyListeners(resolvedFallback);
          resolve(resolvedFallback);
        }
      });

      tunnelProcess.on('exit', (code) => {
        if (code !== 0 && code !== null) {
          console.warn(`[Tunnel 24/7] Process exited (code ${code}).`);
        }
        activeTunnelUrl = null;
        setTimeout(() => {
          if (!activeTunnelUrl && binPath && fs.existsSync(binPath)) {
            startTunnel(currentPort).catch(() => {});
          }
        }, 3000);
      });

      // Timeout fallback to platform APP_URL
      setTimeout(() => {
        if (!resolved) {
          resolved = true;
          if (activeTunnelUrl) {
            resolve(activeTunnelUrl);
          } else {
            const resolvedFallback = fallbackUrl || `http://localhost:${port}`;
            console.log(`[Tunnel 24/7] Tunnel creation timeout, falling back to: ${resolvedFallback}`);
            activeTunnelUrl = resolvedFallback;
            notifyListeners(resolvedFallback);
            resolve(resolvedFallback);
          }
        }
      }, 12000);

      // Start periodic health-check watchdog
      initWatchdog();

    } catch (err: any) {
      console.warn("[Tunnel 24/7] Spawn error, falling back to APP_URL:", err?.message);
      const resolvedFallback = fallbackUrl || `http://localhost:${port}`;
      activeTunnelUrl = resolvedFallback;
      notifyListeners(resolvedFallback);
      resolve(resolvedFallback);
    }
  });
}

function initWatchdog() {
  if (watchdogInterval) return;

  watchdogInterval = setInterval(async () => {
    if (!activeTunnelUrl || activeTunnelUrl.includes('localhost')) {
      const binPath = findCloudflaredBinary();
      if (binPath) {
        startTunnel(currentPort).catch(() => {});
      }
      return;
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);
      const res = await fetch(`${activeTunnelUrl}/api/telegram/webapp-url`, {
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        healthCheckFailures = 0;
      } else {
        healthCheckFailures++;
      }
    } catch (e) {
      healthCheckFailures++;
    }

    if (healthCheckFailures >= 3) {
      healthCheckFailures = 0;
      stopTunnel();
      setTimeout(() => {
        startTunnel(currentPort).catch(() => {});
      }, 2000);
    }
  }, 30000);
}

export function stopTunnel() {
  if (tunnelProcess) {
    try {
      tunnelProcess.kill('SIGTERM');
    } catch (e) {}
    tunnelProcess = null;
  }
  activeTunnelUrl = null;
}
