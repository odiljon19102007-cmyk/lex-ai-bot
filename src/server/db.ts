import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Data store path
const DATA_DIR = path.resolve(__dirname, '../../data_store');
const DB_FILE = path.join(DATA_DIR, 'lexai_database.json');

export interface UserRecord {
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

export interface AIQueryRecord {
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

export interface LegalCaseRecord {
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

export interface LegalDocumentRecord {
  id: string;
  user_id: string;
  case_id?: string;
  title: string;
  doc_type: string;
  party_a?: string;
  party_b?: string;
  content: string;
  legal_basis: string[];
  created_at: string;
  updated_at: string;
}

export interface CalculationRecord {
  id: string;
  user_id: string;
  calc_type: string;
  title: string;
  inputs: Record<string, any>;
  result: Record<string, any>;
  formula: string;
  legal_basis: string;
  created_at: string;
}

export interface AcademyProgressRecord {
  user_id: string;
  completed_lessons: string[];
  scores: {
    category: string;
    score: number;
    total: number;
    date: string;
  }[];
  total_xp: number;
  rank_title: string;
}

export interface AuditLogRecord {
  id: string;
  timestamp: string;
  action: string;
  actor_id: string;
  details: string;
}

export interface SystemConfig {
  bhm: number; // Bazaviy hisoblash miqdori (375,000 so'm amaldagi)
  mhekm: number; // Mehnatga haq to'lashning eng kam miqdori (1,155,000 so'm)
  active_modules: {
    ai: boolean;
    ocr: boolean;
    calculators: boolean;
    case_manager: boolean;
    academy: boolean;
    docs: boolean;
    lex: boolean;
  };
  primary_admin_id?: string;
  primary_admin_username?: string;
  version: string;
}

interface DatabaseSchema {
  users: UserRecord[];
  cases: LegalCaseRecord[];
  documents: LegalDocumentRecord[];
  calculations: CalculationRecord[];
  academy: AcademyProgressRecord[];
  audit_logs: AuditLogRecord[];
  ai_queries: AIQueryRecord[];
  config: SystemConfig;
}

const DEFAULT_DB: DatabaseSchema = {
  users: [
    {
      id: 'admin_master',
      telegram_id: 1,
      first_name: 'Bosh Administrator',
      username: 'admin',
      role: 'admin',
      is_primary_admin: true,
      queries_count: 0,
      created_at: new Date().toISOString(),
      last_active: new Date().toISOString()
    }
  ],
  ai_queries: [],
  cases: [
    {
      id: 'case_demo_1',
      user_id: 'default_user',
      title: 'Ish haqini undirish to\'g\'risida da\'vo',
      category: 'mehnat',
      status: 'in_progress',
      case_number: '2-1002/2026',
      court_name: 'Fuqarolik ishlari bo\'yicha Mirzo Ulug\'bek tumanlararo sudi',
      next_deadline: '2026-03-20',
      notes: 'Mehnat shartnomasi va bankdan oylik ko\'chirmasi ilova qilingan. 3 oylik maosh kechiktirilgan.',
      document_ids: ['doc_demo_1'],
      created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
      updated_at: new Date().toISOString()
    }
  ],
  documents: [
    {
      id: 'doc_demo_1',
      user_id: 'default_user',
      case_id: 'case_demo_1',
      title: 'Ish haqini undirish to\'g\'risida da\'vo arizasi',
      doc_type: 'da_vo',
      party_a: 'Alimov Alisher',
      party_b: '"Grand Logistic" MCHJ',
      content: 'Fuqarolik ishlari bo\'yicha tumanlararo sudiga\nDa\'vogar: Alimov Alisher\nJavobgar: "Grand Logistic" MCHJ\n\nDA\'VO ARIZASI\n(Ish haqini majburiy tartibda undirish to\'g\'risida)\n\nMen "Grand Logistic" MCHJda 2023-yil 1-fevraldan boshlab ekspeditor lavozimida ishlab kelganman. 2025-yil dekabr, 2026-yil yanvar va fevral oylari uchun jami 18,500,000 so\'m ish haqi to\'lanmadi.\n\nO\'zbekiston Respublikasi Mehnat kodeksining 253-moddasiga binoan, ish beruvchi ish haqini o\'z vaqtida to\'lashi shart.\n\nShuningdek, MK 333-moddasiga muvofiq, ish beruvchi ish haqini to\'lashni kechiktirgani uchun Markaziy bank qayta moliyalash stavkasi miqdorida kompensatsiya to\'lashi lozim.\n\nYuqoridagilarga asosan, sudidan:\n1. Javobgardan mening foydamga 18,500,000 so\'m asosiy ish haqi undirib berishingizni;\n2. Davlat bojidan ozod qilishingizni (Soliq kodeksi 329-modda) so\'rayman.',
      legal_basis: ['MK 253-modda', 'MK 333-modda', 'SK 329-modda'],
      created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
      updated_at: new Date().toISOString()
    }
  ],
  calculations: [
    {
      id: 'calc_demo_1',
      user_id: 'default_user',
      calc_type: 'aliment',
      title: '2 nafar farzand uchun aliment',
      inputs: { children: 2, income: 8000000 },
      result: { monthly_amount: 2666667, percentage: '33.3% (1/3)', minimum_per_child: 385000 },
      formula: 'Oila kodeksi 99-moddasi: 2 nafar bolaga daromadning 1/3 qismi',
      legal_basis: 'Oila kodeksi 99-modda',
      created_at: new Date(Date.now() - 86400000).toISOString()
    }
  ],
  academy: [
    {
      user_id: 'default_user',
      completed_lessons: ['mk_basics', 'fk_contracts'],
      scores: [
        { category: 'Mehnat huquqi', score: 90, total: 100, date: new Date().toISOString() }
      ],
      total_xp: 450,
      rank_title: 'Katta Yurist Maslahatchi'
    }
  ],
  audit_logs: [
    {
      id: 'log_init',
      timestamp: new Date().toISOString(),
      action: 'SYSTEM_START',
      actor_id: 'system',
      details: 'LexAI 2.0 Yagona Huquqiy AI Ekotizimi ishga tushirildi'
    }
  ],
  config: {
    bhm: 375000,
    mhekm: 1155000,
    active_modules: {
      ai: true,
      ocr: true,
      calculators: true,
      case_manager: true,
      academy: true,
      docs: true,
      lex: true
    },
    version: '2.0.0'
  }
};

class LexDatabase {
  private data: DatabaseSchema;

  constructor() {
    this.ensureDirectory();
    this.data = this.load();
  }

  private ensureDirectory() {
    if (!fs.existsSync(DATA_DIR)) {
      try {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      } catch (e) {
        console.warn('[DB] Failed to create data dir:', e);
      }
    }
  }

  private load(): DatabaseSchema {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        return {
          ...DEFAULT_DB,
          ...parsed,
          ai_queries: parsed.ai_queries || [],
          config: { ...DEFAULT_DB.config, ...(parsed.config || {}) }
        };
      }
    } catch (e) {
      console.warn('[DB] Could not load DB, falling back to default:', e);
    }
    this.save(DEFAULT_DB);
    return JSON.parse(JSON.stringify(DEFAULT_DB));
  }

  private save(dataToSave?: DatabaseSchema) {
    try {
      this.ensureDirectory();
      const content = JSON.stringify(dataToSave || this.data, null, 2);
      fs.writeFileSync(DB_FILE, content, 'utf-8');
    } catch (e) {
      console.error('[DB] Save error:', e);
    }
  }

  // User methods
  getUser(userId: string): UserRecord | undefined {
    return this.data.users.find(u => u.id === userId || (u.telegram_id && String(u.telegram_id) === userId));
  }

  upsertUser(user: Partial<UserRecord> & { id: string }): UserRecord {
    const existingIdx = this.data.users.findIndex(u => u.id === user.id || (user.telegram_id && u.telegram_id === user.telegram_id));
    const now = new Date().toISOString();

    const isCreatorAccount = 
      (user.username && user.username.toLowerCase().includes('odil')) ||
      (user.first_name && user.first_name.toLowerCase().includes('odil')) ||
      (this.data.config.primary_admin_id && (user.id === this.data.config.primary_admin_id || String(user.telegram_id) === this.data.config.primary_admin_id)) ||
      (this.data.config.primary_admin_username && user.username && user.username.toLowerCase() === this.data.config.primary_admin_username.toLowerCase()) ||
      user.id === 'admin_master';

    if (existingIdx >= 0) {
      const existing = this.data.users[existingIdx];
      const newRole = isCreatorAccount ? 'admin' : (user.role || existing.role || 'user');
      this.data.users[existingIdx] = {
        ...existing,
        ...user,
        role: newRole,
        is_primary_admin: isCreatorAccount ? true : existing.is_primary_admin,
        last_active: now
      };
      this.save();
      return this.data.users[existingIdx];
    } else {
      const newUser: UserRecord = {
        id: user.id,
        telegram_id: user.telegram_id,
        first_name: user.first_name || 'Foydalanuvchi',
        username: user.username,
        role: isCreatorAccount ? 'admin' : (user.role || 'user'),
        is_primary_admin: isCreatorAccount,
        queries_count: 0,
        created_at: now,
        last_active: now
      };
      this.data.users.push(newUser);
      this.save();
      return newUser;
    }
  }

  updateUserRole(userId: string, role: 'admin' | 'user'): UserRecord | null {
    const user = this.data.users.find(u => u.id === userId || (u.telegram_id && String(u.telegram_id) === userId));
    if (!user) return null;
    user.role = role;
    this.logAction('ROLE_CHANGE', 'admin', `Foydalanuvchi @${user.username || user.first_name} (ID: ${user.id}) roli "${role}" ga o'zgartirildi`);
    this.save();
    return user;
  }

  addAdminByIdentifier(identifier: string, name?: string): UserRecord {
    const cleanId = identifier.trim().replace(/^@/, '');
    let user = this.data.users.find(u => 
      u.id === cleanId || 
      (u.telegram_id && String(u.telegram_id) === cleanId) || 
      (u.username && u.username.toLowerCase() === cleanId.toLowerCase())
    );

    if (user) {
      user.role = 'admin';
      this.logAction('ASSIGN_ADMIN', 'admin', `Mavjud foydalanuvchiga adminlik berildi: @${user.username || user.first_name} (${user.id})`);
    } else {
      const isNumeric = /^\d+$/.test(cleanId);
      user = {
        id: isNumeric ? cleanId : `user_${Date.now()}`,
        telegram_id: isNumeric ? parseInt(cleanId, 10) : undefined,
        first_name: name || (isNumeric ? `Telegram Foydalanuvchi (${cleanId})` : cleanId),
        username: isNumeric ? undefined : cleanId,
        role: 'admin',
        queries_count: 0,
        created_at: new Date().toISOString(),
        last_active: new Date().toISOString()
      };
      this.data.users.push(user);
      this.logAction('ASSIGN_ADMIN', 'admin', `Yangi admin tayinlandi: ${identifier}`);
    }
    this.save();
    return user;
  }

  setPrimaryAdmin(identifier: string): void {
    const clean = identifier.trim().replace(/^@/, '');
    const isNum = /^\d+$/.test(clean);
    if (isNum) {
      this.data.config.primary_admin_id = clean;
    } else {
      this.data.config.primary_admin_username = clean;
    }
    this.addAdminByIdentifier(clean);
    this.save();
  }

  // AI Queries History methods
  saveAIQuery(queryData: {
    user_id: string;
    telegram_id?: number;
    user_name: string;
    query: string;
    answer: string;
    sources: { title: string; uri: string }[];
    law_status: string;
  }): AIQueryRecord {
    const newQuery: AIQueryRecord = {
      id: `aiq_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      ...queryData,
      timestamp: new Date().toISOString()
    };
    if (!this.data.ai_queries) this.data.ai_queries = [];
    this.data.ai_queries.unshift(newQuery);

    if (this.data.ai_queries.length > 1000) {
      this.data.ai_queries = this.data.ai_queries.slice(0, 1000);
    }

    const user = this.getUser(queryData.user_id);
    if (user) {
      user.queries_count = (user.queries_count || 0) + 1;
    }

    this.save();
    return newQuery;
  }

  getAIQueries(userId?: string): AIQueryRecord[] {
    if (!this.data.ai_queries) this.data.ai_queries = [];
    if (userId && userId !== 'all') {
      return this.data.ai_queries.filter(q => q.user_id === userId || (q.telegram_id && String(q.telegram_id) === userId));
    }
    return this.data.ai_queries;
  }

  deleteAIQuery(queryId: string, userId?: string): boolean {
    if (!this.data.ai_queries) return false;
    const idx = this.data.ai_queries.findIndex(q => q.id === queryId && (!userId || q.user_id === userId || userId === 'admin_master'));
    if (idx === -1) return false;
    this.data.ai_queries.splice(idx, 1);
    this.save();
    return true;
  }

  getAllUsers(): UserRecord[] {
    return this.data.users;
  }

  // Cases methods
  getCases(userId: string): LegalCaseRecord[] {
    return this.data.cases.filter(c => c.user_id === userId || c.user_id === 'default_user');
  }

  getCaseById(id: string): LegalCaseRecord | undefined {
    return this.data.cases.find(c => c.id === id);
  }

  createCase(caseData: Omit<LegalCaseRecord, 'id' | 'created_at' | 'updated_at'>): LegalCaseRecord {
    const now = new Date().toISOString();
    const newCase: LegalCaseRecord = {
      id: `case_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      ...caseData,
      created_at: now,
      updated_at: now
    };
    this.data.cases.unshift(newCase);
    this.logAction('CREATE_CASE', caseData.user_id, `Yangi ish ochildi: "${newCase.title}"`);
    this.save();
    return newCase;
  }

  updateCase(id: string, updates: Partial<LegalCaseRecord>): LegalCaseRecord | null {
    const idx = this.data.cases.findIndex(c => c.id === id);
    if (idx === -1) return null;
    this.data.cases[idx] = {
      ...this.data.cases[idx],
      ...updates,
      updated_at: new Date().toISOString()
    };
    this.save();
    return this.data.cases[idx];
  }

  deleteCase(id: string, userId: string): boolean {
    const idx = this.data.cases.findIndex(c => c.id === id && (c.user_id === userId || userId === 'admin_master'));
    if (idx === -1) return false;
    this.data.cases.splice(idx, 1);
    this.save();
    return true;
  }

  // Documents methods
  getDocuments(userId: string): LegalDocumentRecord[] {
    return this.data.documents.filter(d => d.user_id === userId || d.user_id === 'default_user');
  }

  getDocumentById(id: string): LegalDocumentRecord | undefined {
    return this.data.documents.find(d => d.id === id);
  }

  createDocument(doc: Omit<LegalDocumentRecord, 'id' | 'created_at' | 'updated_at'>): LegalDocumentRecord {
    const now = new Date().toISOString();
    const newDoc: LegalDocumentRecord = {
      id: `doc_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      ...doc,
      created_at: now,
      updated_at: now
    };
    this.data.documents.unshift(newDoc);
    if (doc.case_id) {
      const parentCase = this.getCaseById(doc.case_id);
      if (parentCase && !parentCase.document_ids.includes(newDoc.id)) {
        parentCase.document_ids.push(newDoc.id);
        this.updateCase(parentCase.id, { document_ids: parentCase.document_ids });
      }
    }
    this.logAction('CREATE_DOC', doc.user_id, `Yangi hujjat yaratildi: "${newDoc.title}"`);
    this.save();
    return newDoc;
  }

  updateDocument(id: string, updates: Partial<LegalDocumentRecord>): LegalDocumentRecord | null {
    const idx = this.data.documents.findIndex(d => d.id === id);
    if (idx === -1) return null;
    this.data.documents[idx] = {
      ...this.data.documents[idx],
      ...updates,
      updated_at: new Date().toISOString()
    };
    this.save();
    return this.data.documents[idx];
  }

  deleteDocument(id: string, userId: string): boolean {
    const idx = this.data.documents.findIndex(d => d.id === id && (d.user_id === userId || userId === 'admin_master'));
    if (idx === -1) return false;
    this.data.documents.splice(idx, 1);
    this.save();
    return true;
  }

  // Calculations
  getCalculations(userId: string): CalculationRecord[] {
    return this.data.calculations.filter(c => c.user_id === userId || c.user_id === 'default_user');
  }

  saveCalculation(calc: Omit<CalculationRecord, 'id' | 'created_at'>): CalculationRecord {
    const newCalc: CalculationRecord = {
      id: `calc_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      ...calc,
      created_at: new Date().toISOString()
    };
    this.data.calculations.unshift(newCalc);
    this.save();
    return newCalc;
  }

  // Academy progress
  getAcademyProgress(userId: string): AcademyProgressRecord {
    let progress = this.data.academy.find(a => a.user_id === userId);
    if (!progress) {
      progress = {
        user_id: userId,
        completed_lessons: [],
        scores: [],
        total_xp: 0,
        rank_title: 'Boshlang\'ich O\'quvchi'
      };
      this.data.academy.push(progress);
      this.save();
    }
    return progress;
  }

  recordAcademyQuiz(userId: string, category: string, score: number, total: number): AcademyProgressRecord {
    const progress = this.getAcademyProgress(userId);
    const addedXP = score * 10;
    progress.total_xp += addedXP;
    progress.scores.push({
      category,
      score,
      total,
      date: new Date().toISOString()
    });

    if (progress.total_xp >= 1000) {
      progress.rank_title = 'Oliy Sud Eksperti';
    } else if (progress.total_xp >= 500) {
      progress.rank_title = 'Katta Yurist Maslahatchi';
    } else if (progress.total_xp >= 200) {
      progress.rank_title = 'Huquqshunos Amaliyotchi';
    }

    this.save();
    return progress;
  }

  getAcademyLeaderboard(): { user_name: string; xp: number; rank_title: string }[] {
    return this.data.academy
      .map(a => {
        const user = this.getUser(a.user_id);
        return {
          user_name: user?.first_name || 'Yurist Foydalanuvchi',
          xp: a.total_xp,
          rank_title: a.rank_title
        };
      })
      .sort((a, b) => b.xp - a.xp)
      .slice(0, 10);
  }

  // Logs & Admin
  logAction(action: string, actorId: string, details: string) {
    const log: AuditLogRecord = {
      id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
      timestamp: new Date().toISOString(),
      action,
      actor_id: actorId,
      details
    };
    this.data.audit_logs.unshift(log);
    if (this.data.audit_logs.length > 500) {
      this.data.audit_logs = this.data.audit_logs.slice(0, 500);
    }
    this.save();
  }

  getAuditLogs(limit = 100): AuditLogRecord[] {
    return this.data.audit_logs.slice(0, limit);
  }

  getConfig(): SystemConfig {
    return this.data.config;
  }

  updateConfig(updates: Partial<SystemConfig>): SystemConfig {
    this.data.config = {
      ...this.data.config,
      ...updates
    };
    this.save();
    return this.data.config;
  }

  getMetrics() {
    return {
      total_users: this.data.users.length,
      total_cases: this.data.cases.length,
      total_documents: this.data.documents.length,
      total_calculations: this.data.calculations.length,
      total_academy_students: this.data.academy.length,
      total_logs: this.data.audit_logs.length,
      config: this.data.config
    };
  }
}

export const db = new LexDatabase();
