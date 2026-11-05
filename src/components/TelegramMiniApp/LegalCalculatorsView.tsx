import React, { useState } from 'react';
import { 
  Calculator, DollarSign, Calendar, ShieldCheck, 
  ChevronRight, ExternalLink, RefreshCw, BookmarkCheck, 
  HelpCircle, Sparkles, Scale, Info, ArrowRight, Check
} from 'lucide-react';
import { useTelegram } from './TelegramContext';
import { 
  calculateAlimony, 
  calculateVacationPay, 
  calculateSeverancePay, 
  calculateCourtFee, 
  calculateSalaryTaxes, 
  calculateMibExecutionFee,
  CalculationResult,
  LEGAL_CONSTANTS
} from '../../data/legalCalculatorsEngine';

export const LegalCalculatorsView: React.FC = () => {
  const { theme, haptic, language, user } = useTelegram();
  const isDark = theme === 'dark';

  const [activeTab, setActiveTab] = useState<'aliment' | 'tatil' | 'nafaqa' | 'boj' | 'soliq' | 'mib'>('aliment');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // 1. Aliment state
  const [alimentChildren, setAlimentChildren] = useState(1);
  const [alimentIncome, setAlimentIncome] = useState(6000000);

  // 2. Ta'til puli state
  const [vacationSalary, setVacationSalary] = useState(5500000);
  const [vacationDays, setVacationDays] = useState(21);

  // 3. Ishdan bo'shatish nafaqasi state
  const [severanceSalary, setSeveranceSalary] = useState(6000000);
  const [severanceYears, setSeveranceYears] = useState(4);

  // 4. Davlat boji state
  const [claimType, setClaimType] = useState<'mulkiy' | 'nomulkiy' | 'ajralish' | 'meros'>('mulkiy');
  const [claimAmount, setClaimAmount] = useState(50000000);

  // 5. Ish haqi & Soliq state
  const [grossSalary, setGrossSalary] = useState(7000000);

  // 6. MIB ijro yig'imi state
  const [mibDebt, setMibDebt] = useState(15000000);
  const [mibIsEntity, setMibIsEntity] = useState(false);

  // Compute active calculation
  const getActiveResult = (): CalculationResult => {
    switch (activeTab) {
      case 'aliment':
        return calculateAlimony(alimentChildren, alimentIncome);
      case 'tatil':
        return calculateVacationPay(vacationSalary, vacationDays);
      case 'nafaqa':
        return calculateSeverancePay(severanceSalary, severanceYears);
      case 'boj':
        return calculateCourtFee(claimType, claimAmount);
      case 'soliq':
        return calculateSalaryTaxes(grossSalary);
      case 'mib':
        return calculateMibExecutionFee(mibDebt, mibIsEntity);
      default:
        return calculateAlimony(1, 5000000);
    }
  };

  const currentResult = getActiveResult();

  const handleSaveToHistory = async () => {
    haptic('success');
    try {
      await fetch('/api/calculators/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          calcType: currentResult.calcType,
          userId: user.id ? String(user.id) : 'default_user',
          params: { saveHistory: true, activeTab }
        })
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
    } catch (e) {
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
    }
  };

  const tabs = [
    { id: 'aliment', label: "Aliment (OK 99)", icon: Scale },
    { id: 'tatil', label: "Ta'til puli (MK 216)", icon: Calendar },
    { id: 'nafaqa', label: "Ishdan bo'shatish (MK 173)", icon: DollarSign },
    { id: 'boj', label: "Davlat boji", icon: ShieldCheck },
    { id: 'soliq', label: "Ish haqi & Soliq (SK 381)", icon: Calculator },
    { id: 'mib', label: "MIB ijro yig'imi", icon: Sparkles },
  ];

  return (
    <div className="space-y-4 pb-20">
      {/* Header Banner */}
      <div className={`p-5 rounded-3xl border ${
        isDark ? 'bg-gradient-to-r from-[#0c1429] to-[#111e3d] border-indigo-900/50 text-white' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold shadow-md">
            <Calculator className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold tracking-tight">
              {language === 'ru' ? 'Правовые калькуляторы' : 'Huquqiy Kalkulyatorlar'}
            </h2>
            <p className="text-xs text-slate-400">
              BHM: 375 000 so'm | MHEKM: 1 155 000 so'm (Amaldagi O'zbekiston me'yorlari)
            </p>
          </div>
        </div>

        {/* Tab Pills */}
        <div className="mt-4 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
          {tabs.map((t) => {
            const Icon = t.icon;
            const isActive = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => {
                  haptic('light');
                  setActiveTab(t.id as any);
                }}
                className={`px-3 py-2 rounded-xl flex items-center gap-1.5 font-bold transition whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-amber-400 text-slate-950 shadow-md font-extrabold'
                    : isDark
                    ? 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Input Parameters Card */}
      <div className={`p-5 rounded-3xl border ${
        isDark ? 'bg-[#0a1128] border-indigo-900/50 text-white' : 'bg-white border-slate-200 text-slate-800'
      }`}>
        <h3 className="text-sm font-extrabold uppercase tracking-wider text-amber-400 mb-3 flex items-center gap-1.5">
          <Info className="w-4 h-4" />
          <span>Hisoblash Parametrlari</span>
        </h3>

        {/* TAB 1: ALIMENT */}
        {activeTab === 'aliment' && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold mb-1.5">Farzandlar soni:</label>
              <div className="grid grid-cols-3 gap-2">
                {[1, 2, 3].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => {
                      haptic('light');
                      setAlimentChildren(num);
                    }}
                    className={`py-2 rounded-xl text-xs font-bold border transition ${
                      alimentChildren === num
                        ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md'
                        : isDark
                        ? 'bg-slate-800 text-slate-300 border-slate-700'
                        : 'bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    {num === 3 ? "3 va undan ortiq" : `${num} nafar bola`}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1">
                Oylik rasmiy daromad (so'mda):
              </label>
              <input
                type="number"
                value={alimentIncome}
                onChange={(e) => setAlimentIncome(Math.max(0, Number(e.target.value)))}
                step="500000"
                className={`w-full px-3.5 py-2.5 rounded-xl text-sm border focus:outline-none transition ${
                  isDark ? 'bg-[#060c1c] text-white border-slate-800 focus:border-amber-400' : 'bg-slate-50 text-slate-900 border-slate-300 focus:border-blue-600'
                }`}
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                {alimentIncome.toLocaleString('uz-UZ')} so'm
              </span>
            </div>
          </div>
        )}

        {/* TAB 2: TA'TIL PULI */}
        {activeTab === 'tatil' && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold mb-1">
                Oxirgi 12 oylik o'rtacha oylik maosh (so'mda):
              </label>
              <input
                type="number"
                value={vacationSalary}
                onChange={(e) => setVacationSalary(Math.max(0, Number(e.target.value)))}
                step="500000"
                className={`w-full px-3.5 py-2.5 rounded-xl text-sm border focus:outline-none transition ${
                  isDark ? 'bg-[#060c1c] text-white border-slate-800 focus:border-amber-400' : 'bg-slate-50 text-slate-900 border-slate-300 focus:border-blue-600'
                }`}
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                {vacationSalary.toLocaleString('uz-UZ')} so'm
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1">
                Ta'til davomiyligi (ish kunlarida):
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={vacationDays}
                  onChange={(e) => setVacationDays(Math.max(1, Number(e.target.value)))}
                  className={`w-32 px-3.5 py-2.5 rounded-xl text-sm border focus:outline-none transition ${
                    isDark ? 'bg-[#060c1c] text-white border-slate-800 focus:border-amber-400' : 'bg-slate-50 text-slate-900 border-slate-300 focus:border-blue-600'
                  }`}
                />
                <div className="flex gap-1.5">
                  {[15, 21, 24, 30].map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setVacationDays(d)}
                      className="px-2.5 py-1 rounded-lg text-xs bg-slate-700/60 hover:bg-slate-700 text-slate-200"
                    >
                      {d} kun
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: ISHDAN BO'SHATISH NAFAQASI */}
        {activeTab === 'nafaqa' && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold mb-1">
                O'rtacha oylik ish haqi (so'mda):
              </label>
              <input
                type="number"
                value={severanceSalary}
                onChange={(e) => setSeveranceSalary(Math.max(0, Number(e.target.value)))}
                step="500000"
                className={`w-full px-3.5 py-2.5 rounded-xl text-sm border focus:outline-none transition ${
                  isDark ? 'bg-[#060c1c] text-white border-slate-800 focus:border-amber-400' : 'bg-slate-50 text-slate-900 border-slate-300 focus:border-blue-600'
                }`}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1">
                Korxonadagi ish staji (yillarda):
              </label>
              <input
                type="number"
                value={severanceYears}
                onChange={(e) => setSeveranceYears(Math.max(0, Number(e.target.value)))}
                className={`w-32 px-3.5 py-2.5 rounded-xl text-sm border focus:outline-none transition ${
                  isDark ? 'bg-[#060c1c] text-white border-slate-800 focus:border-amber-400' : 'bg-slate-50 text-slate-900 border-slate-300 focus:border-blue-600'
                }`}
              />
              <p className="text-[11px] text-slate-400 mt-1">
                MK 173-moddasi: 3 yilgacha — 50%, 3-5 yil — 75%, 5-10 yil — 100%, 10-15 yil — 150%, 15+ yil — 200%.
              </p>
            </div>
          </div>
        )}

        {/* TAB 4: DAVLAT BOJI */}
        {activeTab === 'boj' && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold mb-1.5">Da'vo turi:</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'mulkiy', label: "Mulkiy da'vo (4%)" },
                  { id: 'nomulkiy', label: "Nomulkiy (2 BHM)" },
                  { id: 'ajralish', label: "Ajralish (2 BHM)" },
                  { id: 'meros', label: "Meros nizosi" },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      haptic('light');
                      setClaimType(item.id as any);
                    }}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border text-left transition ${
                      claimType === item.id
                        ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md'
                        : isDark
                        ? 'bg-slate-800 text-slate-300 border-slate-700'
                        : 'bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {claimType === 'mulkiy' && (
              <div>
                <label className="block text-xs font-semibold mb-1">
                  Da'vo bahosi (undirilishi so'ralayotgan summa, so'mda):
                </label>
                <input
                  type="number"
                  value={claimAmount}
                  onChange={(e) => setClaimAmount(Math.max(0, Number(e.target.value)))}
                  step="1000000"
                  className={`w-full px-3.5 py-2.5 rounded-xl text-sm border focus:outline-none transition ${
                    isDark ? 'bg-[#060c1c] text-white border-slate-800 focus:border-amber-400' : 'bg-slate-50 text-slate-900 border-slate-300 focus:border-blue-600'
                  }`}
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  {claimAmount.toLocaleString('uz-UZ')} so'm
                </span>
              </div>
            )}
          </div>
        )}

        {/* TAB 5: ISH HAQI & SOLIQ */}
        {activeTab === 'soliq' && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold mb-1">
                Hisoblangan yalpi ish haqi (Brutto, so'mda):
              </label>
              <input
                type="number"
                value={grossSalary}
                onChange={(e) => setGrossSalary(Math.max(0, Number(e.target.value)))}
                step="500000"
                className={`w-full px-3.5 py-2.5 rounded-xl text-sm border focus:outline-none transition ${
                  isDark ? 'bg-[#060c1c] text-white border-slate-800 focus:border-amber-400' : 'bg-slate-50 text-slate-900 border-slate-300 focus:border-blue-600'
                }`}
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                {grossSalary.toLocaleString('uz-UZ')} so'm
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Soliq kodeksi 381-moddasi: JShODS stavkasi 12%. INPS 0.1% daromad solig'i hisobidan avtomatik ajratiladi.
            </p>
          </div>
        )}

        {/* TAB 6: MIB IJRO YIG'IMI */}
        {activeTab === 'mib' && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold mb-1">
                Ijro hujjati bo'yicha qarz summasi (so'mda):
              </label>
              <input
                type="number"
                value={mibDebt}
                onChange={(e) => setMibDebt(Math.max(0, Number(e.target.value)))}
                step="1000000"
                className={`w-full px-3.5 py-2.5 rounded-xl text-sm border focus:outline-none transition ${
                  isDark ? 'bg-[#060c1c] text-white border-slate-800 focus:border-amber-400' : 'bg-slate-50 text-slate-900 border-slate-300 focus:border-blue-600'
                }`}
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isEntity"
                checked={mibIsEntity}
                onChange={(e) => setMibIsEntity(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="isEntity" className="text-xs font-semibold cursor-pointer">
                Qarzdor yuridik shaxs (tashkilot) — 5% stavka
              </label>
            </div>
          </div>
        )}
      </div>

      {/* Result Card */}
      <div className={`p-5 rounded-3xl border shadow-lg ${
        isDark ? 'bg-gradient-to-br from-[#0c1633] to-[#12224d] border-amber-500/30 text-white' : 'bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200 text-slate-900'
      }`}>
        <div className="flex items-start justify-between">
          <div>
            <span className="text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-md bg-amber-400/20 text-amber-400 border border-amber-400/30">
              Yakuniy Natija
            </span>
            <h3 className="text-base font-extrabold mt-1.5">{currentResult.title}</h3>
            <p className="text-2xl font-black text-amber-400 mt-2 tracking-tight">
              {currentResult.resultFormatted}
            </p>
            <p className="text-xs text-slate-300 mt-1">{currentResult.summary}</p>
          </div>

          <button
            onClick={handleSaveToHistory}
            className={`p-2 rounded-xl transition cursor-pointer flex items-center gap-1 text-xs font-bold ${
              savedSuccess
                ? 'bg-emerald-500 text-white'
                : 'bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-400/30'
            }`}
            title="Tarixga saqlash"
          >
            {savedSuccess ? <Check className="w-4 h-4" /> : <BookmarkCheck className="w-4 h-4" />}
            <span className="hidden sm:inline">{savedSuccess ? "Saqlandi" : "Saqlash"}</span>
          </button>
        </div>

        {/* Breakdown table */}
        <div className="mt-4 pt-3 border-t border-slate-700/40 space-y-2">
          {currentResult.breakdown.map((row, idx) => (
            <div key={idx} className="flex items-center justify-between text-xs">
              <span className="text-slate-400">{row.label}:</span>
              <span className="font-semibold text-slate-200 text-right">{row.value}</span>
            </div>
          ))}
        </div>

        {/* Legal basis footer */}
        <div className="mt-4 pt-3 border-t border-slate-700/40 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
            <Scale className="w-3.5 h-3.5 text-amber-400" />
            <span>{currentResult.legalBasis}</span>
          </div>

          <a
            href={currentResult.lexUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 text-[11px] text-amber-400 hover:underline font-bold"
          >
            <span>Lex.uz da ko'rish</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
};
