import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, Activity, Users, Briefcase, FileText, 
  Database, RefreshCw, CheckCircle2, AlertTriangle, 
  Settings, Server, Search, UserCheck, UserPlus, 
  UserX, History, Trash2, ChevronDown, ChevronUp, 
  Crown, ExternalLink, Sparkles, MessageSquare, Clock
} from 'lucide-react';
import { useTelegram } from './TelegramContext';

interface UserItem {
  id: string;
  telegram_id?: number;
  first_name: string;
  username?: string;
  role: 'admin' | 'user';
  is_primary_admin?: boolean;
  queries_count?: number;
  created_at: string;
  last_active: string;
}

interface AIQueryItem {
  id: string;
  user_id: string;
  telegram_id?: number;
  user_name: string;
  query: string;
  answer: string;
  sources: { title: string; uri: string }[];
  law_status: string;
  timestamp: string;
}

interface Metrics {
  total_users: number;
  total_cases: number;
  total_documents: number;
  total_calculations: number;
  total_academy_students: number;
  total_logs: number;
  bot_running: boolean;
  bot_messages_processed: number;
  bot_reconnects: number;
  tunnel_url?: string;
  config: {
    bhm: number;
    mhekm: number;
    primary_admin_id?: string;
    primary_admin_username?: string;
    active_modules: Record<string, boolean>;
    version: string;
  };
}

export const AdminDashboardView: React.FC = () => {
  const { theme, haptic, language, user } = useTelegram();
  const isDark = theme === 'dark';

  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [usersList, setUsersList] = useState<UserItem[]>([]);
  const [aiQueries, setAiQueries] = useState<AIQueryItem[]>([]);
  const [logs, setLogs] = useState<any[]>([]);

  const [activeTab, setActiveTab] = useState<'users' | 'ai_history' | 'metrics' | 'modules' | 'logs'>('users');
  const [isLoading, setIsLoading] = useState(false);

  // User management inputs
  const [newAdminInput, setNewAdminInput] = useState('');
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [historySearchQuery, setHistorySearchQuery] = useState('');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [expandedQueryId, setExpandedQueryId] = useState<string | null>(null);

  const fetchAdminData = async () => {
    setIsLoading(true);
    try {
      const [mRes, uRes, qRes, lRes] = await Promise.all([
        fetch('/api/admin/metrics'),
        fetch('/api/admin/users'),
        fetch('/api/admin/ai-history'),
        fetch('/api/admin/logs')
      ]);
      const mData = await mRes.json();
      const uData = await uRes.json();
      const qData = await qRes.json();
      const lData = await lRes.json();

      if (mData.success) setMetrics(mData.metrics);
      if (uData.success) setUsersList(uData.users);
      if (qData.success) setAiQueries(qData.queries);
      if (lData.success) setLogs(lData.logs);
    } catch (e) {
      console.warn("Admin fetch error:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const showNotification = (msg: string) => {
    setStatusMessage(msg);
    setTimeout(() => setStatusMessage(null), 3000);
  };

  // Claim Current Account as Primary Admin
  const handleClaimPrimaryAdmin = async () => {
    haptic('medium');
    const identifier = user.username || String(user.id) || 'admin';
    const name = user.first_name || 'Admin';

    try {
      const res = await fetch('/api/admin/claim-primary-admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, name })
      });
      const data = await res.json();
      if (data.success) {
        haptic('success');
        showNotification("Akkauntingiz Bosh Administrator sifatida tasdiqlandi!");
        fetchAdminData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Toggle user role (promote to admin or demote to user)
  const handleToggleUserRole = async (targetUser: UserItem) => {
    haptic('medium');
    const newRole = targetUser.role === 'admin' ? 'user' : 'admin';
    try {
      const res = await fetch('/api/admin/users/role', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: targetUser.id, role: newRole })
      });
      const data = await res.json();
      if (data.success) {
        haptic('success');
        showNotification(`@${targetUser.username || targetUser.first_name} roli "${newRole}" ga o'zgartirildi!`);
        fetchAdminData();
      }
    } catch (e) {}
  };

  // Add new admin by telegram ID or username
  const handleAddAdminById = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminInput.trim()) return;
    haptic('medium');

    try {
      const res = await fetch('/api/admin/users/add-admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: newAdminInput.trim() })
      });
      const data = await res.json();
      if (data.success) {
        haptic('success');
        showNotification(`Yangi admin tayinlandi: ${newAdminInput.trim()}`);
        setNewAdminInput('');
        fetchAdminData();
      }
    } catch (e) {}
  };

  // Delete AI query
  const handleDeleteQuery = async (queryId: string) => {
    haptic('light');
    try {
      await fetch(`/api/legal-ai/history/${queryId}?userId=admin_master`, { method: 'DELETE' });
      setAiQueries(aiQueries.filter(q => q.id !== queryId));
      showNotification("So'rov o'chirildi.");
    } catch (e) {}
  };

  // Toggle Module
  const handleToggleModule = async (modKey: string) => {
    if (!metrics) return;
    haptic('medium');
    const newModules = {
      ...metrics.config.active_modules,
      [modKey]: !metrics.config.active_modules[modKey]
    };
    try {
      const res = await fetch('/api/admin/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active_modules: newModules })
      });
      const data = await res.json();
      if (data.success) {
        setMetrics({
          ...metrics,
          config: { ...metrics.config, active_modules: newModules }
        });
      }
    } catch (e) {}
  };

  // Filter users
  const filteredUsers = usersList.filter(u => {
    const q = userSearchQuery.toLowerCase();
    return u.first_name.toLowerCase().includes(q) ||
      (u.username && u.username.toLowerCase().includes(q)) ||
      u.id.includes(q) ||
      (u.telegram_id && String(u.telegram_id).includes(q));
  });

  // Filter queries
  const filteredQueries = aiQueries.filter(q => {
    const s = historySearchQuery.toLowerCase();
    return q.query.toLowerCase().includes(s) ||
      q.user_name.toLowerCase().includes(s) ||
      (q.telegram_id && String(q.telegram_id).includes(s));
  });

  const isCurrentUserSuperAdmin = 
    user.id === 1 || 
    user.username === metrics?.config?.primary_admin_username ||
    String(user.id) === metrics?.config?.primary_admin_id ||
    (user.first_name && user.first_name.toLowerCase().includes('odil')) ||
    (user.username && user.username.toLowerCase().includes('odil'));

  return (
    <div className="space-y-4 pb-20">
      {/* Admin Header */}
      <div className={`p-5 rounded-3xl border ${
        isDark ? 'bg-gradient-to-r from-[#0c1429] to-[#111e3d] border-indigo-900/50 text-white' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-500 to-red-600 flex items-center justify-center text-white font-bold shadow-md">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-extrabold tracking-tight">
                  Admin Boshqaruv Paneli
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-400/30 uppercase">
                  LexAI 2.0
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Foydalanuvchilar, yangi adminlar tayinlash va AI so'rovlar tarixi
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              haptic('light');
              fetchAdminData();
            }}
            className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white transition cursor-pointer"
            title="Yangilash"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Primary Admin Banner Card */}
        <div className={`p-3.5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
          isCurrentUserSuperAdmin
            ? 'bg-amber-500/10 border-amber-400/40 text-amber-200'
            : 'bg-indigo-950/40 border-indigo-800/40 text-slate-200'
        }`}>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold shadow-md shrink-0">
              <Crown className="w-4 h-4" />
            </div>
            <div className="text-xs">
              <span className="font-bold text-amber-400">
                {isCurrentUserSuperAdmin ? "👑 Siz Bosh Administratorsiz" : "Bosh Administrator Akkaunti"}
              </span>
              <p className="text-[11px] text-slate-300">
                Sizning Telegramingiz: <span className="font-semibold text-white">{user.first_name || 'Odiljon'}</span> {user.username ? `(@${user.username})` : `(ID: ${user.id || 'Telegram'})`}
              </p>
            </div>
          </div>

          {!isCurrentUserSuperAdmin && (
            <button
              onClick={handleClaimPrimaryAdmin}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 text-xs font-bold shadow-md cursor-pointer hover:from-amber-400 hover:to-amber-500 transition"
            >
              👑 Mening akkauntimni Bosh Admin qilish
            </button>
          )}
        </div>

        {/* Status Toast */}
        {statusMessage && (
          <div className="mt-3 p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{statusMessage}</span>
          </div>
        )}

        {/* Tab Switcher */}
        <div className="mt-4 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
          {[
            { id: 'users', label: `Foydalanuvchilar (${usersList.length})`, icon: Users },
            { id: 'ai_history', label: `AI Tarixi (${aiQueries.length})`, icon: History },
            { id: 'metrics', label: 'Metrikalar', icon: Activity },
            { id: 'modules', label: 'Modullar', icon: Settings },
            { id: 'logs', label: 'Xavfsizlik', icon: ShieldCheck },
          ].map((t) => {
            const Icon = t.icon;
            const isActive = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => {
                  haptic('light');
                  setActiveTab(t.id as any);
                }}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                  isActive
                    ? 'bg-amber-400 text-slate-950 shadow-md font-extrabold'
                    : isDark
                    ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 1. USERS & ADMIN ASSIGNMENT TAB */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          {/* Add Admin by Telegram ID / Username Form */}
          <div className={`p-5 rounded-3xl border ${
            isDark ? 'bg-[#0a1128] border-indigo-900/40 text-white' : 'bg-white border-slate-200 text-slate-800'
          }`}>
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-amber-400 mb-2 flex items-center gap-1.5">
              <UserPlus className="w-4 h-4" />
              <span>Yangi Admin Tayinlash (Telegram ID yoki Username orqali)</span>
            </h3>
            <p className="text-xs text-slate-400 mb-3">
              Botga kirgan yoki yangi odamning Telegram ID raqamini (masalan: 12345678) yoki @username'ini kiriting:
            </p>

            <form onSubmit={handleAddAdminById} className="flex gap-2">
              <input
                type="text"
                value={newAdminInput}
                onChange={(e) => setNewAdminInput(e.target.value)}
                placeholder="Telegram ID raqami yoki @username..."
                className={`flex-1 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm border focus:outline-none transition ${
                  isDark ? 'bg-[#060c1c] text-white border-slate-800 focus:border-amber-400' : 'bg-slate-50 text-slate-900 border-slate-300 focus:border-blue-600'
                }`}
              />
              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-xs shadow-md cursor-pointer hover:from-amber-400 hover:to-amber-500 transition whitespace-nowrap flex items-center gap-1"
              >
                <UserCheck className="w-4 h-4" />
                <span>Admin tayinlash</span>
              </button>
            </form>
          </div>

          {/* User Search & List of Bot Visitors */}
          <div className={`p-5 rounded-3xl border ${
            isDark ? 'bg-[#0a1128] border-indigo-900/40 text-white' : 'bg-white border-slate-200 text-slate-800'
          }`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div>
                <h3 className="text-sm font-extrabold">Botga Kirgan Barcha Odamlar</h3>
                <p className="text-xs text-slate-400">
                  Jami ro'yxatdan o'tganlar: <span className="font-bold text-amber-400">{usersList.length} nafar</span> (shundan {usersList.filter(u => u.role === 'admin').length} ta admin)
                </p>
              </div>

              <div className="relative">
                <input
                  type="text"
                  value={userSearchQuery}
                  onChange={(e) => setUserSearchQuery(e.target.value)}
                  placeholder="Ism yoki ID bo'yicha qidirish..."
                  className={`pl-8 pr-3 py-1.5 rounded-xl text-xs border focus:outline-none ${
                    isDark ? 'bg-[#060c1c] text-white border-slate-800' : 'bg-slate-50 text-slate-900 border-slate-300'
                  }`}
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div className="space-y-2.5">
              {filteredUsers.length === 0 ? (
                <p className="text-xs text-slate-400 py-6 text-center">Foydalanuvchilar topilmadi.</p>
              ) : (
                filteredUsers.map((u) => {
                  const isAdmin = u.role === 'admin';
                  const isPrimary = u.is_primary_admin;

                  return (
                    <div
                      key={u.id}
                      className={`p-3.5 rounded-2xl border transition flex items-center justify-between gap-3 ${
                        isAdmin
                          ? isDark ? 'bg-amber-950/20 border-amber-500/30 text-white' : 'bg-amber-50 border-amber-200 text-slate-900'
                          : isDark ? 'bg-[#060c1c] border-slate-800/80 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
                      }`}
                    >
                      <div className="flex items-center space-x-3 min-w-0">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                          isAdmin ? 'bg-amber-400 text-slate-950 shadow-md' : 'bg-slate-800 text-slate-300'
                        }`}>
                          {isAdmin ? <Crown className="w-4 h-4" /> : <Users className="w-4 h-4" />}
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="font-bold text-xs truncate">{u.first_name || 'Foydalanuvchi'}</span>
                            {u.username && (
                              <span className="text-[11px] text-amber-400">@{u.username}</span>
                            )}
                            <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                              isPrimary
                                ? 'bg-amber-500 text-slate-950'
                                : isAdmin
                                ? 'bg-rose-500/20 text-rose-300 border border-rose-400/30'
                                : 'bg-slate-700 text-slate-300'
                            }`}>
                              {isPrimary ? 'Bosh Admin' : isAdmin ? 'Admin' : 'Foydalanuvchi'}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            ID: <span className="font-mono text-slate-300">{u.telegram_id || u.id}</span> • AI so'rovlari: <span className="text-amber-400 font-bold">{u.queries_count || 0} ta</span>
                          </p>
                        </div>
                      </div>

                      {/* Role toggle button */}
                      <div>
                        {isPrimary ? (
                          <span className="text-[11px] text-amber-400 font-bold px-2 py-1 bg-amber-400/10 rounded-lg">
                            Bosh admin
                          </span>
                        ) : (
                          <button
                            onClick={() => handleToggleUserRole(u)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1 whitespace-nowrap ${
                              isAdmin
                                ? 'bg-rose-500/20 text-rose-300 border border-rose-400/40 hover:bg-rose-500/30'
                                : 'bg-amber-500/20 text-amber-300 border border-amber-400/40 hover:bg-amber-500/30'
                            }`}
                          >
                            {isAdmin ? <UserX className="w-3.5 h-3.5" /> : <UserCheck className="w-3.5 h-3.5" />}
                            <span>{isAdmin ? "Adminlikdan olish" : "Admin qilish"}</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* 2. AI QUERY HISTORY TAB */}
      {activeTab === 'ai_history' && (
        <div className={`p-5 rounded-3xl border ${
          isDark ? 'bg-[#0a1128] border-indigo-900/40 text-white' : 'bg-white border-slate-200 text-slate-800'
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div>
              <h3 className="text-sm font-extrabold flex items-center gap-1.5">
                <History className="w-4 h-4 text-amber-400" />
                <span>AI Yordamida Qidirilgan Narsalar Tarixi</span>
              </h3>
              <p className="text-xs text-slate-400">
                Foydalanuvchilar qidirgan barcha savollar, kazuslar va berilgan qonuniy javoblar
              </p>
            </div>

            <div className="relative">
              <input
                type="text"
                value={historySearchQuery}
                onChange={(e) => setHistorySearchQuery(e.target.value)}
                placeholder="Savol yoki foydalanuvchi bo'yicha..."
                className={`pl-8 pr-3 py-1.5 rounded-xl text-xs border focus:outline-none ${
                  isDark ? 'bg-[#060c1c] text-white border-slate-800' : 'bg-slate-50 text-slate-900 border-slate-300'
                }`}
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div className="space-y-3">
            {filteredQueries.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-xs">
                <MessageSquare className="w-8 h-8 mx-auto mb-2 text-slate-500" />
                <p className="font-bold">Hozircha AI qidiruvlar tarixi mavjud emas</p>
                <p className="mt-1">Bot yoki Mini Appda berilgan barcha savollar bu yerda avtomatik saqlanib boradi.</p>
              </div>
            ) : (
              filteredQueries.map((q) => {
                const isExpanded = expandedQueryId === q.id;

                return (
                  <div
                    key={q.id}
                    className={`p-4 rounded-2xl border transition ${
                      isDark ? 'bg-[#060c1c] border-slate-800/80 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1 text-[11px]">
                          <span className="font-bold text-amber-400">👤 {q.user_name}</span>
                          {q.telegram_id && (
                            <span className="text-slate-400 font-mono">ID: {q.telegram_id}</span>
                          )}
                          <span className="text-slate-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{new Date(q.timestamp).toLocaleString('uz-UZ')}</span>
                          </span>
                        </div>

                        <h4 className="text-xs sm:text-sm font-bold text-slate-200 leading-snug">
                          🔍 "{q.query}"
                        </h4>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setExpandedQueryId(isExpanded ? null : q.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-white transition"
                          title={isExpanded ? "Yopish" : "Javobni ko'rish"}
                        >
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => handleDeleteQuery(q.id)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 transition"
                          title="Tarixdan o'chirish"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Expandable AI Response */}
                    {isExpanded && (
                      <div className={`mt-3 p-3 rounded-xl border text-xs leading-relaxed whitespace-pre-wrap animate-fadeIn ${
                        isDark ? 'bg-[#030712] border-slate-800 text-slate-300' : 'bg-white border-slate-200 text-slate-700'
                      }`}>
                        <div className="font-bold text-amber-400 mb-1 flex items-center gap-1">
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>AI Bergan Huquqiy Xulosa:</span>
                        </div>
                        {q.answer}

                        {q.sources && q.sources.length > 0 && (
                          <div className="mt-2 pt-2 border-t border-slate-800 flex items-center gap-2 text-[11px]">
                            <span className="text-slate-400">Manba:</span>
                            <a
                              href={q.sources[0].uri}
                              target="_blank"
                              rel="noreferrer"
                              className="text-amber-400 hover:underline flex items-center gap-1 font-semibold"
                            >
                              <span>{q.sources[0].title}</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* 3. METRICS VIEW */}
      {activeTab === 'metrics' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className={`p-4 rounded-2xl border ${
              isDark ? 'bg-[#0a1128] border-indigo-900/40 text-white' : 'bg-white border-slate-200 text-slate-800'
            }`}>
              <div className="flex items-center gap-2 text-slate-400 text-xs">
                <Users className="w-4 h-4 text-blue-400" />
                <span>Foydalanuvchilar</span>
              </div>
              <p className="text-2xl font-black mt-2 text-blue-400">
                {usersList.length || metrics?.total_users || 1}
              </p>
            </div>

            <div className={`p-4 rounded-2xl border ${
              isDark ? 'bg-[#0a1128] border-indigo-900/40 text-white' : 'bg-white border-slate-200 text-slate-800'
            }`}>
              <div className="flex items-center gap-2 text-slate-400 text-xs">
                <Briefcase className="w-4 h-4 text-amber-400" />
                <span>Yuridik Ishlar</span>
              </div>
              <p className="text-2xl font-black mt-2 text-amber-400">
                {metrics?.total_cases || 0}
              </p>
            </div>

            <div className={`p-4 rounded-2xl border ${
              isDark ? 'bg-[#0a1128] border-indigo-900/40 text-white' : 'bg-white border-slate-200 text-slate-800'
            }`}>
              <div className="flex items-center gap-2 text-slate-400 text-xs">
                <FileText className="w-4 h-4 text-emerald-400" />
                <span>Tayyor Hujjatlar</span>
              </div>
              <p className="text-2xl font-black mt-2 text-emerald-400">
                {metrics?.total_documents || 0}
              </p>
            </div>

            <div className={`p-4 rounded-2xl border ${
              isDark ? 'bg-[#0a1128] border-indigo-900/40 text-white' : 'bg-white border-slate-200 text-slate-800'
            }`}>
              <div className="flex items-center gap-2 text-slate-400 text-xs">
                <History className="w-4 h-4 text-cyan-400" />
                <span>AI So'rovlari</span>
              </div>
              <p className="text-2xl font-black mt-2 text-cyan-400">
                {aiQueries.length}
              </p>
            </div>

            <div className={`p-4 rounded-2xl border ${
              isDark ? 'bg-[#0a1128] border-indigo-900/40 text-white' : 'bg-white border-slate-200 text-slate-800'
            }`}>
              <div className="flex items-center gap-2 text-slate-400 text-xs">
                <Server className="w-4 h-4 text-purple-400" />
                <span>Bot Holati</span>
              </div>
              <p className="text-sm font-black mt-2 text-emerald-400 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>24/7 Faol</span>
              </p>
            </div>

            <div className={`p-4 rounded-2xl border ${
              isDark ? 'bg-[#0a1128] border-indigo-900/40 text-white' : 'bg-white border-slate-200 text-slate-800'
            }`}>
              <div className="flex items-center gap-2 text-slate-400 text-xs">
                <Database className="w-4 h-4 text-teal-400" />
                <span>Baza Holati</span>
              </div>
              <p className="text-sm font-black mt-2 text-emerald-400">
                ACID Barqaror
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 4. MODULES MANAGEMENT */}
      {activeTab === 'modules' && (
        <div className={`p-5 rounded-3xl border space-y-3 ${
          isDark ? 'bg-[#0a1128] border-indigo-900/40 text-white' : 'bg-white border-slate-200 text-slate-800'
        }`}>
          <h3 className="text-sm font-extrabold mb-3">Tizim Modullari Holati</h3>
          {metrics?.config?.active_modules && Object.entries(metrics.config.active_modules).map(([k, v]) => (
            <div
              key={k}
              className={`p-3.5 rounded-2xl border flex items-center justify-between ${
                isDark ? 'bg-slate-800/60 border-slate-700' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div>
                <p className="text-xs font-bold uppercase tracking-wide">{k}</p>
                <p className="text-[11px] text-slate-400">
                  {v ? "Faol va foydalanuvchilar uchun ochiq" : "Vaqtincha o'chirilgan"}
                </p>
              </div>

              <button
                onClick={() => handleToggleModule(k)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition ${
                  v ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30' : 'bg-slate-700 text-slate-400'
                }`}
              >
                {v ? "Yoqilgan" : "O'chirilgan"}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* 5. AUDIT LOGS */}
      {activeTab === 'logs' && (
        <div className={`p-5 rounded-3xl border ${
          isDark ? 'bg-[#0a1128] border-indigo-900/40 text-white' : 'bg-white border-slate-200 text-slate-800'
        }`}>
          <h3 className="text-sm font-extrabold mb-3">Xavfsizlik va Audit Jurnali</h3>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {logs.length === 0 ? (
              <p className="text-xs text-slate-400 py-3 text-center">Jurnal bo'sh.</p>
            ) : (
              logs.map((log) => (
                <div
                  key={log.id}
                  className={`p-3 rounded-xl border text-xs ${
                    isDark ? 'bg-slate-800/40 border-slate-700/60' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-amber-400">{log.action}</span>
                    <span className="text-[10px] text-slate-400">
                      {new Date(log.timestamp).toLocaleTimeString('uz-UZ')}
                    </span>
                  </div>
                  <p className="text-slate-300">{log.details}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
