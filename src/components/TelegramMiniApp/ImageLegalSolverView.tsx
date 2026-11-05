import React, { useState, useRef } from 'react';
import { 
  Camera, Upload, Sparkles, FileText, CheckCircle2, 
  AlertTriangle, Copy, Check, ExternalLink, RotateCcw, 
  HelpCircle, Eye, ShieldCheck, ArrowRight
} from 'lucide-react';
import { useTelegram } from './TelegramContext';

interface ImageLegalSolverViewProps {
  onBackToDashboard?: () => void;
}

export const ImageLegalSolverView: React.FC<ImageLegalSolverViewProps> = ({ onBackToDashboard }) => {
  const { theme, haptic, language } = useTelegram();
  const isDark = theme === 'dark';

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>('image/jpeg');
  const [userPrompt, setUserPrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [result, setResult] = useState<string | null>(null);
  const [lawStatus, setLawStatus] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const presets = [
    { label: "📝 Huquqiy test savolini yechish", prompt: "Ushbu test savolini yechib bering, to'g'ri javob variantini aniq ko'rsating va O'zbekistonning amaldagi qonun kodeksi bilan asoslang." },
    { label: "🚗 YHQ jarima bayonnomasi", prompt: "Ushbu jarima bayonnomasini tekshiring: qonuniymi, 15 kunlik 50% chegirma bormi va qanday to'lash yoki shikoyat qilish mumkin?" },
    { label: "⚖️ Sud / MIB qarori", prompt: "Ushbu sud yoki MIB hujjati bo'yicha nima qilishim kerak, qanday huquqlarim bor va murojaat muddati qancha?" },
    { label: "📄 Shartnoma / Tilxat tekshiruvi", prompt: "Ushbu shartnoma yoki tilxatning qonuniy kuchini va undagi xavfli bandlarni tekshirib bering." },
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMsg("Iltimos, faqat rasm fayli (JPG, PNG, WEBP) yuklang.");
      return;
    }

    setErrorMsg(null);
    setResult(null);
    setMimeType(file.type);

    const reader = new FileReader();
    reader.onload = () => {
      const resultStr = reader.result as string;
      setImagePreview(resultStr);
      // clean base64
      setImageBase64(resultStr);
      haptic('light');
    };
    reader.readAsDataURL(file);
  };

  const handleSolve = async () => {
    if (!imageBase64) {
      setErrorMsg("Iltimos, avval rasm yoki hujjat suratini yuklang!");
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);
    setResult(null);
    haptic('medium');

    try {
      const res = await fetch('/api/legal-ai/vision-solve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64,
          mimeType,
          userPrompt: userPrompt.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setResult(data.answer);
        setLawStatus(data.lawStatus);
        haptic('success');
      } else {
        throw new Error(data.error || "Rasmni tahlil qilishda xatolik yuz berdi.");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Xatolik yuz berdi. Qaytadan urinib ko'ring.");
      haptic('error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result);
    setCopied(true);
    haptic('selection');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setImagePreview(null);
    setImageBase64(null);
    setResult(null);
    setUserPrompt('');
    setErrorMsg(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    haptic('light');
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Header Banner */}
      <div className={`p-5 rounded-3xl border ${
        isDark ? 'bg-gradient-to-r from-[#0c1429] to-[#16254a] border-indigo-900/50 text-white' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold shadow-md">
            <Camera className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold tracking-tight">
              {language === 'ru' ? 'Распознавание и решение фото (OCR)' : 'Rasm / Hujjatni O‘qish & Yechish'}
            </h2>
            <p className="text-xs text-slate-400">
              Sud qarorlari, jarimalar, shartnomalar va huquqiy test savollarini rasm orqali yechish
            </p>
          </div>
        </div>

        {/* Info pill */}
        <div className="mt-3 p-3 rounded-2xl bg-cyan-950/40 border border-cyan-800/40 flex items-start gap-2.5 text-xs text-cyan-200">
          <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
          <div>
            <strong className="text-cyan-300">Gemini 3.8 Multimodal Vision:</strong> Hujjatingiz yoki test savolingiz suratini oling. AI matnni o'qiydi (OCR) va O'zbekistonning eng yangi amaldagi qonunchiligi (Lex.uz) bo'yicha to'g'ri yechim beradi.
          </div>
        </div>
      </div>

      {/* Main Upload / Camera Area */}
      <div className={`p-5 rounded-3xl border ${
        isDark ? 'bg-[#0b1224] border-indigo-900/50 text-white' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          capture="environment"
          className="hidden"
        />

        {!imagePreview ? (
          <div 
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-6 sm:p-8 flex flex-col items-center justify-center text-center cursor-pointer transition ${
              isDark 
                ? 'border-slate-800 hover:border-cyan-500/60 bg-[#060b17]/50 hover:bg-[#081020]' 
                : 'border-slate-300 hover:border-blue-500 bg-slate-50 hover:bg-slate-100'
            }`}
          >
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-3 shadow-inner">
              <Camera className="w-7 h-7" />
            </div>
            <h3 className="font-bold text-sm sm:text-base text-slate-200">
              Rasm yuklang yoki kamerada suratga oling
            </h3>
            <p className="text-xs text-slate-400 mt-1 max-w-xs">
              Test savoli, sud hujjati, ma'muriy jarima yoki shartnoma suratini tanlang
            </p>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
              <span className="px-3 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5" /> Kamera
              </span>
              <span className="px-3 py-1.5 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs font-semibold flex items-center gap-1.5">
                <Upload className="w-3.5 h-3.5" /> Galereya
              </span>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Image Preview Card */}
            <div className="relative rounded-2xl overflow-hidden border border-slate-700/60 bg-black/40 flex items-center justify-center max-h-72">
              <img 
                src={imagePreview} 
                alt="Yuklangan hujjat" 
                className="max-h-72 w-auto object-contain rounded-xl"
              />
              <div className="absolute top-2 right-2 flex items-center gap-1.5">
                <button
                  onClick={handleReset}
                  className="px-2.5 py-1 rounded-xl bg-rose-600/90 hover:bg-rose-500 text-white text-xs font-semibold shadow-md transition cursor-pointer"
                >
                  O'chirish
                </button>
              </div>
            </div>

            {/* Presets Chips */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400">
                Tayyor savollar (ixtiyoriy):
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {presets.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      haptic('selection');
                      setUserPrompt(p.prompt);
                    }}
                    className={`p-2 rounded-xl text-left text-xs font-medium border transition cursor-pointer ${
                      userPrompt === p.prompt
                        ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 font-bold'
                        : isDark
                        ? 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                        : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Prompt Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400">
                Savolingiz yoki izohingiz:
              </label>
              <textarea
                value={userPrompt}
                onChange={(e) => setUserPrompt(e.target.value)}
                placeholder="Rasm bo'yicha maxsus savol bering (masalan: Testning to'g'ri javobi qaysi? yoki Jarimani qanday kamaytirish mumkin?)..."
                rows={2}
                className={`w-full p-3 rounded-xl text-xs sm:text-sm border focus:outline-none transition resize-none ${
                  isDark
                    ? 'bg-[#050b18] text-white border-slate-800 focus:border-cyan-400'
                    : 'bg-slate-50 text-slate-900 border-slate-300 focus:border-blue-600'
                }`}
              />
            </div>

            {/* Solve Button */}
            <button
              onClick={handleSolve}
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-extrabold text-xs sm:text-sm shadow-lg shadow-blue-500/20 transition disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>🔍 Matn o'qilmoqda va yechilmoqda...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Rasmni Tahlil Qilish &amp; Yechish</span>
                </>
              )}
            </button>
          </div>
        )}

        {errorMsg && (
          <div className="mt-3 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
      </div>

      {/* Result Section */}
      {result && (
        <div className={`p-5 rounded-3xl border space-y-3.5 animate-fadeIn ${
          isDark ? 'bg-[#0c1428] border-cyan-800/50 text-white' : 'bg-white border-blue-200 text-slate-900 shadow-md'
        }`}>
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <h3 className="font-extrabold text-sm sm:text-base text-emerald-400">
                Huquqiy Ekspertiza &amp; Yechim
              </h3>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                ✅ AMALDAGI QONUNCHILIK
              </span>
              <button
                onClick={handleCopy}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
                title="Xulosani nusxalash"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Formatted Text */}
          <div className="text-xs sm:text-sm leading-relaxed whitespace-pre-line text-slate-200">
            {result}
          </div>

          {/* Footer action links */}
          <div className="pt-3 border-t border-slate-800/60 flex flex-wrap items-center justify-between gap-2 text-xs">
            <a
              href="https://lex.uz"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300 font-semibold"
            >
              <span>Lex.uz rasmiy qonunlar bazasida tekshirish</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <button
              onClick={handleReset}
              className="text-slate-400 hover:text-white text-xs underline cursor-pointer"
            >
              Yangi rasm tahlil qilish
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
