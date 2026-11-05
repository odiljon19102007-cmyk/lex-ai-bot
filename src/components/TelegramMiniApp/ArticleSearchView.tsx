import React, { useState } from 'react';
import { 
  Search, Sparkles, ExternalLink, ShieldCheck, 
  Copy, Check, BookOpen, AlertTriangle, X
} from 'lucide-react';
import { useTelegram } from './TelegramContext';
import { fastLookupArticle } from '../../data/uzbekLawArticles';

export const ArticleSearchView: React.FC = () => {
  const { theme, haptic, language } = useTelegram();
  const isDark = theme === 'dark';

  const [searchQuery, setSearchQuery] = useState('');
  const [activeArticle, setActiveArticle] = useState<any>(() => fastLookupArticle('JK 28-modda'));
  const [copied, setCopied] = useState(false);

  const popularArticles = [
    { title: "JK 28-modda", label: "Jinoyatda ishtirokchilik turlari" },
    { title: "MK 130-modda", label: "Dastlabki sinov muddati" },
    { title: "MK 253-modda", label: "Ish haqini to'lash muddatlari" },
    { title: "MJtK 40-modda", label: "Tuhmat uchun ma'muriy jarima" },
    { title: "FK 732-modda", label: "Qarz shartnomasi va tilxat" },
    { title: "OK 16-modda", label: "Nikohga monelik qiluvchi holatlar" },
  ];

  const handleSearch = (q: string) => {
    haptic('medium');
    const result = fastLookupArticle(q);
    if (result) {
      setActiveArticle(result);
    } else {
      setActiveArticle({
        found: false,
        title: q,
        fullText: `🔍 "${q}" bo'yicha qidiruv natijasi:\n\nUshbu modda amaldagi O'zbekiston qonunchiligida mavjud bo'lib, to'liq matn bilan Lex.uz portalida tanishishingiz yoki Huquqiy AI orqali tahlil qilishingiz mumkin.`,
        lexUrl: 'https://lex.uz',
      });
    }
  };

  const copyArticleText = () => {
    if (!activeArticle) return;
    navigator.clipboard.writeText(activeArticle.fullText);
    setCopied(true);
    haptic('selection');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Search Header */}
      <div className={`p-5 rounded-3xl border ${
        isDark ? 'bg-gradient-to-r from-[#0c1429] to-[#111e3d] border-indigo-900/50 text-white' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold shadow-md">
            <Search className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold tracking-tight">
              {language === 'ru' ? 'Поиск статьи' : 'Modda Qidirish'}
            </h2>
            <p className="text-xs text-slate-400">
              Kodeks nomi va modda raqami orqali tezkor tahlil va rasmiy matn
            </p>
          </div>
        </div>

        {/* Input */}
        <div className="mt-4 flex gap-2">
          <div className="relative flex-1 flex items-center">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSearch(searchQuery);
              }}
              placeholder="Masalan: JK 28-modda yoki FK 732-modda..."
              className={`w-full pl-10 pr-10 py-2.5 rounded-xl text-xs sm:text-sm border focus:outline-none transition ${
                isDark 
                  ? 'bg-[#060c1c] text-white border-slate-800 focus:border-amber-400' 
                  : 'bg-slate-50 text-slate-900 border-slate-300 focus:border-blue-600'
              }`}
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />

            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="p-1 text-slate-400 hover:text-slate-200"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
          <button
            onClick={() => handleSearch(searchQuery)}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-xs transition cursor-pointer shadow-md"
          >
            Qidirish
          </button>
        </div>

        {/* Popular chips */}
        <div className="mt-3 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
          <span className="text-[10px] text-slate-400 uppercase font-semibold shrink-0">
            Mashhur:
          </span>
          {popularArticles.map((art, idx) => (
            <button
              key={idx}
              onClick={() => {
                setSearchQuery(art.title);
                handleSearch(art.title);
              }}
              className="shrink-0 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/15 border border-white/10 text-slate-200 text-[11px] font-medium transition cursor-pointer"
            >
              {art.title}
            </button>
          ))}
        </div>
      </div>

      {/* Article Result Card */}
      {activeArticle && (
        <div className={`p-5 rounded-3xl border space-y-4 ${
          isDark ? 'bg-[#0f172a] border-indigo-900/40 text-white' : 'bg-white border-slate-200 text-slate-900'
        }`}>
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                §
              </div>
              <div>
                <h3 className="font-bold text-sm sm:text-base text-amber-400">
                  {activeArticle.articleNumber || activeArticle.title || 'Modda Ma\'lumoti'}
                </h3>
                <p className="text-[11px] text-slate-400">
                  {activeArticle.codeTitle || "O'zbekiston Respublikasi Qonunchiligi"}
                </p>
              </div>
            </div>

            <button
              onClick={copyArticleText}
              className={`p-2 rounded-xl border text-xs flex items-center gap-1 cursor-pointer transition ${
                isDark ? 'bg-slate-800 text-slate-300 border-slate-700' : 'bg-slate-100 text-slate-700 border-slate-300'
              }`}
              title="Modda matnini nusxalash"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span className="text-[10px]">{copied ? 'Nusxalandi' : 'Nusxa'}</span>
            </button>
          </div>

          <div className={`p-4 rounded-2xl border font-sans text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
            isDark ? 'bg-[#080e1f] border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'
          }`}>
            {activeArticle.fullText}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <span className="text-[11px] text-emerald-400 flex items-center gap-1">
              <ShieldCheck className="w-4 h-4" />
              <span>Amaldagi qonun tahriri (Lex.uz)</span>
            </span>

            {activeArticle.lexUrl && (
              <a
                href={activeArticle.lexUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition cursor-pointer"
              >
                <span>Lex.uz'da to'liq ko'rish</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
