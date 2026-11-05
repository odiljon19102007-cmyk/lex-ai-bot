import React, { useState } from 'react';
import { Terminal, Copy, Check, Server, Shield, Sparkles, Cpu, Globe } from 'lucide-react';

export const DeployGuide: React.FC = () => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copySnippet = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const steps = [
    {
      num: 1,
      title: "Telegram @BotFather orqali yangi bot yaratish",
      desc: "Telegram qidiruvidan @BotFather ni toping va unga `/newbot` buyrug'ini yuboring. Botingizga nom va username bering (masalan: `lex_uz_huquq_bot`). BotFather sizga Telegram Token beradi (masalan: `7123456789:AAEjf...`). Ushbu tokenni saqlab oling.",
      code: `/newbot
# Bot nomini kiriting: LexAI Huquqiy Maslahatchi
# Username kiriting (oxiri 'bot' bilan tugashi kerak): lex_uz_yordamchi_bot`,
    },
    {
      num: 2,
      title: "Google Gemini API Kalitini Olish",
      desc: "Google AI Studio (aistudio.google.com) orqali 'Get API Key' bo'limidan bepul Gemini API kalitini yarating. Bu kalit huquqiy tahlil qilish uchun kerak bo'ladi.",
      code: `# .env fayliga yozing:
TELEGRAM_BOT_TOKEN="sizning_telegram_tokeningiz"
GEMINI_API_KEY="sizning_gemini_api_kalitingiz"`,
    },
    {
      num: 3,
      title: "VPS server yoki lokal kompyuterda 24/7 ishlatish (Node.js & PM2)",
      desc: "Loyiha papkasida paketlarni o'rnating va PM2 yordamida jarayonni fonda to'xtovsiz ishga tushiring:",
      code: `# 1. Paketlarni o'rnatish
npm install

# 2. PM2 (Process Manager) orqali fon rejimida 24/7 ishga tushirish:
npm install -g pm2
pm2 start "npx tsx server.ts" --name "huquq-sphere-bot"

# 3. Server qayta yonganda avtomatik yonishi uchun:
pm2 save
pm2 startup`,
    },
    {
      num: 4,
      title: "Docker yordamida 1 ta buyruq bilan 24/7 to'xtovsiz ishlatish",
      desc: "Loyiha ildizida Dockerfile va docker-compose.yml tayyorlangan. Serveringizda Docker o'rnatilgan bo'lsa, quyidagi buyruqni bering:",
      code: `# Docker konteynerini fonda 24/7 ishga tushirish:
docker compose up -d --build

# Ishlash holati va loglarni ko'rish:
docker compose logs -f

# Konteyner o'chib qolsa, 'restart: always' qoidasi tufayli o'zi qayta yonadi!`,
    },
    {
      num: 5,
      title: "Linux (Ubuntu/Debian) Systemd xizmati (Muqobil variant)",
      desc: "Agar PM2 yoki Docker ishlatmasangiz, Linux tizimining o'z xizmati (systemd) orqali avtomatik qayta yonishni sozlang:",
      code: `sudo nano /etc/systemd/system/huquqbot.service

# Quyidagi matnni yozing va saqlang:
[Unit]
Description=Huquq Sphere Telegram Bot 24/7 Service
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/var/www/huquq-sphere
ExecStart=/usr/bin/npx tsx server.ts
Restart=always
RestartSec=3

[Install]
WantedBy=multi-user.target

# Xizmatni yoqish va ishga tushirish:
sudo systemctl daemon-reload
sudo systemctl enable huquqbot
sudo systemctl start huquqbot`,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Intro Box */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
            <Server className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base sm:text-lg">
              Telegram Botni 0 dan 100 gacha Ishga Tushirish Yo'riqnomasi
            </h3>
            <p className="text-xs text-slate-500">
              Quyidagi oddiy qadamlar yordamida o'z Telegram botingizni bir necha daqiqada ishga tushirishingiz mumkin.
            </p>
          </div>
        </div>
      </div>

      {/* Steps List */}
      <div className="space-y-4">
        {steps.map((st) => (
          <div key={st.num} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start space-x-3">
                <span className="w-7 h-7 rounded-lg bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  {st.num}
                </span>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm sm:text-base">{st.title}</h4>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">{st.desc}</p>
                </div>
              </div>
            </div>

            {/* Code Box */}
            <div className="mt-3 relative rounded-xl bg-slate-900 text-slate-200 p-4 font-mono text-xs overflow-x-auto border border-slate-800">
              <button
                onClick={() => copySnippet(st.code, `step-${st.num}`)}
                className="absolute top-2.5 right-2.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1 rounded-md border border-slate-700 flex items-center gap-1.5 transition cursor-pointer"
              >
                {copiedCode === `step-${st.num}` ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Nusxa olindi</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Nusxa</span>
                  </>
                )}
              </button>
              <pre className="pr-20">
                <code>{st.code}</code>
              </pre>
            </div>
          </div>
        ))}
      </div>

      {/* Cloud Deploy Options (Railway & Render) */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-2xl p-6 shadow-md border border-slate-800">
        <h4 className="font-bold text-base mb-2 flex items-center gap-2">
          <Globe className="w-5 h-5 text-sky-400" />
          Server sotib olmasdan bepul joylashtirish (Render / Railway)
        </h4>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
          Agar shaxsiy VPS serveringiz bo'lmasa, ushbu kodni <strong>GitHub</strong> repozitoriyingizga yuklab, bepul <strong>Railway.app</strong> yoki <strong>Render.com</strong> platformalariga 1 ta tugma orqali (Background Worker sifatida) joylashtirishingiz mumkin. Berilgan <code>Dockerfile</code> orqali ular avtomatik yig'ib beradi.
        </p>
        <div className="flex flex-wrap gap-2 text-xs">
          <span className="bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700">✓ 24/7 uzluksiz ishlash</span>
          <span className="bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700">✓ Avtomatik qayta yuklanish (Auto-restart)</span>
          <span className="bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700">✓ Bepul SSL va resurslar</span>
        </div>
      </div>
    </div>
  );
};
