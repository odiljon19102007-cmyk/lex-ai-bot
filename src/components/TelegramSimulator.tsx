import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, Scale, ExternalLink, Copy, Check, Sparkles, AlertTriangle, 
  ShieldCheck, RefreshCw, ChevronDown, ChevronUp, FileText, 
  BookOpen, GitCompare, Landmark, HelpCircle, Settings, ThumbsUp, 
  ThumbsDown, ArrowRight, CornerDownLeft, Info
} from 'lucide-react';
import { ChatMessage } from '../types';
import { 
  MAIN_MENU_KEYBOARD, 
  UZBEK_LEGAL_CODES, 
  DOCUMENT_TEMPLATES, 
  LAW_COMPARISONS, 
  MIB_TOPICS, 
  USER_GUIDE_TEXT, 
  SETTINGS_TEXT 
} from '../data/telegramLegalPlatform';

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-start',
    sender: 'bot',
    text: `Assalomu alaykum! 🇺🇿⚖️\n\n` +
      `🏛 **LexAI O'zbekiston — Professional Huquqiy Platformasiga xush kelibsiz!**\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `Platforma **Lex.uz** (Qonunchilik ma'lumotlari milliy bazasi) ning amaldagi eng so'nggi tahrirlari asosida ishlaydi.\n\n` +
      `📌 **Mening imkoniyatlarim:**\n` +
      `• Faqat amaldagi eng yangi qonun, kodeks va qarorlardan javob beraman;\n` +
      `• Eski, o'z kuchini yo'qotgan (1995-yilgi) normalarni qat'iy chetlataman;\n` +
      `• Har bir maslahatga rasmiy Lex.uz havolalarini biriktiraman.\n\n` +
      `Quyidagi boshqaruv menyusidan kerakli bo'limni tanlang yoki savolingizni yozing:`,
    timestamp: '10:00',
    suggestedButtons: [
      { text: "⚖️ Huquqiy savol berish", action: "Yangi Mehnat kodeksida sinov muddati qancha?" },
      { text: "📝 Hujjat tayyorlash", callback_data: "open_doc_menu" },
      { text: "📚 Kodekslar bazasi", callback_data: "open_codes_menu" },
      { text: "🚗 15 kunlik jarima chegirmasi", action: "Yo'l jarimasini 15 kunda to'lasa 50 foiz chegirma beriladimi?" },
    ],
  },
];

export const TelegramSimulator: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [currentMode, setCurrentMode] = useState<'idle' | 'case_analysis' | 'doc_drafting' | 'article_search'>('idle');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [activeLanguage, setActiveLanguage] = useState<'uz' | 'ru'>('uz');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const showToast = (text: string) => {
    setToastMessage(text);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    showToast("Matn nusxalandi ✅");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleRateMessage = (id: string, type: 'up' | 'down') => {
    setMessages((prev) =>
      prev.map((m) => {
        if (m.id === id) {
          const nextRating = m.rating === type ? undefined : type;
          return { ...m, rating: nextRating };
        }
        return m;
      })
    );
    if (type === 'up') {
      showToast("Fikringiz uchun rahmat! 👍 Javob aniqligi tasdiqlandi.");
    } else {
      showToast("Fikringiz qabul qilindi! 👎 Masala qayta ekspertizaga olinadi.");
    }
  };

  const handleSend = async (questionText?: string) => {
    const textToSend = (questionText || input).trim();
    if (!textToSend || isLoading) return;

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Add user message
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: timeStr,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // --- 1. Handle Main Menu Keyboard Clicks ---
    if (textToSend === '⚖️ Huquqiy AI' || textToSend.toLowerCase() === 'huquqiy ai') {
      setCurrentMode('idle');
      setIsLoading(false);
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: `⚖️ **Huquqiy AI — Savol-Javob Rejimi**\n━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
            `O'zbekiston Respublikasining amaldagi qonunchiligi (Lex.uz) bo'yicha istalgan huquqiy savolingizni yozib yuboring.\n\n` +
            `💡 **Namunaviy savollar:**\n` +
            `• *Yangi Mehnat kodeksida sinov muddati qancha?*\n` +
            `• *Talaba kontraktiga soliq imtiyozi qanday ishlaydi?*\n` +
            `• *Qarz va tilxat bo'yicha sudga da'vo arizasi berish*\n` +
            `• *Nikoh tuzishga monelik qiladigan holatlar qaysilar?*\n\n` +
            `Savolingizni pastdagi maydonga yozing:`,
          timestamp: timeStr,
          suggestedButtons: [
            { text: "💼 Mehnat kodeksi 130-modda", action: "Mehnat kodeksi 130-moddasi sinov muddati" },
            { text: "💰 Talaba kontrakti soliq imtiyozi", action: "Talabalar uchun kontrakt to'lashda soliq imtiyozi bormi?" },
            { text: "💍 Nikohga to'siqlar (OK 16)", action: "Nikoh tuzishga monelik qiladigan holatlar qaysilar?" }
          ]
        }
      ]);
      return;
    }

    if (textToSend === '📚 Qonunchilik bazasi' || textToSend.toLowerCase() === 'qonunchilik bazasi') {
      setIsLoading(false);
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: `📚 **O'zbekiston Respublikasi Qonunchilik Bazasi**\n━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
            `Amaldagi asosiy kodekslar va rasmiy Lex.uz sahifalari. Kerakli kodeksni tanlang:`,
          timestamp: timeStr,
          suggestedButtons: [
            { text: "💼 Yangi Mehnat kodeksi (2023)", callback_data: "code_mk" },
            { text: "⚖️ Jinoyat kodeksi", callback_data: "code_jk" },
            { text: "📜 Fuqarolik kodeksi", callback_data: "code_fk" },
            { text: "💰 Soliq kodeksi", callback_data: "code_sk" },
            { text: "💍 Oila kodeksi", callback_data: "code_ok" },
            { text: "🚗 MJtK (Jarimalar)", callback_data: "code_mjtk" },
            { text: "🏛 Yangi Konstitutsiya", callback_data: "code_konstitutsiya" }
          ]
        }
      ]);
      return;
    }

    if (textToSend === '🔍 Modda qidirish' || textToSend.toLowerCase() === 'modda qidirish') {
      setCurrentMode('article_search');
      setIsLoading(false);
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: `🔍 **Tezkor Modda Qidirish Tizimi**\n━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
            `Qonun yoki kodeksning nomi va modda raqamini yozing. Masalan:\n\n` +
            `• **JK 28-modda** (Jinoyatda ishtirokchilar)\n` +
            `• **MK 130-modda** (Dastlabki sinov muddati)\n` +
            `• **OK 16-modda** (Nikoh tuzishga moneliklar)\n` +
            `• **MJtK 40-modda** (Tuhmat uchun jarima)\n` +
            `• **SK 378-modda** (Soliq imtiyozlari)\n\n` +
            `Kerakli moddani kiriting:`,
          timestamp: timeStr,
          suggestedButtons: [
            { text: "JK 28-modda", action: "Jinoyat kodeksini 28 moddasi nima" },
            { text: "MK 130-modda", action: "Yangi Mehnat kodeksida sinov muddati" },
            { text: "OK 16-modda", action: "Nikoh tuzishga monelik qiladigan holatlar qaysilar?" }
          ]
        }
      ]);
      return;
    }

    if (textToSend === '📝 Hujjat tayyorlash' || textToSend.toLowerCase() === 'hujjat tayyorlash') {
      setCurrentMode('doc_drafting');
      setIsLoading(false);
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: `📝 **Huquqiy Hujjatlar Tayyorlash Bo'limi**\n━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
            `Quyidagi rasmiy huquqiy shablonlardan birini tanlang. Tizim amaldagi sud va idora talablariga mos yuridik nusxani tayyorlab beradi:`,
          timestamp: timeStr,
          suggestedButtons: [
            { text: "📄 Sudga da'vo arizasi (Qarz)", callback_data: "doc_davo_qarz" },
            { text: "💼 Ish beruvchiga ariza (Ta'til/Oylik)", callback_data: "doc_ariza_mehnat" },
            { text: "🏛 MIBga talabnoma (Ijro)", callback_data: "doc_shikoyat_mib" },
            { text: "🛡️ IIBga ariza (Tuhmat/Haqorat)", callback_data: "doc_ariza_tuhmat" }
          ]
        }
      ]);
      return;
    }

    if (textToSend === '⚖️ Kazus tahlili' || textToSend.toLowerCase() === 'kazus tahlili') {
      setCurrentMode('case_analysis');
      setIsLoading(false);
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: `⚖️ **Kazus Tahlili — Yuridik Nizolarni Ekspertizasi**\n━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
            `Hayotiy huquqiy muammo yoki nizoli vaziyatingizni batafsil yozib yuboring (masalan: *"Qo'shnim noqonuniy devor qurib oldi"* yoki *"Ish beruvchi 2 oydan buyon oyligimni bermayapti"*).\n\n` +
            `Tizim vaziyatingizni quyidagi 4 mezon bo'yicha tahlil qilib beradi:\n` +
            `1️⃣ Yuridik ahamiyatga ega faktlar\n` +
            `2️⃣ Buzilgan qonun normalari (Lex.uz)\n` +
            `3️⃣ Taraflarning huquqiy pozitsiyalari\n` +
            `4️⃣ Sud istiqboli va amaliy tavsiya.\n\n` +
            `Vaziyatingizni to'liq yozing:`,
          timestamp: timeStr,
          suggestedButtons: [
            { text: "🏠 Qo'shni devor nizosi kazusi", action: "Qo'shnim noqonuniy devor qurib oldi nima qilishim kerak?" },
            { text: "💼 Oylik maosh berilmasligi kazusi", action: "Ish beruvchi 2 oydan buyon ish haqini bermayapti, xodim nima qilishi kerak?" }
          ]
        }
      ]);
      return;
    }

    if (textToSend === '📊 Qonunlarni solishtirish' || textToSend.toLowerCase() === 'qonunlarni solishtirish') {
      setIsLoading(false);
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: `📊 **Qonunlarni Solishtirish — Islohotlar va Yangi Normalar**\n━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
            `O'zbekistonda so'nggi yillarda qabul qilingan yangi kodekslar va eski bekor qilingan qonunlar taqqoslamasini tanlang:`,
          timestamp: timeStr,
          suggestedButtons: [
            { text: "💼 Mehnat kodeksi: 1995 vs 2023", callback_data: "cmp_mehnat" },
            { text: "🏛 Konstitutsiya: 1992 vs 2023", callback_data: "cmp_konstitutsiya" },
            { text: "🚗 Yo'l jarimalari: 15 kunlik chegirma", callback_data: "cmp_jarima" }
          ]
        }
      ]);
      return;
    }

    if (textToSend === '🏛 MIB bo‘limi' || textToSend === '🏛 MIB bo\'limi' || textToSend.toLowerCase().includes('mib')) {
      setIsLoading(false);
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: `🏛 **Majburiy Ijro Byurosi (MIB) Yordam Bo'limi**\n━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
            `Ijro harakatlari, aliment undiruvi va taqiqlarga oid masalalar bo'yicha quyidagilardan birini tanlang:`,
          timestamp: timeStr,
          suggestedButtons: [
            { text: "👶 Aliment undirish tartibi va miqdori", callback_data: "mib_aliment" },
            { text: "✈️ Chet elga chiqish taqiqi (Zapret)", callback_data: "mib_zapret" },
            { text: "⚖️ MIB harakatsizligi ustidan shikoyat", callback_data: "mib_shikoyat" }
          ]
        }
      ]);
      return;
    }

    if (textToSend === '📖 Foydalanish qo‘llanmasi' || textToSend.toLowerCase().includes('qo\'llanma') || textToSend.toLowerCase().includes('qollanma')) {
      setIsLoading(false);
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: USER_GUIDE_TEXT,
          timestamp: timeStr,
          sources: [{ title: "Lex.uz Qonunchilik ma'lumotlari milliy bazasi", uri: "https://lex.uz" }]
        }
      ]);
      return;
    }

    if (textToSend === '⚙️ Sozlamalar' || textToSend.toLowerCase() === 'sozlamalar') {
      setIsLoading(false);
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: SETTINGS_TEXT,
          timestamp: timeStr,
          suggestedButtons: [
            { text: activeLanguage === 'uz' ? "🇺🇿 O'zbekcha (Tanlangan)" : "🇺🇿 O'zbekcha", callback_data: "lang_uz" },
            { text: activeLanguage === 'ru' ? "🇷🇺 Русский (Выбрано)" : "🇷🇺 Русский", callback_data: "lang_ru" },
            { text: "⚡ Javob rejimi: Kengaytirilgan", callback_data: "mode_detailed" },
          ]
        }
      ]);
      return;
    }

    if (textToSend === '🔙 Orqaga' || textToSend === '🏠 Bosh menyu' || textToSend.toLowerCase() === 'orqaga' || textToSend.toLowerCase() === 'bosh menyu') {
      setCurrentMode('idle');
      setIsLoading(false);
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: `🏠 **Asosiy boshqaruv menyusidasiz.** Kerakli bo'limni tanlang:`,
          timestamp: timeStr,
        }
      ]);
      return;
    }

    // --- 2. Query Legal Engine API ---
    try {
      const response = await fetch('/api/legal-ai/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: textToSend }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Serverda xatolik yuz berdi");
      }

      const botMessage: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: data.answer,
        timestamp: timeStr,
        sources: data.sources || [],
        lawStatus: data.lawStatus,
        suggestedButtons: [
          { text: "🌐 Lex.uz Rasmiy Manbasi", url: data.sources?.[0]?.uri || "https://lex.uz" },
          { text: "💡 Yana tushuntirish", callback_data: "lex_explain_more" },
          { text: "📝 Hujjat tayyorlash", callback_data: "open_doc_menu" },
          { text: "👍 Foydali", callback_data: "rate_up" },
          { text: "👎 Noto'g'ri", callback_data: "rate_down" },
          { text: "🔄 Yangi savol", callback_data: "new_query" }
        ],
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err: any) {
      const errorMessage: ChatMessage = {
        id: `bot-err-${Date.now()}`,
        sender: 'bot',
        text: `⚠️ Kechirasiz, huquqiy tahlil jarayonida xatolik yuz berdi: ${err.message || 'Tarmoq xatosi'}. Iltimos, qayta urinib ko'ring.`,
        timestamp: timeStr,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Callback Data Actions from Inline Buttons
  const handleCallbackClick = async (callbackData: string) => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    if (callbackData === 'rate_up') {
      showToast("Fikringiz uchun rahmat! 👍 Bahoingiz saqlandi.");
      return;
    }

    if (callbackData === 'rate_down') {
      showToast("Fikringiz uchun rahmat. Masala qayta o'rganiladi 🤝");
      return;
    }

    if (callbackData === 'new_query') {
      setCurrentMode('idle');
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: `⚖️ **Yangi Huquqiy Savol**\n━━━━━━━━━━━━━━━━━━━━━━━━━━\nIstalgan qonun, kodeks moddasi yoki hayotiy vaziyat bo'yicha savolingizni yozib yuboring:`,
          timestamp: timeStr,
        }
      ]);
      return;
    }

    if (callbackData === 'lex_explain_more') {
      const lastUserMsg = [...messages].reverse().find(m => m.sender === 'user')?.text || "Mehnat kodeksi sinov muddati";
      setIsLoading(true);
      setMessages((prev) => [
        ...prev,
        {
          id: `user-${Date.now()}`,
          sender: 'user',
          text: `💡 "${lastUserMsg}" bo'yicha yana-da chuqurroq, amaliy misollar bilan tushuntirib bering`,
          timestamp: timeStr,
        }
      ]);
      await handleSend(`"${lastUserMsg}" mavzusida sud amaliyoti, amaliy tavsiyalar va muhim huquqiy nozikliklarni batafsil tushuntirib bering`);
      return;
    }

    if (callbackData === 'open_doc_menu') {
      handleSend('📝 Hujjat tayyorlash');
      return;
    }

    if (callbackData === 'open_codes_menu') {
      handleSend('📚 Qonunchilik bazasi');
      return;
    }

    if (callbackData === 'lang_uz' || callbackData === 'lang_ru') {
      const newLang = callbackData === 'lang_ru' ? 'ru' : 'uz';
      setActiveLanguage(newLang);
      showToast(newLang === 'ru' ? "Язык изменен на Русский 🇷🇺" : "Til O'zbekchaga o'zgartirildi 🇺🇿");
      return;
    }

    // Code detail lookup
    if (callbackData.startsWith('code_')) {
      const codeId = callbackData.replace('code_', '');
      const code = UZBEK_LEGAL_CODES.find(c => c.id === codeId);
      if (code) {
        setMessages((prev) => [
          ...prev,
          {
            id: `bot-${Date.now()}`,
            sender: 'bot',
            text: `${code.icon} **${code.title}**\n━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
              `📜 **Hujjat raqami:** ${code.lawNumber}\n` +
              `📅 **Kuchga kirgan sana:** ${code.effectiveDate}\n` +
              `📊 **Hajmi:** ${code.articlesCount}\n` +
              `🟢 **Maqomi:** ✅ ${code.status}\n\n` +
              `📌 **Mazmuni va qamrovi:**\n${code.description}\n\n` +
              `💡 **Muhim moddalar:**\n${code.sampleArticles.map(a => `• ${a}`).join('\n')}`,
            timestamp: timeStr,
            sources: [{ title: `${code.title} - Lex.uz Rasmiy Sahifasi`, uri: code.lexUrl }],
            suggestedButtons: [
              { text: `🌐 ${code.title}ni Lex.uz'da ko'rish`, url: code.lexUrl },
              { text: "🔙 Boshqa kodekslar", callback_data: "open_codes_menu" }
            ]
          }
        ]);
      }
      return;
    }

    // Document template delivery
    if (callbackData.startsWith('doc_')) {
      const doc = DOCUMENT_TEMPLATES.find(d => d.id === callbackData);
      if (doc) {
        setMessages((prev) => [
          ...prev,
          {
            id: `bot-${Date.now()}`,
            sender: 'bot',
            text: `📝 **${doc.title}**\n━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
              `🏷️ **Bo'lim:** ${doc.badge}\n` +
              `📌 **Tavsif:** ${doc.description}\n\n` +
              `📋 **Hujjat matni (Nusxa olib, qavslar ichini to'ldiring):**\n\n` +
              `\`\`\`text\n${doc.sampleText}\n\`\`\`\n\n` +
              `💡 *Tavsiya:* Nusxalash tugmasini bosing va o'z ma'lumotlaringizni kiriting.`,
            timestamp: timeStr,
            suggestedButtons: [
              { text: "🔙 Boshqa hujjatlar", callback_data: "open_doc_menu" },
              { text: "🏠 Bosh menyu", action: "🏠 Bosh menyu" }
            ]
          }
        ]);
      }
      return;
    }

    // Law comparison delivery
    if (callbackData.startsWith('cmp_')) {
      const cmp = LAW_COMPARISONS.find(c => c.id === callbackData);
      if (cmp) {
        let cmpMsg = `${cmp.icon} **${cmp.title}**\n━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
          `🟢 **Maqomi:** ${cmp.status}\n\n`;
        for (const pt of cmp.points) {
          cmpMsg += `📌 **${pt.topic}:**\n` +
            `🔴 *Eski me'yor:* ${pt.old}\n` +
            `🟢 *Yangi amaldagi qoida:* ${pt.current}\n\n`;
        }
        setMessages((prev) => [
          ...prev,
          {
            id: `bot-${Date.now()}`,
            sender: 'bot',
            text: cmpMsg,
            timestamp: timeStr,
            sources: [{ title: `${cmp.title} - Lex.uz`, uri: cmp.lexUrl }],
            suggestedButtons: [
              { text: "🌐 Lex.uz'da to'liq ko'rish", url: cmp.lexUrl },
              { text: "🔙 Boshqa solishtirishlar", action: "📊 Qonunlarni solishtirish" }
            ]
          }
        ]);
      }
      return;
    }

    // MIB topic delivery
    if (callbackData.startsWith('mib_')) {
      const mib = MIB_TOPICS.find(m => m.id === callbackData);
      if (mib) {
        setMessages((prev) => [
          ...prev,
          {
            id: `bot-${Date.now()}`,
            sender: 'bot',
            text: `${mib.icon} **${mib.title}**\n━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n${mib.details}`,
            timestamp: timeStr,
            sources: [{ title: `${mib.title} - Lex.uz`, uri: mib.lexUrl }],
            suggestedButtons: [
              { text: "🌐 Lex.uz qonunini ochish", url: mib.lexUrl },
              { text: "🔙 MIB bo'limi", action: "🏛 MIB bo‘limi" }
            ]
          }
        ]);
      }
      return;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Toast Notification Alert */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-2.5 rounded-xl border border-blue-500/40 shadow-2xl flex items-center gap-2 animate-bounce">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Left/Main Column: Telegram Bot Simulator Window */}
      <div className="lg:col-span-8 flex flex-col h-[760px] bg-slate-950 rounded-2xl shadow-2xl overflow-hidden border border-slate-800">
        {/* Telegram Header: Navy Blue & Gold Accents */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 px-4 py-3 border-b border-indigo-900/50 flex items-center justify-between shadow-md">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 via-indigo-600 to-amber-500 flex items-center justify-center text-white font-bold shadow-lg ring-2 ring-blue-500/30">
                <Scale className="w-5 h-5 text-amber-200" />
              </div>
              <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-slate-900"></span>
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <h3 className="font-bold text-white text-sm tracking-tight">LexAI O'zbekiston Boti</h3>
                <span className="bg-blue-600/90 text-white text-[9px] px-1.5 py-0.2 rounded font-bold uppercase tracking-wider">
                  bot
                </span>
                <span className="text-amber-400 text-xs">✓</span>
              </div>
              <p className="text-[11px] text-slate-300">
                {isLoading ? (
                  <span className="text-amber-300 flex items-center gap-1 font-medium animate-pulse">
                    <RefreshCw className="w-3 h-3 animate-spin" /> Lex.uz me'yorlari tahlil qilinmoqda...
                  </span>
                ) : (
                  <span className="text-slate-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    24/7 amaldagi qonunchilik (Lex.uz)
                  </span>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                setMessages(INITIAL_MESSAGES);
                setCurrentMode('idle');
                showToast("Chat tozalandi");
              }}
              className="text-xs text-slate-400 hover:text-white px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 border border-slate-700/60 transition cursor-pointer"
              title="Chatni tozalash"
            >
              Tozalash
            </button>
          </div>
        </div>

        {/* Telegram Message Stream */}
        <div
          className="flex-1 overflow-y-auto p-4 space-y-4"
          style={{
            backgroundImage: `radial-gradient(circle at 50% 50%, rgba(15, 23, 42, 0.75) 0%, rgba(2, 6, 23, 0.98) 100%)`,
          }}
        >
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-full`}
              >
                <div
                  className={`relative max-w-[92%] sm:max-w-[85%] rounded-2xl px-4 py-3 shadow-md text-sm leading-relaxed ${
                    isUser
                      ? 'bg-blue-600 text-white rounded-br-xs'
                      : 'bg-slate-900/95 text-slate-100 rounded-bl-xs border border-slate-800/90 shadow-lg'
                  }`}
                >
                  {/* Status Tag for Bot Legal Advice */}
                  {!isUser && msg.lawStatus && (
                    <div className="mb-2.5 pb-2 border-b border-slate-800 flex items-center justify-between text-xs">
                      {msg.lawStatus === 'ESKI_HUJJAT_ANIQLANDI_VA_YANGILANDI' ? (
                        <span className="inline-flex items-center text-amber-300 font-semibold bg-amber-950/60 px-2.5 py-0.5 rounded-md border border-amber-600/40 text-[11px]">
                          <AlertTriangle className="w-3.5 h-3.5 mr-1 text-amber-400" />
                          Eski qonun aniqlandi va yangilandi
                        </span>
                      ) : (
                        <span className="inline-flex items-center text-emerald-300 font-semibold bg-emerald-950/60 px-2.5 py-0.5 rounded-md border border-emerald-600/40 text-[11px]">
                          <ShieldCheck className="w-3.5 h-3.5 mr-1 text-emerald-400" />
                          Faqat amaldagi qonunchilik (Lex.uz)
                        </span>
                      )}
                      <button
                        onClick={() => copyToClipboard(msg.text, msg.id)}
                        className="text-slate-400 hover:text-white p-1 rounded transition cursor-pointer"
                        title="Nusxa olish"
                      >
                        {copiedId === msg.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  )}

                  {/* Message Body with Markdown formatting & Interactive links */}
                  <div className="whitespace-pre-wrap font-sans break-words space-y-2 text-[13px] leading-relaxed">
                    {msg.text.split('\n').map((line, idx) => {
                      const trimmedLine = line.trim();
                      if (!trimmedLine) {
                        return <div key={idx} className="h-1" />;
                      }

                      // Check for URL in line
                      const urlMatch = line.match(/(https?:\/\/[^\s]+)/i);
                      const isHeader = line.startsWith('📌') || line.startsWith('📜') || line.startsWith('⚖️') || line.startsWith('💡') || line.startsWith('🏛') || line.startsWith('📋') || line.startsWith('⏳');
                      const isStep = line.startsWith('1️⃣') || line.startsWith('2️⃣') || line.startsWith('3️⃣') || line.startsWith('4️⃣') || line.startsWith('5️⃣');
                      const isDivider = line.includes('━━━');
                      
                      if (isDivider) {
                        return <hr key={idx} className="border-slate-800 my-2" />;
                      }

                      if (urlMatch) {
                        const detectedUrl = urlMatch[1].replace(/[),;.]+$/, '');
                        return (
                          <div key={idx} className="my-2 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-2 shadow-xs">
                            <div className="flex items-center gap-2 min-w-0">
                              <div className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-300 font-bold text-xs flex items-center justify-center shrink-0">
                                🏛️
                              </div>
                              <span className="text-xs font-semibold text-amber-200 truncate">
                                {line.replace(/(https?:\/\/[^\s]+)/i, '').replace(/🔗|\*+/g, '').trim() || "Lex.uz Rasmiy Hujjat Havolasi"}
                              </span>
                            </div>
                            <a
                              href={detectedUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-2.5 py-1 text-xs font-bold rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center gap-1 shrink-0 transition shadow-xs cursor-pointer"
                            >
                              <span>Ochish</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        );
                      }

                      if (isHeader) {
                        return (
                          <div key={idx} className="mt-2.5 mb-1 px-2.5 py-1 rounded-lg bg-amber-500/10 border-l-2 border-amber-400 font-bold text-amber-300 text-[13px]">
                            {line}
                          </div>
                        );
                      }

                      return (
                        <p
                          key={idx}
                          className={`${
                            isStep ? 'font-semibold text-sky-200 pl-1' : ''
                          } ${
                            line.startsWith('⚠️') ? 'text-amber-300 font-medium bg-amber-500/10 p-2 rounded-lg border border-amber-500/20' : ''
                          }`}
                        >
                          {line}
                        </p>
                      );
                    })}
                  </div>

                  {/* Web Sources & Grounding Links from Lex.uz */}
                  {!isUser && msg.sources && msg.sources.length > 0 && (
                    <div className="mt-3.5 pt-2.5 border-t border-slate-800">
                      <div className="text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                        Rasmiy Lex.uz Manbalari:
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {msg.sources.map((src, i) => (
                          <a
                            key={i}
                            href={src.uri}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs bg-slate-900/90 hover:bg-slate-800 text-amber-300 px-3 py-1.5 rounded-xl border border-amber-500/30 hover:border-amber-400 transition cursor-pointer font-semibold shadow-xs"
                          >
                            <span className="truncate max-w-[220px]">{src.title}</span>
                            <ExternalLink className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Footer with Rating (Thumbs Up/Down) & Timestamp */}
                  <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-800/60 text-[10px] text-slate-500">
                    {!isUser ? (
                      <div className="flex items-center space-x-1">
                        <span className="text-[10px] text-slate-400 mr-1">Aniqlik bahosi:</span>
                        <button
                          onClick={() => handleRateMessage(msg.id, 'up')}
                          className={`p-1 rounded-md transition flex items-center gap-1 cursor-pointer ${
                            msg.rating === 'up'
                              ? 'bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/50'
                              : 'text-slate-400 hover:text-emerald-400 hover:bg-slate-800'
                          }`}
                          title="Foydali va to'g'ri (Thumbs Up)"
                        >
                          <ThumbsUp className={`w-3.5 h-3.5 ${msg.rating === 'up' ? 'fill-emerald-400' : ''}`} />
                          {msg.rating === 'up' && <span className="text-[9px] font-semibold text-emerald-300">To'g'ri</span>}
                        </button>
                        <button
                          onClick={() => handleRateMessage(msg.id, 'down')}
                          className={`p-1 rounded-md transition flex items-center gap-1 cursor-pointer ${
                            msg.rating === 'down'
                              ? 'bg-rose-500/20 text-rose-400 ring-1 ring-rose-500/50'
                              : 'text-slate-400 hover:text-rose-400 hover:bg-slate-800'
                          }`}
                          title="Qayta tekshirish kerak (Thumbs Down)"
                        >
                          <ThumbsDown className={`w-3.5 h-3.5 ${msg.rating === 'down' ? 'fill-rose-400' : ''}`} />
                          {msg.rating === 'down' && <span className="text-[9px] font-semibold text-rose-300">Qayta ko'rish</span>}
                        </button>
                      </div>
                    ) : (
                      <div></div>
                    )}

                    <div className="flex items-center space-x-1.5">
                      <span>{msg.timestamp}</span>
                      {isUser && <span className="text-blue-300 font-bold">✓✓</span>}
                    </div>
                  </div>
                </div>

                {/* Inline Action Keyboard (Simulating Telegram Inline Buttons) */}
                {!isUser && msg.suggestedButtons && msg.suggestedButtons.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5 max-w-[92%] sm:max-w-[85%]">
                    {msg.suggestedButtons.map((btn, btnIdx) => {
                      if (btn.url) {
                        return (
                          <a
                            key={btnIdx}
                            href={btn.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs bg-slate-800/90 hover:bg-slate-700 text-sky-300 font-medium px-3 py-1.5 rounded-xl border border-slate-700/80 hover:border-sky-500/50 flex items-center gap-1.5 transition shadow-sm"
                          >
                            <span>{btn.text}</span>
                            <ExternalLink className="w-3 h-3 text-sky-400 shrink-0" />
                          </a>
                        );
                      }

                      return (
                        <button
                          key={btnIdx}
                          onClick={() => {
                            if (btn.callback_data) {
                              handleCallbackClick(btn.callback_data);
                            } else if (btn.action) {
                              handleSend(btn.action);
                            }
                          }}
                          disabled={isLoading}
                          className="text-xs bg-slate-800/90 hover:bg-indigo-900/60 hover:text-white text-slate-200 font-medium px-3 py-1.5 rounded-xl border border-slate-700/80 hover:border-indigo-500/50 transition shadow-sm cursor-pointer"
                        >
                          {btn.text}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Reply Keyboard removed per user request for clean chat */}

        {/* Telegram Chat Input Form */}
        <div className="bg-slate-900 px-3.5 py-3 border-t border-slate-800">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center space-x-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                currentMode === 'case_analysis'
                  ? "Vaziyatingiz yoki nizoni batafsil yozing..."
                  : currentMode === 'article_search'
                  ? "Qidirmoqchi bo'lgan kodeks va modda raqamini yozing..."
                  : "Savolingizni yozing (masalan: 'Mehnat kodeksi 130-modda')..."
              }
              disabled={isLoading}
              className="flex-1 bg-slate-950 text-slate-100 placeholder-slate-500 text-xs sm:text-sm px-4 py-2.5 rounded-xl border border-slate-700/80 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="p-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white rounded-xl transition cursor-pointer shrink-0 shadow-md"
              title="Yuborish"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-1.5 flex items-center justify-between text-[11px] text-slate-400 px-1">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Lex.uz rasmiy qonunchilik me'yorlari</span>
            </span>
            <span className="text-amber-400/90 font-mono text-[10px]">
              Yangi Yangilanish: 9 Bo'limli Professional Tizim
            </span>
          </div>
        </div>
      </div>

      {/* Right Column: Platform Dashboard & Quick Module Launcher */}
      <div className="lg:col-span-4 space-y-5">
        {/* Platform Identity Card */}
        <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-5 border border-indigo-800/40 shadow-lg relative overflow-hidden">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-300 font-bold">
              <Scale className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">LexAI Platformasi</h4>
              <p className="text-[11px] text-amber-300/90 font-medium">O'zbekiston Qonunchiligi (Lex.uz)</p>
            </div>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Mavjud Telegram huquqiy boti 9 ta professional bo'lim bilan takomillashtirildi. Barcha javoblar amaldagi kodekslar va Lex.uz rasmiy havolalari bilan mustahkamlangan.
          </p>

          <div className="mt-4 pt-3 border-t border-slate-800 grid grid-cols-2 gap-2 text-xs">
            <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 block">Javob Tezligi</span>
              <span className="font-bold text-emerald-400">⚡ 0.01 - 1.5 sek</span>
            </div>
            <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 block">Eski Qonunlar</span>
              <span className="font-bold text-amber-300">Qat'iy Filtrlangan</span>
            </div>
          </div>
        </div>

        {/* Quick Module Switcher Card */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
          <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            Tezkor Bo'limlar & Funksiyalar
          </h4>

          <div className="space-y-1.5 text-xs">
            <button
              onClick={() => handleSend('📝 Hujjat tayyorlash')}
              className="w-full text-left p-2.5 rounded-xl bg-slate-50 hover:bg-indigo-50/60 hover:border-indigo-300 border border-slate-200 transition flex items-center justify-between group cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-600" />
                <span className="font-semibold text-slate-800 group-hover:text-indigo-950">Sud & MIB Hujjatlari</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600" />
            </button>

            <button
              onClick={() => handleSend('⚖️ Kazus tahlili')}
              className="w-full text-left p-2.5 rounded-xl bg-slate-50 hover:bg-indigo-50/60 hover:border-indigo-300 border border-slate-200 transition flex items-center justify-between group cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Scale className="w-4 h-4 text-purple-600" />
                <span className="font-semibold text-slate-800 group-hover:text-indigo-950">Kazus & Nizo Ekspertizasi</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600" />
            </button>

            <button
              onClick={() => handleSend('📊 Qonunlarni solishtirish')}
              className="w-full text-left p-2.5 rounded-xl bg-slate-50 hover:bg-indigo-50/60 hover:border-indigo-300 border border-slate-200 transition flex items-center justify-between group cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <GitCompare className="w-4 h-4 text-rose-600" />
                <span className="font-semibold text-slate-800 group-hover:text-indigo-950">Eski vs Yangi Qonunlar</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600" />
            </button>

            <button
              onClick={() => handleSend('🏛 MIB bo‘limi')}
              className="w-full text-left p-2.5 rounded-xl bg-slate-50 hover:bg-indigo-50/60 hover:border-indigo-300 border border-slate-200 transition flex items-center justify-between group cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Landmark className="w-4 h-4 text-cyan-600" />
                <span className="font-semibold text-slate-800 group-hover:text-indigo-950">Aliment & Zapret Tekshiruvi</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600" />
            </button>
          </div>
        </div>

        {/* Major Uzbek Codes Directory */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-blue-600" />
              Kodekslar Katalogi
            </h4>
            <span className="text-[10px] text-slate-400">7 ta kodeks</span>
          </div>

          <div className="space-y-2">
            {UZBEK_LEGAL_CODES.slice(0, 4).map((c) => (
              <div key={c.id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-slate-800 flex items-center gap-1">
                    <span>{c.icon}</span>
                    <span>{c.title}</span>
                  </p>
                  <p className="text-[10px] text-slate-500 mt-0.5">{c.lawNumber} • {c.articlesCount}</p>
                </div>
                <a
                  href={c.lexUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-2 py-1 rounded bg-white border border-slate-200 text-[10px] text-blue-600 font-semibold hover:border-blue-300 flex items-center gap-0.5"
                >
                  Lex.uz <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
