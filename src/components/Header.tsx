import React from 'react';
import { Scale, Bot, Code2, Filter, Rocket, ShieldCheck, Smartphone } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'miniapp', label: 'Telegram Mini App (TMA)', icon: Smartphone, badge: 'Yangi 🚀' },
    { id: 'runner', label: 'Botni Ishga Tushirish (Jonli)', icon: Rocket, badge: 'Telegramda Ishlatish' },
    { id: 'simulator', label: 'Botni Sinash (Simulyator)', icon: Bot, badge: 'Veb' },
    { id: 'code', label: 'Telegram Bot Kodi', icon: Code2, badge: 'Python' },
    { id: 'filter', label: 'Eski Qonunlar Filtr Mexanizmi', icon: Filter },
    { id: 'deploy', label: 'Qo\'llanma (VPS & Cloud)', icon: ShieldCheck },
  ];

  return (
    <header className="border-b border-slate-200 bg-white/95 backdrop-blur-md sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between py-4 gap-4">
          {/* Logo & Branding */}
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-blue-700 via-indigo-600 to-sky-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20 ring-2 ring-blue-100">
              <Scale className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">LexAI 2.0</h1>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse mr-1.5"></span>
                  Lex.uz Ulangan
                </span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                  Telegram Bot API
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Lex.uz bazasidan faqat amaldagi eng yangi qonunlarni topuvchi va eskirganlarini chiqarib tashlovchi AI
              </p>
            </div>
          </div>

          {/* Badges / Highlights */}
          <div className="flex items-center gap-2 text-xs">
            <div className="bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 border border-slate-200">
              <span className="text-blue-600 font-semibold">Gemini 3.8 Flash</span>
              <span className="text-slate-400">|</span>
              <span>Search Grounding</span>
            </div>
            <div className="bg-amber-50 text-amber-800 px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 border border-amber-200">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              <span>Eskilarini saralash: Aktiv</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex space-x-1 sm:space-x-2 overflow-x-auto pb-2 scrollbar-none">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-3.5 py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-all duration-150 whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/25 ring-1 ring-blue-700'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`ml-1 px-1.5 py-0.5 rounded text-[10px] font-bold ${
                      isActive ? 'bg-blue-500 text-white' : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
