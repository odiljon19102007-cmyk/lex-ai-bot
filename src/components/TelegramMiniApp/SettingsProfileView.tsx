import React, { useState } from 'react';
import { 
  Settings, User, Moon, Sun, Globe, ShieldCheck, 
  Trash2, ExternalLink, RefreshCw, CheckCircle2, Sliders, Smartphone
} from 'lucide-react';
import { useTelegram } from './TelegramContext';

export const SettingsProfileView: React.FC = () => {
  const { 
    user, theme, toggleTheme, language, setLanguage, 
    fontSize, setFontSize, isInsideTelegram, haptic 
  } = useTelegram();

  const isDark = theme === 'dark';
  const [cacheCleared, setCacheCleared] = useState(false);

  const handleClearCache = () => {
    haptic('heavy');
    setCacheCleared(true);
    setTimeout(() => setCacheCleared(false), 2500);
  };

  return (
    <div className="space-y-4 pb-20">
      {/* User Profile Card */}
      <div className={`p-5 rounded-3xl border ${
        isDark ? 'bg-gradient-to-r from-[#0c1429] to-[#111e3d] border-indigo-900/50 text-white' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        <div className="flex items-center space-x-3.5">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-600 flex items-center justify-center text-slate-950 font-bold text-xl shadow-lg shadow-amber-500/20">
            {user.first_name ? user.first_name[0] : 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-base truncate">
                {user.first_name} {user.last_name || ''}
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
                {isInsideTelegram ? 'Telegram TMA' : 'Veb Sessiya'}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5 truncate">
              @{user.username || 'huquq_user'} • ID: {user.id || '123456789'}
            </p>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-indigo-900/40 grid grid-cols-2 gap-2 text-xs">
          <div className={`p-2.5 rounded-xl border ${isDark ? 'bg-[#080e1e] border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
            <span className="text-[10px] text-slate-400 block">Qonunlar Tahlili</span>
            <span className="font-bold text-emerald-400">Lex.uz 2026 Aktiv</span>
          </div>
          <div className={`p-2.5 rounded-xl border ${isDark ? 'bg-[#080e1e] border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
            <span className="text-[10px] text-slate-400 block">Eskirgan Normalar</span>
            <span className="font-bold text-amber-400">Filtrlangan</span>
          </div>
        </div>
      </div>

      {/* Settings Options Card */}
      <div className={`p-5 rounded-3xl border space-y-4 ${
        isDark ? 'bg-[#0f172a] border-indigo-900/40 text-white' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        <h3 className="font-bold text-xs uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
          <Sliders className="w-4 h-4" />
          <span>Ilova va Interfeys Sozlamalari</span>
        </h3>

        {/* Language switch */}
        <div className={`p-3.5 rounded-2xl border flex items-center justify-between ${
          isDark ? 'bg-[#080e1e] border-slate-800' : 'bg-slate-50 border-slate-200'
        }`}>
          <div className="flex items-center space-x-2.5">
            <Globe className="w-4 h-4 text-sky-400" />
            <span className="text-xs font-semibold">Tizim tili (Язык):</span>
          </div>
          <div className="flex gap-1">
            <button
              onClick={() => {
                haptic('selection');
                setLanguage('uz');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                language === 'uz'
                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              O'zbekcha 🇺🇿
            </button>
            <button
              onClick={() => {
                haptic('selection');
                setLanguage('ru');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                language === 'ru'
                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Русский 🇷🇺
            </button>
          </div>
        </div>

        {/* Theme mode toggle */}
        <div className={`p-3.5 rounded-2xl border flex items-center justify-between ${
          isDark ? 'bg-[#080e1e] border-slate-800' : 'bg-slate-50 border-slate-200'
        }`}>
          <div className="flex items-center space-x-2.5">
            {isDark ? <Moon className="w-4 h-4 text-amber-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
            <span className="text-xs font-semibold">Mavzu (Theme):</span>
          </div>
          <button
            onClick={() => {
              haptic('selection');
              toggleTheme();
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition cursor-pointer flex items-center gap-1.5 ${
              isDark 
                ? 'bg-slate-800 text-amber-300 border-slate-700' 
                : 'bg-white text-slate-800 border-slate-300 shadow-xs'
            }`}
          >
            {isDark ? <span>🌙 To'q (Dark Navy)</span> : <span>☀️ Yorug' (Light)</span>}
          </button>
        </div>

        {/* Font size */}
        <div className={`p-3.5 rounded-2xl border flex items-center justify-between ${
          isDark ? 'bg-[#080e1e] border-slate-800' : 'bg-slate-50 border-slate-200'
        }`}>
          <span className="text-xs font-semibold">Matn o'lchami:</span>
          <div className="flex gap-1 text-xs font-bold">
            {(['sm', 'md', 'lg'] as const).map((sz) => (
              <button
                key={sz}
                onClick={() => {
                  haptic('selection');
                  setFontSize(sz);
                }}
                className={`px-2.5 py-1 rounded-lg border transition cursor-pointer ${
                  fontSize === sz
                    ? 'bg-amber-500 text-slate-950 border-amber-400'
                    : isDark
                    ? 'border-slate-800 text-slate-400'
                    : 'border-slate-300 text-slate-600'
                }`}
              >
                {sz === 'sm' ? 'Kichik' : sz === 'md' ? 'O\'rtacha' : 'Katta'}
              </button>
            ))}
          </div>
        </div>

        {/* Clear cache */}
        <button
          onClick={handleClearCache}
          className={`w-full p-3 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
            cacheCleared
              ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
              : 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border-rose-500/30'
          }`}
        >
          {cacheCleared ? (
            <>
              <CheckCircle2 className="w-4 h-4" />
              <span>Kesh va tarix muvaffaqiyatli tozalandi!</span>
            </>
          ) : (
            <>
              <Trash2 className="w-4 h-4" />
              <span>Suhbatlar va qidiruv keshini tozalash</span>
            </>
          )}
        </button>
      </div>

      {/* Official State Portals */}
      <div className={`p-5 rounded-3xl border space-y-3 ${
        isDark ? 'bg-[#0f172a] border-indigo-900/40 text-white' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400">
          Rasmiy Davlat Resurslari:
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
          <a
            href="https://lex.uz"
            target="_blank"
            rel="noreferrer"
            className={`p-2.5 rounded-xl border flex items-center justify-between transition cursor-pointer ${
              isDark ? 'bg-[#080e1e] hover:bg-[#121f3f] border-slate-800' : 'bg-slate-50 hover:bg-slate-100 border-slate-200'
            }`}
          >
            <span>Lex.uz Qonunchilik</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </a>

          <a
            href="https://minjust.uz"
            target="_blank"
            rel="noreferrer"
            className={`p-2.5 rounded-xl border flex items-center justify-between transition cursor-pointer ${
              isDark ? 'bg-[#080e1e] hover:bg-[#121f3f] border-slate-800' : 'bg-slate-50 hover:bg-slate-100 border-slate-200'
            }`}
          >
            <span>Adliya Vazirligi</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </a>

          <a
            href="https://my.gov.uz"
            target="_blank"
            rel="noreferrer"
            className={`p-2.5 rounded-xl border flex items-center justify-between transition cursor-pointer ${
              isDark ? 'bg-[#080e1e] hover:bg-[#121f3f] border-slate-800' : 'bg-slate-50 hover:bg-slate-100 border-slate-200'
            }`}
          >
            <span>My.Gov.uz Portali</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </a>
        </div>
      </div>
    </div>
  );
};
