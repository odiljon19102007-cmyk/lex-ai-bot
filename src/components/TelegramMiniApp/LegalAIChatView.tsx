import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, Sparkles, Copy, Check, ThumbsUp, ThumbsDown, 
  ExternalLink, RotateCcw, ShieldCheck, AlertTriangle, 
  Bookmark, Paperclip, FileText, CornerDownLeft, Info,
  Camera, Image as ImageIcon, X, History, Trash2, Clock
} from 'lucide-react';
import { useTelegram } from './TelegramContext';
import { ChatMessage } from '../../types';

interface LegalAIChatViewProps {
  initialQuery?: string;
  onClearInitialQuery?: () => void;
}

export const LegalAIChatView: React.FC<LegalAIChatViewProps> = ({ initialQuery, onClearInitialQuery }) => {
  const { theme, haptic, language, user } = useTelegram();
  const isDark = theme === 'dark';

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-tma',
      sender: 'bot',
      text: language === 'ru'
        ? `Здравствуйте! Я — юридический ИИ-помощник LexAI 2.0.\n\nЗадайте любой вопрос по действующему законодательству Республики Узбекистан (Lex.uz).\n• Автоматически отфильтрую устаревшие нормы\n• Предоставлю точные статьи и официальные ссылки\n• 📷 Можете прикрепить фото документа или теста для мгновенного анализа`
        : `Assalomu alaykum! Men LexAI 2.0 — O'zbekiston Respublikasi amaldagi qonunchiligi (Lex.uz) bo'yicha yagona sun'iy intellekt ekotizimiman.\n\nSavolingizni yozing. Shuningdek, 📷 hujjat, jarima, sud qarori yoki huquqiy test suratini yuklab tahlil qilishingiz mumkin!`,
      timestamp: '10:00',
      suggestedButtons: [
        { text: "💼 Mehnat: sinov muddati", action: "Yangi Mehnat kodeksida sinov muddati qancha?" },
        { text: "💰 Oylik berilmasa", action: "Ish beruvchi ish haqini bermasa nima qilish kerak?" },
        { text: "🚗 Jarima 50% chegirmasi", action: "Yo'l jarimasini 15 kunda to'lasa 50% chegirma beriladimi?" },
        { text: "🛡️ Tuhmat jazosi", action: "Tuhmat qilgan shaxsga nisbatan qanday chora ko'riladi?" },
      ]
    }
  ]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());
  
  // Image attachment state
  const [attachedImageBase64, setAttachedImageBase64] = useState<string | null>(null);
  const [attachedImagePreview, setAttachedImagePreview] = useState<string | null>(null);
  const [attachedMimeType, setAttachedMimeType] = useState<string>('image/jpeg');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // History state
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [historyItems, setHistoryItems] = useState<any[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  const fetchUserHistory = async () => {
    setIsLoadingHistory(true);
    try {
      const uId = user?.id ? String(user.id) : 'default_user';
      const res = await fetch(`/api/legal-ai/history?userId=${uId}`);
      const data = await res.json();
      if (data.success) {
        setHistoryItems(data.queries || []);
      }
    } catch (e) {
      console.warn("Failed to load history:", e);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const handleOpenHistory = () => {
    haptic('light');
    setShowHistoryModal(true);
    fetchUserHistory();
  };

  const handleSelectHistoryItem = (item: any) => {
    haptic('medium');
    setShowHistoryModal(false);
    const userMsg: ChatMessage = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text: item.query,
      timestamp: new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    const botMsg: ChatMessage = {
      id: `bot_${Date.now()}`,
      sender: 'bot',
      text: item.answer,
      timestamp: new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      sources: item.sources,
      lawStatus: item.law_status
    };
    setMessages(prev => [...prev, userMsg, botMsg]);
  };

  const handleDeleteHistoryItem = async (e: React.MouseEvent, itemId: string) => {
    e.stopPropagation();
    haptic('light');
    try {
      const uId = user?.id ? String(user.id) : 'default_user';
      const res = await fetch(`/api/legal-ai/history/${itemId}?userId=${uId}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setHistoryItems(prev => prev.filter(i => i.id !== itemId));
      }
    } catch (err) {}
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    if (initialQuery && initialQuery.trim()) {
      handleSend(initialQuery.trim());
      if (onClearInitialQuery) onClearInitialQuery();
    }
  }, [initialQuery]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert("Faqat rasm formatidagi fayllar qabul qilinadi.");
      return;
    }

    setAttachedMimeType(file.type);
    const reader = new FileReader();
    reader.onload = () => {
      const b64 = reader.result as string;
      setAttachedImagePreview(b64);
      setAttachedImageBase64(b64);
      haptic('light');
    };
    reader.readAsDataURL(file);
  };

  const removeAttachedImage = () => {
    setAttachedImagePreview(null);
    setAttachedImageBase64(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    haptic('light');
  };

  const handleSend = async (customQuery?: string) => {
    const q = (customQuery || input).trim();
    if ((!q && !attachedImageBase64) || isLoading) return;

    haptic('medium');
    const isImageAnalysis = !!attachedImageBase64;
    const currentBase64 = attachedImageBase64;
    const currentMime = attachedMimeType;
    const previewUrl = attachedImagePreview;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: isImageAnalysis 
        ? `${q || "Ushbu rasm/hujjatni O'zbekiston qonunchiligi bo'yicha tahlil qiling va yechim bering."}`
        : q,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    removeAttachedImage();
    setIsLoading(true);

    try {
      let data: any;
      if (isImageAnalysis && currentBase64) {
        // Send to vision solve endpoint
        const visionRes = await fetch('/api/legal-ai/vision-solve', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            imageBase64: currentBase64,
            mimeType: currentMime,
            userPrompt: q || undefined,
          }),
        });
        data = await visionRes.json();
      } else {
        const conversationHistory = messages
          .filter((m) => m.id !== 'welcome-tma' && m.id !== 'new-start')
          .slice(-10)
          .map((m) => ({
            role: m.sender === 'user' ? 'user' : 'model',
            text: m.text,
          }));

        const queryRes = await fetch('/api/legal-ai/query', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            query: q,
            userId: user?.id ? String(user.id) : 'default_user',
            userName: user?.first_name || 'Foydalanuvchi',
            history: conversationHistory,
          }),
        });
        data = await queryRes.json();
      }

      if (data.success) {
        haptic('light');
        const botMsg: ChatMessage = {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: data.answer,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          sources: data.sources || [{ title: "Lex.uz Qonunchilik Bazasida Ko'rish", uri: "https://lex.uz" }],
          lawStatus: data.lawStatus,
          suggestedButtons: [
            { text: "📝 Da'vo arizasi loyihasi", action: `${q || 'Ushbu vaziyat'} bo'yicha rasmiy da'vo arizasi loyihasini tayyorlab bering` },
            { text: "🏛️ Qaysi sudga berish kerak?", action: `${q || 'Ushbu masala'} bo'yicha sudlovga tegishlilik, tuman sudi va kerakli hujjatlarni tushuntiring` },
          ]
        };
        setMessages((prev) => [...prev, botMsg]);
      } else {
        throw new Error(data.error || "Xatolik yuz berdi");
      }
    } catch (e: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: `⚠️ Kechirasiz, tahlil qilishda xatolik yuz berdi: ${e.message || "Internet aloqasini tekshirib qaytadan urinib ko'ring."}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const openExternalLink = (url: string) => {
    if (!url) return;
    haptic('selection');
    let cleanUrl = url.trim();
    if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
      cleanUrl = `https://${cleanUrl}`;
    }
    const tgWebApp = (window as any).Telegram?.WebApp;
    if (tgWebApp && typeof tgWebApp.openLink === 'function') {
      try {
        tgWebApp.openLink(cleanUrl);
        return;
      } catch (e) {
        console.warn("tgWebApp.openLink error:", e);
      }
    }
    window.open(cleanUrl, '_blank', 'noopener,noreferrer');
  };

  const copyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    haptic('selection');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleBookmark = (id: string) => {
    haptic('selection');
    setBookmarkedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const rateMessage = (id: string, type: 'up' | 'down') => {
    haptic('medium');
    setMessages((prev) =>
      prev.map((m) => {
        if (m.id === id) {
          return { ...m, rating: m.rating === type ? undefined : type };
        }
        return m;
      })
    );
  };

  const resetChat = () => {
    haptic('heavy');
    setMessages([
      {
        id: 'new-start',
        sender: 'bot',
        text: "Suhbat tozalandi. Yangi huquqiy savolingizni yozing:",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }
    ]);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] min-h-[500px] max-h-[800px]">
      {/* Mini App Chat Header */}
      <div className={`px-4 py-3 border-b flex items-center justify-between shrink-0 rounded-t-2xl ${
        isDark ? 'bg-[#0f172a] border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-600 flex items-center justify-center text-slate-950 font-bold shadow-md">
            <Sparkles className="w-5 h-5 text-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Huquqiy AI Maslahatchi
              </h3>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-bold px-1.5 py-0.5 rounded-full border border-emerald-500/30">
                Lex.uz 2026
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              {isLoading ? 'Qonunlar tahlil qilinmoqda...' : 'Faqat amaldagi qonunchilik asosida'}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleOpenHistory}
            className={`px-2.5 py-1.5 rounded-xl border text-xs font-medium flex items-center gap-1.5 transition cursor-pointer shadow-xs ${
              isDark 
                ? 'bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border-amber-500/30' 
                : 'bg-amber-50 hover:bg-amber-100 text-amber-800 border-amber-200'
            }`}
            title="Qidiruvlar tarixi"
          >
            <History className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-[11px] font-semibold">Tarix</span>
          </button>

          <button
            onClick={resetChat}
            className={`p-1.5 rounded-xl border text-xs font-medium flex items-center gap-1 transition cursor-pointer ${
              isDark 
                ? 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border-slate-700' 
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
            }`}
            title="Yangi suhbat"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Tozalash</span>
          </button>
        </div>
      </div>

      {/* Messages Stream */}
      <div className={`flex-1 overflow-y-auto p-4 space-y-4 ${
        isDark ? 'bg-[#0b1329]' : 'bg-slate-50'
      }`}>
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          const isBookmarked = bookmarkedIds.has(msg.id);

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-full`}
            >
              <div
                className={`relative max-w-[94%] sm:max-w-[88%] rounded-2xl p-3.5 sm:p-4 text-sm leading-relaxed transition-all shadow-md ${
                  isUser
                    ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-700 text-white rounded-br-xs border border-blue-400/20'
                    : isDark
                    ? 'bg-[#111c38]/95 text-slate-100 rounded-bl-xs border border-indigo-500/25 shadow-lg backdrop-blur-sm'
                    : 'bg-white text-slate-900 rounded-bl-xs border border-slate-200 shadow-md'
                }`}
              >
                {/* Header for Bot Message with Verification & Actions */}
                {!isUser && (
                  <div className={`mb-3 pb-2.5 border-b flex items-center justify-between gap-2 text-xs ${
                    isDark ? 'border-slate-800' : 'border-slate-100'
                  }`}>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 font-bold text-[10px] shadow-xs">
                        ⚖️
                      </div>
                      <span className="font-bold text-[11px] text-amber-300 tracking-wide">
                        LexAI Ekspertiza
                      </span>
                      {msg.lawStatus === 'ESKI_HUJJAT_ANIQLANDI_VA_YANGILANDI' ? (
                        <span className="inline-flex items-center text-amber-400 bg-amber-500/15 border border-amber-500/30 px-1.5 py-0.5 rounded-full text-[10px] font-semibold">
                          <AlertTriangle className="w-3 h-3 mr-1" />
                          Yangilangan qonun
                        </span>
                      ) : (
                        <span className="inline-flex items-center text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-1.5 py-0.5 rounded-full text-[10px] font-semibold">
                          <ShieldCheck className="w-3 h-3 mr-1" />
                          Amaldagi Lex.uz 2026
                        </span>
                      )}
                    </div>

                    <div className="flex items-center space-x-1 shrink-0">
                      <button
                        onClick={() => toggleBookmark(msg.id)}
                        className={`p-1.5 rounded-lg transition cursor-pointer ${
                          isBookmarked 
                            ? 'text-amber-400 bg-amber-500/20' 
                            : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                        }`}
                        title="Saqlash"
                      >
                        <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-amber-400' : ''}`} />
                      </button>
                      <button
                        onClick={() => copyText(msg.text, msg.id)}
                        className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800/60 transition cursor-pointer"
                        title="Nusxalash"
                      >
                        {copiedId === msg.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {/* Formatted body with interactive clickable links */}
                <div className="whitespace-pre-wrap font-sans break-words space-y-2 text-[13px] leading-relaxed">
                  {msg.text.split('\n').map((line, idx) => {
                    const trimmedLine = line.trim();
                    if (!trimmedLine) {
                      return <div key={idx} className="h-1" />;
                    }

                    // Check for URL in line
                    const urlMatch = line.match(/(https?:\/\/[^\s]+)/i);
                    const isHeader = line.startsWith('📌') || line.startsWith('📜') || line.startsWith('⚖️') || line.startsWith('💡') || line.startsWith('📋') || line.startsWith('⏳');
                    const isStep = line.startsWith('1️⃣') || line.startsWith('2️⃣') || line.startsWith('3️⃣') || line.startsWith('4️⃣') || line.startsWith('5️⃣');
                    
                    if (line.includes('━━━')) {
                      return <hr key={idx} className={`my-2 ${isDark ? 'border-slate-800' : 'border-slate-200'}`} />;
                    }

                    // Dedicated interactive link card for Lex.uz link lines
                    if (urlMatch) {
                      const detectedUrl = urlMatch[1].replace(/[),;.]+$/, '');
                      return (
                        <div key={idx} className="my-2.5 p-2.5 rounded-xl bg-gradient-to-r from-amber-500/15 via-indigo-900/30 to-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-2 shadow-xs">
                          <div className="flex items-center gap-2 min-w-0">
                            <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300 font-bold text-xs shrink-0">
                              🏛️
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-amber-200 truncate">
                                {line.replace(/(https?:\/\/[^\s]+)/i, '').replace(/🔗|\*+/g, '').trim() || "Lex.uz Rasmiy Qonun Hujjati"}
                              </p>
                              <p className="text-[10px] text-slate-400 truncate font-mono">
                                {detectedUrl}
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => openExternalLink(detectedUrl)}
                            className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 shrink-0 transition shadow-xs cursor-pointer active:scale-95"
                          >
                            <span>Ochish</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      );
                    }

                    if (isHeader) {
                      return (
                        <div key={idx} className="mt-3 mb-1 px-2.5 py-1.5 rounded-lg bg-amber-500/10 border-l-2 border-amber-400 text-amber-300 font-bold text-[13px] flex items-center gap-1.5">
                          <span>{line}</span>
                        </div>
                      );
                    }

                    return (
                      <p
                        key={idx}
                        className={`${isStep ? 'font-semibold text-sky-200 pl-1' : ''} ${
                          line.startsWith('⚠️') ? 'text-amber-400 font-medium bg-amber-500/10 p-2 rounded-lg border border-amber-500/20' : ''
                        }`}
                      >
                        {line}
                      </p>
                    );
                  })}
                </div>

                {/* Lex.uz Sources with Active Click Handlers */}
                {!isUser && msg.sources && msg.sources.length > 0 && (
                  <div className={`mt-3.5 pt-2.5 border-t ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
                    <div className="flex items-center gap-1.5 mb-2">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                        Rasmiy Qonunchilik Bazasida Ko'rish (Lex.uz):
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {msg.sources.map((src, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => openExternalLink(src.uri)}
                          className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-amber-300 border border-amber-500/30 hover:border-amber-400 font-semibold transition cursor-pointer shadow-xs active:scale-95 group"
                          title="Rasmiy Lex.uz sahifasini brauzerda ochish"
                        >
                          <span className="truncate max-w-[240px]">{src.title}</span>
                          <ExternalLink className="w-3.5 h-3.5 text-amber-400 group-hover:translate-x-0.5 transition-transform" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Rating and Timestamp Footer */}
                <div className={`flex items-center justify-between mt-3 pt-2 border-t text-[11px] ${
                  isDark ? 'border-slate-800/80 text-slate-400' : 'border-slate-100 text-slate-500'
                }`}>
                  {!isUser ? (
                    <div className="flex items-center space-x-1.5">
                      <span className="text-[10px] text-slate-400">Baholash:</span>
                      <button
                        onClick={() => rateMessage(msg.id, 'up')}
                        className={`p-1 rounded-md transition flex items-center gap-1 cursor-pointer ${
                          msg.rating === 'up'
                            ? 'bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/50'
                            : 'text-slate-400 hover:text-emerald-400'
                        }`}
                        title="Foydali (Thumbs Up)"
                      >
                        <ThumbsUp className={`w-3.5 h-3.5 ${msg.rating === 'up' ? 'fill-emerald-400' : ''}`} />
                        {msg.rating === 'up' && <span className="text-[9px] font-semibold text-emerald-400">To'g'ri</span>}
                      </button>
                      <button
                        onClick={() => rateMessage(msg.id, 'down')}
                        className={`p-1 rounded-md transition flex items-center gap-1 cursor-pointer ${
                          msg.rating === 'down'
                            ? 'bg-rose-500/20 text-rose-400 ring-1 ring-rose-500/50'
                            : 'text-slate-400 hover:text-rose-400'
                        }`}
                        title="Noto'g'ri (Thumbs Down)"
                      >
                        <ThumbsDown className={`w-3.5 h-3.5 ${msg.rating === 'down' ? 'fill-rose-400' : ''}`} />
                        {msg.rating === 'down' && <span className="text-[9px] font-semibold text-rose-400">Qayta ko'rish</span>}
                      </button>
                    </div>
                  ) : <div />}

                  <span>{msg.timestamp}</span>
                </div>
              </div>

              {/* Action buttons */}
              {!isUser && msg.suggestedButtons && msg.suggestedButtons.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5 max-w-[90%] sm:max-w-[85%]">
                  {msg.suggestedButtons.map((btn, btnIdx) => (
                    <button
                      key={btnIdx}
                      onClick={() => {
                        if (btn.action) handleSend(btn.action);
                      }}
                      disabled={isLoading}
                      className={`text-xs px-3 py-1.5 rounded-xl border transition shadow-xs cursor-pointer font-medium ${
                        isDark 
                          ? 'bg-[#121f3d] hover:bg-[#1a2d59] text-slate-200 border-indigo-900/60' 
                          : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-300'
                      }`}
                    >
                      {btn.text}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center space-x-2 text-xs text-amber-400 animate-pulse p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 max-w-[280px]">
            <Sparkles className="w-4 h-4 animate-spin" />
            <span>Lex.uz qonunlari tahlil qilinmoqda...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input box */}
      <div className={`p-3 border-t shrink-0 rounded-b-2xl ${
        isDark ? 'bg-[#0f172a] border-slate-800' : 'bg-white border-slate-200'
      }`}>
        {/* Attached Image Preview */}
        {attachedImagePreview && (
          <div className="mb-2.5 p-2 rounded-xl bg-cyan-950/50 border border-cyan-500/30 flex items-center justify-between text-xs text-cyan-200">
            <div className="flex items-center gap-2">
              <img 
                src={attachedImagePreview} 
                alt="Ilova qilingan rasm" 
                className="w-10 h-10 object-cover rounded-lg border border-cyan-400/40" 
              />
              <div>
                <span className="font-semibold text-cyan-300">📷 Rasm yuklandi (OCR &amp; Yechim)</span>
                <p className="text-[10px] text-slate-400">Yuborish tugmasini bosing yoki savol qo'shing</p>
              </div>
            </div>
            <button
              type="button"
              onClick={removeAttachedImage}
              className="p-1 rounded-md text-slate-400 hover:text-white cursor-pointer"
              title="Bekor qilish"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Message Input Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center space-x-1.5"
        >
          {/* Real Photo / Camera Input for OCR / Vision */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageSelect}
            accept="image/*"
            capture="environment"
            className="hidden"
          />

          <button
            type="button"
            onClick={() => {
              haptic('light');
              fileInputRef.current?.click();
            }}
            className={`p-2.5 rounded-xl border transition cursor-pointer ${
              attachedImageBase64 
                ? 'bg-cyan-500 text-slate-950 border-cyan-400' 
                : isDark 
                ? 'bg-slate-800 text-slate-400 hover:text-cyan-400 border-slate-700' 
                : 'bg-slate-100 text-slate-600 hover:text-blue-600 border-slate-300'
            }`}
            title="Hujjat yoki test rasmini yuklash (OCR & Yechim)"
          >
            <Camera className="w-4 h-4" />
          </button>

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              attachedImageBase64 
                ? "Rasm bo'yicha savolingizni yozing yoki darhol yuboring..." 
                : language === 'ru' 
                ? 'Напишите юридический вопрос...' 
                : 'Savolingiz yoki kazusingizni yozing...'
            }
            disabled={isLoading}
            className={`flex-1 text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border focus:outline-none transition ${
              isDark
                ? 'bg-[#050b18] text-white border-slate-800 focus:border-amber-400 focus:ring-1 focus:ring-amber-400'
                : 'bg-slate-50 text-slate-900 border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600'
            }`}
          />

          <button
            type="submit"
            disabled={(!input.trim() && !attachedImageBase64) || isLoading}
            className="p-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold transition disabled:opacity-40 cursor-pointer shadow-md"
            title="Yuborish"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* History Modal Dialog */}
      {showHistoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div 
            className={`w-full max-w-lg rounded-2xl border shadow-2xl overflow-hidden flex flex-col max-h-[80vh] ${
              isDark ? 'bg-[#0f172a] border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-800'
            }`}
          >
            {/* Modal Header */}
            <div className={`p-4 border-b flex items-center justify-between shrink-0 ${
              isDark ? 'border-slate-800 bg-[#0a1124]' : 'border-slate-200 bg-slate-50'
            }`}>
              <div className="flex items-center space-x-2">
                <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
                  <History className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">Mening Qidiruvlarim Tarixi</h3>
                  <p className="text-[11px] text-slate-400">Oldin berilgan huquqiy savollar va AI javoblari</p>
                </div>
              </div>
              <button
                onClick={() => setShowHistoryModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-4 overflow-y-auto space-y-3 flex-1">
              {isLoadingHistory ? (
                <div className="py-12 text-center text-slate-400 text-xs">
                  Yuklanmoqda...
                </div>
              ) : historyItems.length === 0 ? (
                <div className="py-12 text-center text-slate-400 space-y-2">
                  <Clock className="w-8 h-8 mx-auto text-slate-500 opacity-60" />
                  <p className="text-xs">Siz hali hech qanday huquqiy savol bermadingiz.</p>
                  <p className="text-[11px] text-slate-500">Qidirilgan barcha savollar avtomatik saqlanadi.</p>
                </div>
              ) : (
                historyItems.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleSelectHistoryItem(item)}
                    className={`p-3 rounded-xl border transition cursor-pointer group ${
                      isDark 
                        ? 'bg-[#14203d] border-indigo-950 hover:border-amber-500/40' 
                        : 'bg-slate-50 border-slate-200 hover:border-blue-400 hover:bg-blue-50/30'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold line-clamp-2 text-slate-200 group-hover:text-amber-400 transition">
                          {item.query}
                        </p>
                        <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                          {item.answer.replace(/[#*`]/g, '')}
                        </p>
                        <div className="flex items-center gap-2 mt-2 text-[10px] text-slate-400">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-500" />
                            {new Date(item.timestamp).toLocaleString()}
                          </span>
                          <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-medium">
                            {item.law_status === 'AMALDAGI_QONUNCHILIK' ? 'Amaldagi Lex.uz' : 'Yangilangan'}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={(e) => handleDeleteHistoryItem(e, item.id)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition"
                          title="Tarixdan o'chirish"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Modal Footer */}
            <div className={`p-3 border-t flex justify-end shrink-0 ${
              isDark ? 'border-slate-800 bg-[#0a1124]' : 'border-slate-200 bg-slate-50'
            }`}>
              <button
                onClick={() => setShowHistoryModal(false)}
                className="px-4 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 text-slate-200 hover:bg-slate-700 transition cursor-pointer"
              >
                Yopish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
