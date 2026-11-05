export interface DocumentField {
  id: string;
  label: string;
  placeholder: string;
  defaultValue?: string;
  type?: 'text' | 'number' | 'date' | 'textarea';
}

export interface DocumentBlueprint {
  id: string;
  title: string;
  category: 'sud' | 'mehnat' | 'shartnoma' | 'shikoyat' | 'fuqarolik';
  description: string;
  fields: DocumentField[];
  generateContent: (data: Record<string, string>) => { content: string; legalBasis: string[] };
}

export const LEGAL_DOCUMENT_BLUEPRINTS: DocumentBlueprint[] = [
  {
    id: 'da_vo_ish_haqi',
    title: "Ish haqini undirish to'g'risida da'vo arizasi",
    category: 'sud',
    description: "Ish beruvchi tomonidan o'z vaqtida to'lanmagan oylik maosh va kompensatsiyani sud orqali majburiy undirish.",
    fields: [
      { id: 'courtName', label: "Sud nomi", placeholder: "Masalan: Fuqarolik ishlari bo'yicha Shayxontohur tumanlararo sudi" },
      { id: 'plaintiffName', label: "Da'vogar (F.I.O.)", placeholder: "Alimov Jasur Baxtiyorovich" },
      { id: 'plaintiffAddress', label: "Da'vogar manzili va telefoni", placeholder: "Toshkent sh., Chilonzor tumani, 5-mavze, 12-uy. Tel: +998901234567" },
      { id: 'defendantName', label: "Javobgar (Tashkilot nomi)", placeholder: '"Orient Logistics" MCHJ' },
      { id: 'defendantAddress', label: "Javobgar yuridik manzili", placeholder: "Toshkent sh., Mirobod t., Nukus ko'chasi, 24-uy" },
      { id: 'jobTitle', label: "Egallab turgan lavozim", placeholder: "Bosh ombor mudiri" },
      { id: 'unpaidMonths', label: "Qaysi oylar uchun to'lanmagan", placeholder: "2025-yil dekabr, 2026-yil yanvar va fevral oylari" },
      { id: 'debtAmount', label: "Qarzdorlik summasi (so'mda)", placeholder: "14500000", type: 'number' },
    ],
    generateContent: (data) => {
      const formattedAmount = Number(data.debtAmount || 0).toLocaleString('uz-UZ') + " so'm";
      const content = `
${data.courtName || "Fuqarolik ishlari bo'yicha tumanlararo sudiga"}

Da'vogar: ${data.plaintiffName || "________________________"}
Manzili: ${data.plaintiffAddress || "________________________"}

Javobgar: ${data.defendantName || "________________________"}
Yuridik manzili: ${data.defendantAddress || "________________________"}

DA'VO ARIZASI
(Kechiktirilgan ish haqini va kompensatsiyani majburiy tartibda undirish to'g'risida)

Men javobgar tashkilotda (${data.defendantName || "ish beruvchida"}) mehnat shartnomasiga asosan ${data.jobTitle || "xodim"} lavozimida ishlab kelmoqdaman.

Biroq, javobgar ish beruvchi o'zining mehnat shartnomasi va qonunchilikda belgilangan majburiyatlarini qo'pol ravishda buzib, menga ${data.unpaidMonths || "belgilangan muddatlar"} uchun jami ${formattedAmount} miqdoridagi ish haqini to'lamasdan kelmoqda.

O'zbekiston Respublikasining 2023-yil 30-apreldan kuchga kirgan yangi Mehnat kodeksining 253-moddasiga ko'ra, ish beruvchi ish haqini ushbu Kodeksda, jamoa shartnomasida yoki mehnat shartnomasida belgilangan muddatlarda to'lashi shart.

Shuningdek, yangi Mehnat kodeksining 333-moddasi talabiga binoan, ish beruvchi ish haqini to'lash muddatini buzgan taqdirda, kechiktirilgan har bir kun uchun O'zbekiston Respublikasi Markaziy bankining o'sha vaqtdagi qayta moliyalash stavkasi miqdorida pulli kompensatsiya to'lashi shart.

O'zbekiston Respublikasi Soliq kodeksining 329-moddasiga muvofiq, xodimlar mehnat huquqiy munosabatlaridan kelib chiquvchi da'volar bo'yicha davlat boji to'lashdan to'liq ozod etilgan.

Yuqoridagilarga hamda O'zbekiston Respublikasi Fuqarolik protsessual kodeksining tegishli moddalariga asosan,

SUDDAN SO'RAYMAN:

1. Javobgar — ${data.defendantName || "tashkilot"} hisobidan mening foydamga to'lanmay qolgan ${formattedAmount} miqdoridagi ish haqini;
2. Mehnat kodeksining 333-moddasiga asosan kechiktirilgan kunlar uchun hisoblangan pulli kompensatsiyani undirib berishingizni;
3. Meni davlat boji to'lashdan ozod etishingizni.

Ilova qilinayotgan hujjatlar:
1. Da'vo arizasi nusxasi javobgar uchun;
2. Fuqarolik pasporti (ID karta) nusxasi;
3. Mehnat daftarchasi yoki mehnat shartnomasi nusxasi;
4. Ish haqi hisoblanganligi va to'lanmaganligi haqida ma'lumotnoma (yoki bank ko'chirmasi).

Da'vogar: ${data.plaintiffName || "________________"}    Imzo: ______________
Sana: ${new Date().toLocaleDateString('uz-UZ')}
`.trim();

      return {
        content,
        legalBasis: ["Mehnat kodeksi 253-modda", "Mehnat kodeksi 333-modda", "Soliq kodeksi 329-modda", "FPK 188-modda"]
      };
    }
  },
  {
    id: 'da_vo_aliment',
    title: "Voyaga yetmagan bola uchun aliment undirish da'vosi",
    category: 'sud',
    description: "Farzand ta'minoti uchun ota yoki onadan sud buyrug'i yoki da'vo tartibida aliment undirish.",
    fields: [
      { id: 'courtName', label: "Sud nomi", placeholder: "Fuqarolik ishlari bo'yicha Yunusobod tumanlararo sudi" },
      { id: 'applicantName', label: "Arizachi (Ona/Ota F.I.O.)", placeholder: "Karimova Gulnoza Ravshanovna" },
      { id: 'applicantAddress', label: "Arizachi manzili va tel", placeholder: "Toshkent sh., Yunusobod t., 11-mavze, 45-uy" },
      { id: 'debtorName', label: "Qarzdor (Ota/Ona F.I.O.)", placeholder: "Karimov Sherzod Farxodovich" },
      { id: 'debtorAddress', label: "Qarzdor manzili", placeholder: "Toshkent sh., Mirzo Ulug'bek t., Temur Malik ko'chasi, 10-uy" },
      { id: 'childrenInfo', label: "Bolalar F.I.O.si va tug'ilgan yili", placeholder: "Karimov Diyorbek Sherzod o'g'li, 2018-yil 15-mayda tug'ilgan" },
      { id: 'childrenCount', label: "Farzandlar soni", placeholder: "1", type: 'number' },
    ],
    generateContent: (data) => {
      const count = Number(data.childrenCount || 1);
      const fraction = count === 1 ? "to'rtdan bir qismi (1/4)" : count === 2 ? "uchdan bir qismi (1/3)" : "yarmi (1/2)";

      const content = `
${data.courtName || "Fuqarolik ishlari bo'yicha tumanlararo sudiga"}

Undiruvchi: ${data.applicantName || "________________________"}
Manzili: ${data.applicantAddress || "________________________"}

Qarzdor: ${data.debtorName || "________________________"}
Manzili: ${data.debtorAddress || "________________________"}

ARIZA
(Voyaga yetmagan bolaga aliment undirish to'g'risida sud buyrug'i berish haqida)

Men qarzdor ${data.debtorName || "shaxs"} bilan qonuniy nikohda bo'lganmiz. Bizning birgalikdagi turmushimizdan ${data.childrenInfo || "voyaga yetmagan farzandimiz"} dunyoga kelgan.

Hozirgi vaqtda farzandim mening to'liq qaramog'imda yashab kelmoqda. Qarzdor ota bolaning moddiy ta'minotida ixtiyoriy ravishda ishtirok etmayapti va moddiy yordam ko'rsatishdan bosh tortmoqda.

O'zbekiston Respublikasi Oila kodeksining 96-moddasiga muvofiq, ota-ona voyaga yetmagan bolalariga ta'minot berishi shart. Ushbu majburiyatni ixtiyoriy bajarmagan ota-onadan sud qaroriga binoan aliment undiriladi.

Oila kodeksining 99-moddasi talabiga ko'ra, aliment ota-onaning har oydagi ish haqi va (yoki) boshqa daromadining: ${data.childrenCount || 1} nafar bolaga — ${fraction} miqdorida undiriladi.

Fuqarolik protsessual kodeksining 171-moddasiga asosan, voyaga yetmagan bolalar uchun aliment undirish talabi bo'yicha sud buyrug'i chiqariladi.

Yuqoridagilarga asosan,

SUDDAN SO'RAYMAN:

Qarzdor — ${data.debtorName || "qarzdor"}dan mening foydamga voyaga yetmagan ${data.childrenInfo || "farzandim ta'minoti uchun"} har oyda oladigan barcha daromadlarining ${fraction} miqdorida, bola voyaga yetgunga qadar aliment undirish haqida sud buyrug'i chiqarishingizni so'rayman.

Ilova:
1. Nikoh to'g'risidagi guvohnoma nusxasi (yoki ajralish to'g'risida guvohnoma);
2. Bolaning tug'ilganlik haqidagi guvohnomasi nusxasi;
3. Bolaning arizachi qaramog'ida ekanligi haqida ma'lumotnoma (mahalla / MFY);
4. Fuqarolik pasporti (ID karta) nusxasi.

Arizachi: ${data.applicantName || "________________"}    Imzo: ______________
Sana: ${new Date().toLocaleDateString('uz-UZ')}
`.trim();

      return {
        content,
        legalBasis: ["Oila kodeksi 96-modda", "Oila kodeksi 99-modda", "FPK 171-modda", "Soliq kodeksi 329-modda"]
      };
    }
  },
  {
    id: 'shartnoma_qarz',
    title: "Qarz shartnomasi va Tilxat loyihasi",
    category: 'shartnoma',
    description: "Fuqarolar o'rtasida pul mablag'larini qarzga berish va qaytarish kafolati bo'yicha rasmiy tilxat shartnomasi.",
    fields: [
      { id: 'city', label: "Tuzilgan shahar/tuman", placeholder: "Toshkent shahri" },
      { id: 'lenderName', label: "Qarz beruvchi (F.I.O., Pasport)", placeholder: "Rustamov Anvar Salimovich, Pasport: AA 1234567" },
      { id: 'borrowerName', label: "Qarz oluvchi (F.I.O., Pasport)", placeholder: "Yoqubov Dilshod Farxodovich, Pasport: AB 7654321" },
      { id: 'borrowerAddress', label: "Qarz oluvchi doimiy yashash manzili", placeholder: "Toshkent sh., Sergeli t., Yangi hayot ko'chasi, 8-uy" },
      { id: 'amount', label: "Qarz summasi (so'mda)", placeholder: "25000000", type: 'number' },
      { id: 'dueDate', label: "Qaytarishning oxirgi sanasi", placeholder: "2026-yil 1-dekabr" },
    ],
    generateContent: (data) => {
      const formattedAmount = Number(data.amount || 0).toLocaleString('uz-UZ') + " so'm";
      const content = `
QARZ SHARTNOMASI VA TILXAT (RASPISKA)

Shahar: ${data.city || "Toshkent shahri"}              Sana: ${new Date().toLocaleDateString('uz-UZ')}

Men, qarz oluvchi ${data.borrowerName || "________________________"}, yashash manzilim: ${data.borrowerAddress || "________________________"},
ushbu tilxat orqali tasdiqlaymanki, fuqaro ${data.lenderName || "________________________"}dan naqd pul shaklida quyidagi summani qarzga oldim:

Qarz summasi: ${formattedAmount} (${data.amount || "____"} O'zbekiston so'mi).

MAJBURIYATLAR:
1. Men ushbu qarz summasini to'liq hajmda ${data.dueDate || "belgilangan sanaga"} qadar hech qanday bahonasiz qaytarish majburiyatini olaman.
2. Qarz o'z vaqtida qaytarilmagan taqdirda, O'zbekiston Respublikasi Fuqarolik kodeksining 327 va 736-moddalariga muvofiq, kechiktirilgan har bir kun uchun qonuniy foizlar va barcha sud xarajatlari mening hisobimdan undirilishiga roziman.
3. Mazkur tilxat o'z xohish-irodam bilan, hech qanday tazyiqsiz, aqli raso holatda yozildi va imzolandi.
4. Ushbu tilxat O'zbekiston Respublikasi Fuqarolik kodeksining 732-734 moddalari talablariga to'liq javob beradi va sud organlarida yozma dalil kuchiga ega.

Qarz oluvchi: ${data.borrowerName || "________________"}
Imzo: ____________________

Guvohlar (agar mavjud bo'lsa):
1. F.I.O.: ____________________    Imzo: ________
2. F.I.O.: ____________________    Imzo: ________
`.trim();

      return {
        content,
        legalBasis: ["Fuqarolik kodeksi 732-modda", "Fuqarolik kodeksi 733-modda", "Fuqarolik kodeksi 736-modda"]
      };
    }
  },
  {
    id: 'shikoyat_mib',
    title: "MIB ijrochisining harakatsizligi ustidan shikoyat",
    category: 'shikoyat',
    description: "Sud qarori bo'yicha ijro hujjati o'z vaqtida bajarilmaganda yoki aliment/qarz undirilmaganda yuqori turuvchi organga shikoyat.",
    fields: [
      { id: 'recipient', label: "Qaysi organga", placeholder: "Bosh prokuratura huzuridagi Majburiy ijro byurosi Toshkent shahar boshqarmasiga" },
      { id: 'complainantName', label: "Shikoyatchi F.I.O.", placeholder: "Sultonova Nilufar Odilovna" },
      { id: 'complainantPhone', label: "Telefon raqami", placeholder: "+998909876543" },
      { id: 'courtDocDetails', label: "Ijro hujjati ma'lumotlari", placeholder: "2024-yil 12-oktyabrdagi 2-154/24-sonli ijro varaqasi" },
      { id: 'mibDepartment', label: "MIB tuman bo'limi va inspektor", placeholder: "MIB Shayxontohur tumani bo'limi davlat ijrochisi" },
      { id: 'debtorName', label: "Qarzdor F.I.O.", placeholder: "Sultonov Alisher Akromovich" },
    ],
    generateContent: (data) => {
      const content = `
${data.recipient || "Majburiy ijro byurosi boshqarmasiga"}

Shikoyat beruvchi: ${data.complainantName || "________________________"}
Telefon: ${data.complainantPhone || "________________________"}

SHIKOYAT
(Davlat ijrochisining harakatsizligi yuzasidan)

Mening arizamga asosan, ${data.courtDocDetails || "sud hujjati"} bo'yicha qarzdor ${data.debtorName || "qarzdor"}dan mening foydamga pul mablag'larini undirish to'g'risida ijro ishi qo'zg'atilgan.

Biroq, ${data.mibDepartment || "MIB davlat ijrochisi"} tomonidan bugungi kunga qadar "Sud hujjatlari va boshqa organlar hujjatlarini ijro etish to'g'risida"gi O'zbekiston Respublikasi Qonunining 23 va 30-moddalarida belgilangan muddatlarda tegishli ijro harakatlari amalga oshirilmadi.

Qarzdorning bankdagi hisobvaraqlariga band solish, unga tegishli avtotransport va ko'chmas mulklarni xatlash hamda O'zbekiston Respublikasidan chiqishini vaqtincha cheklash (zapret) choralari o'z vaqtida ko'rilmagan. Natijada qarzdorlik undirilmasdan, mening huquqlarim poymol bo'lmoqda.

Qonunning 86-moddasiga muvofiq, davlat ijrochisining xatti-harakatlari (harakatsizligi) ustidan yuqori turuvchi mansabdor shaxsga yoki sudga shikoyat berilishi mumkin.

Yuqoridagilarga asosan,

SO'RAYMAN:

1. Mazkur shikoyatimni o'rganib chiqib, mas'ul davlat ijrochisining harakatsizligiga huquqiy baho berishingizni;
2. Qarzdor ${data.debtorName || "shaxs"}ga nisbatan barcha majburiy ijro choralari (mol-mulkni xatlash, chetga chiqishni taqiqlash) qo'llanilishini va ijro hujjati to'liq ijro etilishini nazoratga olishingizni so'rayman.

Shikoyat beruvchi: ${data.complainantName || "________________"}    Imzo: ______________
Sana: ${new Date().toLocaleDateString('uz-UZ')}
`.trim();

      return {
        content,
        legalBasis: ["Ijro to'g'risidagi Qonun 23-modda", "Ijro to'g'risidagi Qonun 30-modda", "Ijro to'g'risidagi Qonun 86-modda"]
      };
    }
  }
];

export function exportToWordHtml(title: string, bodyText: string): string {
  return `
<!DOCTYPE html>
<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head>
  <meta charset='utf-8'>
  <title>${title}</title>
  <style>
    body {
      font-family: 'Times New Roman', Times, serif;
      font-size: 14pt;
      line-height: 1.5;
      margin: 2cm 2cm 2cm 3cm;
      color: #000;
    }
    h1, h2, h3 {
      text-align: center;
      font-size: 16pt;
      font-weight: bold;
      margin-bottom: 20px;
    }
    p {
      text-align: justify;
      text-indent: 1.25cm;
      margin-bottom: 8px;
    }
    .header-box {
      margin-left: 50%;
      text-align: left;
      margin-bottom: 30px;
      font-size: 13pt;
    }
    .footer-stamp {
      margin-top: 40px;
      display: flex;
      justify-content: space-between;
    }
  </style>
</head>
<body>
  <div style="white-space: pre-line;">
    ${bodyText}
  </div>
</body>
</html>
`.trim();
}
