import React, { useState } from 'react';
import { Copy, Check, Download, FileCode, Terminal, Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react';
import { BOT_TEMPLATES, BotImplementation, BotCodeFile } from '../data/botTemplates';

export const CodeViewer: React.FC = () => {
  const [selectedImplId, setSelectedImplId] = useState<string>('aiogram3');
  const [activeFileIndex, setActiveFileIndex] = useState<number>(0);
  const [copied, setCopied] = useState<boolean>(false);

  const currentImpl: BotImplementation =
    BOT_TEMPLATES.find((t) => t.id === selectedImplId) || BOT_TEMPLATES[0];

  const currentFile: BotCodeFile =
    currentImpl.files[activeFileIndex] || currentImpl.files[0];

  const handleCopy = () => {
    navigator.clipboard.writeText(currentFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([currentFile.content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = currentFile.filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Function Solution Highlight */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-2xl p-6 shadow-lg border border-blue-800/40">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-200 border border-blue-400/30">
              <Sparkles className="w-3.5 h-3.5 text-sky-400" />
              Siz so'ragan maxsus huquqiy funksiya tayyorlandi
            </div>
            <h2 className="text-xl md:text-2xl font-bold tracking-tight">
              search_lex_uz_and_answer() funksiyasi & Telegram Bot Kodi
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm max-w-3xl leading-relaxed">
              Ushbu funksiya foydalanuvchining huquqiy savolini qabul qiladi, <strong>Lex.uz</strong> bazasidagi eng yangi qonun va qarorlarni qidiradi, eskirgan va bekor qilingan (o'z kuchini yo'qotgan) hujjatlarni butunlay chiqarib tashlaydi hamda Telegram uchun tayyor formatda taqdim etadi.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-2 shadow-md transition cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Nusxalandi!' : 'Kodni nusxalash'}</span>
            </button>
            <button
              onClick={handleDownload}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-2 border border-slate-700 transition cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>{currentFile.filename} yuklab olish</span>
            </button>
          </div>
        </div>
      </div>

      {/* Framework / Tech Stack Selector */}
      <div className="flex flex-wrap items-center gap-2">
        {BOT_TEMPLATES.map((tmpl) => (
          <button
            key={tmpl.id}
            onClick={() => {
              setSelectedImplId(tmpl.id);
              setActiveFileIndex(0);
            }}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition cursor-pointer ${
              selectedImplId === tmpl.id
                ? 'bg-blue-600 text-white shadow-sm ring-2 ring-blue-600 ring-offset-2'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <FileCode className="w-4 h-4" />
            <span>{tmpl.title}</span>
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded ${
                selectedImplId === tmpl.id ? 'bg-blue-700 text-blue-100' : 'bg-slate-100 text-slate-600'
              }`}
            >
              {tmpl.badge}
            </span>
          </button>
        ))}
      </div>

      {/* Code Editor / Viewer Box */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        {/* File Tabs & Actions */}
        <div className="bg-slate-950 px-4 py-2.5 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
          {/* File Tabs */}
          <div className="flex items-center space-x-1.5 overflow-x-auto scrollbar-none">
            {currentImpl.files.map((file, idx) => (
              <button
                key={file.filename}
                onClick={() => setActiveFileIndex(idx)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition cursor-pointer flex items-center gap-1.5 ${
                  activeFileIndex === idx
                    ? 'bg-slate-800 text-sky-400 border border-slate-700 shadow-xs'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                <span>{file.filename}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-3 text-xs text-slate-400">
            <span className="font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded">
              Ishga tushirish: {currentImpl.runCommand}
            </span>
            <button
              onClick={handleCopy}
              className="hover:text-white flex items-center gap-1 text-slate-300 transition"
              title="Fayldan nusxa olish"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Nusxa olindi' : 'Nusxa'}</span>
            </button>
          </div>
        </div>

        {/* File Description Bar */}
        <div className="bg-slate-850 px-4 py-2 border-b border-slate-800/80 text-xs text-slate-300 flex items-center gap-2">
          <Terminal className="w-3.5 h-3.5 text-blue-400 shrink-0" />
          <span>{currentFile.description}</span>
        </div>

        {/* Code Content */}
        <div className="p-4 sm:p-6 overflow-x-auto max-h-[600px] overflow-y-auto font-mono text-xs sm:text-sm text-slate-200 leading-relaxed bg-[#0d1117]">
          <pre>
            <code>{currentFile.content}</code>
          </pre>
        </div>
      </div>

      {/* Explanatory cards on how the Lex.uz function works */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center gap-2 text-blue-600 font-semibold text-sm mb-2">
            <CheckCircle2 className="w-4 h-4" />
            1. Yangi Qonunlarga Ustunlik
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            AI tizim ko'rsatmasida <strong>2023-yilgi Yangi Mehnat kodeksi (O'RQ-798)</strong>, <strong>Yangi Konstitutsiya</strong> va so'nggi Prezident qarorlari prioritet qilib belgilangan.
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center gap-2 text-amber-600 font-semibold text-sm mb-2">
            <AlertCircle className="w-4 h-4" />
            2. Eskilarini Qat'iy Saralash
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Agar foydalanuvchi so'ragan norma bekor bo'lgan bo'lsa, funksiya <code>is_outdated_detected</code> orqali ogohlantirib, uning o'rniga chiqqan amaldagi moddani beradi.
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center gap-2 text-emerald-600 font-semibold text-sm mb-2">
            <Terminal className="w-4 h-4" />
            3. Lex.uz Havolalari & Tugmalar
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Har bir javob ostida to'g'ridan-to'g'ri Lex.uz sahifasiga o'tuvchi Telegram Inline tugmalari (masalan, <code>https://lex.uz/docs/6257288</code>) avtomatik biriktiriladi.
          </p>
        </div>
      </div>
    </div>
  );
};
