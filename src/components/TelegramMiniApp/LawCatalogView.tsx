import React, { useState } from 'react';
import { 
  BookOpen, Search, ExternalLink, ShieldCheck, 
  ChevronRight, ArrowLeft, FileText, CheckCircle2, Bookmark,
  Sparkles, X
} from 'lucide-react';
import { useTelegram } from './TelegramContext';
import { UZBEK_LEGAL_CODES } from '../../data/telegramLegalPlatform';

interface LawCatalogViewProps {
  onSelectArticle?: (query: string) => void;
}

export const LawCatalogView: React.FC<LawCatalogViewProps> = ({ onSelectArticle }) => {
  const { theme, haptic, language } = useTelegram();
  const isDark = theme === 'dark';

  const [selectedCodeId, setSelectedCodeId] = useState<string | null>(null);
  const [searchFilter, setSearchFilter] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: language === 'ru' ? 'Все' : 'Barchasi' },
    { id: 'mk', label: language === 'ru' ? 'Труд' : 'Mehnat' },
    { id: 'jk', label: language === 'ru' ? 'Уголовный' : 'Jinoyat' },
    { id: 'fk', label: language === 'ru' ? 'Гражданский' : 'Fuqarolik' },
    { id: 'sk', label: language === 'ru' ? 'Налоговый' : 'Soliq' },
    { id: 'mjtk', label: language === 'ru' ? 'Штрафы' : 'MJtK (Jarimalar)' },
  ];

  const filteredCodes = UZBEK_LEGAL_CODES.filter((c) => {
    const matchesSearch = c.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
      c.description.toLowerCase().includes(searchFilter.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || c.id === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const selectedCode = UZBEK_LEGAL_CODES.find((c) => c.id === selectedCodeId);

  return (
    <div className="space-y-4 pb-20">
      {/* Header */}
      <div className={`p-5 rounded-3xl border ${
        isDark ? 'bg-gradient-to-r from-[#0c1429] to-[#111e3d] border-indigo-900/50 text-white' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-600 flex items-center justify-center text-slate-950 font-bold shadow-md">
            <BookOpen className="w-5 h-5 text-slate-950" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold tracking-tight">
              {language === 'ru' ? 'База законодательства' : 'Qonunchilik Bazasi'}
            </h2>
            <p className="text-xs text-slate-400">
              Lex.uz rasmiy milliy bazasi asosidagi barcha amaldagi kodekslar
            </p>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="mt-4 space-y-2.5">
          <div className="relative flex items-center">
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Qonun yoki kodeks nomini qidiring..."
              className={`w-full pl-10 pr-10 py-2.5 rounded-xl text-xs sm:text-sm border focus:outline-none transition ${
                isDark 
                  ? 'bg-[#060c1c] text-white border-slate-800 focus:border-amber-400' 
                  : 'bg-slate-50 text-slate-900 border-slate-300 focus:border-blue-600'
              }`}
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
              {searchFilter && (
                <button
                  type="button"
                  onClick={() => setSearchFilter('')}
                  className="p-1 text-slate-400 hover:text-slate-200 transition"
                  title="Tozalash"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  haptic('selection');
                  setSelectedCategory(cat.id);
                }}
                className={`px-3 py-1.5 rounded-xl font-medium shrink-0 transition cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                    : isDark
                    ? 'bg-slate-800 text-slate-300 hover:text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Code details modal or list */}
      {selectedCode ? (
        <div className={`p-5 rounded-3xl border space-y-4 ${
          isDark ? 'bg-[#0f172a] border-indigo-900/50 text-white' : 'bg-white border-slate-200 text-slate-900'
        }`}>
          <button
            onClick={() => {
              haptic('light');
              setSelectedCodeId(null);
            }}
            className="flex items-center gap-1.5 text-xs font-semibold text-amber-400 hover:text-amber-300 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Ro'yxatga qaytish</span>
          </button>

          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-3xl">{selectedCode.icon}</span>
              <div>
                <h3 className="font-bold text-base">{selectedCode.title}</h3>
                <p className="text-xs text-slate-400">
                  {selectedCode.lawNumber} • {selectedCode.effectiveDate}
                </p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              {selectedCode.status}
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            {selectedCode.description}
          </p>

          <div className={`p-3 rounded-2xl border ${isDark ? 'bg-[#080e1e] border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
            <span className="text-[11px] font-bold text-amber-400 block mb-2">
              📌 Eng ko'p murojaat qilinadigan moddalar:
            </span>
            <div className="space-y-1.5">
              {selectedCode.sampleArticles.map((art, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    if (onSelectArticle) {
                      haptic('medium');
                      onSelectArticle(`${selectedCode.title} ${art}`);
                    }
                  }}
                  className={`p-2.5 rounded-xl border flex items-center justify-between text-xs cursor-pointer transition ${
                    isDark 
                      ? 'bg-slate-900/60 hover:bg-slate-800 border-slate-800 text-slate-200' 
                      : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-800'
                  }`}
                >
                  <span className="font-medium">{art}</span>
                  <span className="text-amber-400 text-[11px] font-semibold flex items-center gap-1">
                    <span>Tahlil</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between">
            <a
              href={selectedCode.lexUrl}
              target="_blank"
              rel="noreferrer"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition cursor-pointer"
            >
              <span>Lex.uz rasmiy matnini ochish</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredCodes.map((code) => (
            <div
              key={code.id}
              onClick={() => {
                haptic('light');
                setSelectedCodeId(code.id);
              }}
              className={`p-4 rounded-2xl border transition-all duration-200 cursor-pointer flex items-center justify-between group shadow-xs hover:shadow-md ${
                isDark
                  ? 'bg-[#0f172a] hover:bg-[#152347] border-indigo-900/40 hover:border-amber-400/50'
                  : 'bg-white hover:bg-slate-50 border-slate-200 hover:border-amber-400'
              }`}
            >
              <div className="flex items-center space-x-3.5">
                <div className="w-11 h-11 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-xl shrink-0 group-hover:scale-105 transition">
                  {code.icon}
                </div>
                <div>
                  <h4 className={`font-bold text-sm ${isDark ? 'text-white group-hover:text-amber-300' : 'text-slate-900'}`}>
                    {code.title}
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {code.lawNumber} • <span className="text-emerald-400 font-semibold">{code.articlesCount}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-[10px] hidden sm:inline-block px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  {code.status}
                </span>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-amber-400 group-hover:translate-x-1 transition" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
