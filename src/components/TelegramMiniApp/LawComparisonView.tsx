import React, { useState } from 'react';
import { 
  GitCompare, ExternalLink, ShieldCheck, 
  ArrowRight, CheckCircle2, XCircle, Sparkles
} from 'lucide-react';
import { useTelegram } from './TelegramContext';
import { LAW_COMPARISONS } from '../../data/telegramLegalPlatform';

export const LawComparisonView: React.FC = () => {
  const { theme, haptic, language } = useTelegram();
  const isDark = theme === 'dark';

  const [selectedCmpId, setSelectedCmpId] = useState<string>('cmp_mehnat');

  const selectedCmp = LAW_COMPARISONS.find((c) => c.id === selectedCmpId) || LAW_COMPARISONS[0];

  return (
    <div className="space-y-4 pb-20">
      {/* Header */}
      <div className={`p-5 rounded-3xl border ${
        isDark ? 'bg-gradient-to-r from-[#0c1429] to-[#111e3d] border-indigo-900/50 text-white' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-600 to-amber-600 flex items-center justify-center text-white font-bold shadow-md">
            <GitCompare className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold tracking-tight">
              {language === 'ru' ? 'Сравнение законов' : 'Qonunlarni Solishtirish'}
            </h2>
            <p className="text-xs text-slate-400">
              Eski bekor bo'lgan va yangi amaldagi qonunlarning qiyosiy tahlili
            </p>
          </div>
        </div>

        {/* Comparison Selector Chips */}
        <div className="mt-4 flex gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
          {LAW_COMPARISONS.map((cmp) => (
            <button
              key={cmp.id}
              onClick={() => {
                haptic('selection');
                setSelectedCmpId(cmp.id);
              }}
              className={`px-3 py-2 rounded-xl font-medium shrink-0 transition flex items-center gap-1.5 cursor-pointer ${
                selectedCmpId === cmp.id
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                  : isDark
                  ? 'bg-slate-800 text-slate-300 hover:text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <span>{cmp.icon}</span>
              <span>{cmp.title.split('—')[0]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Selected Comparison Card */}
      <div className={`p-5 rounded-3xl border space-y-4 ${
        isDark ? 'bg-[#0f172a] border-indigo-900/40 text-white' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-extrabold text-base text-amber-400">
              {selectedCmp.title}
            </h3>
            <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              {selectedCmp.status}
            </span>
          </div>
          <span className="text-2xl">{selectedCmp.icon}</span>
        </div>

        {/* Visual Diff Points */}
        <div className="space-y-3">
          {selectedCmp.points.map((pt, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-2xl border ${
                isDark ? 'bg-[#090f20] border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <h4 className="font-bold text-xs uppercase tracking-wider text-sky-400 mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>{pt.topic}</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {/* Old version (red) */}
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300">
                  <div className="flex items-center gap-1.5 font-bold mb-1 text-rose-400">
                    <XCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>Eski tahrir (Bekor qilingan):</span>
                  </div>
                  <p className="leading-relaxed">{pt.old}</p>
                </div>

                {/* Current version (green) */}
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">
                  <div className="flex items-center gap-1.5 font-bold mb-1 text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    <span>Yangi amaldagi qoida:</span>
                  </div>
                  <p className="leading-relaxed">{pt.current}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-2">
          <a
            href={selectedCmp.lexUrl}
            target="_blank"
            rel="noreferrer"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition cursor-pointer"
          >
            <span>Lex.uz rasmiy qonun matnini ko'rish</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
};
