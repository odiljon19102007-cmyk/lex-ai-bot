import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { LiveBotRunner } from './components/LiveBotRunner';
import { TelegramSimulator } from './components/TelegramSimulator';
import { CodeViewer } from './components/CodeViewer';
import { OutdatedLawFilterExplainer } from './components/OutdatedLawFilterExplainer';
import { DeployGuide } from './components/DeployGuide';
import { TelegramMiniApp } from './components/TelegramMiniApp/TelegramMiniApp';
import { Scale, ExternalLink } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('runner');
  const [isTelegramDirect, setIsTelegramDirect] = useState<boolean>(false);

  useEffect(() => {
    const webApp = (window as any).Telegram?.WebApp;
    const isTg = Boolean(
      (webApp && (
        (webApp.initData && webApp.initData.length > 0) ||
        webApp.initDataUnsafe?.user ||
        (webApp.platform && webApp.platform !== 'unknown')
      )) ||
      window.location.hash.includes('tgWebAppData') ||
      window.location.search.includes('tgWebAppPlatform') ||
      window.location.search.includes('mode=miniapp') ||
      window.location.search.includes('tma=true')
    );
    if (isTg) {
      setIsTelegramDirect(true);
      setActiveTab('miniapp');
      try {
        webApp?.ready?.();
        webApp?.expand?.();
      } catch (e) {}
    }
  }, []);

  // If opened directly as Telegram WebApp inside Telegram, render Mini App directly
  if (isTelegramDirect) {
    return <TelegramMiniApp />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Navigation & App Branding */}
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'miniapp' && <TelegramMiniApp />}
        {activeTab === 'runner' && <LiveBotRunner />}
        {activeTab === 'simulator' && <TelegramSimulator />}
        {activeTab === 'code' && <CodeViewer />}
        {activeTab === 'filter' && <OutdatedLawFilterExplainer />}
        {activeTab === 'deploy' && <DeployGuide />}
      </main>

      {/* Informative Footer & Official Portals */}
      <footer className="border-t border-slate-200 bg-white py-8 mt-12 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold">
                <Scale className="w-4 h-4" />
              </div>
              <div>
                <p className="font-semibold text-slate-800 text-sm">
                  LexAI O'zbekiston - Huquqiy Telegram Boti Tizimi
                </p>
                <p className="text-[11px] text-slate-400">
                  Qonunchilik ma'lumotlari milliy bazasi (Lex.uz) me'yorlari asosida ishlaydi
                </p>
              </div>
            </div>

            {/* Official Portals Links */}
            <div className="flex flex-wrap items-center gap-3 text-xs">
              <a
                href="https://lex.uz"
                target="_blank"
                rel="noreferrer"
                className="hover:text-blue-600 flex items-center gap-1 font-medium text-slate-600"
              >
                <span>Lex.uz Milliy Bazasi</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <span className="text-slate-300">•</span>
              <a
                href="https://minjust.uz"
                target="_blank"
                rel="noreferrer"
                className="hover:text-blue-600 flex items-center gap-1 font-medium text-slate-600"
              >
                <span>Adliya Vazirligi</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <span className="text-slate-300">•</span>
              <a
                href="https://my.gov.uz"
                target="_blank"
                rel="noreferrer"
                className="hover:text-blue-600 flex items-center gap-1 font-medium text-slate-600"
              >
                <span>My.Gov.uz Yagona Portali</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-400">
            <p>
              ⚠️ Eslatma: Ushbu AI yordamchi ma'lumot beruvchi xarakterga ega bo'lib, sud va tergov jarayonlarida litsenziyaga ega rasmiy advokat yoki yurist xizmatining o'rnini to'liq bosmaydi.
            </p>
            <p className="shrink-0 font-medium text-slate-500">
              © {new Date().getFullYear()} LexAI O'zbekiston. Barcha huquqlar himoyalangan.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
