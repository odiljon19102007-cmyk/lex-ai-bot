import React, { useState } from 'react';
import { 
  Landmark, ShieldAlert, Plane, Scale, ExternalLink, 
  HelpCircle, ChevronRight, FileText, CheckCircle2, AlertTriangle
} from 'lucide-react';
import { useTelegram } from './TelegramContext';
import { MIB_TOPICS } from '../../data/telegramLegalPlatform';

export const MibView: React.FC = () => {
  const { theme, haptic, language } = useTelegram();
  const isDark = theme === 'dark';

  const [selectedTopicId, setSelectedTopicId] = useState<string>('mib_aliment');
  const [childrenCount, setChildrenCount] = useState<number>(1);
  const [salaryInput, setSalaryInput] = useState<number>(5000000);

  const selectedTopic = MIB_TOPICS.find((t) => t.id === selectedTopicId) || MIB_TOPICS[0];

  const calculateAliment = () => {
    let fraction = "1/4 (25%)";
    let amount = salaryInput * 0.25;
    if (childrenCount === 2) {
      fraction = "1/3 (33.3%)";
      amount = salaryInput * (1 / 3);
    } else if (childrenCount >= 3) {
      fraction = "1/2 (50%)";
      amount = salaryInput * 0.5;
    }
    return { fraction, amount: Math.round(amount).toLocaleString() };
  };

  const alimentResult = calculateAliment();

  return (
    <div className="space-y-4 pb-20">
      {/* Header */}
      <div className={`p-5 rounded-3xl border ${
        isDark ? 'bg-gradient-to-r from-[#0c1429] to-[#111e3d] border-indigo-900/50 text-white' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-700 flex items-center justify-center text-white font-bold shadow-md">
            <Landmark className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold tracking-tight">
              {language === 'ru' ? 'Отдел БПИ (МИБ)' : 'MIB Bo‘limi (Majburiy Ijro Byurosi)'}
            </h2>
            <p className="text-xs text-slate-400">
              Aliment, chet elga chiqish taqiqlari, qarzdor huquqlari va ijro ishlari
            </p>
          </div>
        </div>

        {/* Topics Selector */}
        <div className="mt-4 flex gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
          {MIB_TOPICS.map((topic) => (
            <button
              key={topic.id}
              onClick={() => {
                haptic('selection');
                setSelectedTopicId(topic.id);
              }}
              className={`px-3 py-2 rounded-xl font-medium shrink-0 transition flex items-center gap-1.5 cursor-pointer ${
                selectedTopicId === topic.id
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                  : isDark
                  ? 'bg-slate-800 text-slate-300 hover:text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <span>{topic.icon}</span>
              <span>{topic.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Aliment Calculator Widget */}
      {selectedTopicId === 'mib_aliment' && (
        <div className={`p-5 rounded-3xl border space-y-4 ${
          isDark ? 'bg-[#0f172a] border-cyan-900/40 text-white' : 'bg-white border-slate-200 text-slate-900'
        }`}>
          <div className="flex items-center space-x-2">
            <span className="text-xl">👶</span>
            <h3 className="font-extrabold text-sm text-cyan-400">
              Aliment Miqdorini Hisoblash Kalkulyatori (OK 99-modda)
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-slate-400 mb-1">Farzandlar soni:</label>
              <div className="flex gap-2">
                {[1, 2, 3].map((num) => (
                  <button
                    key={num}
                    onClick={() => {
                      haptic('selection');
                      setChildrenCount(num);
                    }}
                    className={`flex-1 py-2 rounded-xl border font-bold transition cursor-pointer ${
                      childrenCount === num
                        ? 'bg-cyan-500 text-slate-950 border-cyan-400'
                        : isDark
                        ? 'bg-slate-800 text-slate-300 border-slate-700'
                        : 'bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    {num === 3 ? '3+ bola' : `${num} bola`}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Qarzdorning oylik daromadi (so'm):</label>
              <input
                type="number"
                value={salaryInput}
                onChange={(e) => setSalaryInput(Number(e.target.value))}
                step={500000}
                className={`w-full px-3 py-2 rounded-xl border focus:outline-none ${
                  isDark ? 'bg-[#080e1e] text-white border-slate-800' : 'bg-slate-50 text-slate-900 border-slate-300'
                }`}
              />
            </div>
          </div>

          <div className={`p-4 rounded-2xl border flex items-center justify-between ${
            isDark ? 'bg-cyan-950/40 border-cyan-800/40 text-cyan-200' : 'bg-cyan-50 border-cyan-200 text-cyan-900'
          }`}>
            <div>
              <span className="text-[11px] block font-medium opacity-80">
                Qonuniy ulush: {alimentResult.fraction}
              </span>
              <span className="text-lg font-extrabold text-cyan-400">
                {alimentResult.amount} so'm / oy
              </span>
            </div>
            <span className="text-[10px] max-w-[160px] text-right opacity-80">
              * Har bir bola uchun BHMning 26.5 foizidan kam bo'lishi mumkin emas
            </span>
          </div>
        </div>
      )}

      {/* Selected Topic Details Card */}
      <div className={`p-5 rounded-3xl border space-y-4 ${
        isDark ? 'bg-[#0f172a] border-indigo-900/40 text-white' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        <div className="flex items-center space-x-3">
          <span className="text-2xl">{selectedTopic.icon}</span>
          <div>
            <h3 className="font-extrabold text-base text-amber-400">
              {selectedTopic.title}
            </h3>
            <span className="text-xs text-slate-400">
              "Sud hujjatlari va boshqa organlar hujjatlarini ijro etish to'g'risida"gi Qonun
            </span>
          </div>
        </div>

        <div className={`p-4 rounded-2xl border font-sans text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
          isDark ? 'bg-[#080e1f] text-slate-200 border-slate-800' : 'bg-slate-50 text-slate-800 border-slate-200'
        }`}>
          {selectedTopic.details}
        </div>

        <div className="pt-2">
          <a
            href={selectedTopic.lexUrl}
            target="_blank"
            rel="noreferrer"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition cursor-pointer"
          >
            <span>Lex.uz rasmiy qonunchilik asosini ochish</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
};
