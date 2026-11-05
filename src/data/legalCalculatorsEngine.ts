export interface CalculationResult {
  calcType: string;
  title: string;
  summary: string;
  resultAmount: number;
  resultFormatted: string;
  breakdown: { label: string; value: string }[];
  formula: string;
  legalBasis: string;
  lexUrl: string;
}

export const LEGAL_CONSTANTS = {
  BHM: 375000, // Bazaviy hisoblash miqdori (amaldagi)
  MHEKM: 1155000, // Mehnatga haq to'lashning eng kam miqdori
  WORKING_DAYS_DIVISOR: 25.4, // MK bo'yicha kunlik haq hisoblash koeffitsienti
};

export function formatUzbekSum(amount: number): string {
  return Math.round(amount).toLocaleString('uz-UZ') + " so'm";
}

/**
 * 1. ALIMENT HISOBLASH
 * Oila kodeksi 99-modda: 1 bola 1/4 (25%), 2 bola 1/3 (33.33%), 3+ bola 1/2 (50%)
 * Har bir bola uchun minimal kafolatlangan: MHEKMning 26.5% (1,155,000 * 26.5% = 306,075 so'm)
 */
export function calculateAlimony(childrenCount: number, monthlyIncome: number): CalculationResult {
  const count = Math.max(1, childrenCount);
  let rate = 0.25;
  let fractionLabel = "1/4 qismi (25%)";

  if (count === 2) {
    rate = 1 / 3;
    fractionLabel = "1/3 qismi (33.3%)";
  } else if (count >= 3) {
    rate = 0.5;
    fractionLabel = "1/2 qismi (50%)";
  }

  const calculated = monthlyIncome * rate;
  const minPerChild = LEGAL_CONSTANTS.MHEKM * 0.265;
  const totalMinRequired = minPerChild * count;
  const finalAmount = Math.max(calculated, totalMinRequired);

  return {
    calcType: 'aliment',
    title: `${count} nafar farzand uchun aliment hisob-kitobi`,
    summary: `Oylik daromaddan har oyda ${formatUzbekSum(finalAmount)} aliment to'lanadi.`,
    resultAmount: finalAmount,
    resultFormatted: formatUzbekSum(finalAmount),
    breakdown: [
      { label: "Farzandlar soni", value: `${count} nafar bola` },
      { label: "Oylik daromad miqdori", value: formatUzbekSum(monthlyIncome) },
      { label: "Belgilangan ulush", value: fractionLabel },
      { label: "Hisoblangan ulush summasi", value: formatUzbekSum(calculated) },
      { label: "1 bola uchun qonuniy minimal chegara (MHEKM 26.5%)", value: formatUzbekSum(minPerChild) },
      { label: "Jami minimal kafolatlangan aliment", value: formatUzbekSum(totalMinRequired) },
      { label: "Yakuniy undiriladigan oylik miqdor", value: formatUzbekSum(finalAmount) },
    ],
    formula: `Oila kodeksi 99-modda: ${count} bolaga daromadning ${fractionLabel}. Agar bu summa har bir bola uchun MHEKMning 26.5 foizidan kam bo'lsa, minimal norma qo'llaniladi.`,
    legalBasis: "O'zbekiston Respublikasi Oila kodeksining 96, 99 va 104-moddalari",
    lexUrl: "https://lex.uz/docs/104720"
  };
}

/**
 * 2. MEHNAT TA'TILI PULI HISOBLASH (Ta'til puli)
 * Mehnat kodeksi 216-234 moddalari
 * O'rtacha kunlik ish haqi = O'rtacha oylik maosh / 25.4
 * Ta'til puli = O'rtacha kunlik ish haqi * ta'til kunlari
 */
export function calculateVacationPay(monthlySalary: number, vacationDays: number): CalculationResult {
  const days = Math.max(1, vacationDays);
  const dailyRate = monthlySalary / LEGAL_CONSTANTS.WORKING_DAYS_DIVISOR;
  const totalVacationPay = dailyRate * days;

  return {
    calcType: 'tatil_puli',
    title: `${days} kunlik mehnat ta'tili puli hisob-kitobi`,
    summary: `Xodimga ta'til boshlanishidan kamida 3 kun oldin ${formatUzbekSum(totalVacationPay)} to'lanishi shart.`,
    resultAmount: totalVacationPay,
    resultFormatted: formatUzbekSum(totalVacationPay),
    breakdown: [
      { label: "O'rtacha oylik ish haqi", value: formatUzbekSum(monthlySalary) },
      { label: "Mehnat ta'tili davomiyligi", value: `${days} ish kuni` },
      { label: "Qonuniy bo'luvchi koeffitsient (MK)", value: "25.4 (oltita ish kunlik hafta)" },
      { label: "1 kunlik o'rtacha ish haqi", value: formatUzbekSum(dailyRate) },
      { label: "To'lanadigan yakuniy ta'til puli", value: formatUzbekSum(totalVacationPay) },
    ],
    formula: `Ta'til puli = (Oylik ish haqi / 25.4) * Ta'til kunlari soni`,
    legalBasis: "O'zbekiston Respublikasi Mehnat kodeksining 216, 233 va 257-moddalari",
    lexUrl: "https://lex.uz/docs/6257288"
  };
}

/**
 * 3. ISHDAN BO'SHATISH NAFAQASI (Severance Pay)
 * Mehnat kodeksi 173-modda:
 * - 3 yilgacha staj: 50%
 * - 3 dan 5 yilgacha: 75%
 * - 5 dan 10 yilgacha: 100%
 * - 10 dan 15 yilgacha: 150%
 * - 15 yildan ortiq: 200%
 */
export function calculateSeverancePay(monthlySalary: number, yearsOfService: number): CalculationResult {
  const years = Math.max(0, yearsOfService);
  let percentage = 50;
  let tierLabel = "3 yilgacha ish staji (50%)";

  if (years > 15) {
    percentage = 200;
    tierLabel = "15 yildan ortiq staj (200%)";
  } else if (years > 10) {
    percentage = 150;
    tierLabel = "10 yildan 15 yilgacha staj (150%)";
  } else if (years > 5) {
    percentage = 100;
    tierLabel = "5 yildan 10 yilgacha staj (100%)";
  } else if (years >= 3) {
    percentage = 75;
    tierLabel = "3 yildan 5 yilgacha staj (75%)";
  }

  const severanceAmount = (monthlySalary * percentage) / 100;

  return {
    calcType: 'ishdan_boshatish',
    title: `Ishdan bo'shatish nafaqasi (${years} yil staj)`,
    summary: `Xodimga korxona hisobidan ${formatUzbekSum(severanceAmount)} miqdorida nafaqa to'lanadi.`,
    resultAmount: severanceAmount,
    resultFormatted: formatUzbekSum(severanceAmount),
    breakdown: [
      { label: "O'rtacha oylik ish haqi", value: formatUzbekSum(monthlySalary) },
      { label: "Xodimning ish staji", value: `${years} yil` },
      { label: "Qonuniy toifa (MK 173-m)", value: tierLabel },
      { label: "Nafaqa foizi", value: `${percentage}%` },
      { label: "To'lanadigan nafaqa summasi", value: formatUzbekSum(severanceAmount) },
    ],
    formula: `Nafaqa = O'rtacha oylik ish haqi * ${percentage}% (Ish stajiga muvofiq)`,
    legalBasis: "O'zbekiston Respublikasi Mehnat kodeksining 173-moddasi",
    lexUrl: "https://lex.uz/docs/6257288"
  };
}

/**
 * 4. DAVLAT BOJI HISOBLASH
 * Davlat boji to'g'risidagi Qonun:
 * - Mulkiy da'volar: da'vo bahosining 4% (kamida 1 BHM)
 * - Nomulkiy talablar: 2 BHM
 * - Nikohdan ajratish: 2 BHM (takroriy: 4 BHM)
 */
export function calculateCourtFee(claimType: 'mulkiy' | 'nomulkiy' | 'ajralish' | 'meros', claimValue: number = 0): CalculationResult {
  const bhm = LEGAL_CONSTANTS.BHM;
  let fee = 0;
  let formula = "";
  let typeLabel = "Mulkiy da'vo";

  if (claimType === 'mulkiy') {
    typeLabel = "Mulkiy xarakterdagi da'vo";
    const calculatedFee = (claimValue * 4) / 100;
    fee = Math.max(bhm, calculatedFee);
    formula = "Da'vo bahosining 4 foizi, biroq 1 BHMdan kam bo'lmagan miqdorda";
  } else if (claimType === 'ajralish') {
    typeLabel = "Nikohdan ajratish to'g'risidagi da'vo";
    fee = bhm * 2;
    formula = "BHMning 2 baravari miqdorida";
  } else if (claimType === 'nomulkiy') {
    typeLabel = "Nomulkiy xarakterdagi da'vo";
    fee = bhm * 2;
    formula = "BHMning 2 baravari miqdorida";
  } else {
    typeLabel = "Meros va boshqa nizoli ishlar";
    fee = bhm * 2;
    formula = "BHMning 2 baravari miqdorida";
  }

  return {
    calcType: 'davlat_boji',
    title: `Sudga da'vo arizasi bo'yicha davlat boji`,
    summary: `Sudga murojaat qilish uchun to'lanadigan davlat boji: ${formatUzbekSum(fee)}.`,
    resultAmount: fee,
    resultFormatted: formatUzbekSum(fee),
    breakdown: [
      { label: "Da'vo turi", value: typeLabel },
      { label: "Da'vo bahosi", value: claimType === 'mulkiy' ? formatUzbekSum(claimValue) : "Nomulkiy talab" },
      { label: "Joriy BHM miqdori", value: formatUzbekSum(bhm) },
      { label: "Hisoblash qoidasi", value: formula },
      { label: "To'lanishi lozim bo'lgan davlat boji", value: formatUzbekSum(fee) },
    ],
    formula,
    legalBasis: "\"Davlat boji to'g'risida\"gi O'zbekiston Respublikasi Qonuni (Ilova: Davlat boji stavkalari)",
    lexUrl: "https://lex.uz/docs/4680882"
  };
}

/**
 * 5. ISH HAQI VA SOLIQLAR HISOBLASH
 * JShODS: 12%
 * INPS: 0.1% (daromad solig'i hisobidan o'tkaziladi)
 */
export function calculateSalaryTaxes(grossSalary: number): CalculationResult {
  const jshods = (grossSalary * 12) / 100;
  const inps = (grossSalary * 0.1) / 100;
  const netSalary = grossSalary - jshods;

  return {
    calcType: 'ish_haqi_soliq',
    title: `Ish haqi va ushlanmalar hisob-kitobi`,
    summary: `Qo'lga tegadigan sof ish haqi (Netto): ${formatUzbekSum(netSalary)}.`,
    resultAmount: netSalary,
    resultFormatted: formatUzbekSum(netSalary),
    breakdown: [
      { label: "Yalpi hisoblangan oylik (Brutto)", value: formatUzbekSum(grossSalary) },
      { label: "JShODS (Daromad solig'i 12%)", value: formatUzbekSum(jshods) },
      { label: "INPS (Jamg'arib boriladigan pensiya 0.1%)", value: `${formatUzbekSum(inps)} (soliq ichidan)` },
      { label: "Jami ushlanmalar", value: formatUzbekSum(jshods) },
      { label: "Xodim qo'liga oladigan summa (Netto)", value: formatUzbekSum(netSalary) },
    ],
    formula: `Netto ish haqi = Brutto maosh - 12% JShODS`,
    legalBasis: "O'zbekiston Respublikasi Soliq kodeksining 381-moddasi",
    lexUrl: "https://lex.uz/docs/4674902"
  };
}

/**
 * 6. MIB IJRO YIG'IMI
 * Ijro to'g'risidagi Qonun 77-1-modda:
 * Jismoniy shaxslardan 2%, Yuridik shaxslardan 5%
 */
export function calculateMibExecutionFee(debtAmount: number, isEntity: boolean = false): CalculationResult {
  const rate = isEntity ? 0.05 : 0.02;
  const fee = debtAmount * rate;
  const totalToPay = debtAmount + fee;

  return {
    calcType: 'mib_fee',
    title: `MIB ijro yig'imi hisob-kitobi`,
    summary: `Qarzdorlikdan tashqari davlat foydasiga ${formatUzbekSum(fee)} ijro yig'imi undiriladi.`,
    resultAmount: fee,
    resultFormatted: formatUzbekSum(fee),
    breakdown: [
      { label: "Ijro hujjati bo'yicha qarz summasi", value: formatUzbekSum(debtAmount) },
      { label: "Qarzdor maqomi", value: isEntity ? "Yuridik shaxs (5%)" : "Jismoniy shaxs (2%)" },
      { label: "MIB ijro yig'imi miqdori", value: formatUzbekSum(fee) },
      { label: "Qarzdor to'lashi lozim bo'lgan umumiy summa", value: formatUzbekSum(totalToPay) },
    ],
    formula: `Ijro yig'imi = Qarz summasi * ${rate * 100}%`,
    legalBasis: "\"Sud hujjatlari va boshqa organlar hujjatlarini ijro etish to'g'risida\"gi Qonunning 77-1-moddasi",
    lexUrl: "https://lex.uz/docs/41605"
  };
}
