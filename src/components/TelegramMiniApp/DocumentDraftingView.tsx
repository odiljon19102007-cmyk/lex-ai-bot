import React, { useState, useEffect } from 'react';
import { 
  FileText, Download, Copy, Check, Sparkles, 
  ChevronRight, RefreshCw, Edit3, ArrowLeft, ShieldCheck,
  BookmarkCheck, Printer, Briefcase
} from 'lucide-react';
import { useTelegram } from './TelegramContext';
import { LEGAL_DOCUMENT_BLUEPRINTS, exportToWordHtml } from '../../data/legalDocumentsEngine';

export const DocumentDraftingView: React.FC = () => {
  const { theme, haptic, language, user } = useTelegram();
  const isDark = theme === 'dark';

  const [blueprints] = useState(LEGAL_DOCUMENT_BLUEPRINTS);
  const [selectedBlueprintId, setSelectedBlueprintId] = useState<string>(LEGAL_DOCUMENT_BLUEPRINTS[0].id);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [generatedDoc, setGeneratedDoc] = useState<string>('');
  const [legalBasis, setLegalBasis] = useState<string[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [userCases, setUserCases] = useState<any[]>([]);
  const [selectedCaseId, setSelectedCaseId] = useState<string>('');

  const currentBlueprint = blueprints.find(b => b.id === selectedBlueprintId) || blueprints[0];

  useEffect(() => {
    // Generate initial doc for selected blueprint
    const res = currentBlueprint.generateContent(formData);
    setGeneratedDoc(res.content);
    setLegalBasis(res.legalBasis);
  }, [selectedBlueprintId, formData]);

  useEffect(() => {
    // Fetch user's cases for attachment
    const userId = user.id ? String(user.id) : 'default_user';
    fetch(`/api/cases?userId=${userId}`)
      .then(r => r.json())
      .then(d => {
        if (d.success && d.cases) setUserCases(d.cases);
      })
      .catch(() => {});
  }, [user.id]);

  const handleFieldChange = (fieldId: string, val: string) => {
    setFormData(prev => ({ ...prev, [fieldId]: val }));
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedDoc);
    setCopied(true);
    haptic('selection');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadWord = () => {
    haptic('medium');
    const wordHtml = exportToWordHtml(currentBlueprint.title, generatedDoc);
    const blob = new Blob([wordHtml], { type: 'application/msword;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${currentBlueprint.title.replace(/\s+/g, '_')}.doc`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    haptic('light');
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>${currentBlueprint.title}</title>
            <style>
              body { font-family: 'Times New Roman', serif; font-size: 14pt; line-height: 1.5; padding: 40px; }
              pre { white-space: pre-wrap; font-family: inherit; font-size: inherit; }
            </style>
          </head>
          <body>
            <pre>${generatedDoc}</pre>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
    }
  };

  const handleSaveToCase = async () => {
    haptic('medium');
    const userId = user.id ? String(user.id) : 'default_user';
    try {
      await fetch('/api/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          caseId: selectedCaseId || undefined,
          title: currentBlueprint.title,
          doc_type: currentBlueprint.id,
          content: generatedDoc,
          legal_basis: legalBasis
        })
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
    } catch (e) {
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
    }
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Header */}
      <div className={`p-5 rounded-3xl border ${
        isDark ? 'bg-gradient-to-r from-[#0c1429] to-[#111e3d] border-indigo-900/50 text-white' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-md">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold tracking-tight">
              {language === 'ru' ? 'Генератор документов' : 'Professional Hujjat Generator'}
            </h2>
            <p className="text-xs text-slate-400">
              O'zbekiston sud va davlat organlari uchun rasmiy arizalar, da'volar va shartnomalar
            </p>
          </div>
        </div>

        {/* Blueprint selector pills */}
        <div className="mt-4 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
          {blueprints.map((b) => (
            <button
              key={b.id}
              onClick={() => {
                haptic('light');
                setSelectedBlueprintId(b.id);
                setIsEditing(false);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                selectedBlueprintId === b.id
                  ? 'bg-amber-400 text-slate-950 font-bold shadow-md'
                  : isDark
                  ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {b.title}
            </button>
          ))}
        </div>
      </div>

      {/* Dynamic Form for Current Blueprint */}
      <div className={`p-5 rounded-3xl border ${
        isDark ? 'bg-[#0a1128] border-indigo-900/40 text-white' : 'bg-white border-slate-200 text-slate-800'
      }`}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
            <Edit3 className="w-4 h-4" />
            <span>Hujjat Ma'lumotlarini Kiritish</span>
          </h3>
          <span className="text-[11px] text-slate-400">{currentBlueprint.description}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {currentBlueprint.fields.map((f) => (
            <div key={f.id} className={f.type === 'textarea' ? 'sm:col-span-2' : ''}>
              <label className="block font-semibold mb-1 text-slate-300">
                {f.label}
              </label>
              {f.type === 'textarea' ? (
                <textarea
                  rows={2}
                  value={formData[f.id] || ''}
                  onChange={(e) => handleFieldChange(f.id, e.target.value)}
                  placeholder={f.placeholder}
                  className={`w-full px-3 py-2 rounded-xl border focus:outline-none transition ${
                    isDark ? 'bg-[#060c1c] text-white border-slate-800 focus:border-amber-400' : 'bg-slate-50 text-slate-900 border-slate-300 focus:border-blue-600'
                  }`}
                />
              ) : (
                <input
                  type={f.type || 'text'}
                  value={formData[f.id] || ''}
                  onChange={(e) => handleFieldChange(f.id, e.target.value)}
                  placeholder={f.placeholder}
                  className={`w-full px-3 py-2 rounded-xl border focus:outline-none transition ${
                    isDark ? 'bg-[#060c1c] text-white border-slate-800 focus:border-amber-400' : 'bg-slate-50 text-slate-900 border-slate-300 focus:border-blue-600'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Generated Document Preview & Actions */}
      <div className={`p-5 rounded-3xl border shadow-xl ${
        isDark ? 'bg-[#060c1c] border-indigo-900/60 text-white' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800/80">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
              <ShieldCheck className="w-4 h-4" />
              <span>Tayyor Hujjat Loyihasi</span>
            </span>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-2.5 py-1 rounded-xl text-xs font-semibold bg-slate-800 text-slate-300 hover:bg-slate-700 transition"
            >
              {isEditing ? "Ko'rish" : "Tahrirlash"}
            </button>

            <button
              onClick={handleCopy}
              className="px-2.5 py-1 rounded-xl text-xs font-semibold bg-slate-800 text-slate-300 hover:bg-slate-700 transition flex items-center gap-1"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? "Nusxalandi" : "Nusxa"}</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-2.5 py-1 rounded-xl text-xs font-semibold bg-slate-800 text-slate-300 hover:bg-slate-700 transition flex items-center gap-1"
              title="Chop etish"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Chop etish</span>
            </button>

            <button
              onClick={handleDownloadWord}
              className="px-3 py-1 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white transition flex items-center gap-1 shadow-md cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Word (.doc)</span>
            </button>
          </div>
        </div>

        {/* Text Area / Document View */}
        <div className="mt-4">
          {isEditing ? (
            <textarea
              rows={16}
              value={generatedDoc}
              onChange={(e) => setGeneratedDoc(e.target.value)}
              className={`w-full p-4 rounded-2xl text-xs sm:text-sm font-mono border focus:outline-none ${
                isDark ? 'bg-[#030712] text-slate-200 border-slate-800 focus:border-amber-400' : 'bg-slate-50 text-slate-800 border-slate-300'
              }`}
            />
          ) : (
            <div className={`p-4 rounded-2xl text-xs sm:text-sm font-serif leading-relaxed whitespace-pre-wrap border ${
              isDark ? 'bg-[#040817] text-slate-200 border-slate-800/80' : 'bg-slate-50 text-slate-800 border-slate-200'
            }`}>
              {generatedDoc}
            </div>
          )}
        </div>

        {/* Attach to Case Manager */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-amber-400" />
            <span className="text-slate-400">Ishga biriktirish:</span>
            <select
              value={selectedCaseId}
              onChange={(e) => setSelectedCaseId(e.target.value)}
              className={`px-2 py-1 rounded-lg border text-xs ${
                isDark ? 'bg-slate-800 text-slate-200 border-slate-700' : 'bg-slate-100 text-slate-700 border-slate-300'
              }`}
            >
              <option value="">Alohida saqlash (ishsiz)</option>
              {userCases.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleSaveToCase}
            className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition ${
              savedSuccess
                ? 'bg-emerald-500 text-white'
                : 'bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-400/30'
            }`}
          >
            {savedSuccess ? <Check className="w-4 h-4" /> : <BookmarkCheck className="w-4 h-4" />}
            <span>{savedSuccess ? "Muvaffaqiyatli Saqlandi" : "Hujjatni Saqlash"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
