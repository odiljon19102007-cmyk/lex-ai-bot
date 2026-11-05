import React, { useState } from 'react';
import { 
  ShieldAlert, AlertTriangle, PhoneCall, Copy, Check, 
  CreditCard, FileText, ArrowLeft, ExternalLink, Lock, 
  Send, Sparkles, HelpCircle, CheckCircle2, ChevronDown, ChevronUp, Download
} from 'lucide-react';
import { useTelegram } from './TelegramContext';

interface BankContact {
  name: string;
  phone: string;
  shortCode: string;
  app: string;
  logoColor: string;
}

const UZBEK_BANKS: BankContact[] = [
  { name: 'Click', phone: '+998 71 231 08 80', shortCode: '71 231 08 80', app: 'Click Up', logoColor: 'from-blue-500 to-cyan-600' },
  { name: 'Payme', phone: '+998 78 150 22 45', shortCode: '78 150 22 45', app: 'Payme', logoColor: 'from-teal-500 to-emerald-600' },
  { name: 'Uzum Bank', phone: '+998 78 777 07 99', shortCode: '78 777 07 99', app: 'Uzum Bank', logoColor: 'from-purple-600 to-indigo-700' },
  { name: 'Kapitalbank', phone: '+998 71 200 15 15', shortCode: '1340', app: 'Kapitalbank', logoColor: 'from-amber-600 to-orange-700' },
  { name: 'Ipak Yo‘li Bank', phone: '+998 78 140 69 00', shortCode: '1296', app: 'Ipak Yo‘li Mobile', logoColor: 'from-emerald-600 to-teal-700' },
  { name: 'TBC Bank', phone: '+998 78 777 27 27', shortCode: '78 777 27 27', app: 'TBC UZ', logoColor: 'from-sky-500 to-blue-700' },
  { name: 'Xalq Banki', phone: '+998 71 210 20 02', shortCode: '1106', app: 'Xalq Mobile', logoColor: 'from-green-600 to-emerald-800' },
  { name: 'Agrobank', phone: '+998 71 203 88 88', shortCode: '1216', app: 'Agrobank Mobile', logoColor: 'from-lime-600 to-green-700' },
  { name: 'Milliy Bank (NBU)', phone: '+998 78 148 00 10', shortCode: '1344', app: 'Milliy', logoColor: 'from-blue-700 to-indigo-900' },
  { name: 'Anorbank', phone: '+998 55 503 00 00', shortCode: '1290', app: 'Anorbank', logoColor: 'from-rose-600 to-pink-700' },
  { name: 'Hamkorbank', phone: '+998 71 200 47 74', shortCode: '1256', app: 'Hamkor Mobile', logoColor: 'from-blue-600 to-cyan-700' },
  { name: 'O‘zsanoatqurilishbank (SQB)', phone: '+998 71 200 43 43', shortCode: '1180', app: 'Joyda', logoColor: 'from-slate-700 to-blue-900' },
];

export const CyberDefenseView: React.FC = () => {
  const { theme, haptic, language, user } = useTelegram();
  const isDark = theme === 'dark';

  const [activeTab, setActiveTab] = useState<'sos' | 'chargeback' | 'police' | 'laws' | 'ai_consult'>('sos');
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // Chargeback Form State
  const [userName, setUserName] = useState(user?.first_name || '');
  const [cardNumber, setCardNumber] = useState('');
  const [bankName, setBankName] = useState('Kapitalbank');
  const [amount, setAmount] = useState('');
  const [dateTime, setDateTime] = useState(new Date().toISOString().slice(0, 16));
  const [incidentType, setIncidentType] = useState('Fishing havola orqali pul yechildi');
  const [generatedLetter, setGeneratedLetter] = useState<string | null>(null);

  // AI Cyber Consult state
  const [userQuery, setUserQuery] = useState('');
  const [aiAnswer, setAiAnswer] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  // FAQ Expand state
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

  const copyToClipboard = (text: string, id: string) => {
    haptic('light');
    navigator.clipboard.writeText(text);
    setCopiedText(id);
    setTimeout(() => setCopiedText(null), 2500);
  };

  const handleGenerateChargeback = (e: React.FormEvent) => {
    e.preventDefault();
    haptic('medium');

    const cleanCard = cardNumber.trim() || '8600 **** **** ****';
    const cleanAmount = amount.trim() || '0';
    const cleanName = userName.trim() || 'Fuqaro';

    const letter = `"${bankName}" ATB Boshqaruv Raisi nomiga\n` +
      `Mijoz: ${cleanName}\n` +
      `Bog'lanish uchun telefon: ${user?.username ? '@' + user.username : 'Mavjud telefon'}\n` +
      `Bank karta raqami: ${cleanCard}\n\n` +
      `ARIZA\n` +
      `(Ruxsatsiz firibgarlik tranzaksiyasini to'xtatish va to'lovni qaytarish to'g'risida)\n\n` +
      `Men, ${cleanName}, Sizning bankingiz tomonidan chiqarilgan ${cleanCard} raqamli bank kartasi egasiman.\n\n` +
      `${dateTime.replace('T', ' ')} vaqtida mening roziligim va tasdig'imsiz kartamdan ${cleanAmount} so'm miqdoridagi pul mablag'i noma'lum uchinchi shaxslar tomonidan firibgarlik yo'li bilan ("${incidentType}") ruxsatsiz yechib olindi.\n\n` +
      `O'zbekiston Respublikasining "Banklar va bank faoliyati to'g'risida"gi hamda "To'lovlar va to'lov tizimlari to'g'risida"gi Qonunlariga muvofiq, men to'lovga qonuniy rozilik bermaganman va tranzaksiya firibgarlik yo'li bilan amalga oshirilgan.\n\n` +
      `Yuqoridagilardan kelib chiqib, Sizdan:\n` +
      `1. Mazkur tranzaksiya bo'yicha pul mablag'lari o'tkazilgan qabul qiluvchi hisobvaraqni/kartani zudlik bilan aniqlashingizni va unga blokirovka qo'yishingizni;\n` +
      `2. To'lov tizimi (Uzcard/Humo/Visa/Mastercard) qoidalari bo'yicha mazkur noqonuniy tranzaksiyani bekor qilish (Chargeback / Nizo) tartibini qo'llab, ${cleanAmount} so'm pul mablag'ini mening hisobimga qaytarish chorasini ko'rishingizni;\n` +
      `3. Tergov organlariga taqdim etish uchun mazkur tranzaksiyaning to'liq rekvizitlari, IP-manzili va tranzaksiya identifikatorini rasmiy tasdiqlangan ko'chirma sifatida taqdim etishingizni so'rayman.\n\n` +
      `Ariza berilgan sana: ${new Date().toLocaleDateString('uz-UZ')}\n` +
      `Imzo: _________________ (${cleanName})`;

    setGeneratedLetter(letter);
  };

  const handleAiConsult = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userQuery.trim() || isAiLoading) return;

    setIsAiLoading(true);
    setAiAnswer(null);
    haptic('medium');

    try {
      const res = await fetch('/api/legal-ai/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: `Kiberxavfsizlik va karta firibgarligi bo'yicha savol: ${userQuery}. O'zbekiston JK 168, 169 va kiberjinoyat normalari bo'yicha batafsil harakatlar rejasini bering.`,
          category: 'Kiberhimoya',
          userName: user?.first_name || 'Fuqaro',
          userId: user?.id ? String(user.id) : 'default_user'
        })
      });
      const data = await res.json();
      if (data.success && data.answer) {
        setAiAnswer(data.answer);
      } else {
        setAiAnswer("Ma'lumot tayyorlanmadi, iltimos qayta urinib ko'ring.");
      }
    } catch (e: any) {
      setAiAnswer("Aloqa xatosi yuz berdi. Iltimos, internetingizni tekshirib qayta yuboring.");
    } finally {
      setIsAiLoading(false);
    }
  };

  const faqs = [
    {
      q: "SMS orqali kelgan 6 xonali kodni firibgarga berib qo'ydim, nima qilish kerak?",
      a: "1-soniya: Darhol bank ilovasiga kirib kartani 'Bloklash' tugmasini bosing yoki bank koll-markaziga telefon qiling. 2-qadam: Ilovadan barcha faol sessiyalarni (ulangan qurilmalarni) uzing. 3-qadam: Bankka rasmiy ariza va IIB Kiberxavfsizlik markaziga (102) xabar bering."
    },
    {
      q: "Mening nomimga onlayn mikrokredit rasmiylashtirib olishibdi, qanday qutulaman?",
      a: "Zudlik bilan mikromoliya tashkilotiga (MFO/Bank) 'Kredit shartnomasini bekor qilish to'g'risida' e'tiroz xati yuboring va IIBga Jinoyat kodeksining 168-moddasi (Firibgarlik) bo'yicha jinoyat ishi qo'zg'atish to'g'risida ariza yozing. Tergov organi siz pulni olmaganligingizni va pul boshqa kartaga o'tkazilganini aniqlagach, sud qarori bilan kredit yopiladi."
    },
    {
      q: "Telegramda qarindoshim 'menga pul tashlab tur' deb yozdi va kartasiga pul o'tkazdim. Nima qilay?",
      a: "Bu akkaunt buzilgan (fishing) holati. Pul tushgan bank kartasining raqami va chekini saqlab oling. Zudlik bilan o'z bankingizga va o'sha qabul qiluvchi bankka firibgarlik haqida xabar bering. Qabul qiluvchi shaxs 'pulni naqdlashtiruvchi shaxs' (dropper) hisoblanadi va uning kartasi bloklanadi."
    },
    {
      q: "OLX yoki Uzumda soxta to'lov havolasi yuborishdi, karta ma'lumotlarimni kiritdim...",
      a: "Agar kartangizdagi CVC-kod va amal qilish muddatini kiritgan bo'lsangiz, kartangizni darhol butunlay yopib (re-issue) yangi karta ochtirishingiz shart. Eskirgan kartani qayta faollashtirmang, chunki firibgarlar undan doimiy avto-to'lov orqali pul yechishda davom etishadi."
    }
  ];

  return (
    <div className="space-y-5 pb-24">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-red-950 via-rose-900 to-slate-900 text-white p-5 border border-red-800/60 shadow-xl">
        <div className="absolute top-0 right-0 -mr-6 -mt-6 w-36 h-36 rounded-full bg-red-500/20 blur-3xl pointer-events-none" />
        <div className="flex items-start space-x-3.5 relative z-10">
          <div className="w-12 h-12 rounded-2xl bg-red-500/30 border border-red-400/40 flex items-center justify-center text-red-300 shrink-0 shadow-lg animate-pulse">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-extrabold tracking-tight">
                Kiberhimoya & Karta Firibgarligi
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-red-500 text-white shadow-xs">
                SOS Tezkor
              </span>
            </div>
            <p className="text-xs text-red-200/90 mt-1 leading-relaxed">
              Karta puli o‘g‘irlanganda, fishing, soxta kredit va onlayn aldovlarda zudlik bilan pulni to'xtatish va qaytarish algoritmi.
            </p>
          </div>
        </div>

        {/* Quick SOS Bar */}
        <div className="mt-4 pt-3.5 border-t border-red-800/50 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="font-semibold text-slate-200">IIB Kiberxavfsizlik:</span>
            <span className="font-mono font-bold text-amber-300">102 / 1102</span>
          </div>
          <a
            href="https://cyber.uz"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 font-semibold text-sky-300 hover:text-white"
          >
            <span>cyber.uz portali</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-1.5 overflow-x-auto pb-1 scrollbar-none">
        {[
          { id: 'sos', label: '1. Tezkor Bloklash (Banklar)', icon: PhoneCall },
          { id: 'chargeback', label: '2. Bankka Ariza (Nizo)', icon: FileText },
          { id: 'police', label: '3. IIBga Murojaat', icon: ShieldAlert },
          { id: 'laws', label: '4. Qonuniy Jazolari (JK)', icon: Lock },
          { id: 'ai_consult', label: '5. AI Kiber-Yurist', icon: Sparkles },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                haptic('light');
                setActiveTab(tab.id as any);
              }}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 cursor-pointer shrink-0 ${
                isActive
                  ? 'bg-red-600 text-white shadow-md shadow-red-900/30'
                  : isDark
                  ? 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-800'
                  : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 shadow-xs'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 1. SOS BANK BLOCKING TAB */}
      {activeTab === 'sos' && (
        <div className="space-y-4">
          <div className={`p-4 rounded-2xl border text-xs leading-relaxed ${
            isDark ? 'bg-red-950/30 border-red-900/50 text-red-200' : 'bg-red-50 border-red-200 text-red-900'
          }`}>
            <p className="font-bold flex items-center gap-1.5 text-sm text-red-400">
              <AlertTriangle className="w-4 h-4" />
              Dastlabki 5 daqiqa hal qiluvchi ahamiyatga ega!
            </p>
            <p className="mt-1.5">
              Firibgarlar pulni naqdlashtirib olishga ulgurmasidan oldin kartangizga tegishli bankka telefon qiling yoki mobil ilovadan kartani darhol bloklang:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {UZBEK_BANKS.map((b) => (
              <div
                key={b.name}
                className={`p-3.5 rounded-2xl border transition flex items-center justify-between ${
                  isDark 
                    ? 'bg-[#0f172a] border-slate-800 hover:border-red-500/40 text-white' 
                    : 'bg-white border-slate-200 hover:border-red-400 text-slate-900 shadow-xs'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-sm">{b.name}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-slate-800 text-slate-300">
                      {b.app}
                    </span>
                  </div>
                  <p className="text-xs font-mono font-bold text-amber-400 mt-1">
                    {b.phone}
                  </p>
                </div>

                <a
                  href={`tel:${b.phone.replace(/[^0-9+]/g, '')}`}
                  className="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold flex items-center gap-1 transition shadow-xs"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Qo'ng'iroq</span>
                </a>
              </div>
            ))}
          </div>

          {/* Quick FAQ / Real Cases */}
          <div className={`p-4 rounded-2xl border mt-5 space-y-3 ${
            isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <h4 className="font-bold text-xs uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4" />
              Eng Ko'p Uchraydigan Firibgarlik Vaziyatlari
            </h4>

            <div className="space-y-2">
              {faqs.map((f, idx) => (
                <div
                  key={idx}
                  className={`rounded-xl border overflow-hidden transition ${
                    isDark ? 'border-slate-800 bg-[#070d1d]' : 'border-slate-200 bg-slate-50'
                  }`}
                >
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                    className="w-full p-3 text-left font-bold text-xs flex items-center justify-between cursor-pointer"
                  >
                    <span>{f.q}</span>
                    {expandedFaq === idx ? (
                      <ChevronUp className="w-4 h-4 text-amber-400 shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                    )}
                  </button>
                  {expandedFaq === idx && (
                    <div className="p-3 pt-0 text-xs text-slate-400 leading-relaxed border-t border-slate-800/40">
                      {f.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. CHARGEBACK GENERATOR TAB */}
      {activeTab === 'chargeback' && (
        <div className="space-y-4">
          <div className={`p-4 rounded-2xl border text-xs leading-relaxed ${
            isDark ? 'bg-[#0f172a] border-slate-800 text-slate-300' : 'bg-white border-slate-200 text-slate-700'
          }`}>
            <h3 className="font-extrabold text-sm text-amber-400 mb-1">
              Bankka Rasmiy Da'vo / To'lovni Bekor Qilish (Chargeback) Blankasi
            </h3>
            <p>
              Ma'lumotlaringizni to'ldiring. Tizim O'zbekiston bank qonunchiligiga to'liq mos keladigan, bank boshqaruviga topshirish uchun rasmiy ariza matnini tayyorlab beradi:
            </p>
          </div>

          <form onSubmit={handleGenerateChargeback} className={`p-5 rounded-3xl border space-y-3.5 ${
            isDark ? 'bg-[#0b1329] border-indigo-950 text-white' : 'bg-white border-slate-200 text-slate-900 shadow-sm'
          }`}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-medium">Ism, Familiyangiz:</label>
                <input
                  type="text"
                  required
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Masalan: Alimov Alisher"
                  className={`w-full p-2.5 rounded-xl border focus:outline-none ${
                    isDark ? 'bg-[#050b18] border-slate-800 text-white' : 'bg-slate-50 border-slate-300'
                  }`}
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">Bank nomi:</label>
                <select
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  className={`w-full p-2.5 rounded-xl border focus:outline-none ${
                    isDark ? 'bg-[#050b18] border-slate-800 text-white' : 'bg-slate-50 border-slate-300'
                  }`}
                >
                  {UZBEK_BANKS.map(b => (
                    <option key={b.name} value={b.name}>{b.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">Karta raqami (16 xonali):</label>
                <input
                  type="text"
                  required
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  placeholder="8600 0000 0000 0000"
                  className={`w-full p-2.5 rounded-xl border focus:outline-none font-mono ${
                    isDark ? 'bg-[#050b18] border-slate-800 text-white' : 'bg-slate-50 border-slate-300'
                  }`}
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">Yechib olingan summa (so'm):</label>
                <input
                  type="text"
                  required
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Masalan: 3 500 000"
                  className={`w-full p-2.5 rounded-xl border focus:outline-none font-mono ${
                    isDark ? 'bg-[#050b18] border-slate-800 text-white' : 'bg-slate-50 border-slate-300'
                  }`}
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">Tranzaksiya sanasi va soati:</label>
                <input
                  type="datetime-local"
                  required
                  value={dateTime}
                  onChange={(e) => setDateTime(e.target.value)}
                  className={`w-full p-2.5 rounded-xl border focus:outline-none ${
                    isDark ? 'bg-[#050b18] border-slate-800 text-white' : 'bg-slate-50 border-slate-300'
                  }`}
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">Hodisa turi:</label>
                <select
                  value={incidentType}
                  onChange={(e) => setIncidentType(e.target.value)}
                  className={`w-full p-2.5 rounded-xl border focus:outline-none ${
                    isDark ? 'bg-[#050b18] border-slate-800 text-white' : 'bg-slate-50 border-slate-300'
                  }`}
                >
                  <option value="Fishing havola orqali pul yechildi">Fishing havola orqali pul yechildi</option>
                  <option value="SMS-kodni aldov yo'li bilan bilib olishdi">SMS-kodni aldov yo'li bilan bilib olishdi</option>
                  <option value="Soxta 'kredit/moddiy yordam' boti orqali">Soxta 'kredit/moddiy yordam' boti orqali</option>
                  <option value="OLX / Uzum soxta to'lov havolasi">OLX / Uzum soxta to'lov havolasi</option>
                  <option value="Buzilgan Telegram akkaunt orqali qarz so'rash">Buzilgan Telegram akkaunt orqali qarz so'rash</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white font-extrabold text-xs transition shadow-md cursor-pointer flex items-center justify-center gap-1.5"
            >
              <FileText className="w-4 h-4" />
              <span>Rasmiy Ariza Matnini Generatsiya Qilish</span>
            </button>
          </form>

          {/* Generated Result */}
          {generatedLetter && (
            <div className={`p-4 rounded-3xl border space-y-3 ${
              isDark ? 'bg-[#0f172a] border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900 shadow-md'
            }`}>
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" />
                  Tayyor Yuridik Ariza
                </span>

                <button
                  onClick={() => copyToClipboard(generatedLetter, 'letter')}
                  className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1 transition cursor-pointer"
                >
                  {copiedText === 'letter' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedText === 'letter' ? 'Nusxalandi!' : 'Nusxa olish'}</span>
                </button>
              </div>

              <pre className="p-3.5 rounded-2xl bg-slate-950 text-slate-200 font-sans text-xs leading-relaxed whitespace-pre-wrap border border-slate-800 max-h-96 overflow-y-auto">
                {generatedLetter}
              </pre>
            </div>
          )}
        </div>
      )}

      {/* 3. POLICE / CYBER.UZ REPORT TAB */}
      {activeTab === 'police' && (
        <div className={`p-5 rounded-3xl border space-y-4 ${
          isDark ? 'bg-[#0f172a] border-indigo-950 text-white' : 'bg-white border-slate-200 text-slate-900'
        }`}>
          <div className="flex items-center space-x-2.5 text-red-400">
            <ShieldAlert className="w-6 h-6" />
            <h3 className="font-extrabold text-base">IIB Kiberxavfsizlik Markaziga Murojaat Tartibi</h3>
          </div>

          <div className="space-y-3 text-xs leading-relaxed text-slate-300">
            <div className={`p-3.5 rounded-2xl border ${isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
              <span className="font-bold text-amber-400 block mb-1">1️⃣ Qayerga murojaat qilish kerak?</span>
              <ul className="list-disc list-inside space-y-1 text-slate-300">
                <li>O'zbekiston Respublikasi IIV Tezkor-qidiruv departamenti <strong>Kiberxavfsizlik markazi</strong>;</li>
                <li>Yashash joyingizdagi tuman (shahar) Ichki ishlar boshqarmasi (IIB);</li>
                <li>Yagona onlayn portal: <strong>cyber.uz</strong> yoki <strong>102</strong> / <strong>1102</strong> ishonch telefoni.</li>
              </ul>
            </div>

            <div className={`p-3.5 rounded-2xl border ${isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
              <span className="font-bold text-amber-400 block mb-1">2️⃣ Qanday dalillarni ilova qilish shart?</span>
              <ul className="list-disc list-inside space-y-1 text-slate-300">
                <li>Bankdan rasmiy muhr bilan tasdiqlangan <strong>hisobdan ko'chirma (vypiska)</strong>;</li>
                <li>Firibgar bilan yozishmalar skrinshotlari (yozishmani o'chirmang!);</li>
                <li>Pul o'tkazilgan karta raqami yoki soxta sayt (fishing) havolasi;</li>
                <li>SMS-xabarlar va qo'ng'iroqlar tarixi.</li>
              </ul>
            </div>

            <div className={`p-3.5 rounded-2xl border ${isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
              <span className="font-bold text-amber-400 block mb-1">3️⃣ Pulni qaytarish imkoniyati (Dropperlar masalasi):</span>
              <p className="text-slate-300">
                O'zbekiston sud amaliyotida pul tushgan karta egasi (hatto u 'kartamni birovga berib turgandim' desa ham) Fuqarolik kodeksining 1023-moddasiga ko'ra <strong>asossiz boylik orttirgan shaxs</strong> sifatida butun summani qonuniy egasiga qaytarishga majbur hisoblanadi.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 4. CRIMINAL CODE LAWS TAB */}
      {activeTab === 'laws' && (
        <div className="space-y-3">
          {[
            {
              code: "JK 168-modda",
              title: "Firibgarlik (Axborot tizimlaridan foydalanib)",
              penalty: "BHMning 100 dan 300 baravarigacha jarima yoki 3 yildan 5 yilgacha ozodlikni cheklash yoxud 5 yildan 8 yilgacha ozodlikdan mahrum qilish bilan jazolanadi.",
              status: "O'zbekiston Respublikasi Jinoyat kodeksi",
              lexUrl: "https://lex.uz/docs/111453#168"
            },
            {
              code: "JK 169-modda",
              title: "O'g'rilik (Bank kartalari va elektron to'lovlar)",
              penalty: "Elektron hisobvaraqlardan yashirin talon-toroj qilish — 5 yildan 8 yilgacha ozodlikdan mahrum qilish bilan jazolanadi.",
              status: "O'g'ir jinoiy javobgarlik",
              lexUrl: "https://lex.uz/docs/111453#169"
            },
            {
              code: "JK 278-4-modda",
              title: "Kompyuter axborotini noqonuniy egallash",
              penalty: "Axborot tizimiga noqonuniy kirib, ma'lumotlarni o'g'irlash yoki o'zgartirish — BHMning 100 dan 300 baravarigacha jarima yoki 3 yilgacha ozodlikdan mahrum qilish.",
              status: "Kiberjinoyat normasi",
              lexUrl: "https://lex.uz/docs/111453"
            },
            {
              code: "FK 1023-modda",
              title: "Asossiz orttirilgan boylikni qaytarish majburiyati",
              penalty: "Firibgarlar pul o'tkazgan karta egasi (dropper) o'sha pulni to'liq miqdorda jabrlanuvchiga foizlari bilan qaytarib berishga shaxsan majbur.",
              status: "Fuqarolik javobgarligi (Sud orqali undirish)",
              lexUrl: "https://lex.uz/docs/111189#1023"
            }
          ].map((item, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-2xl border ${
                isDark ? 'bg-[#0f172a] border-slate-800' : 'bg-white border-slate-200 shadow-xs'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-extrabold text-sm text-red-400">{item.code}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                  {item.status}
                </span>
              </div>
              <h4 className="font-bold text-xs text-slate-200 mt-0.5">{item.title}</h4>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/60">
                ⚖️ <strong>Jazo:</strong> {item.penalty}
              </p>
              <div className="mt-2.5 flex justify-end">
                <a
                  href={item.lexUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] font-semibold text-sky-400 hover:text-white flex items-center gap-1"
                >
                  <span>Lex.uz rasmiy moddasi</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 5. AI CYBER CONSULTANT TAB */}
      {activeTab === 'ai_consult' && (
        <div className="space-y-4">
          <form onSubmit={handleAiConsult} className={`p-4 rounded-3xl border space-y-3 ${
            isDark ? 'bg-[#0f172a] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900 shadow-sm'
          }`}>
            <label className="block text-xs font-bold text-amber-400">
              Qanday firibgarlikka duch keldingiz? Vaziyatingizni to'liq bayon eting:
            </label>
            <textarea
              rows={3}
              required
              value={userQuery}
              onChange={(e) => setUserQuery(e.target.value)}
              placeholder="Masalan: Kecha kechasi kartamdan 2 million so'm yechildi, SMS-kodni bitta botga kiritgandim. Hozir qaysi idoraga borishim kerak?"
              className={`w-full p-3 rounded-2xl border text-xs focus:outline-none ${
                isDark ? 'bg-[#060c1c] border-slate-800 text-white' : 'bg-slate-50 border-slate-300'
              }`}
            />
            <button
              type="submit"
              disabled={isAiLoading || !userQuery.trim()}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white font-extrabold text-xs transition disabled:opacity-40 flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isAiLoading ? "Kiber-Yurist tahlil qilmoqda..." : "Individual Huquqiy Reja Olish"}</span>
            </button>
          </form>

          {aiAnswer && (
            <div className={`p-4 rounded-3xl border space-y-2 ${
              isDark ? 'bg-[#101b38] border-indigo-900/60 text-slate-100' : 'bg-white border-slate-200 text-slate-900 shadow-md'
            }`}>
              <div className="flex items-center justify-between pb-2 border-b border-indigo-900/40">
                <span className="font-extrabold text-xs text-amber-400 flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-red-400" />
                  Kiber-Yurist Xulosasi
                </span>
                <button
                  onClick={() => copyToClipboard(aiAnswer, 'ai')}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white"
                  title="Nusxalash"
                >
                  {copiedText === 'ai' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              <div className="text-xs leading-relaxed whitespace-pre-wrap font-sans space-y-2">
                {aiAnswer}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
