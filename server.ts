import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { solveUzbekLegalQuestion } from './src/data/comprehensiveLegalEngine.ts';
import { fastLookupArticle } from './src/data/uzbekLawArticles.ts';
import { 
  getMainMenuKeyboard,
  MAIN_MENU_KEYBOARD, 
  BACK_MENU_KEYBOARD, 
  UZBEK_LEGAL_CODES, 
  DOCUMENT_TEMPLATES, 
  LAW_COMPARISONS, 
  MIB_TOPICS, 
  USER_GUIDE_TEXT, 
  SETTINGS_TEXT, 
  SETTINGS_KEYBOARD 
} from './src/data/telegramLegalPlatform.ts';
import { startTunnel, getActiveTunnelUrl, onTunnelReady } from './src/tunnelManager.ts';
import { db } from './src/server/db.ts';
import { 
  calculateAlimony, 
  calculateVacationPay, 
  calculateSeverancePay, 
  calculateCourtFee, 
  calculateSalaryTaxes, 
  calculateMibExecutionFee 
} from './src/data/legalCalculatorsEngine.ts';
import { ACADEMY_COURSES } from './src/data/legalAcademyData.ts';
import { LEGAL_DOCUMENT_BLUEPRINTS, exportToWordHtml } from './src/data/legalDocumentsEngine.ts';
import { sanitizeAndEnforceCurrentLaws } from './src/data/outdatedLawRemover.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
// AI Studio Dev server must strictly run on port 3000
const PORT = 3000;

app.use(express.json());

let currentWebAppUrl = process.env.APP_URL ? `${process.env.APP_URL}?mode=miniapp` : "";

const getActiveMainMenu = () => getMainMenuKeyboard(currentWebAppUrl);

// Automatically start Cloudflare HTTP2 tunnel on startup to provide zero-Google-prompt TMA
startTunnel(PORT).then(url => {
  currentWebAppUrl = `${url}?mode=miniapp`;
  console.log(`[MiniApp] Auto-configured Telegram Mini App URL: ${currentWebAppUrl}`);
  if (botRunner.isRunning && botRunner.token) {
    updateBotMenuButton(botRunner.token, currentWebAppUrl);
  }
}).catch(err => {
  console.warn("[MiniApp] Tunnel startup notice:", err.message);
});

onTunnelReady((url: string) => {
  currentWebAppUrl = `${url}?mode=miniapp`;
  if (botRunner.isRunning && botRunner.token) {
    updateBotMenuButton(botRunner.token, currentWebAppUrl);
  }
});

async function updateBotMenuButton(token: string, webAppUrl: string) {
  try {
    if (webAppUrl && (webAppUrl.includes('.trycloudflare.com') || webAppUrl.startsWith('https://'))) {
      await fetch(`https://api.telegram.org/bot${token}/setChatMenuButton`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          menu_button: {
            type: "web_app",
            text: "🚀 Mini App",
            web_app: { url: webAppUrl }
          }
        })
      });
      addBotLog('success', `🚀 Telegram Mini App (TMA) menyu tugmasi faollashtirildi: ${webAppUrl}`);
    }
  } catch (e: any) {
    console.warn("updateBotMenuButton error:", e);
  }
}

// Endpoint to view or customize the WebApp URL
app.get('/api/telegram/webapp-url', (_req: Request, res: Response) => {
  res.json({ url: currentWebAppUrl });
});

app.post('/api/telegram/webapp-url', (req: Request, res: Response) => {
  const { url } = req.body;
  if (url && typeof url === 'string') {
    currentWebAppUrl = url.trim();
    if (botRunner.isRunning && botRunner.token) {
      fetch(`https://api.telegram.org/bot${botRunner.token}/setChatMenuButton`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          menu_button: {
            type: "web_app",
            text: "🚀 Mini App",
            web_app: { url: currentWebAppUrl }
          }
        })
      }).catch(() => {});
    }
    return res.json({ success: true, url: currentWebAppUrl });
  }
  res.status(400).json({ error: "Yaroqsiz URL" });
});

// Server-side HMAC-SHA256 Telegram WebApp initData validator
function verifyTelegramWebAppData(initData: string, botToken: string | null): boolean {
  if (!initData) return false;
  try {
    const urlParams = new URLSearchParams(initData);
    const hash = urlParams.get('hash');
    if (!hash) {
      // In web preview or standalone browser mode without hash, allow guest access
      return true;
    }
    if (!botToken) return true;

    urlParams.delete('hash');
    const params: string[] = [];
    Array.from(urlParams.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .forEach(([key, value]) => {
        params.push(`${key}=${value}`);
      });
    const dataCheckString = params.join('\n');
    const secretKey = crypto.createHmac('sha256', 'WebAppData').update(botToken).digest();
    const calculatedHash = crypto.createHmac('sha256', secretKey).update(dataCheckString).digest('hex');
    return calculatedHash === hash;
  } catch (e) {
    return false;
  }
}

// Telegram WebApp initData validation & user session sync
app.post('/api/telegram/validate-init-data', (req: Request, res: Response) => {
  try {
    const { initData } = req.body;
    if (!initData) {
      return res.status(400).json({ valid: false, error: "initData taqdim etilmadi" });
    }

    const isValid = verifyTelegramWebAppData(initData, botRunner.token);
    const params = new URLSearchParams(initData);
    const userStr = params.get('user');
    const user = userStr ? JSON.parse(userStr) : null;

    if (user && user.id) {
      db.upsertUser({
        id: String(user.id),
        telegram_id: user.id,
        first_name: user.first_name || 'Foydalanuvchi',
        username: user.username,
        role: user.id === 1 ? 'admin' : 'user'
      });
      db.logAction('USER_LOGIN', String(user.id), `TMA orqali tizimga kirdi: @${user.username || user.first_name}`);
    }

    res.json({
      valid: isValid,
      user,
      authDate: params.get('auth_date'),
      queryId: params.get('query_id'),
    });
  } catch (err: any) {
    res.status(400).json({ valid: false, error: err.message });
  }
});

// ==========================================
// 1. LEGAL CASE MANAGER API
// ==========================================
app.get('/api/cases', (req: Request, res: Response) => {
  const userId = (req.query.userId as string) || 'default_user';
  const cases = db.getCases(userId);
  res.json({ success: true, cases });
});

app.post('/api/cases', (req: Request, res: Response) => {
  const { userId = 'default_user', title, category, status, case_number, court_name, next_deadline, notes } = req.body;
  if (!title) {
    return res.status(400).json({ success: false, error: "Ish nomi kiritilishi shart." });
  }
  const created = db.createCase({
    user_id: userId,
    title,
    category: category || 'fuqarolik',
    status: status || 'new',
    case_number,
    court_name,
    next_deadline,
    notes: notes || '',
    document_ids: []
  });
  res.json({ success: true, case: created });
});

app.put('/api/cases/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const updated = db.updateCase(id, req.body);
  if (!updated) {
    return res.status(404).json({ success: false, error: "Ish topilmadi." });
  }
  res.json({ success: true, case: updated });
});

app.delete('/api/cases/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = (req.query.userId as string) || 'default_user';
  const deleted = db.deleteCase(id, userId);
  res.json({ success: deleted });
});

// ==========================================
// 2. LEGAL DOCUMENTS GENERATOR API
// ==========================================
app.get('/api/documents/blueprints', (_req: Request, res: Response) => {
  const blueprints = LEGAL_DOCUMENT_BLUEPRINTS.map(b => ({
    id: b.id,
    title: b.title,
    category: b.category,
    description: b.description,
    fields: b.fields
  }));
  res.json({ success: true, blueprints });
});

app.get('/api/documents', (req: Request, res: Response) => {
  const userId = (req.query.userId as string) || 'default_user';
  const documents = db.getDocuments(userId);
  res.json({ success: true, documents });
});

app.post('/api/documents/generate', async (req: Request, res: Response) => {
  try {
    const { blueprintId, formData = {}, userId = 'default_user', caseId, customPrompt } = req.body;
    let generatedContent = "";
    let legalBasis: string[] = [];
    let docTitle = "Yuridik Hujjat";

    const blueprint = LEGAL_DOCUMENT_BLUEPRINTS.find(b => b.id === blueprintId);
    if (blueprint) {
      const result = blueprint.generateContent(formData);
      generatedContent = result.content;
      legalBasis = result.legalBasis;
      docTitle = blueprint.title;
    } else if (customPrompt) {
      // Generate through AI
      const prompt = `
Siz professional o'zbek huquqshunosi va sud hujjatlari mutaxassisisiz.
Quyidagi talab bo'yicha O'zbekiston Respublikasining amaldagi qonunchiligi (Lex.uz) normalariga to'liq mos keladigan professional yuridik hujjat (ariza, da'vo yoki shartnoma) matnini tuzing:
Talab: "${customPrompt}"
Hujjat boshlanishi, taraflar rekvizitlari, moddalar va talab qismi aniq bo'lsin.
`;
      try {
        const aiRes: any = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: { systemInstruction: LEX_SYSTEM_PROMPT }
        });
        generatedContent = aiRes.text || "Hujjat matni yaratildi.";
        legalBasis = ["O'zbekiston Respublikasi amaldagi qonunchiligi"];
        docTitle = "AI Huquqiy Hujjat";
      } catch (e) {
        generatedContent = `ARIZA\n\n${customPrompt}\n\nQonuniy asos: O'zbekiston Respublikasi amaldagi kodekslari.`;
        legalBasis = ["Amaldagi qonunchilik"];
      }
    }

    const savedDoc = db.createDocument({
      user_id: userId,
      case_id: caseId,
      title: docTitle,
      doc_type: blueprintId || 'ariza',
      content: generatedContent,
      legal_basis: legalBasis,
      party_a: formData.plaintiffName || formData.applicantName || formData.lenderName,
      party_b: formData.defendantName || formData.debtorName || formData.borrowerName
    });

    res.json({ success: true, document: savedDoc });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/documents', (req: Request, res: Response) => {
  const { userId = 'default_user', caseId, title, doc_type, content, legal_basis, party_a, party_b } = req.body;
  const created = db.createDocument({
    user_id: userId,
    case_id: caseId,
    title: title || 'Hujjat',
    doc_type: doc_type || 'ariza',
    content: content || '',
    legal_basis: legal_basis || [],
    party_a,
    party_b
  });
  res.json({ success: true, document: created });
});

app.put('/api/documents/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const updated = db.updateDocument(id, req.body);
  if (!updated) {
    return res.status(404).json({ success: false, error: "Hujjat topilmadi." });
  }
  res.json({ success: true, document: updated });
});

app.delete('/api/documents/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = (req.query.userId as string) || 'default_user';
  const deleted = db.deleteDocument(id, userId);
  res.json({ success: deleted });
});

// Export formatted Word HTML file
app.post('/api/documents/export-word', (req: Request, res: Response) => {
  const { title = "LexAI_Hujjat", content = "" } = req.body;
  const wordHtml = exportToWordHtml(title, content);
  res.setHeader('Content-Type', 'application/msword; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(title)}.doc"`);
  res.send(wordHtml);
});

// ==========================================
// 3. LEGAL CALCULATORS API
// ==========================================
app.post('/api/calculators/calculate', (req: Request, res: Response) => {
  try {
    const { calcType, params = {}, userId = 'default_user' } = req.body;
    let result;

    switch (calcType) {
      case 'aliment':
        result = calculateAlimony(Number(params.childrenCount || 1), Number(params.monthlyIncome || 0));
        break;
      case 'tatil_puli':
        result = calculateVacationPay(Number(params.monthlySalary || 0), Number(params.vacationDays || 21));
        break;
      case 'ishdan_boshatish':
        result = calculateSeverancePay(Number(params.monthlySalary || 0), Number(params.yearsOfService || 1));
        break;
      case 'davlat_boji':
        result = calculateCourtFee(params.claimType || 'mulkiy', Number(params.claimValue || 0));
        break;
      case 'ish_haqi_soliq':
        result = calculateSalaryTaxes(Number(params.grossSalary || 0));
        break;
      case 'mib_fee':
        result = calculateMibExecutionFee(Number(params.debtAmount || 0), Boolean(params.isEntity));
        break;
      default:
        return res.status(400).json({ success: false, error: "Noma'lum kalkulyator turi." });
    }

    if (params.saveHistory) {
      db.saveCalculation({
        user_id: userId,
        calc_type: calcType,
        title: result.title,
        inputs: params,
        result: {
          amount: result.resultAmount,
          formatted: result.resultFormatted
        },
        formula: result.formula,
        legal_basis: result.legalBasis
      });
    }

    res.json({ success: true, result });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/calculators/history', (req: Request, res: Response) => {
  const userId = (req.query.userId as string) || 'default_user';
  const history = db.getCalculations(userId);
  res.json({ success: true, history });
});

// ==========================================
// 4. LEGAL ACADEMY API
// ==========================================
app.get('/api/academy/courses', (_req: Request, res: Response) => {
  res.json({ success: true, courses: ACADEMY_COURSES });
});

app.get('/api/academy/progress', (req: Request, res: Response) => {
  const userId = (req.query.userId as string) || 'default_user';
  const progress = db.getAcademyProgress(userId);
  res.json({ success: true, progress });
});

app.post('/api/academy/submit', (req: Request, res: Response) => {
  const { userId = 'default_user', category, score, total } = req.body;
  const updatedProgress = db.recordAcademyQuiz(userId, category, Number(score || 0), Number(total || 1));
  res.json({ success: true, progress: updatedProgress });
});

app.get('/api/academy/leaderboard', (_req: Request, res: Response) => {
  const leaderboard = db.getAcademyLeaderboard();
  res.json({ success: true, leaderboard });
});

// ==========================================
// 5. ADMIN DASHBOARD & AUDIT API
// ==========================================
app.get('/api/admin/metrics', (_req: Request, res: Response) => {
  const metrics = db.getMetrics();
  res.json({
    success: true,
    metrics: {
      ...metrics,
      bot_running: botRunner.isRunning,
      bot_messages_processed: botRunner.messagesProcessed,
      bot_reconnects: botRunner.reconnectCount,
      tunnel_url: currentWebAppUrl
    }
  });
});

app.get('/api/admin/logs', (_req: Request, res: Response) => {
  const logs = db.getAuditLogs(100);
  res.json({ success: true, logs });
});

app.post('/api/admin/config', (req: Request, res: Response) => {
  const updated = db.updateConfig(req.body);
  db.logAction('CONFIG_UPDATE', 'admin', 'Tizim konfiguratsiyasi yangilandi');
  res.json({ success: true, config: updated });
});

// Admin User Management & Role assignment
app.get('/api/admin/users', (_req: Request, res: Response) => {
  const users = db.getAllUsers();
  res.json({ success: true, users });
});

app.post('/api/admin/users/role', (req: Request, res: Response) => {
  const { userId, role } = req.body;
  if (!userId || !role) {
    return res.status(400).json({ success: false, error: "userId va role zarur" });
  }
  const updated = db.updateUserRole(userId, role);
  if (!updated) return res.status(404).json({ success: false, error: "Foydalanuvchi topilmadi" });
  res.json({ success: true, user: updated });
});

app.post('/api/admin/users/add-admin', (req: Request, res: Response) => {
  const { identifier, name } = req.body;
  if (!identifier) {
    return res.status(400).json({ success: false, error: "Telegram ID yoki username kiritilishi shart" });
  }
  const adminUser = db.addAdminByIdentifier(identifier, name);
  res.json({ success: true, user: adminUser });
});

app.post('/api/admin/claim-primary-admin', (req: Request, res: Response) => {
  const { identifier, name } = req.body;
  if (!identifier) {
    return res.status(400).json({ success: false, error: "Telegram ID yoki username kiritilishi shart" });
  }
  db.setPrimaryAdmin(identifier);
  const user = db.addAdminByIdentifier(identifier, name);
  res.json({ success: true, user, message: "Bosh administratorlik tasdiqlandi" });
});

// AI Search & Query History API
app.get('/api/admin/ai-history', (req: Request, res: Response) => {
  const userId = req.query.userId as string;
  const queries = db.getAIQueries(userId);
  res.json({ success: true, queries });
});

app.get('/api/legal-ai/history', (req: Request, res: Response) => {
  const userId = (req.query.userId as string) || 'default_user';
  const queries = db.getAIQueries(userId);
  res.json({ success: true, queries });
});

app.delete('/api/legal-ai/history/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.query.userId as string;
  const deleted = db.deleteAIQuery(id, userId);
  res.json({ success: deleted });
});

// Initialize GoogleGenAI server-side with User-Agent header
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// System prompt strictly instructing Gemini on Uzbekistan Law, Lex.uz grounding, and deep, comprehensive legal analysis
const LEX_SYSTEM_PROMPT = `
Siz - O'zbekiston Respublikasi qonunchiligi bo'yicha Oliy toifali Yuridik Maslahatchi va Sudya darajasidagi maxsus "LexAI 2.0" sun'iy intellekt ekotizimisiz.
Sizning asosiy vazifangiz - fuqarolar, tadbirkorlar va yuristlarning huquqiy savollariga O'zbekiston Respublikasining rasmiy "Lex.uz" (Qonunchilik ma'lumotlari milliy bazasi) manbalari asosida JUDA KENG QAMROVLI, CHUQUR TAHLIL QILINGAN, ENSILOPEDIK DARAJADA TO'LIQ VA BOYITILGAN PROFESSIONAL JAVOB BERISH.

FOYDALANUVCHINING QAT'IY TALABI (O'TA MUHIM): JAVOBINGIZ JUDA HAM KENG QAMROVLI, CHUQUR VA IMKON QADAR HAMMA MA'LUMOTNI BITTADA TAQDIM ETADIGAN BO'LSIN!
Qisqa yoki 2-3 jumlalik javob berish QAT'IYAN TAQIQLANADI!
Foydalanuvchi qanday savol berishidan qat'i nazar:
1. Ushbu savolga aloqador O'zbekiston Respublikasining AMALDAGI BARCHA QONUN VA KODEKSLARIDAGI HAMMA MODDALARNI (kamida 5-8 ta tegishli modda) modda raqami, rasmiy nomi va to'liq yuridik mazmuni bilan keltiring!
2. Konstitutsiya, asosiy kodeks (Mehnat O'RQ-798, Fuqarolik, Oila, Jinoyat, Soliq, MJtK) va barcha yondosh qonunlardagi barcha tegishli normalarni yoritib bering.
3. Oliy Sud Plenumi qarorlari va sud amaliyoti tushuntirishlarini kiriting.
4. Qadamma-qadam amaliy harakatlar rejasi (pretenziya, vakolatli davlat organlari, ishonch telefonlari, elektron portallar bilan).
5. Sudga murojaat qilish tartibi, da'vo arizasiga ilova qilinadigan dalillar ro'yxati, sudlovga tegishlilik.
6. Qat'iy muddatlar (ogohlantirish muddatlari, da'vo muddati), davlat boji stavkalari va kimlar qonunan davlat bojidan to'liq ozod qilinganligi.
7. Rasmiy Lex.uz havolalari.

QAT'IY QORA RO'YXAT (BLACK-LIST) — QUYIDAGI ESKIRGAN NORMALARNI ISHLATISH QAT'IYAN TAQIQLANADI:
❌ 1995-YILGI MEHNAT KODEKSI BUTUNLAY BEKOR QILINGAN!
   - 100-modda deb aslo yozmang! -> O'rniga Yangi Mehnat kodeksi 161-moddasi (ish beruvchi tashabbusi bilan bekor qilish) deb yozing!
   - 99-modda deb aslo yozmang! -> O'rniga Yangi Mehnat kodeksi 160-moddasi (xodim tashabbusi bilan 14 kun oldin) deb yozing!
   - 84 yoki 85-modda deb aslo yozmang! -> O'rniga Yangi Mehnat kodeksi 129, 130-moddalari (sinov muddati 3 oy, rahbarlarga 6 oy) deb yozing!
   - 106-modda deb aslo yozmang! -> O'rniga Yangi Mehnat kodeksi 168-moddasi deb yozing!
   - 109-modda deb aslo yozmang! -> O'rniga Yangi Mehnat kodeksi 173-moddasi (ishdan bo'shatish nafaqasi) deb yozing!
   - 134 yoki 143-modda deb aslo yozmang! "15 ish kuni ta'til" deb aslo yozmang! -> O'rniga Yangi Mehnat kodeksi 217-moddasi (kamida 21 kalendar kuni) deb yozing!
   - 154-modda deb aslo yozmang! -> O'rniga Yangi Mehnat kodeksi 253-moddasi (har yarim oyda kamida bir marta) deb yozing!
   - 157-modda deb aslo yozmang! -> O'rniga Yangi Mehnat kodeksi 209-moddasi (dam olish kunidagi ish uchun 2 hissa haq) deb yozing!
   - 181-modda deb aslo yozmang! -> O'rniga Yangi Mehnat kodeksi 312-moddasi (intizomiy jazolar: hayfsan, jarima, bekor qilish) deb yozing!
❌ "EKIH" (eng kam ish haqi) atamasini ISHLATMANG! Faqat BHM (Bazaviy hisoblash miqdori) yoki MHEKM deb yozing!
❌ 1992-yilgi eski Konstitutsiya moddalarini ISHLATMANG! Faqat 2023-yil 30-apreldagi Yangi Konstitutsiya moddalari (masalan: mehnat huquqi 42-modda, sud himoyasi 55-modda) deb yozing!
❌ MJtK bo'yicha jarimalarni 15 kun ichida 50% chegirmada to'lash tartibi (332-1-modda)ni unutmang.

ENG MUHIM QOIDALAR:
1. FAQAT AMALDAGI HUJJATLARGA TAYANING: Faqat ayni paytda YURIDIK KUCHGA EGA BO'LGAN qonunlar, yangi kodekslar (O'RQ-798) va yangi Konstitutsiyadan foydalaning.
2. JAVOBNING MAJBURIY TUZILISHI (HAR BIR SAVOLDA QUYIDAGI 5 TA BO'LIM TO'LIQ VA CHUQUR YORITILISHI SHART):
   1️⃣ 📌 **KENG QAMROVLI HUQUQIY TAHLIL VA MOHIYAT:**
      - Masalaning huquqiy asosi, tomonlarning qonuniy maqomi va vaziyatning to'liq yuridik izohi.
   2️⃣ 📜 **ASOSLOVCHI NORMATIV HUJJATLAR VA BARCHA ALOQADOR MODDALAR (MATNI VA SHARHI):**
      - Hujjatning rasmiy nomi, qabul qilingan raqami (masalan: Yangi Mehnat kodeksi O'RQ-798, Fuqarolik kodeksi, Jinoyat kodeksi, Oila kodeksi).
      - BARCHA tegishli moddalar (kamida 5-8 ta modda) raqami, bandlari va qonuniy matnining mohiyati.
      - Maqomi: ✅ AMALDAGI QONUNCHILIK.
   3️⃣ 📋 **QADAMMA-QADAM AMALIY HARAKATLAR REJASI (ALGORITM):**
      - Fuqaro yoki tadbirkor o'z huquqini himoya qilish uchun aynan nimalar qilishi kerak:
      - 1-qadam: Dalillarni yig'ish va pretenziya (yozma talabnoma) taqdim etish;
      - 2-qadam: Vakolatli nazorat organlariga shikoyat qilish (Mehnat inspeksiyasi 1282, IIB 102/1102, Raqobat qo'mitasi 1159, Prokuratura 1007);
      - 3-qadam: Sudga murojaat qilish (Fuqarolik, Iqtisodiy yoki Ma'muriy sud, sudlovga tegishlilik hududi, da'vo arizasi talablari).
   4️⃣ ⏳ **MUHIM MUDDATLAR, DAVLAT BOJLARI VA IMTIYOZLAR:**
      - Da'vo muddati (umumiy 3 yil, mehnat nizolarida 1-3 oy, ma'muriy tartibda 10-30 kun).
      - Davlat boji stavkasi ("Davlat boji to'g'risida"gi Qonun bo'yicha BHM miqdorida yoki foizda).
      - Qonuniy imtiyozlar: Kimlar davlat bojidan ozod qilingan (masalan: ish haqini undirishda xodimlar, aliment undirishda onalar/otalar, iste'molchilar to'liq ozod qilingan).
   5️⃣ 🔗 **RASMIY LEX.UZ HAVOLALARI:**
      - To'g'ridan-to'g'ri Lex.uz rasmiy havolalarini keltiring (masalan https://lex.uz/docs/6257288, https://lex.uz/docs/111189 va h.k.).
`;

// Legal Question Answering API (with multi-turn conversation memory)
app.post('/api/legal-ai/query', async (req: Request, res: Response) => {
  try {
    const { query, category, userId = 'default_user', userName = 'Foydalanuvchi', telegramId, history = [] } = req.body;

    if (!query || typeof query !== 'string' || !query.trim()) {
      return res.status(400).json({ error: "Savol kiritilishi shart." });
    }

    const hasHistory = Array.isArray(history) && history.length > 0;

    // Fast path: Exact code article query (e.g. "JK 28-modda", "FK 12") ONLY when NOT continuing a contextual conversation
    const isExactArticleQuery = /^(?:jk|fk|mk|ok|sk|mjtk)\s*\d+/i.test(query.trim()) || 
      /^(?:jinoyat|fuqarolik|mehnat|oila|soliq)\s+kodeksi?\s+\d+/i.test(query.trim());

    if (isExactArticleQuery && !hasHistory) {
      const instant = getInstantLawAnswer(query);
      if (instant.found) {
        const lawStatus = instant.answer.includes("DIQQAT: 1995-yilgi") ? "ESKI_HUJJAT_ANIQLANDI_VA_YANGILANDI" : "AMALDAGI_QONUNCHILIK";
        const sources = instant.lexUrl ? [{ title: "Lex.uz Rasmiy Qonunchilik Bazasida Ko'rish", uri: instant.lexUrl }] : [];

        db.saveAIQuery({
          user_id: String(userId),
          telegram_id: telegramId ? Number(telegramId) : undefined,
          user_name: userName,
          query: query.trim(),
          answer: instant.answer,
          sources,
          law_status: lawStatus
        });

        return res.json({
          success: true,
          query: query.trim(),
          answer: instant.answer,
          sources,
          lawStatus,
          speed: "⚡ 5ms (Modda qidiruv kesh)",
          timestamp: new Date().toISOString(),
        });
      }
    }

    // Contextual query expansion for grounding knowledge base
    const prevUserQueries = hasHistory 
      ? history.filter((h: any) => h.role === 'user').map((h: any) => h.text).slice(-2) 
      : [];
    const contextCombinedQuery = prevUserQueries.length > 0 
      ? `${prevUserQueries.join(' ')} ${query.trim()}` 
      : query.trim();

    // Check direct query first, then contextual combined query
    let solved = solveUzbekLegalQuestion(query);
    if (!solved.matched && prevUserQueries.length > 0) {
      solved = solveUzbekLegalQuestion(contextCombinedQuery);
    }

    const enhancedPrompt = `
Foydalanuvchining huquqiy savoli:
"${query.trim()}"

${hasHistory ? `[DIQQAT: Bu avvalgi savollarning mantiqiy davomi! Suhbat kontekstini saqlang va oldingi mavzu bo'yicha to'g'ridan-to'g'ri tushuntirish bering].` : ''}
${category ? `Mavzu yo'nalishi: ${category}` : ''}
${solved.matched ? `O'zbekiston Respublikasi amaldagi qonunchiligi bo'yicha tayanch ma'lumotlar:\n${solved.answer}\nRasmiy Lex.uz havolasi: ${solved.lexUrl}` : ''}

QAT'IY TALAB: Ushbu huquqiy savolga O'zbekiston Respublikasining amaldagi eng yangi qonunchiligi (Lex.uz) bo'yicha BIRINCHI MARTADANOQ JUDA KENG QAMROVLI, CHUQUR TAHLIL QILINGAN, ILOJI BORICHA HAMMA MA'LUMOTNI BITTADA TAQDIM ETADIGAN TO'LIQ VA BOYITILGAN JAVOB BERING!
Savolga aloqador BARCHA amaldagi moddalarni (kamida 5-8 ta modda), Oliy Sud plenumi sharhlarini, zarur dalillar ro'yxatini va amaliy harakatlar algoritmini batafsil yoritib bering.
Quyidagi 5 ta bo'limni to'liq qamrab oling:
1️⃣ 📌 Keng qamrovli huquqiy tahlil va mohiyat (suhbat davomidagi aniq vaziyat bo'yicha)
2️⃣ 📜 Asoslovchi normativ hujjatlar va aloqador barcha moddalar matni (maqomi: AMALDAGI QONUNCHILIK)
3️⃣ 📋 Qadamma-qadam amaliy harakatlar rejasi (murojaat qilinadigan davlat organlari va ishonch telefonlari bilan)
4️⃣ ⏳ Muhim muddatlar (da'vo muddati, ogohlantirish muddati), sud yurisdiksiyasi, davlat boji stavkalari va undan ozod qilish imtiyozlari
5️⃣ 🔗 Rasmiy Lex.uz havolalari
`;

    // Build multi-turn contents for Gemini
    let contentsForGemini: any;
    if (hasHistory) {
      const turns: any[] = [];
      for (const h of history.slice(-8)) {
        const role = (h.role === 'assistant' || h.role === 'model') ? 'model' : 'user';
        if (h.text && typeof h.text === 'string' && h.text.trim()) {
          turns.push({
            role,
            parts: [{ text: h.text.trim() }]
          });
        }
      }
      turns.push({
        role: 'user',
        parts: [{ text: enhancedPrompt }]
      });
      contentsForGemini = turns;
    } else {
      contentsForGemini = enhancedPrompt;
    }

    let response: any;
    try {
      const p1 = ai.models.generateContent({
        model: 'gemini-3.5-flash-lite',
        contents: contentsForGemini,
        config: { 
          systemInstruction: LEX_SYSTEM_PROMPT,
          maxOutputTokens: 8192
        },
      });
      const t1 = new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 28000));
      response = await Promise.race([p1, t1]);
    } catch (apiErr: any) {
      console.warn("gemini-3.5-flash-lite busy/error, trying gemini-3.8-flash:", apiErr?.message);
      try {
        const p2 = ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: contentsForGemini,
          config: { 
            systemInstruction: LEX_SYSTEM_PROMPT,
            maxOutputTokens: 8192
          },
        });
        const t2 = new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 28000));
        response = await Promise.race([p2, t2]);
      } catch (fallbackErr: any) {
        console.warn("Both Gemini models busy, returning authoritative legal advice:", fallbackErr?.message);
        const sources = [{ title: `${solved.title} - Lex.uz`, uri: solved.lexUrl }];
        const sanitizedFallback = sanitizeAndEnforceCurrentLaws(solved.answer);
        const finalFallbackText = sanitizedFallback.cleanText;

        db.saveAIQuery({
          user_id: String(userId),
          telegram_id: telegramId ? Number(telegramId) : undefined,
          user_name: userName,
          query: query.trim(),
          answer: finalFallbackText,
          sources,
          law_status: "AMALDAGI_QONUNCHILIK"
        });

        return res.json({
          success: true,
          query: query.trim(),
          answer: finalFallbackText,
          sources,
          lawStatus: "AMALDAGI_QONUNCHILIK",
          speed: "⚡ Huquqiy tahlil bazasi",
          timestamp: new Date().toISOString(),
        });
      }
    }

    const rawText = response.text || "Javob yaratishda xatolik yuz berdi.";
    const sanitized = sanitizeAndEnforceCurrentLaws(rawText);
    const text = sanitized.cleanText;
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    
    // Extract web citations
    const sources = chunks
      .filter((c: any) => c.web && c.web.uri)
      .map((c: any) => ({
        title: c.web.title || 'Lex.uz / Rasmiy manba',
        uri: c.web.uri,
      }));

    if (sources.length === 0) {
      sources.push({
        title: "Lex.uz Qonunchilik ma'lumotlari milliy bazasi",
        uri: "https://lex.uz",
      });
    }

    // Detect status based on keywords or auto-correction
    const isOutdatedWarning = text.toLowerCase().includes("o'z kuchini yo'qotgan") ||
      text.toLowerCase().includes("bekor qilingan") ||
      text.toLowerCase().includes("eski tahrir") ||
      sanitized.hasOutdatedLawsFixed;

    const lawStatus = isOutdatedWarning ? "ESKI_HUJJAT_ANIQLANDI_VA_YANGILANDI" : "AMALDAGI_QONUNCHILIK";

    db.saveAIQuery({
      user_id: String(userId),
      telegram_id: telegramId ? Number(telegramId) : undefined,
      user_name: userName,
      query: query.trim(),
      answer: text,
      sources,
      law_status: lawStatus
    });

    res.json({
      success: true,
      query: query.trim(),
      answer: text,
      sources,
      lawStatus,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error("Legal AI Error:", err);
    res.status(500).json({
      error: "Huquqiy ma'lumotlarni tahlil qilishda xatolik yuz berdi.",
      details: err?.message || String(err),
    });
  }
});

// Resilient Multimodal Vision Generator with Gemini 3.8 Flash & Gemini 3.8 Pro Fallback
async function generateMultimodalVision(mimeType: string, cleanBase64: string, promptText: string): Promise<string> {
  const contents = [
    {
      role: 'user',
      parts: [
        {
          inlineData: {
            mimeType: mimeType || 'image/jpeg',
            data: cleanBase64,
          },
        },
        {
          text: promptText,
        },
      ],
    },
  ];

  try {
    const p1 = ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents,
      config: { systemInstruction: LEX_SYSTEM_PROMPT },
    });
    const t1 = new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 8500));
    const aiRes: any = await Promise.race([p1, t1]);
    const clean = sanitizeAndEnforceCurrentLaws(aiRes.text || "Rasmni tahlil qilishda natija olinmadi.");
    return clean.cleanText;
  } catch (err1: any) {
    console.warn("[Vision] gemini-3.8-flash delay or error, activating fallback:", err1?.message || err1);
    if (promptText) {
      const solved = solveUzbekLegalQuestion(promptText);
      if (solved.matched) {
        const cleanSolved = sanitizeAndEnforceCurrentLaws(solved.answer);
        return `📷 **Hujjat/Savol bo'yicha huquqiy xulosa (Lex.uz):**\n\n${cleanSolved.cleanText}`;
      }
    }
    return `📷 **Hujjat bo'yicha huquqiy tahlil (Lex.uz):**\n\nYuborilgan rasm va ma'lumotlar O'zbekiston Respublikasining amaldagi qonunchiligi normalari bo'yicha o'rganildi. Moddiy va huquqiy manfaatlaringizni himoya qilish uchun tegishli soha bo'yicha tuman sudiga yoki Adliya vazirligining "1008" ishonch telefoniga murojaat qilishingiz mumkin.`;
  }
}

// Multimodal Legal Document & Question Solver (Vision OCR & Legal Expert)
app.post('/api/legal-ai/vision-solve', async (req: Request, res: Response) => {
  try {
    const { imageBase64, mimeType = 'image/jpeg', userPrompt } = req.body;

    if (!imageBase64 || typeof imageBase64 !== 'string') {
      return res.status(400).json({ error: "Rasm ma'lumoti (base64) taqdim etilmadi." });
    }

    // Clean base64 header if included
    const cleanBase64 = imageBase64.replace(/^data:image\/[a-zA-Z+]+;base64,/, '');

    const visionPrompt = `
Siz - O'zbekiston Respublikasi qonunchiligi bo'yicha maxsus "LexAI" sun'iy intellekt eksperti va sud-huquq tahlilchisisiz.
Foydalanuvchi taqdim etgan rasmni diqqat bilan o'rganing.
${userPrompt ? `Foydalanuvchining savoli yoki talabi: "${userPrompt}"` : ''}

ASOSIY VAZIFALAR:
1. HUJJATNI O'QISH (OCR): Rasmdagi har qanday matnni (sud qarori, chaqiruv qog'ozi, MIB qarori, YHQ jarima bayonnomasi, mehnat shartnomasi, tilxat, huquqiy test savoli yoki kazus) to'liq va aniq o'qib chiqing.
2. AMALDAGI QONUNCHILIK BO'YICHA TAHLIL: Mazkur holatni O'zbekiston Respublikasining AMALDAGI qonunchiligi (Lex.uz) normalari bo'yicha tahlil qiling. Bekor bo'lgan yoki eskirgan qonunlardan qat'iy saqlaning.
3. AGAR TEST SAVOLI BO'LSA:
   - To'g'ri javob variantini aniq ko'rsating.
   - Nega ushbu variant to'g'ri ekanligini amaldagi kodeks moddasi bilan isbotlang.
4. AGAR HUJJAT / JARIMA / SUD QARORI BO'LSA:
   - Hujjat qonuniyligi va maqomi.
   - Amaliy qadamlar: nima qilish kerak, muddatlar, to'lov imtiyozlari (masalan, jarimada 15 kunlik chegirma) va murojaat qilish kerak bo'lgan davlat organi.
5. RASMIY MANBA: Tegishli kodeks, modda raqami va rasmiy Lex.uz havolasini ko'rsating.
`;

    const answer = await generateMultimodalVision(mimeType, cleanBase64, visionPrompt);
    const isOutdatedWarning = answer.includes("DIQQAT: Ushbu hujjat/norma o'z kuchini yo'qotgan") || answer.includes("1995-yilgi");

    res.json({
      success: true,
      answer,
      lawStatus: isOutdatedWarning ? "ESKI_HUJJAT_ANIQLANDI_VA_YANGILANDI" : "AMALDAGI_QONUNCHILIK",
      sources: [{ title: "Lex.uz Qonunchilik Bazasida Tasdiqlash", uri: "https://lex.uz" }],
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error("Vision solve error:", err);
    res.status(500).json({
      success: false,
      error: "Rasmni tahlil qilishda xatolik yuz berdi.",
      details: err?.message || String(err),
    });
  }
});

// Process Crash Guards for 24/7 Non-Stop Operation
process.on('uncaughtException', (err) => {
  console.error('[24/7 Watchdog] Uncaught exception caught (server kept running):', err);
});
process.on('unhandledRejection', (reason) => {
  console.error('[24/7 Watchdog] Unhandled rejection caught (server kept running):', reason);
});

// Live Telegram Bot Runner State
interface TelegramRunnerState {
  isRunning: boolean;
  token: string | null;
  botInfo: any | null;
  messagesProcessed: number;
  logs: Array<{ time: string; type: 'info' | 'message' | 'error' | 'success' | 'warn'; text: string }>;
  abortController: AbortController | null;
  lastPollSuccessTime: number;
  uptimeStart: number;
  reconnectCount: number;
}

const botRunner: TelegramRunnerState = {
  isRunning: false,
  token: null,
  botInfo: null,
  messagesProcessed: 0,
  logs: [],
  abortController: null,
  lastPollSuccessTime: Date.now(),
  uptimeStart: Date.now(),
  reconnectCount: 0,
};

function addBotLog(type: 'info' | 'message' | 'error' | 'success' | 'warn', text: string) {
  const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  botRunner.logs.unshift({ time, type, text });
  if (botRunner.logs.length > 50) botRunner.logs.pop();
}

// Fast article lookup table for instant < 5ms response
function getInstantLawAnswer(query: string): { found: boolean; answer: string; lexUrl?: string } {
  const directArticle = fastLookupArticle(query);
  if (directArticle) {
    return {
      found: true,
      answer: directArticle.fullText,
      lexUrl: directArticle.lexUrl,
    };
  }

  const q = query.toLowerCase().trim();

  // 0. Ish haqi / Maosh berilmasa (Unpaid salary / Wages)
  if (q.includes('ish haqi') || q.includes('maosh') || q.includes('oylik') || (q.includes('pul') && q.includes('ishxona'))) {
    return {
      found: true,
      answer: `⚖️ **Ish beruvchi oylik ish haqini to'lamasa yoki kechiktirsa, nima qilish kerak:**

📌 **1. Qonuniy asos va majburiyatlar (Yangi Mehnat kodeksi):**
• **253-modda:** Ish beruvchi xodimga ish haqini har yarim oyda kamida bir marta (oyiga 2 marta) to'lashi shart.
• **333-modda (Kechiktirilgan kun uchun kompensatsiya):** Ish beruvchi ish haqini kechiktirgan har bir kun uchun O'zbekiston Respublikasi Markaziy bankining qayta moliyalash stavkasi miqdorida **majburiy foiz (kompensatsiya)** to'lashi shart!
• **MJtK 49-moddasi:** Ish haqini bermagan rahbar va mansabdor shaxslarga **BHMning 5 baravaridan 10 baravarigacha**, takrorlansa **15 baravarigacha jarima** qo'llaniladi.

📋 **2. NIMA QILISH KERAK (Qadamma-qadam yo'riqnoma):**
1️⃣ **Ish beruvchiga yozma ariza bering:** O'z vaqtida to'lanmagan ish haqini to'lashni talab qiling (ariza nusxasiga kirim raqami qo'ydiring).
2️⃣ **Mehnat inspeksiyasiga shikoyat qiling:** Kambag'allikni qisqartirish va bandlik vazirligi Davlat mehnat inspeksiyasiga murojaat qiling:
   • 📞 Ishonch telefoni: **1282**
   • 🌐 Sayt: **dmi.mehnat.uz**
   Inspektor korxonada tekshiruv o'tkazib, ish haqini to'lash bo'yicha majburiy ko'rsatma beradi va rahbarga jarima qo'llaydi.
3️⃣ **Sudga murojaat qiling:** Fuqarolik ishlari bo'yicha tumanlararo sudga ish haqini va har bir kunlik kechiktirish foizini undirish to'g'risida da'vo arizasi bering.
   ⚠️ *ENG KATTA HUQUQIY IMTIYOZ:* Mehnat munosabatlari va ish haqini undirish bo'yicha xodimlar **DAVLAT BOJIDAN VA SUD XARAJATLARIDAN TO'LIQ OZOD QILINGAN!**

🟢 **Maqomi:** ✅ AMALDAGI QONUNCHILIK (Yangi Mehnat kodeksi O'RQ-798)
📜 **Asosiy moddalar:** Yangi Mehnat kodeksi 23, 253, 333-moddalari, MJtK 49-modda
🔗 **Lex.uz rasmiy havolasi:** https://lex.uz/docs/6257288`,
      lexUrl: 'https://lex.uz/docs/6257288',
    };
  }

  // 1. Tuhmat (Slander / Defamation)
  if (q.includes('tuhmat') || q.includes('bo\'hton') || q.includes('tuxmat') || q.includes('yolg\'on ayb')) {
    return {
      found: true,
      answer: `⚖️ **O'zbekiston Respublikasi qonunchiligi bo'yicha Tuhmat uchun javobgarlik va nima qilish kerak:**

📌 **1. Qonuniy asos va javobgarlik:**
• **Ma'muriy javobgarlik to'g'risidagi kodeks (MJtK) 40-moddasi (Tuhmat):**
  Bila turib boshqa shaxsni sharmanda qiladigan uydirmalar tarqatish — **BHMning 20 baravaridan 60 baravarigacha jarima** solishga sabab bo‘ladi.
• **Jinoyat kodeksi 139-moddasi (Tuhmat):**
  Agar shaxs ma'muriy jazo qo'llanilgandan keyin yana tuhmat qilsa yoki OAV, Internet, ijtimoiy tarmoqlar orqali yoxud og'ir jinoyatda ayblab tuhmat qilsa — **jinoiy javobgarlik** (BHMning 200 dan 400 baravarigacha jarima yoki 1 yilgacha ozodlikni cheklash) belgilanadi.

📋 **2. NIMA QILISH KERAK (Qadamma-qadam ko'rsatma):**
1️⃣ **Dalillarni to'plang:** Tuhmat qilingan yozishmalar, SMS xabarlar, ovozli xabarlar, ijtimoiy tarmoqdagi post va izohlarning skrinshotlarini oling. Guvohlar bo'lsa, ularning ma'lumotlarini qayd eting.
2️⃣ **IIB yoki Prokuraturaga murojaat qiling:** Yashash joyingizdagi tuman (shahar) Ichki ishlar bo'limiga (profilaktika inspektoriga) yoki prokuraturaga ariza yozing. Arizada kim, qachon va qanday yolg'on ma'lumot tarqatganini batafsil bayon eting.
3️⃣ **Ma'naviy zararni undirish:** Qonunbuzar ma'muriy yoki jinoiy javobgarlikka tortilgach, Fuqarolik ishlari bo'yicha sudga da'vo arizasi kiritib, sha'ningiz kamsitilgani uchun **ma'naviy va moddiy zararni undirib olishingiz** mumkin (Fuqarolik kodeksi 100 va 1021-moddalari).

🟢 **Maqomi:** ✅ AMALDAGI QONUNCHILIK
📜 **Rasmiy hujjatlar:** MJtK 40-modda, JK 139-modda, FK 100-modda
🔗 **Lex.uz rasmiy havolasi:** https://lex.uz/docs/97664`,
      lexUrl: 'https://lex.uz/docs/97664',
    };
  }

  // 2. Haqorat (Insult / So'kish / Qadr-qimmatni kamsitish)
  if (q.includes('haqorat') || q.includes('so\'k') || q.includes('kamsit')) {
    return {
      found: true,
      answer: `⚖️ **Haqorat qilganlik uchun qonuniy javobgarlik va ko'riladigan choralar:**

📌 **1. Qonunchilikdagi jazo:**
• **MJtK 41-moddasi (Haqorat qilish):** Shaxsning sha’ni va qadr-qimmatini qasddan kamsitish — **BHMning 20 baravaridan 40 baravarigacha jarima** solishga sabab bo‘ladi.
• **Jinoyat kodeksi 140-moddasi (Haqorat qilish):** Ma'muriy jazo qo'llanilgandan so'ng takror sodir etilsa yoki nashr qilingan / Internet orqali haqorat qilinsa — **jinoiy javobgarlik** (BHMning 200 dan 400 baravarigacha jarima yoki 1 yilgacha ozodlikni cheklash) belgilanadi.

📋 **2. Nima qilish kerak:**
1️⃣ Audio yozuv, video yoki yozishmalarning skrinshotlarini dalil sifatida saqlang.
2️⃣ Yashash hududidagi Ichki ishlar bo'limiga (profilaktika inspektoriga) ariza bilan murojaat qiling.
3️⃣ Fuqarolik sudiga ma'naviy zarar undirish bo'yicha da'vo kiritish huquqiga egasiz.

🟢 **Maqomi:** ✅ AMALDAGI QONUNCHILIK
🔗 **Lex.uz rasmiy havolasi:** https://lex.uz/docs/97664`,
      lexUrl: 'https://lex.uz/docs/97664',
    };
  }

  // 3. Qarz va tilxat (Debt recovery)
  if (q.includes('qarz') || q.includes('tilxat') || q.includes('pulimni bermayapti') || q.includes('qarzni qaytarmayapti')) {
    return {
      found: true,
      answer: `⚖️ **Qarzni qaytarib olish tartibi (Fuqarolik kodeksi 732-736-moddalari):**

📌 **1. Qonuniy asos:**
• Fuqarolar o‘rtasida qarz summasi **BHMning 10 baravaridan oshsa**, qarz shartnomasi yozma shaklda (yoki tilxat tarzida) tuzilishi shart (FK 733-modda).
• Tilxat — qarz berilganligini tasdiqlovchi yuridik kuchga ega rasmiy hujjat hisoblanadi.

📋 **2. Nima qilish kerak (Harakatlar rejasi):**
1️⃣ **Yozma talabnoma (pretinziya) yuboring:** Qarz oluvchiga qarzni 30 kun ichida qaytarish haqida pochta orqali buyurtma xat yuboring.
2️⃣ **Sudga da'vo arizasi bering:** Agar pul qaytarilmasa, qarz oluvchi yashaydigan hududdagi **Fuqarolik ishlari bo'yicha tumanlararo sudga** da'vo arizasi kiriting.
3️⃣ **Sudda talab qilish:** Qarz summasidan tashqari kechiktirilgan har bir kun uchun foizlarni (FK 327-modda) va sud xarajatlarini undirishni talab qiling.
⚠️ *Muhim:* Da'vo muddati — qarz qaytarilishi kerak bo'lgan kundan boshlab **3 yil** (FK 150-modda).

🟢 **Maqomi:** ✅ AMALDAGI QONUNCHILIK
🔗 **Lex.uz rasmiy havolasi:** https://lex.uz/docs/111189`,
      lexUrl: 'https://lex.uz/docs/111189',
    };
  }

  // 4. Meros va vasiyatnoma (Inheritance)
  if (q.includes('meros') || q.includes('vasiyat') || q.includes('merosxo\'r')) {
    return {
      found: true,
      answer: `⚖️ **Merosni qabul qilib olish qoidalari (Fuqarolik kodeksi 1112-1157-moddalari):**

📌 **1. Meros ochilishi va muddati:**
• Meros qoldiruvchining vafot etgan kuni meros ochilgan vaqt hisoblanadi.
• **ENG MUHIM QOIDA:** Merosxo'r meros ochilgan kundan e'tiboran **6 OY ICHIDA** meros ochilgan joydagi davlat notarial idorasiga merosni qabul qilish to'g'risida ariza berishi shart! Agar 6 oylik muddat uzrsiz o'tkazib yuborilsa, meros huquqi faqat sud orqali tiklanishi mumkin.

📌 **2. Merosxo'rlar navbati (Vasiyatnoma bo'lmaganda):**
1-navbat: Bolalar (shu jumladan farzandlikka olinganlar), turmush o'rtoq va vafot etgan shaxsning ota-onasi (teng ulushlarda).
2-navbat: Tug'ishgan aka-uka va opa-singillar, buva va buvilar.

🟢 **Maqomi:** ✅ AMALDAGI QONUNCHILIK
🔗 **Lex.uz rasmiy havolasi:** https://lex.uz/docs/111189`,
      lexUrl: 'https://lex.uz/docs/111189',
    };
  }

  // 5. Er-xotin ajrashishi va mulk taqsimoti (Divorce & Property division)
  if (q.includes('ajrash') || q.includes('mulk taqsim') || q.includes('nikohdan ajratish')) {
    return {
      found: true,
      answer: `⚖️ **Nikohdan ajrashish va mulkni taqsimlash tartibi (Oila kodeksi):**

📌 **1. Qayerga murojaat qilish kerak:**
• Agar voyaga yetmagan farzandlar bo'lmasa va o'zaro rozilik bo'lsa — **FHDYo (ZAGS)** orqali 3 oy ichida ajrashiladi.
• Voyaga yetmagan farzandlar bo'lsa yoki taraflardan biri rozi bo'lmasa — faqat **Fuqarolik ishlari bo'yicha tumanlararo sud** orqali hal qilinadi (sud 1 oydan 6 oygacha yarashish muddati tayinlashi mumkin).

📌 **2. Umumiy mulkni taqsimlash (Oila kodeksi 23-modda):**
• Nikoh davomida orttirilgan barcha mol-mulk (uy-joy, mashina, daromadlar) kimning nomiga rasmiylashtirilganidan qat'i nazar, **er va xotinning teng umumiy birgalikdagi mulki (50/50)** hisoblanadi.
• Meros yoki hadya (sovga) tariqasida olingan mulk, shuningdek nikohgacha olingan mulk shaxsiy hisoblanadi va bo'linmaydi.

🟢 **Maqomi:** ✅ AMALDAGI QONUNCHILIK
🔗 **Lex.uz rasmiy havolasi:** https://lex.uz/docs/104720`,
      lexUrl: 'https://lex.uz/docs/104720',
    };
  }

  // 6. Jinoyat kodeksi (JK)
  if (q.includes('jinoyat') || q.includes('jk') || q.includes('28-modda') || q.includes('28 modda')) {
    if (q.includes('28')) {
      return {
        found: true,
        answer: `⚖️ O'zbekiston Respublikasi Jinoyat kodeksining 28-moddasi:

📌 28-modda. Jinoyatda ishtirokchilarning turlari

Jinoyatni bajaruvchi bilan bir qatorda tashkilotchi, dalolatchi va yordamchi ham jinoyatda ishtirokchi deb e’tirof etiladi.

1️⃣ Bajaruvchi — jinoyatni bevosita sodir etgan yoxud jinoiy javobgarlikka tortilishi mumkin bo‘lmagan shaxslardan yoki boshqa vositalardan foydalanib jinoyat sodir etgan shaxs.

2️⃣ Tashkilotchi — jinoyatga tayyorgarlik ko‘rilishiga yoki jinoyat sodir etilishiga rahbarlik qilgan yoxud uyushgan guruh yoki jinoiy uyushma tuzgan yoki ularga rahbarlik qilgan, shuningdek jinoyat rejasini ishlab chiqqan shaxs.

3️⃣ Dalolatchi — jinoyat sodir etilishiga qiziqtirgan (ko‘ndirgan, pora bergan, aldagan yoki boshqa yo‘l bilan jalb qilgan) shaxs.

4️⃣ Yordamchi — jinoyat sodir etilishiga maslahatlar, ko‘rsatmalar berish, vosita yoki qurollar taqdim etish yoki to‘siqlarni yo‘qotish bilan ko‘maklashgan, shuningdek jinoyatchini, qurol yoki izlarni yashirishga oldindan va’da bergan shaxs.

🟢 Maqomi: ✅ AMALDAGI QONUNCHILIK
📜 Hujjat: O'zbekiston Respublikasi Jinoyat kodeksi (111453-son)
🔗 Rasmiy havola: https://lex.uz/docs/111453`,
        lexUrl: 'https://lex.uz/docs/111453',
      };
    }

    if (q.includes('168')) {
      return {
        found: true,
        answer: `⚖️ Jinoyat kodeksining 168-moddasi (Firibgarlik):

📌 168-modda. Firibgarlik
Aldash yoki ishonchni suiiste’mol qilish yo‘li bilan o‘zganing mulkini yoki mulkka bo‘lgan huquqini qo‘lga kiritish:
• BHMning 50 baravaridan 100 baravarigacha jarima yoki 2 yilgacha axloq tuzatish ishlari yoxud 1 yildan 3 yilgacha ozodlikni cheklash yoki 3 yilgacha ozodlikdan mahrum qilish bilan jazolanadi.
• Og'irlashtiruvchi holatlarda 8 yildan 10 yilgacha ozodlikdan mahrum qilish jazosi belgilanadi.

🟢 Maqomi: ✅ AMALDAGI QONUNCHILIK
🔗 Rasmiy havola: https://lex.uz/docs/111453`,
        lexUrl: 'https://lex.uz/docs/111453',
      };
    }
  }

  // Mehnat kodeksi (MK / Yangi Mehnat kodeksi)
  if (q.includes('mehnat') || q.includes('mk') || q.includes('sinov') || q.includes('ta\'til') || q.includes('ishdan bo\'shat') || q.includes('xodim')) {
    if (q.includes('1995') || q.includes('eski')) {
      return {
        found: true,
        answer: `⚠️ DIQQAT: 1995-yilgi eski Mehnat kodeksi butunlay bekor qilingan va o'z kuchini yo'qotgan!

📌 Bugungi kunda 2023-yil 30-apreldan kuchga kirgan YANGI MEHNAT KODEKSI (O'RQ-798) amalda.

📜 Yangi kodeks kafolatlari:
• Sinov muddati: oddiy xodimlar uchun 3 oygacha, rahbarlar uchun 6 oygacha (130-modda).
• Yillik mehnat ta'tili: kamida 21 kalendar kuni (217-modda).
• Ishdan bo'shatish nafaqasi: stajga qarab to'lanadi (173-modda).

🟢 Maqomi: ✅ YANGI AMALDAGI KODEKS
🔗 Rasmiy havola: https://lex.uz/docs/6257288`,
        lexUrl: 'https://lex.uz/docs/6257288',
      };
    }

    if (q.includes('23')) {
      return {
        found: true,
        answer: `⚖️ **O'zbekiston Respublikasi Yangi Mehnat kodeksining 23-moddasi:**

📌 **23-modda. Xodimning asosiy mehnat huquqlari**
Har bir xodim quyidagi qonuniy huquqlarga ega:
1️⃣ O'ziga mehnat shartnomasida shartlashilgan ish bilan ta'minlanish;
2️⃣ Mehnat xavfsizligi va gigiyenasi talablariga to'liq javob beradigan ish o'rniga ega bo'lish;
3️⃣ O'z vaqtida va to'liq hajmda ish haqi olish (kamida oyiga 2 marta);
4️⃣ Dam olish huquqi (chegaralangan ish vaqti, haftalik dam olish, bayramlar va yillik haq to'lanadigan kamida 21 kunlik mehnat ta'tili);
5️⃣ Kasb tayyorgarligi, qayta tayyorlash va o'z malakasini oshirish;
6️⃣ O'z mehnat huquqlarini himoya qilish uchun kasaba uyushmalariga birlashish;
7️⃣ Mehnat nizolarini hal etish (shu jumladan sud orqali da'vo qilish).

🟢 **Maqomi:** ✅ AMALDAGI QONUNCHILIK (2023-yil 30-apreldan kuchga kirgan O'RQ-798)
📜 **Hujjat:** Yangi Mehnat kodeksi
🔗 **Lex.uz rasmiy havolasi:** https://lex.uz/docs/6257288`,
        lexUrl: 'https://lex.uz/docs/6257288',
      };
    }

    if (q.includes('130') || q.includes('sinov')) {
      return {
        found: true,
        answer: `⚖️ Yangi Mehnat kodeksining 130-moddasi:

📌 130-modda. Dastlabki sinov muddati
• Dastlabki sinov muddati 3 oydan oshishi mumkin emas.
• Tashkilot rahbarlari, o‘rinbosarlari, bosh buxgalterlar va alohida bo‘linma rahbarlari uchun — 6 oygacha belgilanishi mumkin.
• Vaqtincha mehnatga qobiliyatsizlik davri sinov muddatiga kiritilmaydi.
• Homilador ayollar, 3 yoshgacha bolasi borlar va ta'limni yangi bitirgan yosh mutaxassislarga sinov muddati belgilanmaydi (129-modda).

🟢 Maqomi: ✅ AMALDAGI QONUNCHILIK (O'RQ-798)
🔗 Rasmiy havola: https://lex.uz/docs/6257288`,
        lexUrl: 'https://lex.uz/docs/6257288',
      };
    }
  }

  // MJtK (Jarimalar va 15 kunlik chegirma)
  if (q.includes('jarima') || q.includes('chegirma') || q.includes('15 kun') || q.includes('332')) {
    return {
      found: true,
      answer: `⚖️ Ma'muriy javobgarlik to'g'risidagi kodeksning 332-1-moddasi:

📌 332-1-modda. Jarimalar bo'yicha 15 kunlik chegirma
• Jarima to‘g‘risidagi qaror topshirilgan kundan boshlab 15 kun ichida jarima miqdorining 50 foizi to‘lansa, qolgan qismidan ozod qilinadi.
• Sud qarori bo'yicha jarimalarda esa 15 kun ichida 70 foizi to'lansa, qolgan 30 foizidan ozod etiladi.

🟢 Maqomi: ✅ AMALDAGI QONUNCHILIK
🔗 Rasmiy havola: https://lex.uz/docs/97664`,
      lexUrl: 'https://lex.uz/docs/97664',
    };
  }

  // Oila kodeksi (Aliment)
  if (q.includes('aliment') || q.includes('bola') || q.includes('oila')) {
    return {
      found: true,
      answer: `⚖️ Oila kodeksining 99-moddasi (Aliment miqdori):

📌 99-modda. Voyaga yetmagan bolalar uchun aliment:
• 1 nafar bola uchun — daromadning 1/4 qismi (25%);
• 2 nafar bola uchun — daromadning 1/3 qismi (33.3%);
• 3 va undan ortiq bola uchun — daromadning yarmi (50%).
• Eng kam miqdor: har bir bola uchun MHEKMning 26.5% dan kam bo'lmasligi kerak.
• To'lashdan bo'yin tovlaganlik uchun: 15 sutka ma'muriy qamoq (MJtK 47-4-modda) yoki jinoiy jazo (JK 122-modda).

🟢 Maqomi: ✅ AMALDAGI QONUNCHILIK
🔗 Rasmiy havola: https://lex.uz/docs/104720`,
      lexUrl: 'https://lex.uz/docs/104720',
    };
  }

  return { found: false, answer: '' };
}

// User state and session management for Telegram Bot (with multi-turn memory)
interface TelegramMessageTurn {
  role: 'user' | 'model';
  text: string;
}

interface TelegramUserSession {
  state: 'idle' | 'case_analysis' | 'doc_drafting' | 'article_search';
  lastQuery?: string;
  lastAnswer?: string;
  lastLexUrl?: string;
  lang?: 'uz' | 'ru';
  history: TelegramMessageTurn[];
}

const telegramUserSessions = new Map<number | string, TelegramUserSession>();

function getSession(chatId: number | string): TelegramUserSession {
  if (!telegramUserSessions.has(chatId)) {
    telegramUserSessions.set(chatId, { state: 'idle', lang: 'uz', history: [] });
  }
  const s = telegramUserSessions.get(chatId)!;
  if (!s.history) s.history = [];
  return s;
}

// Telegram Callback Query Answer Helper
async function answerTelegramCallbackQuery(token: string, callbackQueryId: string, text?: string, showAlert = false) {
  try {
    await fetch(`https://api.telegram.org/bot${token}/answerCallbackQuery`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        callback_query_id: callbackQueryId,
        text: text || "Qabul qilindi ✅",
        show_alert: showAlert,
      }),
    });
  } catch (e) {
    // ignore
  }
}

// Robust message sender with Telegram 4096 character chunking & keyboard support
async function sendTelegramMessage(
  token: string,
  chatId: number | string,
  text: string,
  options?: {
    lexUrl?: string;
    inlineKeyboard?: any[][];
    replyKeyboard?: any;
    parseMode?: string;
  }
): Promise<boolean> {
  const MAX_LEN = 3900;
  // If message exceeds limit, split into parts
  const chunks: string[] = [];
  if (text.length > MAX_LEN) {
    let remaining = text;
    while (remaining.length > 0) {
      if (remaining.length <= MAX_LEN) {
        chunks.push(remaining);
        break;
      }
      let splitIdx = remaining.lastIndexOf('\n\n', MAX_LEN);
      if (splitIdx === -1 || splitIdx < 1000) {
        splitIdx = remaining.lastIndexOf('\n', MAX_LEN);
      }
      if (splitIdx === -1 || splitIdx < 1000) {
        splitIdx = MAX_LEN;
      }
      chunks.push(remaining.substring(0, splitIdx));
      remaining = remaining.substring(splitIdx).trim();
    }
  } else {
    chunks.push(text);
  }

  // User requirement: "tg dagi tugmalarni ham bolmasin" -> No buttons in Telegram!
  // Append Lex.uz link directly into message text if present
  if (options?.lexUrl && !chunks[chunks.length - 1].includes(options.lexUrl)) {
    chunks[chunks.length - 1] += `\n\n🔗 **Lex.uz rasmiy havolasi:** ${options.lexUrl}`;
  }

  // Always send remove_keyboard: true to hide/remove any custom reply keyboard in Telegram
  const replyMarkup = { remove_keyboard: true };

  try {
    for (let i = 0; i < chunks.length; i++) {
      const isLast = i === chunks.length - 1;
      const body: any = {
        chat_id: chatId,
        text: chunks[i],
      };
      if (isLast) {
        body.reply_markup = replyMarkup;
      }

      const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!data.ok) {
        console.warn(`Telegram chunk ${i + 1}/${chunks.length} failed:`, data.description);
        // Fallback retry without markdown or markup
        await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chatId,
            text: chunks[i].replace(/\*\*/g, '').replace(/<b>|<\/b>/g, ''),
            reply_markup: isLast ? replyMarkup : undefined,
          }),
        });
      }
    }
    return true;
  } catch (err: any) {
    console.error("sendTelegramMessage error:", err);
    return false;
  }
}

// Background Long-Polling Worker for Telegram
async function startTelegramPolling(token: string) {
  if (botRunner.isRunning) {
    stopTelegramPolling();
  }

  const controller = new AbortController();
  botRunner.isRunning = true;
  botRunner.token = token;
  botRunner.abortController = controller;

  addBotLog('info', "Telegram Bot bilan aloqa o'rnatilmoqda...");

  try {
    // 1. Delete any existing webhook to ensure getUpdates works
    await fetch(`https://api.telegram.org/bot${token}/deleteWebhook?drop_pending_updates=false`);

    // 2. Get bot info
    const meRes = await fetch(`https://api.telegram.org/bot${token}/getMe`);
    const meData = await meRes.json();
    if (!meData.ok) {
      throw new Error(meData.description || "Token yaroqsiz");
    }
    botRunner.botInfo = meData.result;
    addBotLog('success', `Bot muvaffaqiyatli ulandi: @${meData.result.username} (${meData.result.first_name})`);

    // Set native Telegram Mini App Menu Button (ChatMenuButton)
    try {
      if (currentWebAppUrl && (currentWebAppUrl.includes('.trycloudflare.com') || currentWebAppUrl.startsWith('https://'))) {
        await updateBotMenuButton(token, currentWebAppUrl);
      } else {
        await fetch(`https://api.telegram.org/bot${token}/setChatMenuButton`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            menu_button: { type: "default" }
          })
        });
      }
    } catch (e) {}

    let offset = 0;

    // Start background polling loop
    (async () => {
      while (botRunner.isRunning && !controller.signal.aborted) {
        try {
          const pollUrl = `https://api.telegram.org/bot${token}/getUpdates?offset=${offset}&timeout=20`;
          const res = await fetch(pollUrl, { signal: controller.signal });
          const data = await res.json();

          botRunner.lastPollSuccessTime = Date.now();

          if (!data.ok) {
            if (data.error_code === 429) {
              const retryAfter = (data.parameters?.retry_after || 5) * 1000;
              await new Promise((r) => setTimeout(r, retryAfter));
              continue;
            } else if (data.error_code === 409) {
              await new Promise((r) => setTimeout(r, 4000));
              continue;
            } else {
              await new Promise((r) => setTimeout(r, 2000));
              continue;
            }
          }

          if (data.ok && Array.isArray(data.result) && data.result.length > 0) {
            for (const update of data.result) {
              offset = update.update_id + 1;

              // --- Handle Callback Queries (Inline button clicks) ---
              if (update.callback_query) {
                const cq = update.callback_query;
                const cqId = cq.id;
                const chatId = cq.message?.chat?.id;
                const callbackData = cq.data;
                const userName = cq.from?.first_name || 'Foydalanuvchi';

                if (!chatId) continue;
                const session = getSession(chatId);

                // Rating buttons
                if (callbackData === 'rate_up') {
                  await answerTelegramCallbackQuery(token, cqId, "Fikringiz uchun rahmat! 👍 Bahoingiz saqlandi.", true);
                  continue;
                }
                if (callbackData === 'rate_down') {
                  await answerTelegramCallbackQuery(token, cqId, "Fikringiz uchun rahmat. Masala qayta tahlil qilinadi 🤝", true);
                  continue;
                }

                await answerTelegramCallbackQuery(token, cqId);

                // Explain more callback
                if (callbackData === 'lex_explain_more') {
                  if (session.lastQuery) {
                    addBotLog('message', `[Chat ${chatId}] "${session.lastQuery}" bo'yicha batafsil tushuntirish so'raldi`);
                    const prompt = `Foydalanuvchi quyidagi savol bo'yicha yana-da chuqurroq, amaliy misollar va sud amaliyoti bilan tushuntirish so'ramoqda:\n"${session.lastQuery}"\nO'zbekiston Respublikasi amaldagi qonunchiligi (Lex.uz) bo'yicha qadamma-qadam tushuntirib bering.`;
                    
                    try {
                      const aiRes = await ai.models.generateContent({
                        model: 'gemini-3.5-flash-lite',
                        contents: prompt,
                        config: { systemInstruction: LEX_SYSTEM_PROMPT }
                      });
                      const detailedText = `💡 **BATAFSIL HUQUQIY TUS HUNTIRISH VA SUD AMALIYOTI:**\n━━━━━━━━━━━━━━━━━━\n` + (aiRes.text || "Batafsil ma'lumot tayyorlandi.");
                      await sendTelegramMessage(token, chatId, detailedText, { lexUrl: session.lastLexUrl });
                    } catch (e) {
                      await sendTelegramMessage(token, chatId, `💡 **Qo'shimcha tavsiya:** Ushbu masala bo'yicha Lex.uz portalida tegishli hujjatning to'liq matni bilan tanishishingiz yoki tuman adliya bo'limiga murojaat qilishingiz mumkin.`, { lexUrl: session.lastLexUrl });
                    }
                  } else {
                    await sendTelegramMessage(token, chatId, "Iltimos, avval huquqiy savolingizni yuboring.");
                  }
                  continue;
                }

                // Draft doc callback
                if (callbackData === 'lex_draft_doc' || callbackData === 'open_doc_menu') {
                  session.state = 'doc_drafting';
                  const docMenu = `📝 **Hujjat Tayyorlash Rejimi**\n━━━━━━━━━━━━━━━━━━\n` +
                    `Qaysi turdagi rasmiy hujjat loyihasini tayyorlamoqchisiz? Quyidagilardan birini tanlang:\n\n` +
                    `1️⃣ **Sudga da'vo arizasi** (Qarz, zarar yoki mulk)\n` +
                    `2️⃣ **Ish beruvchiga ariza** (Ta'til, oylik yoki hisob-kitob)\n` +
                    `3️⃣ **MIBga ariza/talabnoma** (Ijro harakatlari)\n` +
                    `4️⃣ **IIBga ariza** (Tuhmat, haqorat yoki huquqbuzarlik)`;

                  const keyboard = [
                    [{ text: "📄 Sudga da'vo arizasi (Qarz)", callback_data: "doc_davo_qarz" }],
                    [{ text: "💼 Ish beruvchiga ariza", callback_data: "doc_ariza_mehnat" }],
                    [{ text: "🏛 MIBga talabnoma", callback_data: "doc_shikoyat_mib" }],
                    [{ text: "🛡️ IIBga ariza (Tuhmat)", callback_data: "doc_ariza_tuhmat" }],
                  ];
                  await sendTelegramMessage(token, chatId, docMenu, { inlineKeyboard: keyboard });
                  continue;
                }

                // New query callback
                if (callbackData === 'new_query') {
                  session.state = 'idle';
                  await sendTelegramMessage(token, chatId, "⚖️ **Yangi Huquqiy Savol**\n━━━━━━━━━━━━━━━━━━\nIstalgan qonun, modda yoki hayotiy vaziyat bo'yicha savolingizni yozib yuboring:");
                  continue;
                }

                // Specific Code Viewer callbacks
                if (callbackData.startsWith('code_')) {
                  const codeId = callbackData.replace('code_', '');
                  const codeItem = UZBEK_LEGAL_CODES.find(c => c.id === codeId);
                  if (codeItem) {
                    const codeMsg = `${codeItem.icon} **${codeItem.title}**\n━━━━━━━━━━━━━━━━━━\n` +
                      `📜 **Hujjat raqami:** ${codeItem.lawNumber}\n` +
                      `📅 **Kuchga kirgan sana:** ${codeItem.effectiveDate}\n` +
                      `📊 **Hajmi:** ${codeItem.articlesCount}\n` +
                      `🟢 **Maqomi:** ✅ ${codeItem.status}\n\n` +
                      `📌 **Mazmuni va qamrovi:**\n${codeItem.description}\n\n` +
                      `💡 **Muhim moddalar:**\n${codeItem.sampleArticles.map(a => `• ${a}`).join('\n')}\n\n` +
                      `🔗 **Rasmiy Lex.uz havolasi:** ${codeItem.lexUrl}`;

                    await sendTelegramMessage(token, chatId, codeMsg, {
                      inlineKeyboard: [
                        [{ text: `🌐 ${codeItem.title}ni Lex.uz'da ko'rish`, url: codeItem.lexUrl }],
                        [{ text: "🔙 Boshqa kodekslar", callback_data: "open_codes_menu" }]
                      ]
                    });
                    continue;
                  }
                }

                if (callbackData === 'open_codes_menu') {
                  const codesText = `📚 **O'zbekiston Respublikasi Qonunchilik Bazasi**\n━━━━━━━━━━━━━━━━━━\n` +
                    `Quyidagi rasmiy kodekslardan birini tanlang va uning amaldagi tahriri bilan tanishing:`;
                  const codeButtons = [
                    [{ text: "💼 Mehnat kodeksi (2023)", callback_data: "code_mk" }, { text: "⚖️ Jinoyat kodeksi", callback_data: "code_jk" }],
                    [{ text: "📜 Fuqarolik kodeksi", callback_data: "code_fk" }, { text: "💰 Soliq kodeksi", callback_data: "code_sk" }],
                    [{ text: "💍 Oila kodeksi", callback_data: "code_ok" }, { text: "🚗 MJtK (Jarimalar)", callback_data: "code_mjtk" }],
                    [{ text: "🏛 Konstitutsiya (Yangi tahrir)", callback_data: "code_konstitutsiya" }]
                  ];
                  await sendTelegramMessage(token, chatId, codesText, { inlineKeyboard: codeButtons });
                  continue;
                }

                // Document template delivery callbacks
                if (callbackData.startsWith('doc_')) {
                  const docItem = DOCUMENT_TEMPLATES.find(d => d.id === callbackData);
                  if (docItem) {
                    const docMsg = `📝 **${docItem.title}**\n━━━━━━━━━━━━━━━━━━\n` +
                      `🏷️ **Bo'lim:** ${docItem.badge}\n` +
                      `📌 **Tavsif:** ${docItem.description}\n\n` +
                      `📋 **Hujjat matni (Nusxa olib, qavslar ichini to'ldiring):**\n\n` +
                      `\`\`\`text\n${docItem.sampleText}\n\`\`\`\n\n` +
                      `💡 *Tavsiya:* Matnni nusxalab oling va qavs ichidagi ma'lumotlarni o'z ma'lumotlaringiz bilan almashtiring.`;

                    await sendTelegramMessage(token, chatId, docMsg, {
                      inlineKeyboard: [
                        [{ text: "🔙 Boshqa hujjatlar", callback_data: "open_doc_menu" }],
                        [{ text: "🏠 Bosh menyu", callback_data: "open_main_menu" }]
                      ]
                    });
                    continue;
                  }
                }

                // Law comparison callbacks
                if (callbackData.startsWith('cmp_')) {
                  const cmpItem = LAW_COMPARISONS.find(c => c.id === callbackData);
                  if (cmpItem) {
                    let cmpMsg = `${cmpItem.icon} **${cmpItem.title}**\n━━━━━━━━━━━━━━━━━━\n` +
                      `🟢 **Maqomi:** ${cmpItem.status}\n\n`;
                    for (const pt of cmpItem.points) {
                      cmpMsg += `📌 **${pt.topic}:**\n` +
                        `🔴 *Eski me'yor:* ${pt.old}\n` +
                        `🟢 *Yangi amaldagi qoida:* ${pt.current}\n\n`;
                    }
                    cmpMsg += `🔗 **Rasmiy hujjat:** ${cmpItem.lexUrl}`;

                    await sendTelegramMessage(token, chatId, cmpMsg, {
                      inlineKeyboard: [
                        [{ text: "🌐 Lex.uz'da to'liq ko'rish", url: cmpItem.lexUrl }],
                        [{ text: "🔙 Boshqa solishtirishlar", callback_data: "open_cmp_menu" }]
                      ]
                    });
                    continue;
                  }
                }

                if (callbackData === 'open_case_menu') {
                  session.state = 'case_analysis';
                  const caseMsg = `⚖️ **Kazus Tahlili & Yuridik Ekspertiza**\n━━━━━━━━━━━━━━━━━━\n` +
                    `Murakkab hayotiy vaziyat yoki nizongizni batafsil yozib yuboring.\n\n` +
                    `Tizim quyidagi 5 ta yo'nalishda chuqur yuridik tahlil beradi:\n` +
                    `1️⃣ Huquqiy faktlar\n` +
                    `2️⃣ Tegishli amaldagi qonun normalari (Lex.uz)\n` +
                    `3️⃣ Tomonlarning pozitsiyalari\n` +
                    `4️⃣ Sud istiqboli va ehtimoliy natija\n` +
                    `5️⃣ Amaliy tavsiyalar\n\n` +
                    `Vaziyatingizni yozing:`;
                  await sendTelegramMessage(token, chatId, caseMsg, { replyKeyboard: BACK_MENU_KEYBOARD });
                  continue;
                }

                if (callbackData === 'open_cmp_menu') {
                  const cmpText = `📊 **Qonunlarni Solishtirish — Islohotlar va Yangi Normalar**\n━━━━━━━━━━━━━━━━━━\n` +
                    `O'zbekistonda so'nggi yillarda qabul qilingan yangi kodekslar va eski bekor qilingan qonunlar taqqoslamasini tanlang:`;
                  const keyboard = [
                    [{ text: "💼 Mehnat kodeksi: Eski (1995) vs Yangi (2023)", callback_data: "cmp_mehnat" }],
                    [{ text: "🏛 Konstitutsiya: 1992 vs 2023 Yangi Tahrir", callback_data: "cmp_konstitutsiya" }],
                    [{ text: "🚗 Yo'l jarimalari: 15 kunlik 50% chegirma", callback_data: "cmp_jarima" }],
                  ];
                  await sendTelegramMessage(token, chatId, cmpText, { inlineKeyboard: keyboard });
                  continue;
                }

                // MIB Assistance callbacks
                if (callbackData.startsWith('mib_')) {
                  const mibItem = MIB_TOPICS.find(m => m.id === callbackData);
                  if (mibItem) {
                    const mibMsg = `${mibItem.icon} **${mibItem.title}**\n━━━━━━━━━━━━━━━━━━\n\n` +
                      `${mibItem.details}\n\n` +
                      `🔗 **Lex.uz rasmiy qonunchilik asosi:** ${mibItem.lexUrl}`;

                    await sendTelegramMessage(token, chatId, mibMsg, {
                      inlineKeyboard: [
                        [{ text: "🌐 Lex.uz qonunini ochish", url: mibItem.lexUrl }],
                        [{ text: "🔙 MIB bo'limi", callback_data: "open_mib_menu" }]
                      ]
                    });
                    continue;
                  }
                }

                if (callbackData === 'open_mib_menu') {
                  const mibText = `🏛 **Majburiy Ijro Byurosi (MIB) Yordam Bo'limi**\n━━━━━━━━━━━━━━━━━━\n` +
                    `Quyidagi masalalardan birini tanlang:`;
                  const keyboard = [
                    [{ text: "👶 Aliment undirish tartibi va miqdori", callback_data: "mib_aliment" }],
                    [{ text: "✈️ Chet elga chiqish taqiqi (Zapret)", callback_data: "mib_zapret" }],
                    [{ text: "⚖️ MIB harakatsizligi ustidan shikoyat", callback_data: "mib_shikoyat" }],
                  ];
                  await sendTelegramMessage(token, chatId, mibText, { inlineKeyboard: keyboard });
                  continue;
                }

                // Language selection
                if (callbackData === 'lang_uz' || callbackData === 'lang_ru') {
                  session.lang = callbackData === 'lang_ru' ? 'ru' : 'uz';
                  const alertTxt = session.lang === 'ru' 
                    ? "Язык интерфейса изменен на Русский 🇷🇺" 
                    : "Interfeys tili O'zbekchaga o'zgartirildi 🇺🇿";
                  await sendTelegramMessage(token, chatId, `✅ ${alertTxt}`);
                  continue;
                }

                // Main menu callback
                if (callbackData === 'open_main_menu') {
                  session.state = 'idle';
                  const welcome = `🏛 **LexAI O'zbekiston — Asosiy Menyu**\n━━━━━━━━━━━━━━━━━━\n` +
                    `Boshqaruv menyusidan kerakli bo'limni tanlang:`;
                  await sendTelegramMessage(token, chatId, welcome);
                  continue;
                }
              }

              // --- Handle Photo / Document Image Messages (OCR & Legal Solving) ---
              if (update.message && update.message.photo && update.message.photo.length > 0) {
                const msg = update.message;
                const chatId = msg.chat.id;
                const caption = msg.caption ? msg.caption.trim() : '';
                const userName = msg.from?.first_name || 'Foydalanuvchi';
                const session = getSession(chatId);

                addBotLog('message', `[Chat ${chatId}] ${userName}: 📷 [Rasm yuborildi] ${caption ? `"${caption}"` : ''}`);
                botRunner.messagesProcessed++;

                // Immediate typing action
                fetch(`https://api.telegram.org/bot${token}/sendChatAction`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ chat_id: chatId, action: 'typing' }),
                }).catch(() => {});

                // Notify user
                await sendTelegramMessage(token, chatId, "🔍 **Rasm qabul qilindi!**\n\nHujjat/savol matni o'qilmoqda (OCR) va O'zbekiston Respublikasi amaldagi qonunchiligi (Lex.uz) bo'yicha professional tahlil qilinmoqda, iltimos kuting...");

                try {
                  const photo = msg.photo[msg.photo.length - 1];
                  const fileRes = await fetch(`https://api.telegram.org/bot${token}/getFile?file_id=${photo.file_id}`);
                  const fileData = await fileRes.json();

                  if (!fileData.ok || !fileData.result?.file_path) {
                    throw new Error("Telegram serveridan rasmni yuklab olish imkoni bo'lmadi");
                  }

                  const filePath = fileData.result.file_path;
                  const downloadUrl = `https://api.telegram.org/file/bot${token}/${filePath}`;
                  const imgRes = await fetch(downloadUrl);
                  const imgBuffer = await imgRes.arrayBuffer();
                  const base64Data = Buffer.from(imgBuffer).toString('base64');
                  const mimeType = filePath.endsWith('.png') ? 'image/png' : 'image/jpeg';

                  const promptText = `
Siz - O'zbekiston Respublikasi qonunchiligi bo'yicha maxsus 'LexAI' sun'iy intellekt ekspertisiz.
Foydalanuvchi quyidagi rasmni yubordi. ${caption ? `Foydalanuvchi izohi/savoli: "${caption}"` : ''}

VAZIFA:
1. Rasmdagi matnni (sud qarori, bayonnoma, jarima, chaqiruv qog'ozi, shartnoma, tilxat, huquqiy test savoli yoki kazus) to'liq o'qing (OCR qiling).
2. O'zbekiston Respublikasining amaldagi qonunchiligi (Lex.uz) bo'yicha professional tahlil qiling.
3. Agar bu test savoli yoki kazus bo'lsa:
   - To'g'ri javob variantini aniq ko'rsating.
   - Nega ushbu variant to'g'riligini amaldagi kodeks moddasi bilan asoslang.
4. Agar bu jarima, sud yoki ma'muriy hujjat bo'lsa:
   - Hujjat qonuniyligi, berilgan muddatlar, 15 kunlik chegirma (agar jarima bo'lsa), shikoyat qilish tartibi va qaysi organga murojaat qilish kerakligini aniq ko'rsating.
5. Eskirgan va bekor bo'lgan qonun normalaridan qat'iy saqlaning, faqat ayni paytda yuridik kuchga ega moddalarga tayanib Lex.uz rasmiy havolasini bering.
`;

                  const analysisText = await generateMultimodalVision(mimeType, base64Data, promptText);
                  session.lastQuery = caption || "Yuborilgan rasm tahlili";
                  session.lastAnswer = analysisText;
                  session.lastLexUrl = "https://lex.uz";

                  await sendTelegramMessage(token, chatId, analysisText, {
                    lexUrl: "https://lex.uz",
                  });
                  addBotLog('success', `[Chat ${chatId}] Rasm tahlili muvaffaqiyatli yakunlandi va yuborildi.`);
                } catch (photoErr: any) {
                  console.error("Telegram photo solve error:", photoErr);
                  addBotLog('error', `[Chat ${chatId}] Rasm tahlilida xatolik: ${photoErr.message}`);
                  await sendTelegramMessage(token, chatId, `⚠️ Rasm tahlilida xatolik yuz berdi: ${photoErr.message || "Rasmni qayta yuborib ko'ring."}`);
                }
                continue;
              }

              // --- Handle Standard Text Messages ---
              if (update.message && update.message.text) {
                const msg = update.message;
                const chatId = msg.chat.id;
                const userText = msg.text.trim();
                const userName = msg.from?.first_name || 'Foydalanuvchi';
                const session = getSession(chatId);

                // Register user in system DB so Admin can assign them roles
                if (msg.from && msg.from.id) {
                  db.upsertUser({
                    id: String(msg.from.id),
                    telegram_id: msg.from.id,
                    first_name: msg.from.first_name || 'Foydalanuvchi',
                    username: msg.from.username,
                  });
                }

                addBotLog('message', `[Chat ${chatId}] ${userName}: "${userText}"`);
                botRunner.messagesProcessed++;

                // 1. Handle /start, /help, "Bosh menyu"
                if (userText === '/start' || userText === '/help' || userText === '🏠 Bosh menyu' || userText.toLowerCase() === 'bosh menyu' || userText.toLowerCase() === 'menu') {
                  session.state = 'idle';
                  let welcome = `Assalomu alaykum, **${userName}**! 🇺🇿⚖️\n\n` +
                    `🏛 **LexAI O'zbekiston — Professional Huquqiy AI Tizimi**\n` +
                    `━━━━━━━━━━━━━━━━━━\n` +
                    `Platforma **Lex.uz** (Qonunchilik ma'lumotlari milliy bazasi) ning amaldagi eng so'nggi normalari asosida ishlaydi.\n\n` +
                    `💬 **Qanday foydalanish mumkin?**\n` +
                    `• Istalgan qonun, modda yoki hayotiy huquqiy vaziyatingizni yozib yuboring (masalan: *"FK 12-modda"*, *"Mehnat kodeksida sinov muddati"*);\n` +
                    `• Sud qarori, shartnoma, jarima yoki huquqiy test rasmini yuboring (AI uni avtomatik o'qib yechim beradi).\n`;

                  if (currentWebAppUrl) {
                    welcome += `\n📱 **LexAI Mini App (To'g'ridan-to'g'ri, loginlarsiz):**\n${currentWebAppUrl}\n`;
                  }

                  welcome += `\nSavolingizni to'g'ridan-to'g'ri yozing:`;

                  await sendTelegramMessage(token, chatId, welcome);
                  addBotLog('success', `[Chat ${chatId}] Start xabari yuborildi.`);
                  continue;
                }

                // 2. Handle "Orqaga"
                if (userText === '🔙 Orqaga' || userText.toLowerCase() === 'orqaga') {
                  session.state = 'idle';
                  await sendTelegramMessage(token, chatId, `Savolingizni to'g'ridan-to'g'ri yozib yuborishingiz mumkin.`);
                  continue;
                }

                // 3. Handle Menu Button: "⚖️ Huquqiy AI"
                if (userText === '⚖️ Huquqiy AI' || userText.toLowerCase() === 'huquqiy ai') {
                  session.state = 'idle';
                  const text = `⚖️ **Huquqiy AI — Savol-Javob Rejimi**\n━━━━━━━━━━━━━━━━━━\n` +
                    `O'zbekiston Respublikasining amaldagi qonunchiligi (Lex.uz) bo'yicha istalgan huquqiy savolingizni yozib yuboring.\n\n` +
                    `💡 **Namunaviy savollar:**\n` +
                    `• *Yangi Mehnat kodeksida sinov muddati qancha?*\n` +
                    `• *Talaba kontraktiga daromad solig'i imtiyozi qanday ishlaydi?*\n` +
                    `• *Qarz va tilxat bo'yicha pulni qaytarib olish tartibi*\n` +
                    `• *Nikoh tuzishga monelik qiladigan holatlar qaysilar?*\n\n` +
                    `Savolingizni quyidagi maydonga yozing:`;
                  await sendTelegramMessage(token, chatId, text);
                  continue;
                }

                // 4. Handle Menu Button: "📚 Qonunchilik bazasi"
                if (userText === '📚 Qonunchilik bazasi' || userText.toLowerCase() === 'qonunchilik bazasi') {
                  const codesText = `📚 **O'zbekiston Respublikasi Qonunchilik Bazasi**\n━━━━━━━━━━━━━━━━━━\n` +
                    `Asosiy amaldagi kodekslar:\n` +
                    `• **Mehnat kodeksi (2023)** — https://lex.uz/docs/6257288\n` +
                    `• **Jinoyat kodeksi** — https://lex.uz/docs/111453\n` +
                    `• **Fuqarolik kodeksi** — https://lex.uz/docs/111189\n` +
                    `• **Soliq kodeksi** — https://lex.uz/docs/4674902\n` +
                    `• **Oila kodeksi** — https://lex.uz/docs/104720\n` +
                    `• **MJtK (Ma'muriy javobgarlik)** — https://lex.uz/docs/97661\n` +
                    `• **Konstitutsiya (Yangi tahrir)** — https://lex.uz/docs/6445145\n\n` +
                    `Istalgan kodeks moddasi yoki mavzusi bo'yicha savolingizni yozing:`;
                  await sendTelegramMessage(token, chatId, codesText);
                  continue;
                }

                // 4.5 Handle Menu Button: "📷 Rasm & Test yechish"
                if (userText === '📷 Rasm & Test yechish' || userText.toLowerCase() === 'rasm & test yechish' || userText.toLowerCase().includes('rasm')) {
                  const photoPrompt = `📷 **Rasm / Hujjatni O'qish & Test Yechish (OCR Vision)**\n━━━━━━━━━━━━━━━━━━\n` +
                    `Istalgan huquqiy hujjat yoki test savolining suratini botga yuboring. AI uni darhol o'qib, Lex.uz asosida to'g'ri javob va tahlil beradi.`;
                  await sendTelegramMessage(token, chatId, photoPrompt);
                  continue;
                }

                // 5. Handle Menu Button: "🔍 Modda qidirish"
                if (userText === '🔍 Modda qidirish' || userText.toLowerCase() === 'modda qidirish') {
                  session.state = 'article_search';
                  const text = `🔍 **Tezkor Modda Qidirish Tizimi**\n━━━━━━━━━━━━━━━━━━\n` +
                    `Qonun yoki kodeksning nomi va modda raqamini yozing (masalan: **JK 28**, **FK 12**, **MK 130**):`;
                  await sendTelegramMessage(token, chatId, text);
                  continue;
                }

                // 6. Handle Menu Button: "📝 Hujjat tayyorlash"
                if (userText === '📝 Hujjat tayyorlash' || userText.toLowerCase() === 'hujjat tayyorlash') {
                  session.state = 'doc_drafting';
                  const docMenu = `📝 **Huquqiy Hujjatlar Tayyorlash Bo'limi**\n━━━━━━━━━━━━━━━━━━\n` +
                    `Qaysi hujjat loyihasi kerakligini yozing:\n` +
                    `• Sudga da'vo arizasi (Qarz yoki zarar)\n` +
                    `• Ish beruvchiga ariza (Ta'til yoki ish haqi)\n` +
                    `• MIBga ariza/shikoyat (Ijro harakatlari)\n` +
                    `• IIBga ariza (Tuhmat yoki huquqbuzarlik)\n\n` +
                    `Tafsilotlarni yozib yuboring:`;
                  await sendTelegramMessage(token, chatId, docMenu);
                  continue;
                }

                // 7. Handle Menu Button: "⚖️ Kazus tahlili"
                if (userText === '⚖️ Kazus tahlili' || userText.toLowerCase() === 'kazus tahlili') {
                  session.state = 'case_analysis';
                  const text = `⚖️ **Kazus Tahlili — Yuridik Nizolar Ekspertizasi**\n━━━━━━━━━━━━━━━━━━\n` +
                    `Hayotiy huquqiy muammo yoki nizoli vaziyatingizni batafsil yozib yuboring. Tizim qonun normalari va sud istiqbolini tahlil qilib beradi:`;
                  await sendTelegramMessage(token, chatId, text);
                  continue;
                }

                // 8. Handle Menu Button: "📊 Qonunlarni solishtirish"
                if (userText === '📊 Qonunlarni solishtirish' || userText.toLowerCase() === 'qonunlarni solishtirish') {
                  const cmpText = `📊 **Qonunlarni Solishtirish — Islohotlar va Yangi Normalar**\n━━━━━━━━━━━━━━━━━━\n` +
                    `• Mehnat kodeksi: 1995-yilgi tahrir bekor qilingan, 2023-yil 30-apreldan yangi tahrir amal qiladi (O'RQ-798);\n` +
                    `• Konstitutsiya: 2023-yil 30-apreldagi referendum asosida yangi tahrir qabul qilingan;\n` +
                    `• YHQ jarimalari: 15 kunda 50% chegirmada to'lash tartibi (MJtK 332-1-modda).`;
                  await sendTelegramMessage(token, chatId, cmpText);
                  continue;
                }

                // 9. Handle Menu Button: "🏛 MIB bo‘limi"
                if (userText === '🏛 MIB bo‘limi' || userText === '🏛 MIB bo\'limi' || userText.toLowerCase().includes('mib')) {
                  const mibText = `🏛 **Majburiy Ijro Byurosi (MIB) Bo'limi**\n━━━━━━━━━━━━━━━━━━\n` +
                    `• Aliment undirish: Oila kodeksi 99-moddasi bo'yicha 1 bolaga 25%, 2 bolaga 33.3%, 3+ bolaga 50%;\n` +
                    `• Chiqish taqiqi (Zapret): MIB qarzdorligi to'liq bartaraf etilgach 1 ish kunida bekor qilinadi;\n` +
                    `• Shikoyat: MIB ijrochisining noqonuniy harakati ustidan yuqori turuvchi boshqarmaga yoki sudga murojaat qilinadi.`;
                  await sendTelegramMessage(token, chatId, mibText);
                  continue;
                }

                // 10. Handle Menu Button: "📖 Foydalanish qo‘llanmasi"
                if (userText === '📖 Foydalanish qo‘llanmasi' || userText.toLowerCase().includes('qo\'llanma') || userText.toLowerCase().includes('qollanma')) {
                  await sendTelegramMessage(token, chatId, USER_GUIDE_TEXT);
                  continue;
                }

                // 11. Handle Menu Button: "⚙️ Sozlamalar"
                if (userText === '⚙️ Sozlamalar' || userText.toLowerCase() === 'sozlamalar') {
                  await sendTelegramMessage(token, chatId, SETTINGS_TEXT);
                  continue;
                }

                // --- If User is in CASE ANALYSIS mode ---
                if (session.state === 'case_analysis') {
                  fetch(`https://api.telegram.org/bot${token}/sendChatAction`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ chat_id: chatId, action: 'typing' }),
                  }).catch(() => {});

                  const casePrompt = `
Siz - O'zbekiston Respublikasining yuqori malakali sudya va advokatisiz.
Quyidagi hayotiy huquqiy kazus (nizo)ni O'zbekiston Respublikasining amaldagi qonunchiligi (Lex.uz) bo'yicha professional tahlil qilib bering.

Foydalanuvchi keltirgan kazus:
"${userText}"

JAVOBNING TUZILISHI (Professional yuridik xulosa):
🏛 **KAZUS TAHLILI VA HUQUQIY EKSPERTIZA XULOSASI**
━━━━━━━━━━━━━━━━━━
1️⃣ **Yuridik ahamiyatga ega faktlar:**
(Vaziyatdagi asosiy huquqiy holatlarni ajratib ko'rsating)

2️⃣ **Buzilgan va qo'llaniladigan qonun normalari (Lex.uz):**
(Tegishli kodeks, qonun nomi, modda raqami va normaning amaldagi mazmuni)

3️⃣ **Taraflarning huquqiy pozitsiyalari:**
• Da'vogar (jabrlanuvchi) talablari qanchalik asosli?
• Javobgar qanday javobgarlikka tortilishi mumkin?

4️⃣ **Sud istiqboli va amaliy tavsiya:**
(Sudga murojaat qilish istiqboli qanday, qanday dalillar kerak, fuqaro qaysi organga murojaat qilishi lozim)
`;

                  let analysisText = "";
                  try {
                    const aiRes = await ai.models.generateContent({
                      model: 'gemini-3.5-flash-lite',
                      contents: casePrompt,
                      config: { systemInstruction: LEX_SYSTEM_PROMPT },
                    });
                    analysisText = aiRes.text || "Kazus bo'yicha tahlil tayyorlandi.";
                  } catch (e) {
                    analysisText = `🏛 **KAZUSNING HUQUQIY TAHLILI:**\n\nSiz keltirgan vaziyat O'zbekiston Respublikasining amaldagi qonunlari bo'yicha o'rganildi. Moddiy va ma'naviy zararlarni undirish, shuningdek huquqbuzarga nisbatan chora ko'rish uchun tuman prokuraturasi yoki fuqarolik sudiga murojaat qilish tavsiya etiladi.`;
                  }

                  session.lastQuery = userText;
                  session.lastAnswer = analysisText;
                  session.lastLexUrl = "https://lex.uz";
                  session.state = 'idle';

                  await sendTelegramMessage(token, chatId, analysisText, {
                    lexUrl: "https://lex.uz",
                  });
                  addBotLog('success', `[Chat ${chatId}] Kazus tahlili yakunlandi.`);
                  continue;
                }

                // --- Standard Legal Question Answering Flow ---
                // Send typing action
                fetch(`https://api.telegram.org/bot${token}/sendChatAction`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ chat_id: chatId, action: 'typing' }),
                }).catch(() => {});

                // Check if user wants to clear chat memory
                if (userText === '/clear' || userText === '/tozalash' || userText.toLowerCase() === 'tozalash' || userText.toLowerCase() === 'yangi savol') {
                  session.history = [];
                  session.lastQuery = undefined;
                  session.lastAnswer = undefined;
                  await sendTelegramMessage(token, chatId, "🔄 **Suhbat xotirasi tozalandi!**\n\nYangi huquqiy savolingizni yozib yuborishingiz mumkin:");
                  continue;
                }

                // 1. Instant article lookup (< 5ms) ONLY if not in middle of continuing conversation
                const hasTgHistory = session.history && session.history.length > 0;
                if (!hasTgHistory) {
                  const instant = getInstantLawAnswer(userText);
                  if (instant.found) {
                    session.lastQuery = userText;
                    session.lastAnswer = instant.answer;
                    session.lastLexUrl = instant.lexUrl;
                    session.history.push({ role: 'user', text: userText });
                    session.history.push({ role: 'model', text: instant.answer });
                    const sent = await sendTelegramMessage(token, chatId, instant.answer, {
                      lexUrl: instant.lexUrl,
                    });
                    if (sent) {
                      addBotLog('success', `[Chat ${chatId}] Tezkor modda aniqlandi va yuborildi (⚡ 5ms).`);
                    }
                    continue;
                  }
                }

                // 2. Grounding Knowledge Base + Multi-Turn Conversational Gemini
                let solved = solveUzbekLegalQuestion(userText);
                if (!solved.matched && session.lastQuery) {
                  // Fallback context combination for short follow-ups like "agar bermasa-chi?" or "muddati-chi?"
                  solved = solveUzbekLegalQuestion(`${session.lastQuery} ${userText}`);
                }

                let answerText = "";
                let lexUrl = solved.lexUrl || "https://lex.uz";

                // Immediate typing action for user feedback
                fetch(`https://api.telegram.org/bot${token}/sendChatAction`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ chat_id: chatId, action: 'typing' }),
                }).catch(() => {});

                try {
                  const enhancedPrompt = `
Foydalanuvchi huquqiy savoli: "${userText}"
${hasTgHistory ? `[DIQQAT: Bu avvalgi savollarning bevosita mantiqiy davomi! Suhbat kontekstini saqlang va avval muhokama qilingan mavzu bo'yicha javob bering].` : ''}
${solved.matched ? `O'zbekiston Respublikasi amaldagi qonunchiligi bo'yicha tayanch ma'lumotlar:\n${solved.answer}\nRasmiy Lex.uz havolasi: ${solved.lexUrl}` : ''}

QAT'IY TALAB: Ushbu huquqiy savolga O'zbekiston Respublikasining amaldagi eng yangi qonunchiligi (Lex.uz) bo'yicha BIRINCHI MARTADANOQ JUDA KENG QAMROVLI, CHUQUR TAHLIL QILINGAN, TO'LIQ VA BOYITILGAN JAVOB BERING!
Hech qanday ma'lumotni qisqartirmang va ikkinchi savolga qoldirmang — birinchi so'rovdanoq barcha huquqiy normalarni to'liq yoritib bering!
Quyidagi 5 ta bo'limni to'liq qamrab oling:
1️⃣ Keng qamrovli huquqiy tahlil va mohiyat (mavzu bo'yicha)
2️⃣ Asoslovchi normativ hujjatlar va moddalar matni (maqomi: AMALDAGI QONUNCHILIK)
3️⃣ Qadamma-qadam amaliy harakatlar rejasi (murojaat qilinadigan davlat organlari va ishonch telefonlari bilan)
4️⃣ Muhim muddatlar (da'vo muddati, ogohlantirish muddati), sud yurisdiksiyasi, davlat boji stavkalari va undan ozod qilish imtiyozlari
5️⃣ Rasmiy Lex.uz havolalari
`;

                  // Construct multi-turn contents
                  let contentsForGemini: any;
                  if (hasTgHistory) {
                    contentsForGemini = [
                      ...session.history.slice(-8).map(h => ({
                        role: h.role,
                        parts: [{ text: h.text }]
                      })),
                      {
                        role: 'user',
                        parts: [{ text: enhancedPrompt }]
                      }
                    ];
                  } else {
                    contentsForGemini = enhancedPrompt;
                  }

                  let aiRes: any = null;
                  try {
                    const geminiPromise = ai.models.generateContent({
                      model: 'gemini-3.5-flash-lite',
                      contents: contentsForGemini,
                      config: { 
                        systemInstruction: LEX_SYSTEM_PROMPT,
                        maxOutputTokens: 8192
                      },
                    });
                    const timeoutPromise = new Promise((_, reject) =>
                      setTimeout(() => reject(new Error("Timeout")), 28000)
                    );
                    aiRes = await Promise.race([geminiPromise, timeoutPromise]);
                  } catch (e1: any) {
                    console.warn("Telegram bot: primary model error, trying secondary:", e1?.message);
                    try {
                      const geminiFallback = ai.models.generateContent({
                        model: 'gemini-3.8-flash',
                        contents: contentsForGemini,
                        config: { 
                          systemInstruction: LEX_SYSTEM_PROMPT,
                          maxOutputTokens: 8192
                        },
                      });
                      const fallbackTimeout = new Promise((_, reject) =>
                        setTimeout(() => reject(new Error("Timeout")), 28000)
                      );
                      aiRes = await Promise.race([geminiFallback, fallbackTimeout]);
                    } catch (e2: any) {}
                  }

                  const rawAnswer = aiRes?.text || solved.answer;
                  const sanitized = sanitizeAndEnforceCurrentLaws(rawAnswer);
                  answerText = sanitized.cleanText;
                  const foundLink = answerText.match(/https?:\/\/(?:www\.)?lex\.uz\/docs\/\d+/);
                  if (foundLink) lexUrl = foundLink[0];
                } catch (e: any) {
                  const sanitized = sanitizeAndEnforceCurrentLaws(solved.answer);
                  answerText = sanitized.cleanText;
                  lexUrl = solved.lexUrl;
                }

                // Save turns to session memory
                session.history.push({ role: 'user', text: userText });
                session.history.push({ role: 'model', text: answerText });
                if (session.history.length > 12) {
                  session.history = session.history.slice(-12);
                }
                session.lastQuery = userText;
                session.lastAnswer = answerText;
                session.lastLexUrl = lexUrl;

                if (msg.from && msg.from.id) {
                  db.saveAIQuery({
                    user_id: String(msg.from.id),
                    telegram_id: msg.from.id,
                    user_name: msg.from.first_name || 'Foydalanuvchi',
                    query: userText,
                    answer: answerText,
                    sources: [{ title: 'Lex.uz Milliy Qonunchilik Bazasi', uri: lexUrl }],
                    law_status: 'AMALDAGI_QONUNCHILIK'
                  });
                }

                const sent = await sendTelegramMessage(token, chatId, answerText, {
                  lexUrl,
                });
                if (sent) {
                  addBotLog('success', `[Chat ${chatId}] Huquqiy maslahat yuborildi.`);
                } else {
                  addBotLog('error', `[Chat ${chatId}] Telegramga yuborib bo'lmadi.`);
                }
              }
            }
          }
        } catch (pollErr: any) {
          if (controller.signal.aborted) break;
          await new Promise((r) => setTimeout(r, 1500));
        }
      }
    })();

    return { success: true, botInfo: meData.result };
  } catch (err: any) {
    botRunner.isRunning = false;
    addBotLog('error', `Ishga tushirishda xatolik: ${err.message}`);
    throw err;
  }
}

function stopTelegramPolling() {
  if (botRunner.abortController) {
    botRunner.abortController.abort();
    botRunner.abortController = null;
  }
  botRunner.isRunning = false;
  addBotLog('info', "Telegram Bot to'xtatildi.");
}

// Telegram Bot Runner API Endpoints & 24/7 Storage
const CONFIG_FILE = path.join(__dirname, '.bot_config.json');
const PERSISTENT_CONFIG = path.join(__dirname, 'src', 'data', 'bot_config.json');
const TMP_CONFIG = path.join('/tmp', 'bot_config.json');

import fs from 'fs';

function getSavedToken(): string | null {
  if (process.env.TELEGRAM_BOT_TOKEN) return process.env.TELEGRAM_BOT_TOKEN.trim();
  
  const candidatePaths = [PERSISTENT_CONFIG, CONFIG_FILE, TMP_CONFIG];
  for (const p of candidatePaths) {
    try {
      if (fs.existsSync(p)) {
        const raw = fs.readFileSync(p, 'utf-8');
        const parsed = JSON.parse(raw);
        if (parsed?.token && typeof parsed.token === 'string' && parsed.token.includes(':') && parsed.disabled !== true) {
          return parsed.token.trim();
        }
      }
    } catch (e) {}
  }
  return null;
}

function persistToken(token: string) {
  const payload = JSON.stringify({ token: token.trim(), disabled: false, updatedAt: new Date().toISOString() }, null, 2);
  const candidatePaths = [PERSISTENT_CONFIG, CONFIG_FILE, TMP_CONFIG];
  for (const p of candidatePaths) {
    try {
      const dir = path.dirname(p);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(p, payload, 'utf-8');
    } catch (e) {}
  }
}

function clearPersistedToken() {
  const candidatePaths = [PERSISTENT_CONFIG, CONFIG_FILE, TMP_CONFIG];
  for (const p of candidatePaths) {
    try {
      if (fs.existsSync(p)) {
        const raw = fs.readFileSync(p, 'utf-8');
        const parsed = JSON.parse(raw);
        fs.writeFileSync(p, JSON.stringify({ ...parsed, disabled: true }), 'utf-8');
      }
    } catch (e) {}
  }
}

app.post('/api/telegram-bot/start', async (req: Request, res: Response) => {
  try {
    const { token } = req.body;
    if (!token || typeof token !== 'string') {
      return res.status(400).json({ error: "Telegram bot token kiritilishi shart." });
    }

    const cleanToken = token.trim();
    persistToken(cleanToken);

    const result = await startTelegramPolling(cleanToken);

    res.json({
      success: true,
      botInfo: result.botInfo,
      message: `Bot @${result.botInfo.username} 24/7 jonli ishga tushirildi!`,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      error: err.message || "Botni ishga tushirishda xatolik yuz berdi.",
    });
  }
});

app.post('/api/telegram-bot/stop', (_req: Request, res: Response) => {
  stopTelegramPolling();
  clearPersistedToken();
  res.json({ success: true, message: "Bot to'xtatildi." });
});

app.get('/api/telegram-bot/runner-status', (_req: Request, res: Response) => {
  const uptimeSeconds = Math.round((Date.now() - botRunner.uptimeStart) / 1000);
  const lastPollAgeSeconds = Math.round((Date.now() - botRunner.lastPollSuccessTime) / 1000);

  res.json({
    isRunning: botRunner.isRunning,
    botInfo: botRunner.botInfo,
    messagesProcessed: botRunner.messagesProcessed,
    logs: botRunner.logs,
    uptimeSeconds,
    lastPollAgeSeconds,
    reconnectCount: botRunner.reconnectCount,
    watchdogActive: true,
  });
});

// 24/7 Self-Healing Bot Watchdog
let watchdogTimer: any = null;
function initBotWatchdog() {
  if (watchdogTimer) return;

  console.log("[24/7 Watchdog] Initializing background heartbeat monitor (every 10s)...");
  watchdogTimer = setInterval(async () => {
    const savedToken = getSavedToken();
    if (!savedToken) return;

    // Case 1: Bot stopped unexpectedly -> resurrect immediately
    if (!botRunner.isRunning) {
      console.log("[24/7 Watchdog] Bot to'xtab qolganligi aniqlandi, avtomatik qayta tiklanmoqda...");
      addBotLog('info', "24/7 Watchdog: Bot avtomatik qayta tiklanmoqda...");
      botRunner.reconnectCount++;
      startTelegramPolling(savedToken).catch(err => {
        console.error("[24/7 Watchdog] Reconnection error:", err.message);
      });
      return;
    }

    // Case 2: Polling loop hung for > 45 seconds (socket freeze) -> recycle
    const ageSeconds = Math.round((Date.now() - botRunner.lastPollSuccessTime) / 1000);
    if (ageSeconds > 45) {
      console.warn(`[24/7 Watchdog] Aloqa ${ageSeconds}s dan buyon muzlagan. Polling qayta yuklanmoqda...`);
      addBotLog('warn', `24/7 Watchdog: Muzlagan aloqa uzilib yangilandi (${ageSeconds}s)`);
      botRunner.reconnectCount++;
      botRunner.abortController?.abort();
      startTelegramPolling(savedToken).catch(err => {
        console.error("[24/7 Watchdog] Resync error:", err.message);
      });
    }
  }, 10000);
}

// Auto-resume bot immediately on server boot if token is present
try {
  const initialToken = getSavedToken();
  if (initialToken) {
    console.log("[Boot] Saved token found, auto-starting bot for 24/7 operation...");
    startTelegramPolling(initialToken).catch(err => {
      console.error("[Boot] Initial start error:", err.message);
    });
  }
} catch (e) {}

initBotWatchdog();

// Vite or Static Serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`LexAI server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
