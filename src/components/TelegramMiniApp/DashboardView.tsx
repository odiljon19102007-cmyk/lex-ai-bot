import React from 'react';
import { 
  Scale, Sparkles, BookOpen, Search, FileText, 
  ShieldCheck, GitCompare, Landmark, HelpCircle, 
  Settings, ArrowRight, Clock, ExternalLink, ChevronRight,
  TrendingUp, Award, BellRing, Camera, Calculator, GraduationCap, Briefcase, Crown, ShieldAlert
} from 'lucide-react';
import { useTelegram } from './TelegramContext';

interface DashboardViewProps {
  onNavigate: (view: string, initialQuery?: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onNavigate }) => {
  const { user, theme, haptic, language } = useTelegram();
  const [searchQuery, setSearchQuery] = React.useState('');

  const isDark = theme === 'dark';

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    haptic('medium');
    onNavigate('ai', searchQuery.trim());
  };

  const quickChips = [
    { label: "Mehnat kodeksi 130", query: "Mehnat kodeksi 130-modda sinov muddati" },
    { label: "Oylik berilmasa", query: "Ish beruvchi ish haqini bermasa nima qilish kerak?" },
    { label: "Tuhmat uchun jarima", query: "Tuhmat uchun qanday jarima bor?" },
    { label: "15 kunlik jarima chegirmasi", query: "Yo'l harakati jarimasini 15 kunda to'lasa 50% chegirma beriladimi?" },
    { label: "Aliment undirish", query: "Aliment undirish tartibi va miqdori qancha?" },
  ];

  const modules = [
    {
      id: 'ai',
      title: language === 'ru' ? 'Юридический ИИ' : 'Huquqiy AI',
      desc: language === 'ru' ? 'Вопросы и ответы по законам Узбекистана' : 'Lex.uz bo\'yicha erkin savol-javob va tahlil',
      icon: Scale,
      color: 'from-blue-600 to-indigo-700',
      badge: 'ChatGPT 3.8',
      badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-400/30',
      accent: 'text-amber-400',
    },
    {
      id: 'image_solver',
      title: language === 'ru' ? 'Распознавание фото (OCR)' : 'Rasm & Test yechish',
      desc: language === 'ru' ? 'Анализ фото повесток, штрафов и тестов' : 'Hujjat, sud qarori, jarima va testlarni rasm orqali yechish',
      icon: Camera,
      color: 'from-cyan-600 to-blue-800',
      badge: 'OCR Vision',
      badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-400/30',
      accent: 'text-cyan-400',
    },
    {
      id: 'codes',
      title: language === 'ru' ? 'База законодательства' : 'Qonunchilik bazasi',
      desc: language === 'ru' ? 'Кодексы, законы и официальные акты' : '7 ta asosiy kodeks, qonunlar va Lex.uz havolalari',
      icon: BookOpen,
      color: 'from-amber-600 to-amber-800',
      badge: 'Lex.uz 2026',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-400/30',
      accent: 'text-amber-300',
    },
    {
      id: 'article_search',
      title: language === 'ru' ? 'Поиск статьи' : 'Modda qidirish',
      desc: language === 'ru' ? 'Мгновенный поиск по номеру и кодексу' : 'Kodeks va modda raqami orqali tezkor topish',
      icon: Search,
      color: 'from-emerald-600 to-teal-800',
      badge: 'Tezkor 5ms',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30',
      accent: 'text-emerald-400',
    },
    {
      id: 'docs',
      title: language === 'ru' ? 'Подготовка документов' : 'Hujjat tayyorlash',
      desc: language === 'ru' ? 'Исковые заявления, жалобы, договоры' : 'Sudga da\'vo, MIB va ish beruvchiga arizalar',
      icon: FileText,
      color: 'from-indigo-600 to-purple-800',
      badge: 'Shablonlar',
      badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-400/30',
      accent: 'text-purple-300',
    },
    {
      id: 'case_analysis',
      title: language === 'ru' ? 'Анализ казуса' : 'Kazus tahlili',
      desc: language === 'ru' ? 'Правовая экспертиза спорных ситуаций' : 'Nizoli vaziyatlar va sud istiqboli ekspertizasi',
      icon: ShieldCheck,
      color: 'from-sky-600 to-blue-900',
      badge: 'Ekspertiza',
      badgeColor: 'bg-sky-500/20 text-sky-300 border-sky-400/30',
      accent: 'text-sky-300',
    },
    {
      id: 'compare',
      title: language === 'ru' ? 'Сравнение законов' : 'Qonunlarni solishtirish',
      desc: language === 'ru' ? 'Старая vs Новая редакция кодексов' : 'Eski (1995) va Yangi (2023) qonunlar taqqoslamasi',
      icon: GitCompare,
      color: 'from-rose-600 to-rose-900',
      badge: 'Visual Diff',
      badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-400/30',
      accent: 'text-rose-300',
    },
    {
      id: 'mib',
      title: language === 'ru' ? 'Отдел БПИ (МИБ)' : 'MIB bo‘limi',
      desc: language === 'ru' ? 'Алименты, запреты на выезд, жалобы' : 'Aliment, zapret tekshiruvi va ijro hujjatlari',
      icon: Landmark,
      color: 'from-cyan-600 to-blue-800',
      badge: 'MIB & Sud',
      badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-400/30',
      accent: 'text-cyan-300',
    },
    {
      id: 'calculators',
      title: language === 'ru' ? 'Правовые калькуляторы' : 'Huquqiy kalkulyatorlar',
      desc: language === 'ru' ? 'Алименты, отпускные, госпошлина, БПИ' : 'Aliment, ta\'til, kompensatsiya va davlat boji hisoblash',
      icon: Calculator,
      color: 'from-emerald-600 to-teal-800',
      badge: 'BHM 2026',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30',
      accent: 'text-emerald-300',
    },
    {
      id: 'case_manager',
      title: language === 'ru' ? 'Мои юридические дела' : 'Ishlar boshqaruvi',
      desc: language === 'ru' ? 'Управление делами, сроками и доказательствами' : 'Shaxsiy huquqiy ishlar, muddatlar, arizalar va dalillar',
      icon: Briefcase,
      color: 'from-amber-600 to-orange-800',
      badge: 'Case Manager',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-400/30',
      accent: 'text-amber-300',
    },
    {
      id: 'academy',
      title: language === 'ru' ? 'Юридическая Академия' : 'Huquqiy Akademiya',
      desc: language === 'ru' ? 'Курсы, интерактивные тесты и рейтинг' : '7 ta soha bo\'yicha darslar, testlar va bilim darajasi',
      icon: GraduationCap,
      color: 'from-purple-600 to-indigo-800',
      badge: 'Akademiya',
      badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-400/30',
      accent: 'text-purple-300',
    },
    {
      id: 'cyber_shield',
      title: language === 'ru' ? 'Киберзащита и мошенничество' : 'Kiberhimoya (Karta firibgarligi)',
      desc: language === 'ru' ? 'Срочная блокировка банков, чарджбэк и возврат средств' : '12 ta bankni tezkor bloklash, chargeback arizasi va pulni qaytarish',
      icon: ShieldAlert,
      color: 'from-rose-600 via-red-600 to-amber-700',
      badge: '🚨 SOS Himoya',
      badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-400/30',
      accent: 'text-rose-400',
    },
    {
      id: 'legal_iq',
      title: language === 'ru' ? 'Юридический IQ и Сертификат' : 'Huquqiy IQ & Sertifikat',
      desc: language === 'ru' ? '10 казус-вопросов, проверка знаний и Canvas-сертификат' : '10 ta real hayotiy kazus, bilim sinovi va rasmiy yuklanadigan sertifikat',
      icon: Award,
      color: 'from-amber-500 via-yellow-600 to-indigo-800',
      badge: '🏆 IQ Test',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-400/30',
      accent: 'text-amber-300',
    },
    {
      id: 'admin',
      title: language === 'ru' ? 'Панель администратора' : 'Admin paneli',
      desc: language === 'ru' ? 'Управление ботом, назначение админов и история запросов' : 'Bot a\'zolari, yangi adminlar tayinlash va barcha AI qidiruvlar tarixi',
      icon: Crown,
      color: 'from-amber-600 via-orange-600 to-red-700',
      badge: '👑 Boshqaruv',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-400/30',
      accent: 'text-amber-300',
    },
    {
      id: 'guide',
      title: language === 'ru' ? 'Руководство пользователя' : 'Foydalanish qo‘llanmasi',
      desc: language === 'ru' ? 'Инструкция по боту и Mini App' : 'Qadamma-qadam yo\'riqnoma va huquqiy maslahat',
      icon: HelpCircle,
      color: 'from-teal-600 to-emerald-900',
      badge: 'Qo\'llanma',
      badgeColor: 'bg-teal-500/20 text-teal-300 border-teal-400/30',
      accent: 'text-teal-300',
    },
    {
      id: 'settings',
      title: language === 'ru' ? 'Настройки и профиль' : 'Sozlamalar & Admin',
      desc: language === 'ru' ? 'Язык, тема оформления и профиль' : 'Til, tungi rejim, profil va tizim monitoringi',
      icon: Settings,
      color: 'from-slate-700 to-slate-900',
      badge: 'Tizim',
      badgeColor: 'bg-slate-500/20 text-slate-300 border-slate-400/30',
      accent: 'text-slate-300',
    },
  ];

  const recentInquiries = [
    { title: "Yangi Mehnat kodeksida sinov muddati", time: "10 daqiqa oldin", tag: "Mehnat" },
    { title: "Qarz va tilxat bo'yicha da'vo kiritish", time: "1 soat oldin", tag: "Fuqarolik" },
    { title: "Yo'l jarimasini 50% chegirmada to'lash", time: "Bugun", tag: "MJtK" },
  ];

  return (
    <div className="space-y-6 pb-20">
      {/* Hero Card: Deep Navy with Gold & White accents */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0a1128] via-[#101f42] to-[#0f172a] text-white p-6 shadow-xl border border-indigo-900/60">
        <div className="absolute top-0 right-0 -mr-8 -mt-8 w-44 h-44 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-40 h-40 rounded-full bg-blue-500/15 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex items-start justify-between">
          <div className="flex items-center space-x-3.5">
            <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-300 p-0.5 shadow-lg shadow-amber-500/20">
              <div className="w-full h-full rounded-[14px] bg-[#0a1128] flex items-center justify-center">
                <Scale className="w-7 h-7 text-amber-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-extrabold tracking-tight text-white">
                  LexAI 2.0
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40 uppercase tracking-wider">
                  Ekotizim
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                {language === 'ru' ? 'Добро пожаловать,' : 'Xush kelibsiz,'}{' '}
                <span className="font-semibold text-amber-300">{user.first_name || 'Foydalanuvchi'}</span>!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 bg-emerald-500/15 border border-emerald-400/30 px-2.5 py-1 rounded-full text-[11px] text-emerald-300 font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Lex.uz Jonli</span>
          </div>
        </div>

        {/* Global AI Search Bar */}
        <div className="mt-5 relative z-10">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                language === 'ru' 
                  ? 'Задайте вопрос по законам Узбекистана (например, алименты, увольнение)...'
                  : 'Huquqiy savol yoki qonun nomini yozing (masalan, aliment, ishdan bo\'shatish)...'
              }
              className="w-full pl-11 pr-24 py-3.5 rounded-2xl bg-[#030712]/80 backdrop-blur-md text-white placeholder-slate-400 text-xs sm:text-sm border border-indigo-900/80 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition shadow-inner"
            />
            <Search className="w-5 h-5 text-amber-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
              <button
                type="submit"
                onClick={() => haptic('medium')}
                className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs transition shadow-md cursor-pointer flex items-center gap-1"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{language === 'ru' ? 'Найти' : 'Tahlil'}</span>
              </button>
            </div>
          </form>

          {/* Quick chips */}
          <div className="mt-3 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-[11px]">
            <span className="text-slate-400 shrink-0 font-medium text-[10px] uppercase tracking-wider">
              {language === 'ru' ? 'Темы:' : 'Tezkor:'}
            </span>
            {quickChips.map((chip, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  haptic('light');
                  onNavigate('ai', chip.query);
                }}
                className="shrink-0 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/15 border border-white/10 text-slate-200 hover:text-white transition cursor-pointer"
              >
                {chip.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Emergency & Featured Highlights: Kiberhimoya va Legal IQ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* SOS Kiberhimoya Card */}
        <button
          onClick={() => {
            haptic('heavy');
            onNavigate('cyber_shield');
          }}
          className="text-left p-4 rounded-2xl bg-gradient-to-br from-red-950/80 via-[#200910] to-[#120409] border border-red-500/40 hover:border-red-400 hover:shadow-lg hover:shadow-red-900/30 transition-all cursor-pointer group relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-28 h-28 bg-red-600/10 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
              <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/30">
                🚨 SOS Kiberhimoya
              </span>
            </div>
            <ArrowRight className="w-4 h-4 text-red-400 group-hover:translate-x-1 transition-transform" />
          </div>
          <h4 className="font-extrabold text-sm text-white group-hover:text-red-200 transition">
            Karta firibgarligi & Pulni qaytarish
          </h4>
          <p className="text-xs text-red-200/80 mt-1 line-clamp-2">
            12 ta bankni 1 daqiqada bloklash, rasmiy chargeback arizasi va IIB 1102 ga murojaat
          </p>
        </button>

        {/* Legal IQ & Certificate Card */}
        <button
          onClick={() => {
            haptic('medium');
            onNavigate('legal_iq');
          }}
          className="text-left p-4 rounded-2xl bg-gradient-to-br from-amber-950/70 via-[#1e1709] to-[#0a1128] border border-amber-500/40 hover:border-amber-400 hover:shadow-lg hover:shadow-amber-900/30 transition-all cursor-pointer group relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-28 h-28 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                🏆 Huquqiy IQ Sinovi
              </span>
            </div>
            <ArrowRight className="w-4 h-4 text-amber-400 group-hover:translate-x-1 transition-transform" />
          </div>
          <h4 className="font-extrabold text-sm text-white group-hover:text-amber-200 transition">
            10 ta Kazus & Rasmiy Sertifikat
          </h4>
          <p className="text-xs text-amber-200/80 mt-1 line-clamp-2">
            Huquqiy bilimingizni sinang, natijangizni hisoblang va nomingizga yuklanadigan sertifikat oling!
          </p>
        </button>
      </div>

      {/* Core Modules Grid */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-500" />
            <h3 className={`font-bold text-sm sm:text-base ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {language === 'ru' ? 'Все 9 правовых разделов' : 'Barcha 9 ta huquqiy bo‘lim'}
            </h3>
          </div>
          <span className="text-[11px] text-amber-500 font-semibold">
            {language === 'ru' ? 'Официально' : 'Rasmiy tizim'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {modules.map((mod) => {
            const Icon = mod.icon;
            return (
              <button
                key={mod.id}
                onClick={() => {
                  haptic('medium');
                  onNavigate(mod.id);
                }}
                className={`text-left p-4 rounded-2xl border transition-all duration-200 cursor-pointer group flex flex-col justify-between relative overflow-hidden shadow-xs hover:shadow-md ${
                  isDark
                    ? 'bg-gradient-to-b from-[#111c38] to-[#0c1427] border-indigo-900/50 hover:border-amber-400/50 hover:from-[#152347]'
                    : 'bg-white border-slate-200 hover:border-amber-400 hover:bg-amber-50/20'
                }`}
              >
                <div className="flex items-start justify-between w-full mb-3">
                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${mod.color} flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform duration-200`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${mod.badgeColor}`}>
                    {mod.badge}
                  </span>
                </div>

                <div>
                  <h4 className={`font-bold text-sm flex items-center justify-between ${isDark ? 'text-white group-hover:text-amber-300' : 'text-slate-900 group-hover:text-blue-900'}`}>
                    <span>{mod.title}</span>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 group-hover:text-amber-400 transition" />
                  </h4>
                  <p className={`text-xs mt-1 leading-relaxed line-clamp-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    {mod.desc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Recent Legal Searches / History */}
      <div className={`p-4 rounded-2xl border ${isDark ? 'bg-[#0f172a]/70 border-slate-800' : 'bg-white border-slate-200'}`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-sky-400" />
            <h4 className={`font-bold text-xs uppercase tracking-wider ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              {language === 'ru' ? 'Недавние запросы' : 'So‘nggi huquqiy tahlillar'}
            </h4>
          </div>
          <button
            onClick={() => onNavigate('ai')}
            className="text-[11px] font-semibold text-amber-500 hover:text-amber-400 cursor-pointer flex items-center gap-0.5"
          >
            <span>{language === 'ru' ? 'Все' : 'Barchasi'}</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="space-y-2">
          {recentInquiries.map((item, idx) => (
            <div
              key={idx}
              onClick={() => {
                haptic('light');
                onNavigate('ai', item.title);
              }}
              className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                isDark 
                  ? 'bg-[#1e293b]/50 hover:bg-[#1e293b] border-slate-800 text-slate-200' 
                  : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                <span className="text-xs font-medium">{item.title}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-slate-400">{item.time}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  {item.tag}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Official Legal News & Updates from Lex.uz */}
      <div className={`p-4 rounded-2xl border ${isDark ? 'bg-gradient-to-br from-[#0e1935] to-[#091124] border-indigo-900/40 text-white' : 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 text-slate-900'}`}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-amber-400" />
            <h4 className="font-bold text-xs uppercase tracking-wider text-amber-400">
              {language === 'ru' ? 'Важные правовые новости' : 'Qonunchilikdagi so‘nggi yangiliklar'}
            </h4>
          </div>
          <span className="text-[10px] text-slate-400">Lex.uz 2026</span>
        </div>

        <div className="text-xs space-y-2">
          <div className="p-2.5 rounded-xl bg-black/20 border border-white/5">
            <p className="font-semibold text-slate-200">
              💼 Yangi Mehnat kodeksi amalda (O'RQ-798):
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Eski 1995-yilgi Mehnat kodeksi to'liq o'z kuchini yo'qotgan. Xodimlarga ta'tilning eng kam muddati 21 kalendar kunga oshirildi.
            </p>
          </div>
          <div className="p-2.5 rounded-xl bg-black/20 border border-white/5">
            <p className="font-semibold text-slate-200">
              🚗 Yo'l harakati jarimalarida 50% chegirma muddati:
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Jarima to'g'risidagi qaror chiqarilgan kundan boshlab 15 kun ichida jarima miqdorining 50 foizi to'lansa, qolgan qismi to'lashdan ozod qilinadi.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
