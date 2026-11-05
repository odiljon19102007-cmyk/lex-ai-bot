import React, { useState } from 'react';
import { ShieldCheck, AlertCircle, RefreshCw, CheckCircle2, Bot, User, Hash } from 'lucide-react';

export const TokenValidator: React.FC = () => {
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleValidate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch('/api/telegram-bot/check-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: token.trim() }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.description || data.error || "Token yaroqsiz");
      }

      setResult(data.botInfo);
    } catch (err: any) {
      setError(err.message || "Telegram API bilan bog'lanishda xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-lg">Telegram Bot Tokenini Tekshirish</h3>
            <p className="text-xs sm:text-sm text-slate-500">
              @BotFather orqali olgan tokeningiz to'g'riligini va Telegram serverlari bilan ulanishini sinovdan o'tkazing.
            </p>
          </div>
        </div>

        <form onSubmit={handleValidate} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Telegram Bot Tokeni (Format: 123456789:AAEjf8...)
            </label>
            <input
              type="text"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Masalan: 7123456789:AAEjfkW9o..."
              className="w-full bg-slate-50 text-slate-900 font-mono text-xs sm:text-sm px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Xavfsizlik: Token faqat rasmiy Telegram API <code>/getMe</code> so'rovi uchun xavfsiz tarzda ishlatiladi.
            </p>
          </div>

          <button
            type="submit"
            disabled={!token.trim() || loading}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition shadow-md shadow-blue-500/20 cursor-pointer disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Tekshirilmoqda...</span>
              </>
            ) : (
              <>
                <Bot className="w-4 h-4" />
                <span>Tokenni Tekshirish</span>
              </>
            )}
          </button>
        </form>

        {error && (
          <div className="mt-4 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-start gap-2.5">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Token tekshiruvdan o'tmadi!</p>
              <p className="text-xs text-rose-700 mt-0.5">{error}</p>
            </div>
          </div>
        )}

        {result && (
          <div className="mt-6 p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-emerald-950 space-y-3">
            <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm sm:text-base">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>Token muvaffaqiyatli tasdiqlandi! Botingiz ishga tayyor.</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-white p-4 rounded-xl border border-emerald-100 shadow-xs">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-slate-400" />
                <span className="text-slate-500">Bot Nomi:</span>
                <span className="font-semibold text-slate-800">{result.first_name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Bot className="w-4 h-4 text-slate-400" />
                <span className="text-slate-500">Username:</span>
                <span className="font-semibold text-blue-600">@{result.username}</span>
              </div>
              <div className="flex items-center gap-2">
                <Hash className="w-4 h-4 text-slate-400" />
                <span className="text-slate-500">Bot ID:</span>
                <span className="font-mono text-slate-700">{result.id}</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span className="text-slate-500">Guruhlarga qo'shila oladi:</span>
                <span className="font-semibold text-emerald-700">
                  {result.can_join_groups ? 'Ha' : "Yo'q"}
                </span>
              </div>
            </div>

            <div className="text-xs text-emerald-800">
              Endi ushbu tokenni <code>.env</code> faylingizdagi <code>TELEGRAM_BOT_TOKEN</code> qatoriga qo'yishingiz mumkin.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
