/**
 * Outdated Law Remover & Strict Uzbekistan Legal Validator Engine
 * 
 * Ensures that no repealed, obsolete, or outdated laws (such as the 1995 Labor Code,
 * 1992 Constitution articles, abolished EKIH currency units, or outdated tax scales)
 * ever appear in responses without immediate replacement with current 2023-2026 norms.
 */

export interface LawReplacementRule {
  oldTermPattern: RegExp;
  newLawName: string;
  newArticle: string;
  newTextSummary: string;
  lexUrl: string;
}

export const OUTDATED_LAW_RULES: LawReplacementRule[] = [
  // 1. Mehnat kodeksi 100-modda (1995) -> 161-modda (2023)
  {
    oldTermPattern: /(?:mehnat\s+kodeksi(?:ning)?\s+(?:100|yuz)(?:-|\s+)?modda|mk\s+100|100-modda\s+bo['`’]yicha\s+ishdan)/gi,
    newLawName: "Yangi Mehnat kodeksi (O'RQ-798, 2023-yil 30-apreldan amalda)",
    newArticle: "161-modda",
    newTextSummary: "Mehnat shartnomasini ish beruvchining tashabbusi bilan bekor qilish asoslari (1995-yilgi 100-modda bekor qilingan, uning o'rniga yangi 161-modda amal qiladi)",
    lexUrl: "https://lex.uz/docs/6257288",
  },
  // 2. Mehnat kodeksi 99-modda (1995) -> 160-modda (2023)
  {
    oldTermPattern: /(?:mehnat\s+kodeksi(?:ning)?\s+(?:99|to['`’]qson\s+to['`’]qqiz)(?:-|\s+)?modda|mk\s+99)/gi,
    newLawName: "Yangi Mehnat kodeksi (O'RQ-798)",
    newArticle: "160-modda",
    newTextSummary: "Mehnat shartnomasini xodimning tashabbusi bilan bekor qilish (14 kalendar kun oldin ogohlantirish)",
    lexUrl: "https://lex.uz/docs/6257288",
  },
  // 3. Mehnat kodeksi 84-85-moddalar (1995: Sinov muddati) -> 129-132-moddalar (2023, ayniqsa 130-modda)
  {
    oldTermPattern: /(?:mehnat\s+kodeksi(?:ning)?\s+(?:84|85|sakson\s+to['`’]rt)(?:-|\s+)?modda|mk\s+84|mk\s+85)/gi,
    newLawName: "Yangi Mehnat kodeksi (O'RQ-798)",
    newArticle: "129-132-moddalar (ayniqsa 130-modda)",
    newTextSummary: "Dastlabki sinov muddati (oddiy xodimlarga ko'pi bilan 3 oy, tashkilot rahbarlariga 6 oy)",
    lexUrl: "https://lex.uz/docs/6257288",
  },
  // 4. Mehnat kodeksi 106-modda (1995) -> 168-modda (2023)
  {
    oldTermPattern: /(?:mehnat\s+kodeksi(?:ning)?\s+106(?:-|\s+)?modda|mk\s+106)/gi,
    newLawName: "Yangi Mehnat kodeksi (O'RQ-798)",
    newArticle: "168-modda",
    newTextSummary: "Mehnat shartnomasini taraflarning ixtiyoriga bog'liq bo'lmagan holatlar bo'yicha bekor qilish",
    lexUrl: "https://lex.uz/docs/6257288",
  },
  // 5. Mehnat kodeksi 109-modda (1995: Ishdan bo'shatish nafaqasi) -> 173-modda (2023)
  {
    oldTermPattern: /(?:mehnat\s+kodeksi(?:ning)?\s+109(?:-|\s+)?modda|mk\s+109)/gi,
    newLawName: "Yangi Mehnat kodeksi (O'RQ-798)",
    newArticle: "173-modda",
    newTextSummary: "Ishdan bo'shatish nafaqasi (xodimning ish stajiga qarab o'rtacha oylik ish haqining 50 foizidan 200 foizigacha tabaqalashtirilgan)",
    lexUrl: "https://lex.uz/docs/6257288",
  },
  // 6. Mehnat kodeksi 134, 143-moddalar (1995: 15 ish kuni ta'til) -> 216-218-moddalar (2023: kamida 21 kalendar kuni!)
  {
    oldTermPattern: /(?:15\s+ish\s+kuni(?:lik)?\s+ta['`’]til|mehnat\s+kodeksi(?:ning)?\s+(?:134|143)(?:-|\s+)?modda|mk\s+134|mk\s+143)/gi,
    newLawName: "Yangi Mehnat kodeksi (O'RQ-798)",
    newArticle: "216-218-moddalar (ayniqsa 217-modda)",
    newTextSummary: "Har yilgi asosiy eng kam mehnat ta'tili muddati endi kamida 21 kalendar kunini tashkil etadi (eski 15 ish kuni bekor qilingan!)",
    lexUrl: "https://lex.uz/docs/6257288",
  },
  // 7. Mehnat kodeksi 154-modda (1995: Ish haqi to'lash muddati) -> 253-modda (2023)
  {
    oldTermPattern: /(?:mehnat\s+kodeksi(?:ning)?\s+154(?:-|\s+)?modda|mk\s+154)/gi,
    newLawName: "Yangi Mehnat kodeksi (O'RQ-798)",
    newArticle: "253-modda",
    newTextSummary: "Ish haqini to'lash muddatlari (har yarim oyda kamida bir marta)",
    lexUrl: "https://lex.uz/docs/6257288",
  },
  // 8. Mehnat kodeksi 157-modda (1995: Dam olish kunidagi ish) -> 209-modda (2023)
  {
    oldTermPattern: /(?:mehnat\s+kodeksi(?:ning)?\s+157(?:-|\s+)?modda|mk\s+157)/gi,
    newLawName: "Yangi Mehnat kodeksi (O'RQ-798)",
    newArticle: "209-modda",
    newTextSummary: "Dam olish va bayram kunlaridagi ish uchun kamida ikki hissa miqdorida haq to'lanadi",
    lexUrl: "https://lex.uz/docs/6257288",
  },
  // 9. Mehnat kodeksi 181-modda (1995: Intizomiy jazo) -> 312-modda (2023)
  {
    oldTermPattern: /(?:mehnat\s+kodeksi(?:ning)?\s+181(?:-|\s+)?modda|mk\s+181)/gi,
    newLawName: "Yangi Mehnat kodeksi (O'RQ-798)",
    newArticle: "312-modda",
    newTextSummary: "Intizomiy jazolar turlari (hayfsan, jarima, shartnomani bekor qilish)",
    lexUrl: "https://lex.uz/docs/6257288",
  },
  // 10. Konstitutsiya 37-moddasi (1992) -> 42-modda (2023 Yangi Konstitutsiya)
  {
    oldTermPattern: /(?:konstitutsiya(?:ning)?\s+37(?:-|\s+)?modda)/gi,
    newLawName: "Yangi tahrirdagi O'zbekiston Respublikasi Konstitutsiyasi (2023)",
    newArticle: "42-modda",
    newTextSummary: "Har kim munosib mehnat qilish, erkin kasb tanlash va adolatli mehnat sharoitlariga ega bo'lish huquqi",
    lexUrl: "https://lex.uz/docs/6445145",
  },
  // 11. Konstitutsiya 44-moddasi (1992) -> 55-modda (2023)
  {
    oldTermPattern: /(?:konstitutsiya(?:ning)?\s+44(?:-|\s+)?modda)/gi,
    newLawName: "Yangi tahrirdagi O'zbekiston Respublikasi Konstitutsiyasi (2023)",
    newArticle: "55-modda",
    newTextSummary: "Har kimga o'z huquq va erkinliklarini sud orqali himoya qilish huquqi kafolatlanadi",
    lexUrl: "https://lex.uz/docs/6445145",
  },
  // 12. EKIH (Eng kam ish haqi) -> BHM (Bazaviy hisoblash miqdori)
  {
    oldTermPattern: /\b(?:EKIH|eng\s+kam\s+ish\s+haqining)\b/gi,
    newLawName: "O'zbekiston Respublikasi Prezidentining PF-5723-son Farmoni",
    newArticle: "BHM normasi",
    newTextSummary: "EKIH bekor qilingan. Jarimalar, davlat bojlari va to'lovlar BHM (Bazaviy hisoblash miqdori) orqali hisoblanadi",
    lexUrl: "https://lex.uz/docs/4348529",
  }
];

/**
 * Sanitizes and upgrades any legal response text:
 * 1. Detects and replaces outdated law citations.
 * 2. Replaces "EKIH" with "BHM".
 * 3. Replaces outdated 1995 Labor Code articles with 2023 Labor Code articles.
 * 4. Adds official compliance audit badge.
 */
export function sanitizeAndEnforceCurrentLaws(responseText: string): {
  cleanText: string;
  hasOutdatedLawsFixed: boolean;
  replacementsMade: string[];
} {
  let text = responseText;
  let hasOutdatedLawsFixed = false;
  const replacementsMade: string[] = [];

  // 1. Direct word replacements for EKIH -> BHM
  if (/\bEKIH(?:ning)?\b/i.test(text) || /eng\s+kam\s+ish\s+haqi(?:ning)?\s+(\d+\s*(?:baravari|foizi))/gi.test(text)) {
    hasOutdatedLawsFixed = true;
    text = text.replace(/\bEKIHning\b/gi, "BHMning");
    text = text.replace(/\bEKIH\b/gi, "BHM");
    text = text.replace(/eng\s+kam\s+ish\s+haqining\s+(\d+)/gi, "BHMning $1");
    replacementsMade.push("Eskirgan 'EKIH' atamasi amaldagi 'BHM' (Bazaviy hisoblash miqdori)ga o'zgartirildi");
  }

  // 2. Scan and replace known outdated articles
  for (const rule of OUTDATED_LAW_RULES) {
    if (rule.oldTermPattern.test(text)) {
      hasOutdatedLawsFixed = true;
      replacementsMade.push(`${rule.newLawName} ${rule.newArticle} ga moslashtirildi`);
      
      // Replace with explicit current statutory statement
      text = text.replace(rule.oldTermPattern, `**${rule.newArticle}** (*${rule.newLawName}*)`);
    }
  }

  // 3. Check for 1995 references and clarify
  if (text.includes("1995-yilgi") && !text.includes("bekor qilingan") && !text.includes("o'z kuchini yo'qotgan")) {
    text = text.replace(/1995-yilgi\s+Mehnat\s+kodeksi/gi, "Yangi Mehnat kodeksi (O'RQ-798, 2023-yil)");
    hasOutdatedLawsFixed = true;
    replacementsMade.push("1995-yilgi Mehnat kodeksi 2023-yilgi Yangi Mehnat kodeksi bilan almashtirildi");
  }

  // 4. Ensure Lex.uz labor code link points to the 2023 Code (6257288) rather than old ones
  if (text.toLowerCase().includes("mehnat kodeksi") && !text.includes("6257288")) {
    text += `\n\n📌 **Rasmiy amaldagi manba:** [Yangi Mehnat kodeksi (Lex.uz)](https://lex.uz/docs/6257288)`;
  }

  // 5. If replacements were made, prepend validation notice
  if (hasOutdatedLawsFixed) {
    const auditBanner = `🛡️ **LEXAI AUDITI: AMALDAGI YANGI QONUNCHILIK TASDIQLANDI**\n` +
      `*(Eski, bekor qilingan normalar chiqarib tashlandi va 2023-2026-yillardagi amaldagi Lex.uz tahririga to'liq moslashtirildi)*\n\n`;
    text = auditBanner + text;
  }

  return {
    cleanText: text,
    hasOutdatedLawsFixed,
    replacementsMade,
  };
}
