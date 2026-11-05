import React, { useState, useRef } from 'react';
import { 
  Award, CheckCircle2, XCircle, ArrowRight, RotateCcw, 
  Download, Share2, Sparkles, ShieldCheck, ExternalLink, HelpCircle
} from 'lucide-react';
import { useTelegram } from './TelegramContext';

interface Question {
  id: number;
  question: string;
  category: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  legalBasis: string;
}

const IQ_QUESTIONS: Question[] = [
  {
    id: 1,
    question: "Do'konda tovar vitrinasida 20 000 so'm yozilgan, lekin kassir 'tizimda narx 25 000 so'mga oshgan' deb ortiqcha pul talab qilsa, qaysi narxda to'lashingiz shart?",
    category: "Iste'molchilar huquqlari",
    options: [
      "Kassadagi yangi narx (25 000 so'm) bo'yicha to'lash shart",
      "Vitrindagi ko'rsatilgan narx (20 000 so'm) bo'yicha to'lanadi",
      "Ikkala narxning o'rtachasi bo'yicha kelishiladi",
      "Do'kon tovarni sotishdan butunlay bosh tortishi mumkin"
    ],
    correctIndex: 1,
    explanation: "'Iste'molchilarning huquqlarini himoya qilish to'g'risida'gi Qonunning 8-moddasiga ko'ra, sotuvchi xaridorga to'g'ri narx haqida ma'lumot berishi shart. Vitrinadagi narx ommaviy oferta hisoblanadi va tovar faqat vitrindagi narxda sotilishi shart!",
    legalBasis: "O'zbekiston Respublikasi 'Iste'molchilar huquqlarini himoya qilish to'g'risida'gi Qonun, 8-modda"
  },
  {
    id: 2,
    question: "Yangi Mehnat kodeksi bo'yicha xodim ishga qabul qilinganda dastlabki sinov muddati maksimal necha oydan oshmasligi kerak?",
    category: "Mehnat huquqi",
    options: [
      "Ko'pi bilan 1 oydan",
      "Ko'pi bilan 3 oydan (rahbarlar uchun 6 oygacha)",
      "Ko'pi bilan 6 oydan (barcha xodimlar uchun)",
      "Sinov muddati chegaralanmagan"
    ],
    correctIndex: 1,
    explanation: "Yangi Mehnat kodeksining 130-moddasiga binoan, dastlabki sinov muddati 3 oydan, tashkilot rahbari, uning o'rinbosarlari va bosh buxgalterlar uchun esa 6 oydan oshishi mumkin emas.",
    legalBasis: "Mehnat kodeksi (O'RQ-798), 130-modda"
  },
  {
    id: 3,
    question: "Yo'l harakati qoidasini buzganlik uchun jarimani qaror chiqqan kundan boshlab necha kun ichida to'lasa, 50 foiz chegirma beriladi?",
    category: "Ma'muriy javobgarlik",
    options: [
      "3 kun ichida",
      "7 kun ichida",
      "15 kun ichida",
      "30 kun ichida"
    ],
    correctIndex: 2,
    explanation: "MJtKning 332-1-moddasiga ko'ra, huquqbuzar jarima solish to'g'risidagi qaror topshirilgan kundan boshlab 15 kun ichida jarima miqdorining 50 foizini to'lasa, qolgan qismidan ozod qilinadi.",
    legalBasis: "Ma'muriy javobgarlik to'g'risidagi kodeks, 332-1-modda"
  },
  {
    id: 4,
    question: "Oila kodeksi bo'yicha sud tartibida 1 nafar voyaga yetmagan bola uchun ota yoki onadan qancha miqdorda aliment undiriladi?",
    category: "Oila huquqi",
    options: [
      "Daromadning 1/6 qismi (16.6%)",
      "Daromadning 1/4 qismi (25%)",
      "Daromadning 1/3 qismi (33.3%)",
      "Daromadning teng yarmi (50%)"
    ],
    correctIndex: 1,
    explanation: "Oila kodeksining 99-moddasiga asosan: 1 nafar bola uchun — daromadning 1/4 qismi (25%), 2 nafar bola uchun — 1/3 qismi, 3 va undan ortiq bola uchun — 1/2 qismi aliment undiriladi.",
    legalBasis: "Oila kodeksi, 99-modda"
  },
  {
    id: 5,
    question: "Ijara shartnomasi bo'lgan taqdirda, uy egasi ijarachini ogohlantirmasdan bir kunda ko'chaga haydab chiqara oladimi?",
    category: "Fuqarolik va Uy-joy huquqi",
    options: [
      "Ha, chunki uy uning shaxsiy mulki",
      "Yo'q, faqat sud qarori orqali yoki shartnomada belgilangan muddatda ogohlantirib",
      "Faqat ichki ishlar xodimi chaqirilsa mumkin",
      "Ha, agar kommunal to'lovni kechiktirsa"
    ],
    correctIndex: 1,
    explanation: "Fuqarolik kodeksining 615-moddasiga binoan, turar joy ijarasi shartnomasini bekor qilish va fuqaroni uydan chiqarish faqat sud tartibida amalga oshiriladi. O'zboshimchalik bilan chiqarish noqonuniydir.",
    legalBasis: "Fuqarolik kodeksi, 615-modda"
  },
  {
    id: 6,
    question: "Do'stingiz olgan bank kreditiga 'Kafil' (poruchitel) bo'lsangiz va u qarzni to'lamasa, siz javobgar bo'lasizmi?",
    category: "Bank va Fuqarolik huquqi",
    options: [
      "Yo'q, kafil faqat yaxshi niyat bildiradi, pul to'lamaydi",
      "Ha, kafil qarz oluvchi bilan teng (solidar) javobgar bo'ladi va bank pulni kafildan undirishi mumkin",
      "Faqat qarz oluvchi vafot etsagina javobgar bo'ladi",
      "Faqat qarzning 10 foizi miqdorida javobgar bo'ladi"
    ],
    correctIndex: 1,
    explanation: "Fuqarolik kodeksining 293-moddasiga muvofiq, agar shartnomada boshqacha ko'rsatilmagan bo'lsa, kafil va qarzdor kreditor oldida solidar (birgalikda) javob beradilar. Bank butun qarzni kafildan undirishga haqlidir.",
    legalBasis: "Fuqarolik kodeksi, 293-modda"
  },
  {
    id: 7,
    question: "Ish beruvchi xodimni dam olish kunlari (shanba va yakshanba) uning roziligisiz ishlashga majburlashi mumkinmi?",
    category: "Mehnat huquqi",
    options: [
      "Ha, agar korxonada reja to'lmayotgan bo'lsa",
      "Yo'q, faqat xodimning yozma roziligi bilan va kamida 2 hissa haq to'lanishi shart",
      "Ha, oylik maoshiga 10% ustama qo'shib berilsa yetarli",
      "Direktorning og'zaki buyrug'i kifoya"
    ],
    correctIndex: 1,
    explanation: "Mehnat kodeksining 209-moddasiga binoan, dam olish kunlarida ishlash faqat xodimning yozma roziligi bilan amalga oshiriladi va MK 262-moddaga muvofiq kamida 2 hissa miqdorida haq to'lanadi.",
    legalBasis: "Mehnat kodeksi, 209 va 262-moddalar"
  },
  {
    id: 8,
    question: "O'zbekiston Respublikasi Fuqarolik kodeksida belgilangan umumiy da'vo muddati (srok davnosti) necha yil?",
    category: "Fuqarolik huquqi",
    options: [
      "1 yil",
      "3 yil",
      "5 yil",
      "10 yil"
    ],
    correctIndex: 1,
    explanation: "Fuqarolik kodeksining 150-moddasiga muvofiq, umumiy da'vo muddati uch yil (3 yil) qilib belgilangan.",
    legalBasis: "Fuqarolik kodeksi, 150-modda"
  },
  {
    id: 9,
    question: "Ko'chada tushib qolgan qimmatbaho telefonni topib olib, o'zlashtirib olgan shaxsning harakati qanday baholanadi?",
    category: "Fuqarolik va Jinoyat huquqi",
    options: [
      "Qonuniy topilma deb hisoblanadi va to'liq o'ziga qoladi",
      "Topilma haqida IIBga yoki mulkdorga xabar bermay yashirish o'g'rilik (JK 169) deb baholanishi mumkin",
      "Faqat egasi qidirib kelsagina qaytarishi shart",
      "Telefon sim-kartasini tashlab yuborsa hech qanday javobgarlik bo'lmaydi"
    ],
    correctIndex: 1,
    explanation: "Fuqarolik kodeksining 192-moddasiga ko'ra, topib olgan shaxs bu haqda darhol politsiyaga yoki tegishli organga xabar berishi shart. O'zbekiston Oliy Sudi amaliyotiga binoan, topilgan narsani yashirib o'zlashtirish o'g'rilik (JK 169-modda) deb malakalanadi.",
    legalBasis: "Fuqarolik kodeksi 192-modda, Jinoyat kodeksi 169-modda"
  },
  {
    id: 10,
    question: "Birov haqida Internetda (Telegram/Instagram) yolg'on va sha'nini kamsituvchi ma'lumot tarqatganlik uchun qanday jazo bor?",
    category: "Axborot va Jinoyat huquqi",
    options: [
      "Internetdagi so'z erkinligi bo'lgani uchun jazo yo'q",
      "Tuhmat va haqorat uchun BHMning 20 dan 60 baravarigacha jarima yoki jinoiy javobgarlik (JK 139)",
      "Faqat akkauntni o'chirib tashlash majburiyati",
      "Faqat 100 000 so'm ma'muriy jarima"
    ],
    correctIndex: 1,
    explanation: "MJtKning 40-moddasi va Jinoyat kodeksining 139-moddasiga ko'ra, ommaviy axborot vositalari yoki Internet orqali tuhmat qilish og'irlashtiruvchi holat hisoblanib, katta jarima yoki ozodlikni cheklash jazosi qo'llaniladi.",
    legalBasis: "MJtK 40-modda, Jinoyat kodeksi 139-modda"
  }
];

export const LegalIqCertificateView: React.FC = () => {
  const { theme, haptic, language, user } = useTelegram();
  const isDark = theme === 'dark';

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  // Certificate canvas ref
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const currentQ = IQ_QUESTIONS[currentIndex];
  const totalQuestions = IQ_QUESTIONS.length;

  const handleSelectOption = (optIndex: number) => {
    if (selectedAnswers[currentIndex] !== undefined) return;
    haptic('light');

    const updated = { ...selectedAnswers, [currentIndex]: optIndex };
    setSelectedAnswers(updated);
    setShowExplanation(true);
  };

  const handleNext = () => {
    haptic('medium');
    setShowExplanation(false);

    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setIsCompleted(true);
    }
  };

  const handleRestart = () => {
    haptic('medium');
    setSelectedAnswers({});
    setCurrentIndex(0);
    setIsCompleted(false);
    setShowExplanation(false);
    setDownloadSuccess(false);
  };

  // Calculate results
  const calculateScore = () => {
    let correct = 0;
    IQ_QUESTIONS.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctIndex) {
        correct++;
      }
    });
    const percentage = Math.round((correct / totalQuestions) * 100);
    const iqScore = 80 + Math.round(correct * 6); // 80 to 140 IQ scale

    let rankTitle = "Boshlang'ich Fuqaro";
    let rankColor = "text-sky-400";
    if (percentage >= 90) {
      rankTitle = "Oliy Toifali Huquqiy Ekspert";
      rankColor = "text-amber-400";
    } else if (percentage >= 70) {
      rankTitle = "Yurist Darajasidagi Bilimdon";
      rankColor = "text-emerald-400";
    } else if (percentage >= 50) {
      rankTitle = "Huquqiy Amaliyotchi";
      rankColor = "text-blue-400";
    }

    return { correct, percentage, iqScore, rankTitle, rankColor };
  };

  const { correct, percentage, iqScore, rankTitle, rankColor } = calculateScore();

  // Generate Certificate Image on HTML5 Canvas
  const handleDownloadCertificate = () => {
    haptic('heavy');
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 1200;
    canvas.height = 800;

    // Background: Deep Royal Navy
    const grad = ctx.createLinearGradient(0, 0, 1200, 800);
    grad.addColorStop(0, '#060a17');
    grad.addColorStop(0.5, '#0b142c');
    grad.addColorStop(1, '#050813');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1200, 800);

    // Gold Outer & Inner Borders
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 14;
    ctx.strokeRect(30, 30, 1140, 740);

    ctx.strokeStyle = '#f3e5ab';
    ctx.lineWidth = 3;
    ctx.strokeRect(45, 45, 1110, 710);

    // Decorative Corner Stars
    ctx.fillStyle = '#d4af37';
    const drawStar = (cx: number, cy: number, spikes = 5, outerRadius = 16, innerRadius = 8) => {
      let rot = Math.PI / 2 * 3;
      let x = cx;
      let y = cy;
      const step = Math.PI / spikes;
      ctx.beginPath();
      ctx.moveTo(cx, cy - outerRadius);
      for (let i = 0; i < spikes; i++) {
        x = cx + Math.cos(rot) * outerRadius;
        y = cy + Math.sin(rot) * outerRadius;
        ctx.lineTo(x, y);
        rot += step;
        x = cx + Math.cos(rot) * innerRadius;
        y = cy + Math.sin(rot) * innerRadius;
        ctx.lineTo(x, y);
        rot += step;
      }
      ctx.lineTo(cx, cy - outerRadius);
      ctx.closePath();
      ctx.fill();
    };

    drawStar(70, 70);
    drawStar(1130, 70);
    drawStar(70, 730);
    drawStar(1130, 730);

    // Header Emblem
    ctx.fillStyle = '#d4af37';
    ctx.font = 'bold 22px serif';
    ctx.textAlign = 'center';
    ctx.fillText("O'ZBEKISTON RESPUBLIKASI QONUNCHILIGI", 600, 110);

    ctx.fillStyle = '#94a3b8';
    ctx.font = 'bold 15px sans-serif';
    ctx.fillText("LEXAI 2.0 MILLIY HUQUQIY AI PLATFORMASI", 600, 140);

    // Main Certificate Title
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 48px serif';
    ctx.fillText("RASMIY HUQUQIY SERTIFIKAT", 600, 215);

    ctx.fillStyle = '#38bdf8';
    ctx.font = '600 18px sans-serif';
    ctx.fillText("HUQUQIY SAVODXONLIK VA BILIM DARAJASI BO'YICHA", 600, 255);

    // Divider line
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(350, 275);
    ctx.lineTo(850, 275);
    ctx.stroke();

    // Recipient Name
    ctx.fillStyle = '#94a3b8';
    ctx.font = 'italic 18px serif';
    ctx.fillText("Ushbu sertifikat rasman taqdim etiladi:", 600, 320);

    const displayName = user?.first_name 
      ? `${user.first_name} ${user.last_name || ''}`.trim() 
      : 'Yurist Foydalanuvchi';

    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 52px serif';
    ctx.fillText(displayName, 600, 385);

    // Result Text
    ctx.fillStyle = '#e2e8f0';
    ctx.font = '20px sans-serif';
    ctx.fillText(
      `O'zbekiston Respublikasi amaldagi qonunchiligi bo'yicha 10 ta asosiy kazus testlaridan muvaffaqiyatli o'tib,`, 
      600, 445
    );

    ctx.fillStyle = '#4ade80';
    ctx.font = 'bold 32px sans-serif';
    ctx.fillText(`Huquqiy IQ: ${iqScore} Ball  •  Natija: ${percentage}% (${correct}/10)`, 600, 495);

    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 26px serif';
    ctx.fillText(`Berilgan unvon: «${rankTitle}»`, 600, 545);

    // Footer info
    const certNumber = `LEX-IQ-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const todayStr = new Date().toLocaleDateString('uz-UZ', { year: 'numeric', month: 'long', day: 'numeric' });

    ctx.textAlign = 'left';
    ctx.fillStyle = '#94a3b8';
    ctx.font = '14px sans-serif';
    ctx.fillText(`Sertifikat raqami: ${certNumber}`, 100, 680);
    ctx.fillText(`Berilgan sana: ${todayStr}`, 100, 705);
    ctx.fillText(`Tekshirish: lex.uz / t.me/Huquqiy_sfera_bot`, 100, 730);

    // Seal / Stamp Simulation
    ctx.textAlign = 'center';
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(1020, 685, 48, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = '#d4af37';
    ctx.font = 'bold 10px sans-serif';
    ctx.fillText("LEXAI 2.0 UZBEKISTAN", 1020, 665);
    ctx.fillText("TASDIQLANGAN", 1020, 685);
    ctx.fillText("2026-YIL", 1020, 705);

    // Download image
    try {
      const dataUrl = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `LexAI_Sertifikat_${displayName.replace(/\s+/g, '_')}.png`;
      a.click();
      setDownloadSuccess(true);
    } catch (e) {
      console.warn("Canvas download error:", e);
    }
  };

  const handleShare = () => {
    haptic('light');
    const shareText = `Men LexAI 2.0 orqali O'zbekiston qonunchiligi bo'yicha test topshirdim va Huquqiy IQ darajam: ${iqScore} ball (${percentage}%) bo'ldi! Siz ham o'z huquqiy bilimingizni tekshirib ko'ring:`;
    const shareUrl = `https://t.me/share/url?url=${encodeURIComponent('https://t.me/Huquqiy_sfera_bot')}&text=${encodeURIComponent(shareText)}`;
    window.open(shareUrl, '_blank');
  };

  return (
    <div className="space-y-5 pb-24 max-w-xl mx-auto">
      {/* Hidden Canvas for Certificate generation */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-slate-950 p-5 shadow-xl">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-slate-950 text-amber-400 flex items-center justify-center font-bold text-xl shadow-lg shrink-0">
            <Award className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-black tracking-tight text-white">
              Huquqiy IQ & Virtual Sertifikat
            </h2>
            <p className="text-xs text-amber-100 font-medium mt-0.5">
              10 ta hayotiy huquqiy kazus bo'yicha bilimingizni sinang va rasmiy sertifikat oling!
            </p>
          </div>
        </div>
      </div>

      {/* QUIZ IN PROGRESS */}
      {!isCompleted ? (
        <div className="space-y-4">
          {/* Progress bar */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold text-slate-400">
              <span>Savol {currentIndex + 1} / {totalQuestions}</span>
              <span className="text-amber-400">{currentQ.category}</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-300"
                style={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }}
              />
            </div>
          </div>

          {/* Question Card */}
          <div className={`p-5 rounded-3xl border ${
            isDark ? 'bg-[#0f172a] border-indigo-950 text-white' : 'bg-white border-slate-200 text-slate-900 shadow-sm'
          }`}>
            <h3 className="text-sm sm:text-base font-extrabold leading-relaxed mb-4">
              {currentQ.question}
            </h3>

            {/* Options */}
            <div className="space-y-2.5">
              {currentQ.options.map((opt, oIdx) => {
                const isSelected = selectedAnswers[currentIndex] === oIdx;
                const isAnswered = selectedAnswers[currentIndex] !== undefined;
                const isCorrect = oIdx === currentQ.correctIndex;

                let btnStyle = isDark
                  ? 'bg-[#080f22] border-slate-800 text-slate-200 hover:border-amber-400/50'
                  : 'bg-slate-50 border-slate-200 text-slate-800 hover:border-blue-400';

                if (isAnswered) {
                  if (isCorrect) {
                    btnStyle = 'bg-emerald-950/60 border-emerald-500 text-emerald-200 font-bold';
                  } else if (isSelected && !isCorrect) {
                    btnStyle = 'bg-rose-950/60 border-rose-500 text-rose-200';
                  }
                }

                return (
                  <button
                    key={oIdx}
                    disabled={isAnswered}
                    onClick={() => handleSelectOption(oIdx)}
                    className={`w-full p-3.5 rounded-2xl border text-left text-xs leading-relaxed transition flex items-start gap-2.5 cursor-pointer ${btnStyle}`}
                  >
                    <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                      {String.fromCharCode(65 + oIdx)}
                    </span>
                    <span className="flex-1">{opt}</span>
                    {isAnswered && isCorrect && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    )}
                    {isAnswered && isSelected && !isCorrect && (
                      <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Explanation card after answer */}
            {showExplanation && (
              <div className={`mt-4 p-3.5 rounded-2xl border text-xs leading-relaxed animate-in fade-in ${
                selectedAnswers[currentIndex] === currentQ.correctIndex
                  ? isDark ? 'bg-emerald-950/30 border-emerald-900/60 text-emerald-200' : 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : isDark ? 'bg-amber-950/30 border-amber-900/60 text-amber-200' : 'bg-amber-50 border-amber-200 text-amber-900'
              }`}>
                <p className="font-bold mb-1 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Qonuniy Asosi:</span>
                </p>
                <p>{currentQ.explanation}</p>
                <p className="mt-1 text-[11px] font-mono opacity-80">
                  📜 {currentQ.legalBasis}
                </p>

                <button
                  onClick={handleNext}
                  className="mt-3 w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-xs transition flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
                >
                  <span>{currentIndex < totalQuestions - 1 ? "Keyingi Savol" : "Natijani Ko'rish"}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* QUIZ COMPLETED: RESULT & CERTIFICATE VIEW */
        <div className="space-y-5 animate-in fade-in duration-300">
          {/* Result Card */}
          <div className={`p-5 rounded-3xl border text-center space-y-3 ${
            isDark ? 'bg-[#0f172a] border-indigo-950 text-white' : 'bg-white border-slate-200 text-slate-900 shadow-md'
          }`}>
            <div className="w-16 h-16 mx-auto rounded-3xl bg-gradient-to-tr from-amber-500 to-yellow-600 flex items-center justify-center text-slate-950 shadow-xl shadow-amber-500/20">
              <Award className="w-9 h-9" />
            </div>

            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block">
                Sizning Natijangiz
              </span>
              <h3 className="text-2xl sm:text-3xl font-black mt-0.5">
                Huquqiy IQ: <span className="text-amber-400">{iqScore} Ball</span>
              </h3>
              <p className="text-xs font-bold text-emerald-400 mt-1">
                {correct} / {totalQuestions} ta to'g'ri javob ({percentage}%)
              </p>
            </div>

            <div className={`p-3 rounded-2xl border text-xs font-bold ${
              isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              Berilgan rasmiy unvon: <span className={`${rankColor} text-sm font-extrabold block mt-0.5`}>«{rankTitle}»</span>
            </div>
          </div>

          {/* Virtual Certificate Visual Preview Card */}
          <div className="relative overflow-hidden rounded-3xl border-4 border-amber-500/80 bg-gradient-to-b from-[#060a17] via-[#0d1630] to-[#060a17] text-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-amber-500/30 pb-3">
              <div>
                <span className="text-[10px] font-bold tracking-widest text-amber-400 block uppercase">
                  O'zbekiston Respublikasi
                </span>
                <span className="text-xs font-extrabold text-slate-300">
                  LexAI 2.0 Milliy Huquqiy Platformasi
                </span>
              </div>
              <div className="w-10 h-10 rounded-full border-2 border-amber-400/80 flex items-center justify-center text-amber-400">
                <Award className="w-5 h-5" />
              </div>
            </div>

            <div className="text-center py-2 space-y-1">
              <h4 className="text-lg sm:text-xl font-black tracking-tight text-white uppercase font-serif">
                Rasmiy Huquqiy Sertifikat
              </h4>
              <p className="text-[11px] text-sky-400 font-semibold">
                Huquqiy Savodxonlik Darajasi Bo'yicha
              </p>
              <p className="text-xs text-slate-400 italic pt-1">Taqdim etiladi:</p>
              <h5 className="text-xl sm:text-2xl font-black text-amber-400 font-serif pt-0.5">
                {user?.first_name ? `${user.first_name} ${user.last_name || ''}` : 'Yurist Foydalanuvchi'}
              </h5>
              <p className="text-[11px] text-slate-300 pt-1">
                Amaldagi qonunchilik bo'yicha 10 ta kazus testini muvaffaqiyatli topshirgani uchun:
              </p>
              <div className="inline-block px-3 py-1 rounded-xl bg-amber-500/20 border border-amber-400/30 text-amber-300 font-bold text-xs mt-2">
                Huquqiy IQ: {iqScore} Ball • «{rankTitle}»
              </div>
            </div>

            <div className="border-t border-amber-500/30 pt-3 flex items-center justify-between text-[10px] text-slate-400">
              <div>
                <span>Sana: {new Date().toLocaleDateString('uz-UZ')}</span>
                <span className="block font-mono">ID: LEX-IQ-2026</span>
              </div>
              <div className="text-right">
                <span className="text-amber-400 font-bold block">TASDIQLANGAN</span>
                <span>lex.uz me'yorlari</span>
              </div>
            </div>
          </div>

          {/* Actions: Download & Share */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <button
              onClick={handleDownloadCertificate}
              className="py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs transition flex items-center justify-center gap-2 shadow-lg cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>{downloadSuccess ? "Sertifikat Yuklandi!" : "Sertifikatni Yuklab Olish (PNG)"}</span>
            </button>

            <button
              onClick={handleShare}
              className="py-3 px-4 rounded-2xl bg-sky-600 hover:bg-sky-500 text-white font-extrabold text-xs transition flex items-center justify-center gap-2 shadow-md cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
              <span>Do'stlarga / Stories'ga Ulashish</span>
            </button>
          </div>

          <button
            onClick={handleRestart}
            className="w-full py-2.5 rounded-2xl border border-slate-700 hover:bg-slate-800 text-slate-300 font-bold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Testni Qayta Topshirish</span>
          </button>
        </div>
      )}
    </div>
  );
};
