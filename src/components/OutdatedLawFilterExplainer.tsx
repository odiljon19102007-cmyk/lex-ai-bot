import React, { useState } from 'react';
import { Filter, CheckCircle2, XCircle, ArrowRight, ShieldCheck, Scale, Search, HelpCircle } from 'lucide-react';

interface LawComparison {
  topic: string;
  outdated: {
    name: string;
    date: string;
    status: string;
    details: string;
  };
  active: {
    name: string;
    date: string;
    lexId: string;
    lexUrl: string;
    status: string;
    details: string;
  };
}

const COMPARISONS: LawComparison[] = [
  {
    topic: "Mehnat munosabatlari va ishdan bo'shatish",
    outdated: {
      name: "1995-yilgi eski Mehnat kodeksi",
      date: "1995-yil 21-dekabr",
      status: "O'z kuchini butunlay yo'qotgan (Bekor qilingan)",
      details: "Eski muddatlar, sinov muddati qoidalari va ishdan bo'shatish tartiblari zamon talabiga javob bermaganligi sababli bekor qilindi.",
    },
    active: {
      name: "Yangi Mehnat kodeksi (O'RQ-798)",
      date: "2023-yil 30-apreldan amalda",
      lexId: "6257288",
      lexUrl: "https://lex.uz/docs/6257288",
      status: "Yuridik kuchga ega (AMALDAGI)",
      details: "Sinov muddati 3 oygacha (rahbarlar uchun 6 oygacha), masofaviy ish, elektron mehnat daftarchalari va xodimlarni himoya qilish kafolatlari kiritilgan.",
    },
  },
  {
    topic: "Konstitutsiyaviy huquqlar va sud kafolatlari",
    outdated: {
      name: "1992-yilgi avvalgi tahrirdagi Konstitutsiya",
      date: "1992-yil 8-dekabr",
      status: "Yangi tahrir bilan almashtirildi",
      details: "Inson huquqlari va sud orqali qamoqqa olish (Habeas Corpus) bo'yicha cheklovlar kamroq edi.",
    },
    active: {
      name: "Yangi tahrirdagi O'zbekiston Respublikasi Konstitutsiyasi",
      date: "2023-yil 30-aprel referendumi",
      lexId: "6445145",
      lexUrl: "https://lex.uz/docs/6445145",
      status: "Oliy yuridik kuchga ega (AMALDAGI)",
      details: "O'zbekiston - ijtimoiy, huquqiy, dunyoviy davlat. Sud qarorisiz shaxsni 48 soatdan ortiq ushlab turish mumkin emas, uy-joy daxlsizligi qat'iy himoyalangan.",
    },
  },
  {
    topic: "Yo'l harakati jarimalarini to'lashdagi chegirmalar",
    outdated: {
      name: "Eski MJtK tartibi (to'liq to'lov)",
      date: "2023-yilgacha bo'lgan tahrir",
      status: "Yangilangan tartib bilan almashtirildi",
      details: "Jarima qarori chiqqandan so'ng chegirma muddati qisqa yoki cheklangan edi.",
    },
    active: {
      name: "MJtK 332-1-moddasi (15 kunlik 50% yoki 70% chegirma)",
      date: "Amaldagi yangi tahrir",
      lexId: "97664",
      lexUrl: "https://lex.uz/docs/97664",
      status: "Yuridik kuchga ega (AMALDAGI)",
      details: "Jarima to'g'risidagi qaror topshirilgan kundan boshlab 15 kun ichida jarima miqdorining 50 foizi (yoki sud qarorlarida belgilangan imtiyoz) to'lansa, qolgan qismidan ozod qilinadi.",
    },
  },
  {
    topic: "Soliq tizimi va Yakka tartibdagi tadbirkorlik",
    outdated: {
      name: "2007-yilgi eski Soliq kodeksi",
      date: "2007-yilgi tahrir",
      status: "Bekor qilingan",
      details: "Murakkab soliq turlari va eskirgan stavkalar bekor bo'lgan.",
    },
    active: {
      name: "Yangi Soliq kodeksi & 2024-2026-yilgi yangi imtiyozlar",
      date: "Amaldagi tahrir",
      lexId: "4674902",
      lexUrl: "https://lex.uz/docs/4674902",
      status: "Yuridik kuchga ega (AMALDAGI)",
      details: "Soliq turlari soddalashtirilgan, o'zini o'zi band qilgan shaxslar uchun daromad solig'idan ozod bo'lish va YATT xodim yollash qoidalari o'rnatilgan.",
    },
  },
];

export const OutdatedLawFilterExplainer: React.FC = () => {
  const [filterQuery, setFilterQuery] = useState('');
  const [testResult, setTestResult] = useState<string | null>(null);

  const handleTestStatus = (e: React.FormEvent) => {
    e.preventDefault();
    const q = filterQuery.toLowerCase().trim();
    if (!q) return;

    if (q.includes('1995') || q.includes('eski mehnat') || q.includes('eski konstitutsiya') || q.includes('bekor')) {
      setTestResult("⚠️ DIQQAT: Ushbu hujjat o'z kuchini butunlay yo'qotgan! LexAI filtri uni avtomatik aniqlaydi va uning o'rniga 2023-yilgi Yangi Mehnat kodeksi yoki Yangi Konstitutsiyani taqdim etadi.");
    } else {
      setTestResult("✅ AMALDAGI HUJJAT: Tizim ushbu so'rov bo'yicha Lex.uz bazasidagi eng yangi qonuniy me'yorlar va moddalarni tanlab beradi.");
    }
  };

  return (
    <div className="space-y-8">
      {/* Visual Pipeline Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
        <div className="max-w-3xl mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 mb-2">
            <Filter className="w-3.5 h-3.5 text-emerald-600" />
            Eskilarini Chiqarib Yuborish Arxitekturasi
          </div>
          <h3 className="text-xl font-bold text-slate-900">
            Bot qanday qilib eski qonunlarni chiqarib tashlaydi va faqat yangilarini qoldiradi?
          </h3>
          <p className="text-slate-600 text-xs sm:text-sm mt-1">
            Lex.uz qonunchilik bazasida minglab bekor qilingan yoki o'zgartirilgan hujjatlar mavjud. Botimiz 4 bosqichli intellektual filtr orqali ishlaydi:
          </p>
        </div>

        {/* 4 Steps Diagram */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col justify-between">
            <div>
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center mb-2">
                1
              </span>
              <h4 className="font-semibold text-slate-800 text-sm mb-1">Savol Tahlili</h4>
              <p className="text-xs text-slate-500">
                Foydalanuvchi bergan savoldagi huquq sohasi (mehnat, oila, soliq, jarima) va til semantikasi aniqlanadi.
              </p>
            </div>
            <div className="mt-3 text-[11px] text-blue-700 font-medium">NLP Parser</div>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col justify-between">
            <div>
              <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center mb-2">
                2
              </span>
              <h4 className="font-semibold text-slate-800 text-sm mb-1">Lex.uz Qidiruvi</h4>
              <p className="text-xs text-slate-500">
                Google Search Grounding yordamida rasmiy <code>lex.uz</code> domenidagi eng so'nggi tahrirlar qidiriladi.
              </p>
            </div>
            <div className="mt-3 text-[11px] text-indigo-700 font-medium">site:lex.uz priority</div>
          </div>

          <div className="bg-amber-50/70 p-4 rounded-xl border border-amber-200 flex flex-col justify-between">
            <div>
              <span className="w-6 h-6 rounded-full bg-amber-600 text-white text-xs font-bold flex items-center justify-center mb-2">
                3
              </span>
              <h4 className="font-semibold text-amber-950 text-sm mb-1">Eskilarini Filtrlash</h4>
              <p className="text-xs text-amber-800">
                "O'z kuchini yo'qotgan", "bekor qilingan" belgisi bor barcha eski moddalar chiqarib tashlanadi.
              </p>
            </div>
            <div className="mt-3 text-[11px] text-amber-700 font-medium">Status Filter: Active Only</div>
          </div>

          <div className="bg-emerald-50/70 p-4 rounded-xl border border-emerald-200 flex flex-col justify-between">
            <div>
              <span className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center mb-2">
                4
              </span>
              <h4 className="font-semibold text-emerald-950 text-sm mb-1">Amaldagi Natija</h4>
              <p className="text-xs text-emerald-800">
                Foydalanuvchiga Telegramda qonun nomi, amaldagi moddasi va to'g'ridan-to'g'ri Lex.uz havolasi beriladi.
              </p>
            </div>
            <div className="mt-3 text-[11px] text-emerald-700 font-medium">Verified Active Norm</div>
          </div>
        </div>
      </div>

      {/* Interactive Status Checker Widget */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-2xl p-6 shadow-md border border-slate-800">
        <h4 className="font-bold text-base sm:text-lg mb-2 flex items-center gap-2">
          <Search className="w-5 h-5 text-sky-400" />
          Qonun / Modda Maqomini Tekshirib Ko'rish (Simulyator)
        </h4>
        <p className="text-xs sm:text-sm text-slate-300 mb-4">
          Istalgan qonun nomini yoki moddani yozing. Filtr uni amaldagi yoki o'z kuchini yo'qotgan ekanligini qanday ajratishini ko'rasiz.
        </p>

        <form onSubmit={handleTestStatus} className="flex flex-col sm:flex-row gap-2 max-w-2xl">
          <input
            type="text"
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            placeholder="Masalan: 1995-yilgi Mehnat kodeksi yoki Yangi Mehnat kodeksi..."
            className="flex-1 bg-slate-800/90 text-white placeholder-slate-400 text-xs sm:text-sm px-4 py-2.5 rounded-xl border border-slate-700 focus:outline-none focus:border-sky-500"
          />
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold text-xs sm:text-sm transition cursor-pointer"
          >
            Tekshirish
          </button>
        </form>

        {testResult && (
          <div className="mt-4 p-3.5 rounded-xl bg-slate-800/80 border border-slate-700 text-xs sm:text-sm leading-relaxed max-w-2xl">
            {testResult}
          </div>
        )}
      </div>

      {/* Comparison Table: Old vs New Laws in Uzbekistan */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-5 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h4 className="font-bold text-slate-900 text-base">
              O'zbekistondagi Eng Katta Huquqiy O'zgarishlar (Eski vs Yangi)
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Bot ushbu o'zgarishlarni to'liq biladi va fuqarolarga eskirgan normalar bo'yicha noto'g'ri maslahat berilishini oldini oladi.
            </p>
          </div>
          <span className="hidden sm:inline-flex text-xs font-semibold px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg border border-blue-200">
            Lex.uz Sinxronlashgan
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {COMPARISONS.map((comp, idx) => (
            <div key={idx} className="p-5 grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
              <div className="lg:col-span-3">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block mb-1">
                  Mavzu:
                </span>
                <p className="text-sm font-semibold text-slate-900">{comp.topic}</p>
              </div>

              {/* Outdated Law */}
              <div className="lg:col-span-4 bg-rose-50/60 p-3.5 rounded-xl border border-rose-200/70">
                <div className="flex items-center gap-1.5 text-xs font-bold text-rose-700 mb-1">
                  <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{comp.outdated.name}</span>
                </div>
                <div className="text-[11px] font-semibold text-rose-600 mb-1.5">
                  Holati: {comp.outdated.status} ({comp.outdated.date})
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{comp.outdated.details}</p>
              </div>

              {/* Arrow */}
              <div className="lg:col-span-1 flex justify-center text-slate-400">
                <ArrowRight className="w-5 h-5 hidden lg:block" />
              </div>

              {/* Active Law */}
              <div className="lg:col-span-4 bg-emerald-50/60 p-3.5 rounded-xl border border-emerald-200/70">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{comp.active.name}</span>
                  </div>
                  <a
                    href={comp.active.lexUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[10px] text-blue-600 hover:underline font-bold"
                  >
                    Lex.uz #{comp.active.lexId}
                  </a>
                </div>
                <div className="text-[11px] font-semibold text-emerald-700 mb-1.5">
                  Holati: {comp.active.status} ({comp.active.date})
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{comp.active.details}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
