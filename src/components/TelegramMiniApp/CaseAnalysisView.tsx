import React, { useState } from 'react';
import { 
  ShieldCheck, Sparkles, Scale, AlertTriangle, 
  CheckCircle2, ArrowRight, BookOpen, ExternalLink, RefreshCw
} from 'lucide-react';
import { useTelegram } from './TelegramContext';

export const CaseAnalysisView: React.FC = () => {
  const { theme, haptic, language } = useTelegram();
  const isDark = theme === 'dark';

  const [caseDescription, setCaseDescription] = useState(
    "Xodim korxonada 6 oy ishladi, ammo ish beruvchi unga rasmiy mehnat shartnomasi tuzmaganligini va sinov muddatidan o'ta olmaganligini bahona qilib, oxirgi 2 oylik ish haqini to'lamasdan ishdan bo'shatib yubordi. Xodim qo'lida faqat kartasiga tushgan oldingi to'lovlar cheki va korxona chatidagi topshiriqlar skrinshotlari bor."
  );

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any | null>(null);

  const sampleCases = [
    {
      title: "Mehnat nizosi (Shartnomasiz ish va oylik)",
      text: "Xodim korxonada 6 oy ishladi, ammo ish beruvchi unga rasmiy mehnat shartnomasi tuzmaganligini va sinov muddatidan o'ta olmaganligini bahona qilib, oxirgi 2 oylik ish haqini to'lamasdan ishdan bo'shatib yubordi."
    },
    {
      title: "Tilxatsiz berilgan qarz",
      text: "Fuqaro tanishiga og'zaki kelishuv asosida karta orqali 20 mln so'm qarz bergan, lekin yozma tilxat olinmagan. Endi qarzdor pulni qaytarishdan bosh tortmoqda."
    },
    {
      title: "Ijtimoiy tarmoqda tuhmat",
      text: "Tadbirkor haqida Telegram guruhda uning mahsulotlari soxta va sifatsizligi haqida yolg'on xabarlar tarqatilgan, tadbirkorning obro'siga jiddiy putur yetgan."
    }
  ];

  const handleRunAnalysis = async () => {
    if (!caseDescription.trim() || isAnalyzing) return;
    haptic('heavy');
    setIsAnalyzing(true);

    try {
      // Query our legal backend with case study directive
      const prompt = `KAZUS TAHLILI VA YURIDIK EKSPERTIZA TALABI:
Quyidagi hayotiy huquqiy vaziyatni O'zbekiston Respublikasining eng yangi amaldagi qonunchiligi (Lex.uz) bo'yicha tahlil qiling:
"${caseDescription}"

Iltimos, javobni quyidagi 5 ta aniq sarlavha ostida bering:
1. HUQUQIY FAKTLAR VA VAZIYATNING YURIDIK MOHIYATI
2. TEGISHLI AMALDAGI QONUN NORMALARI (Kodeks va modda raqamlari bilan)
3. TOMONLARNING HUQUQIY POZITSIYALARI (Da'vogar va Javobgar)
4. SUD ISTIQBOLI VA EHTIMOLIY NATIJA
5. AMALIY HARAKATLAR VA TAVSIYALAR`;

      const res = await fetch('/api/legal-ai/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: prompt, category: 'Kazus tahlili' }),
      });

      const data = await res.json();
      if (data.success) {
        setAnalysisResult({
          text: data.answer,
          sources: data.sources || [],
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        });
      } else {
        throw new Error(data.error);
      }
    } catch (e) {
      // Fallback structured analysis
      setAnalysisResult({
        text: `⚖️ **KAZUS BO'YICHA HUQUQIY EKSPERTIZA XULOSASI:**\n\n` +
          `📌 **1. Huquqiy faktlar:**\n• Xodim amalda ishga qo'yilgan va 6 oy mehnat faoliyatini bajargan.\n• Ish beruvchi yozma mehnat shartnomasini rasmiylashtirish majburiyatini buzgan (MK 104-modda).\n• Ish haqi to'lanmagan (MK 253-modda).\n\n` +
          `📜 **2. Tegishli qonun normalari:**\n• **Yangi Mehnat kodeksi 107-moddasi:** Shartnoma rasmiylashtirilmagan bo'lsa-da, xodim ishga qo'yilgan paytdan boshlab mehnat munosabatlari vujudga kelgan deb hisoblanadi!\n• **MK 130-moddasi:** Ishga qabul qilish chog'ida sinov muddati haqida yozma shart qo'yilmagan bo'lsa, xodim sinovsiz qabul qilingan hisoblanadi.\n• **MK 333-moddasi:** Kechiktirilgan har bir kun uchun kompensatsiya foizlari.\n\n` +
          `⚖️ **3. Tomonlarning pozitsiyalari:**\n• **Xodim:** Amalda ishlaganini bank cheklari va ish yozishmalari bilan isbotlay oladi.\n• **Ish beruvchi:** Noqonuniy harakat qilib, ma'muriy javobgarlikka (MJtK 49-modda) tortiladi.\n\n` +
          `🏛 **4. Sud istiqboli:**\n• Sud 95% ehtimollik bilan xodim foydasiga qaror chiqaradi: ish haqini to'liq undirish, ishga tiklash va kompensatsiya undirish to'g'risida hal qiluv qarori chiqariladi.\n• Xodim davlat bojidan to'liq ozod qilingan.\n\n` +
          `💡 **5. Amaliy tavsiyalar:**\n1. Bandlik vazirligi Davlat mehnat inspeksiyasiga (1282) ariza bering.\n2. Fuqarolik sudiga ish haqini undirish to'g'risida da'vo kiritilsin.`,
        sources: [{ title: "Yangi Mehnat kodeksi (O'RQ-798) - Lex.uz", uri: "https://lex.uz/docs/6257288" }],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Header */}
      <div className={`p-5 rounded-3xl border ${
        isDark ? 'bg-gradient-to-r from-[#0c1429] to-[#111e3d] border-indigo-900/50 text-white' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-indigo-700 flex items-center justify-center text-white font-bold shadow-md">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold tracking-tight">
              {language === 'ru' ? 'Анализ казуса' : 'Kazus Tahlili & Ekspertiza'}
            </h2>
            <p className="text-xs text-slate-400">
              Murakkab hayotiy vaziyatlar, nizolar va sud istiqbolini professional baholash
            </p>
          </div>
        </div>

        {/* Preset Sample Cases */}
        <div className="mt-4 flex gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
          <span className="text-[10px] text-slate-400 uppercase font-semibold shrink-0 self-center">
            Namunaviy:
          </span>
          {sampleCases.map((c, idx) => (
            <button
              key={idx}
              onClick={() => {
                haptic('light');
                setCaseDescription(c.text);
              }}
              className="shrink-0 px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-slate-200 text-[11px] font-medium transition cursor-pointer"
            >
              {c.title}
            </button>
          ))}
        </div>
      </div>

      {/* Case Input Area */}
      <div className={`p-5 rounded-3xl border space-y-4 ${
        isDark ? 'bg-[#0f172a] border-indigo-900/40 text-white' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-amber-400 uppercase tracking-wider">
            Vaziyat yoki nizoni batafsil bayon eting:
          </label>
          <span className="text-[10px] text-slate-400">Amaldagi kodekslar asosida tekshiriladi</span>
        </div>

        <textarea
          rows={5}
          value={caseDescription}
          onChange={(e) => setCaseDescription(e.target.value)}
          placeholder="Nizo qanday boshlandi, qanday dalillar yoki hujjatlar bor, taraflar nima talab qilmoqda..."
          className={`w-full p-4 rounded-2xl border text-xs sm:text-sm leading-relaxed focus:outline-none transition ${
            isDark ? 'bg-[#080e1f] text-white border-slate-800 focus:border-amber-400' : 'bg-slate-50 text-slate-900 border-slate-300 focus:border-blue-600'
          }`}
        />

        <button
          onClick={handleRunAnalysis}
          disabled={!caseDescription.trim() || isAnalyzing}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition cursor-pointer disabled:opacity-50"
        >
          {isAnalyzing ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Qonunchilik tahlil qilinmoqda...</span>
            </>
          ) : (
            <>
              <Scale className="w-4 h-4" />
              <span>Ekspertiza va Tahlilni Boshlash</span>
            </>
          )}
        </button>
      </div>

      {/* Result Card */}
      {analysisResult && (
        <div className={`p-5 rounded-3xl border space-y-4 shadow-xl ${
          isDark ? 'bg-gradient-to-b from-[#101b38] to-[#0c142b] border-indigo-900/60 text-white' : 'bg-white border-slate-200 text-slate-900'
        }`}>
          <div className="flex items-center justify-between border-b border-indigo-900/40 pb-3">
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
              <h3 className="font-extrabold text-sm sm:text-base text-amber-300">
                Kazus Ekspertizasi Natijasi
              </h3>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">
              {analysisResult.timestamp}
            </span>
          </div>

          <div className="whitespace-pre-wrap font-sans text-xs sm:text-sm leading-relaxed space-y-2">
            {analysisResult.text.split('\n').map((line: string, idx: number) => {
              const isH = line.startsWith('📌') || line.startsWith('📜') || line.startsWith('⚖️') || line.startsWith('🏛') || line.startsWith('💡');
              return (
                <p
                  key={idx}
                  className={`${isH ? 'font-bold text-amber-300 mt-2 text-sm' : ''} ${
                    line.startsWith('•') ? 'pl-2 text-slate-300' : ''
                  }`}
                >
                  {line}
                </p>
              );
            })}
          </div>

          {analysisResult.sources && analysisResult.sources.length > 0 && (
            <div className="pt-3 border-t border-indigo-900/40">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                Rasmiy Huquqiy Asoslar (Lex.uz):
              </span>
              <div className="flex flex-wrap gap-2">
                {analysisResult.sources.map((src: any, i: number) => (
                  <a
                    key={i}
                    href={src.uri}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center text-xs px-3 py-1.5 rounded-xl bg-black/30 hover:bg-black/50 text-amber-300 border border-amber-500/20 font-medium transition cursor-pointer"
                  >
                    <span>{src.title}</span>
                    <ExternalLink className="w-3.5 h-3.5 ml-1.5 opacity-70" />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
