import React from 'react';
import { 
  HelpCircle, Sparkles, BookOpen, FileText, 
  Send, ExternalLink, ShieldCheck, CheckCircle2, AlertCircle
} from 'lucide-react';
import { useTelegram } from './TelegramContext';
import { USER_GUIDE_TEXT } from '../../data/telegramLegalPlatform';

export const GuideView: React.FC = () => {
  const { theme, language } = useTelegram();
  const isDark = theme === 'dark';

  const steps = [
    {
      num: '1',
      title: "Savolingizni aniq yozing",
      desc: "Mehnat nizosi, qarz, jarima, aliment yoki oilaviy holatlarni oddiy so'zlar bilan yozishingiz kifoya.",
      icon: Send,
    },
    {
      num: '2',
      title: "Lex.uz filtri tekshiruvidan o'tadi",
      desc: "Tizim 1995-yilgi eskirgan normalarni darhol ajratib, faqat amaldagi eng yangi kodekslarni oladi.",
      icon: ShieldCheck,
    },
    {
      num: '3',
      title: "Sud va MIB hujjatlarini yarating",
      desc: "Hujjat tayyorlash bo'limi orqali da'vo arizasi va talabnomalarni tayyor nusxasini oling.",
      icon: FileText,
    },
    {
      num: '4',
      title: "Telegram ichida to'liq Mini App",
      desc: "Telegramdagi barcha suhbatlar va Mini App avtomatik sinxronlashadi.",
      icon: Sparkles,
    },
  ];

  return (
    <div className="space-y-4 pb-20">
      {/* Header */}
      <div className={`p-5 rounded-3xl border ${
        isDark ? 'bg-gradient-to-r from-[#0c1429] to-[#111e3d] border-indigo-900/50 text-white' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-600 flex items-center justify-center text-white font-bold shadow-md">
            <HelpCircle className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold tracking-tight">
              {language === 'ru' ? 'Руководство пользователя' : 'Foydalanish Qo‘llanmasi'}
            </h2>
            <p className="text-xs text-slate-400">
              Huquq Sphere platformasi va Telegram Mini App bo‘yicha to‘liq yo‘riqnoma
            </p>
          </div>
        </div>
      </div>

      {/* Steps Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {steps.map((st, i) => {
          const Icon = st.icon;
          return (
            <div
              key={i}
              className={`p-4 rounded-2xl border flex items-start space-x-3 ${
                isDark ? 'bg-[#0f172a] border-indigo-900/40 text-white' : 'bg-white border-slate-200 text-slate-900'
              }`}
            >
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 font-extrabold flex items-center justify-center shrink-0">
                {st.num}
              </div>
              <div>
                <h4 className="font-bold text-xs sm:text-sm text-amber-300">
                  {st.title}
                </h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  {st.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Guide Details */}
      <div className={`p-5 rounded-3xl border font-sans text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
        isDark ? 'bg-[#080e1f] text-slate-200 border-slate-800' : 'bg-slate-50 text-slate-800 border-slate-200'
      }`}>
        {USER_GUIDE_TEXT}
      </div>

      {/* Disclaimer */}
      <div className={`p-4 rounded-2xl border flex items-start space-x-3 ${
        isDark ? 'bg-amber-950/20 border-amber-600/30 text-amber-200' : 'bg-amber-50 border-amber-200 text-amber-900'
      }`}>
        <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
        <p className="text-xs leading-relaxed">
          <strong>Huquqiy eslatma:</strong> Ushbu platforma O'zbekiston Respublikasining rasmiy Lex.uz milliy qonunchilik bazasi asosida huquqiy tushuntirish beradi. Sud jarayonlarida litsenziyaga ega rasmiy advokat tavsiyalariga ham amal qilish tavsiya etiladi.
        </p>
      </div>
    </div>
  );
};
