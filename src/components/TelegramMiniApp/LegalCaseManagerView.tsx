import React, { useState, useEffect } from 'react';
import { 
  Briefcase, Plus, Calendar, Clock, AlertCircle, 
  CheckCircle2, Folder, FileText, ChevronRight, Trash2, 
  Edit3, ExternalLink, Filter, Search, X
} from 'lucide-react';
import { useTelegram } from './TelegramContext';

interface LegalCase {
  id: string;
  user_id: string;
  title: string;
  category: 'mehnat' | 'oila' | 'fuqarolik' | 'jinoyat' | 'mib' | 'boshqa';
  status: 'new' | 'in_progress' | 'court' | 'resolved' | 'archived';
  case_number?: string;
  court_name?: string;
  next_deadline?: string;
  notes: string;
  document_ids: string[];
  created_at: string;
  updated_at: string;
}

export const LegalCaseManagerView: React.FC = () => {
  const { theme, haptic, language, user } = useTelegram();
  const isDark = theme === 'dark';

  const [cases, setCases] = useState<LegalCase[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCase, setSelectedCase] = useState<LegalCase | null>(null);

  // Form state
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'mehnat' | 'oila' | 'fuqarolik' | 'jinoyat' | 'mib' | 'boshqa'>('fuqarolik');
  const [status, setStatus] = useState<'new' | 'in_progress' | 'court' | 'resolved' | 'archived'>('new');
  const [caseNumber, setCaseNumber] = useState('');
  const [courtName, setCourtName] = useState('');
  const [nextDeadline, setNextDeadline] = useState('');
  const [notes, setNotes] = useState('');

  const fetchCases = async () => {
    try {
      const userId = user.id ? String(user.id) : 'default_user';
      const res = await fetch(`/api/cases?userId=${userId}`);
      const data = await res.json();
      if (data.success && data.cases) {
        setCases(data.cases);
      }
    } catch (e) {
      console.warn("Fetch cases error:", e);
    }
  };

  useEffect(() => {
    fetchCases();
  }, [user.id]);

  const handleCreateCase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    haptic('medium');

    const userId = user.id ? String(user.id) : 'default_user';
    try {
      const res = await fetch('/api/cases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          title: title.trim(),
          category,
          status,
          case_number: caseNumber.trim(),
          court_name: courtName.trim(),
          next_deadline: nextDeadline,
          notes: notes.trim()
        })
      });
      const data = await res.json();
      if (data.success) {
        haptic('success');
        setIsModalOpen(false);
        resetForm();
        fetchCases();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteCase = async (id: string) => {
    haptic('medium');
    try {
      const userId = user.id ? String(user.id) : 'default_user';
      await fetch(`/api/cases/${id}?userId=${userId}`, { method: 'DELETE' });
      setCases(cases.filter(c => c.id !== id));
      if (selectedCase?.id === id) setSelectedCase(null);
    } catch (e) {}
  };

  const handleStatusChange = async (id: string, newStatus: any) => {
    haptic('light');
    try {
      await fetch(`/api/cases/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      setCases(cases.map(c => c.id === id ? { ...c, status: newStatus } : c));
      if (selectedCase?.id === id) setSelectedCase({ ...selectedCase, status: newStatus });
    } catch (e) {}
  };

  const resetForm = () => {
    setTitle('');
    setCategory('fuqarolik');
    setStatus('new');
    setCaseNumber('');
    setCourtName('');
    setNextDeadline('');
    setNotes('');
  };

  const getStatusBadge = (st: string) => {
    switch (st) {
      case 'new':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-400 border border-blue-400/30">Yangi ish</span>;
      case 'in_progress':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-400/30">Jarayonda</span>;
      case 'court':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-400 border border-rose-400/30">Sudda ko'rilmoqda</span>;
      case 'resolved':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-400/30">Hal etildi</span>;
      case 'archived':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-500/20 text-slate-400 border border-slate-400/30">Arxivlangan</span>;
      default:
        return null;
    }
  };

  const filteredCases = cases.filter(c => {
    const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.court_name && c.court_name.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = filterStatus === 'all' || c.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-4 pb-20">
      {/* Header Banner */}
      <div className={`p-5 rounded-3xl border ${
        isDark ? 'bg-gradient-to-r from-[#0c1429] to-[#111e3d] border-indigo-900/50 text-white' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-slate-950 font-bold shadow-md">
              <Briefcase className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold tracking-tight">
                {language === 'ru' ? 'Мои юридические дела' : 'Shaxsiy Huquqiy Ishlar'}
              </h2>
              <p className="text-xs text-slate-400">
                Sud ishlari, muddatlar, dalillar va hujjatlar boshqaruvi
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              haptic('medium');
              setIsModalOpen(true);
            }}
            className="px-3 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs flex items-center gap-1 shadow-md cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Yangi ish</span>
          </button>
        </div>

        {/* Filter Pills */}
        <div className="mt-4 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
          {[
            { id: 'all', label: 'Barchasi' },
            { id: 'in_progress', label: 'Jarayonda' },
            { id: 'court', label: 'Sudda' },
            { id: 'resolved', label: 'Hal etildi' },
            { id: 'new', label: 'Yangi' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => {
                haptic('light');
                setFilterStatus(f.id);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                filterStatus === f.id
                  ? 'bg-amber-400 text-slate-950 font-bold shadow-sm'
                  : isDark
                  ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Cases List */}
      <div className="space-y-3">
        {filteredCases.length === 0 ? (
          <div className={`p-8 rounded-3xl border text-center ${
            isDark ? 'bg-[#0a1128] border-indigo-900/40 text-slate-400' : 'bg-white border-slate-200 text-slate-500'
          }`}>
            <Briefcase className="w-10 h-10 mx-auto text-slate-500 mb-2" />
            <p className="text-sm font-bold">Hozircha faol huquqiy ishlar yo'q</p>
            <p className="text-xs mt-1">"Yangi ish" tugmasi orqali shaxsiy sud ishingizni ro'yxatga oling.</p>
          </div>
        ) : (
          filteredCases.map((c) => (
            <div
              key={c.id}
              className={`p-4 rounded-2xl border transition ${
                isDark 
                  ? 'bg-[#091024] hover:bg-[#0c1633] border-indigo-950/80 text-white' 
                  : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    {getStatusBadge(c.status)}
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">
                      {c.category}
                    </span>
                    {c.case_number && (
                      <span className="text-[10px] text-slate-400 font-mono">
                        № {c.case_number}
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm font-bold tracking-tight">{c.title}</h3>
                  {c.court_name && (
                    <p className="text-xs text-amber-400/90 mt-1 flex items-center gap-1">
                      <span>🏛️ {c.court_name}</span>
                    </p>
                  )}
                  {c.next_deadline && (
                    <p className="text-xs text-rose-300 mt-1 flex items-center gap-1 font-semibold">
                      <Clock className="w-3 h-3" />
                      <span>Muhim muddat / Majlis: {c.next_deadline}</span>
                    </p>
                  )}
                  {c.notes && (
                    <p className="text-xs text-slate-400 mt-2 line-clamp-2">
                      {c.notes}
                    </p>
                  )}
                </div>

                <div className="flex flex-col items-end gap-2">
                  <button
                    onClick={() => handleDeleteCase(c.id)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 transition"
                    title="O'chirish"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <select
                    value={c.status}
                    onChange={(e) => handleStatusChange(c.id, e.target.value)}
                    className={`text-[11px] font-semibold px-2 py-1 rounded-lg border focus:outline-none ${
                      isDark ? 'bg-slate-800 text-slate-200 border-slate-700' : 'bg-slate-100 text-slate-700 border-slate-300'
                    }`}
                  >
                    <option value="new">Yangi</option>
                    <option value="in_progress">Jarayonda</option>
                    <option value="court">Sudda</option>
                    <option value="resolved">Hal etildi</option>
                    <option value="archived">Arxiv</option>
                  </select>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal: Create Case */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`w-full max-w-md rounded-3xl p-5 border shadow-2xl max-h-[90vh] overflow-y-auto ${
            isDark ? 'bg-[#0a1128] border-indigo-900 text-white' : 'bg-white border-slate-200 text-slate-800'
          }`}>
            <div className="flex items-center justify-between pb-3 border-b border-slate-700/40">
              <h3 className="text-base font-extrabold flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-amber-400" />
                <span>Yangi Huquqiy Ish Ochish</span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCase} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Ish nomi *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Masalan: Ish haqini undirish yoki Meros nizosi"
                  className={`w-full px-3 py-2 rounded-xl border focus:outline-none ${
                    isDark ? 'bg-[#060c1c] text-white border-slate-800 focus:border-amber-400' : 'bg-slate-50 text-slate-900 border-slate-300'
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold mb-1">Soha</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className={`w-full px-3 py-2 rounded-xl border focus:outline-none ${
                      isDark ? 'bg-[#060c1c] text-white border-slate-800' : 'bg-slate-50 text-slate-900 border-slate-300'
                    }`}
                  >
                    <option value="fuqarolik">Fuqarolik</option>
                    <option value="mehnat">Mehnat</option>
                    <option value="oila">Oila</option>
                    <option value="jinoyat">Jinoyat</option>
                    <option value="mib">MIB</option>
                    <option value="boshqa">Boshqa</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-1">Dastlabki holati</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className={`w-full px-3 py-2 rounded-xl border focus:outline-none ${
                      isDark ? 'bg-[#060c1c] text-white border-slate-800' : 'bg-slate-50 text-slate-900 border-slate-300'
                    }`}
                  >
                    <option value="new">Yangi</option>
                    <option value="in_progress">Jarayonda</option>
                    <option value="court">Sudda</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Sud yoki mas'ul organ nomi</label>
                <input
                  type="text"
                  value={courtName}
                  onChange={(e) => setCourtName(e.target.value)}
                  placeholder="Masalan: Fuqarolik ishlari bo'yicha tuman sudi"
                  className={`w-full px-3 py-2 rounded-xl border focus:outline-none ${
                    isDark ? 'bg-[#060c1c] text-white border-slate-800' : 'bg-slate-50 text-slate-900 border-slate-300'
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold mb-1">Ish raqami (agar bo'lsa)</label>
                  <input
                    type="text"
                    value={caseNumber}
                    onChange={(e) => setCaseNumber(e.target.value)}
                    placeholder="Masalan: 2-1045/26"
                    className={`w-full px-3 py-2 rounded-xl border focus:outline-none ${
                      isDark ? 'bg-[#060c1c] text-white border-slate-800' : 'bg-slate-50 text-slate-900 border-slate-300'
                    }`}
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">Muhim muddat / Sana</label>
                  <input
                    type="date"
                    value={nextDeadline}
                    onChange={(e) => setNextDeadline(e.target.value)}
                    className={`w-full px-3 py-2 rounded-xl border focus:outline-none ${
                      isDark ? 'bg-[#060c1c] text-white border-slate-800' : 'bg-slate-50 text-slate-900 border-slate-300'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Izohlar va dalillar</label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Ish bo'yicha muhim tafsilotlar, da'vo talablari..."
                  className={`w-full px-3 py-2 rounded-xl border focus:outline-none ${
                    isDark ? 'bg-[#060c1c] text-white border-slate-800' : 'bg-slate-50 text-slate-900 border-slate-300'
                  }`}
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold shadow-md"
                >
                  Saqlash
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
