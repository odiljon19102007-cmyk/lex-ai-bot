// Professional Telegram Legal Bot Platform Definition & Handlers
// Designed with a deep blue, white, and gold visual accent system for Uzbekistan law.

export interface TelegramKeyboardBtn {
  text: string;
  callback_data?: string;
  url?: string;
  web_app?: { url: string };
}

export function getMainMenuKeyboard(_webAppUrl?: string) {
  return {
    remove_keyboard: true
  };
}

export const MAIN_MENU_KEYBOARD = {
  remove_keyboard: true
};

export const BACK_MENU_KEYBOARD = {
  remove_keyboard: true
};

// Major Codes & Legal Database of Uzbekistan
export const UZBEK_LEGAL_CODES = [
  {
    id: 'mk',
    title: 'Mehnat kodeksi (Yangi tahrir)',
    lawNumber: 'O\'RQ-798',
    effectiveDate: '2023-yil 30-aprel',
    articlesCount: '581 ta modda',
    status: 'AMALDAGI QONUNCHILIK',
    lexUrl: 'https://lex.uz/docs/6257288',
    icon: '💼',
    description: 'Xodim va ish beruvchi munosabatlari, sinov muddati, mehnat shartnomasi, ta\'tillar, ish haqi va kafolatlar.',
    sampleArticles: ['130-modda (Sinov muddati)', '217-modda (Ta\'til muddati)', '253-modda (Ish haqi to\'lash)', '161-modda (Shartnomani bekor qilish)']
  },
  {
    id: 'jk',
    title: 'Jinoyat kodeksi',
    lawNumber: '111453-son',
    effectiveDate: '1995-yil (Oxirgi o\'zgarishlar 2024-2026)',
    articlesCount: '302 ta modda',
    status: 'AMALDAGI QONUNCHILIK',
    lexUrl: 'https://lex.uz/docs/111453',
    icon: '⚖️',
    description: 'Jinoiy javobgarlik, ishtirokchilik turlari, o\'g\'irlik, firibgarlik, tuhmat, korrupsiya va jazolar.',
    sampleArticles: ['28-modda (Ishtirokchilar)', '139-modda (Tuhmat)', '140-modda (Haqorat)', '168-modda (Firibgarlik)']
  },
  {
    id: 'fk',
    title: 'Fuqarolik kodeksi',
    lawNumber: '111189-son',
    effectiveDate: '1997-yil (Doimiy yangilanishlar bilan)',
    articlesCount: '1199 ta modda',
    status: 'AMALDAGI QONUNCHILIK',
    lexUrl: 'https://lex.uz/docs/111189',
    icon: '📜',
    description: 'Mulk huquqi, qarz va tilxat, shartnomalar, bitimlar, zarar yetkazish, merosxo\'rlik va ko\'chmas mulk.',
    sampleArticles: ['732-modda (Qarz)', '212-modda (O\'zboshimchalik bilan qurilish)', '1021-modda (Ma\'naviy zarar)', '1118-modda (Meros)']
  },
  {
    id: 'sk',
    title: 'Soliq kodeksi (Yangi tahrir)',
    lawNumber: '599-son',
    effectiveDate: '2020-yil 1-yanvar (2024-2026 tahrirlari)',
    articlesCount: '483 ta modda',
    status: 'AMALDAGI QONUNCHILIK',
    lexUrl: 'https://lex.uz/docs/4674902',
    icon: '💰',
    description: 'Jismoniy va yuridik shaxslar soliqlari, daromad solig\'i, QQS, aylanma soliq, talaba kontrakti imtiyozlari.',
    sampleArticles: ['378-modda (Soliq imtiyozlari)', '381-modda (Ijara solig\'i)', '369-modda (Daromad turlari)']
  },
  {
    id: 'ok',
    title: 'Oila kodeksi',
    lawNumber: '104720-son',
    effectiveDate: '1998-yil 1-sentyabr',
    articlesCount: '238 ta modda',
    status: 'AMALDAGI QONUNCHILIK',
    lexUrl: 'https://lex.uz/docs/104720',
    icon: '💍',
    description: 'Nikoh tuzish shartlari va to\'siqlar, er-xotinning umumiy mulki, aliment undirish miqdori, ajralish.',
    sampleArticles: ['14-16-moddalar (Nikoh shartlari)', '23-modda (Mulk taqsimoti)', '99-modda (Aliment miqdori)']
  },
  {
    id: 'mjtk',
    title: 'Ma\'muriy javobgarlik to\'g\'risidagi kodeks',
    lawNumber: '97664-son',
    effectiveDate: '1995-yil (Oxirgi o\'zgarishlar 2024-2026)',
    articlesCount: '348 ta modda',
    status: 'AMALDAGI QONUNCHILIK',
    lexUrl: 'https://lex.uz/docs/97664',
    icon: '🚗',
    description: 'Yo\'l harakati qoidabuzarliklari, jarimalar, 15 kunlik 50% chegirma, jamoat tartibi, tuhmat va mayda bezorilik.',
    sampleArticles: ['332-1-modda (15 kunlik chegirma)', '128-moddalar (YHQ jarimalari)', '40-modda (Tuhmat)']
  },
  {
    id: 'konstitutsiya',
    title: 'O\'zbekiston Respublikasi Konstitutsiyasi',
    lawNumber: 'Yangi tahrir',
    effectiveDate: '2023-yil 1-may',
    articlesCount: '155 ta modda',
    status: 'AMALDAGI OLIY QONUN',
    lexUrl: 'https://lex.uz/docs/6445145',
    icon: '🏛',
    description: 'Davlatning asosiy oliy qonuni: inson qadr-qimmati, ijtimoiy davlat, mulk daxlsizligi, huquq va erkinliklar.',
    sampleArticles: ['20-modda (Inson sha\'ni)', '42-modda (Mehnat huquqi)', '65-modda (Mulk daxlsizligi)']
  }
];

// Document generation templates
export const DOCUMENT_TEMPLATES = [
  {
    id: 'doc-davo-qarz',
    title: 'Sudga da\'vo arizasi (Qarz undirish bo\'yicha)',
    badge: 'Fuqarolik sudi',
    icon: '⚖️',
    description: 'Tilxat yoki qarz shartnomasi asosida berilgan, ammo qaytarilmagan pulni sud orqali majburiy undirish arizasi.',
    fields: ['Da\'vogar F.I.Sh va manzili', 'Javobgar F.I.Sh va manzili', 'Qarz summasi (so\'mda)', 'Qarz berilgan sana va tilxat muddati'],
    sampleText: `FUQAROLIK ISHLARI BO'YICHA [Tuman nomi] TUMANLARARO SUDIGA

Da'vogar: [F.I.Sh.], Yashash manzili: [Manzil], Tel: [Telefon raqam]
Javobgar: [F.I.Sh.], Yashash manzili: [Manzil], Tel: [Telefon raqam]

DA'VO ARIZASI
(Qarz summasi va foizlarni majburiy undirish to'g'risida)

Men va javobgar [Javobgar F.I.Sh.] o'rtasida [Sana] kuni qarz shartnomasi (tilxat) tuzilgan bo'lib, unga ko'ra men unga [Summa] so'm miqdorida qarz berganman. Javobgar mazkur mablag'ni [Qaytarish muddati] kuniga qadar to'liq qaytarib berish majburiyatini olgan edi.

Biroq, oradan belgilangan muddat o'tgan bo'lsa-da, javobgar qarzni ixtiyoriy ravishda qaytarishdan bosh tortmoqda.

O'zbekiston Respublikasi Fuqarolik kodeksining 732, 735 va 736-moddalariga, shuningdek Fuqarolik protsessual kodeksining 188, 189, 191-moddalariga asosan,

SO'RAYMAN:
1. Javobgar [Javobgar F.I.Sh.]dan mening foydamga [Summa] so'm asosiy qarz summasini undirib berishingizni;
2. To'langan davlat boji va sud xarajatlarini javobgar zimmasiga yuklashingizni.

Ilova:
1. Qarz tilxati nusxasi;
2. Davlat boji to'langanligi kvitansiyasi;
3. Pasport nusxasi.`
  },
  {
    id: 'doc-ariza-mehnat',
    title: 'Ish beruvchiga ariza (Mehnat ta\'tili yoki hisob-kitob)',
    badge: 'Mehnat munosabatlari',
    icon: '💼',
    description: 'Yangi Mehnat kodeksining 217 va 253-moddalari bo\'yicha qonuniy ta\'til yoki oylik hisob-kitob talabnomasi.',
    fields: ['Tashkilot nomi va rahbari', 'Xodim lavozimi va F.I.Sh.', 'Talab mazmuni'],
    sampleText: `"[Tashkilot nomi]" rahbari [Rahbar F.I.Sh.]ga
[Bo'lim nomi] [Lavozim] [Xodim F.I.Sh.]dan

ARIZA

O'zbekiston Respublikasi Yangi Mehnat kodeksining 217, 220 va 228-moddalariga asosan, menga [Yil]-yil uchun davomiyligi [Kunlar soni] kalendar kuni bo'lgan yillik asosiy mehnat ta'tilini [Boshlanish sanasi] dan boshlab berishingizni hamda tegishli ta'til to'lovlarini qonunda belgilangan muddatda to'lab berishingizni so'rayman.

Sana: [Kun.Oy.Yil]
Imzo: ____________ [Xodim F.I.Sh.]`
  },
  {
    id: 'doc-shikoyat-mib',
    title: 'MIB bo\'limiga shikoyat / ariza (Ijro harakatlarini jadallashtirish)',
    badge: 'MIB & Ijro',
    icon: '🏛',
    description: 'Sud qarori yoki aliment undiruvi bo\'yicha ijro harakatlarini olib borish va qarzdorning mol-mulkini xatlash talabi.',
    fields: ['MIB tuman bo\'limi', 'Undiruvchi F.I.Sh.', 'Ijro hujjati raqami va sanasi'],
    sampleText: `Bosh prokuratura huzuridagi Majburiy ijro byurosi
[Tuman nomi] tuman bo'limi boshlig'iga

Undiruvchi: [Undiruvchi F.I.Sh.], Tel: [Telefon]
Qarzdor: [Qarzdor F.I.Sh.]

ARIZA / TALABNOMA
(Ijro harakatlarini faollashtirish va qarzdorga taqiq qo'yish to'g'risida)

Fuqarolik ishlari bo'yicha [Sud nomi] sudining [Sana] dagi [Ijro varaqasi raqami]-sonli ijro hujjatiga asosan qarzdor [Qarzdor F.I.Sh.]dan mening foydamga [Mablag' yoki aliment] undirilishi belgilangan.

Biroq bugungi kunga qadar qarzdor tomonidan to'lovlar amalga oshirilmay kelinmoqda.

"Sud hujjatlari va boshqa organlar hujjatlarini ijro etish to'g'risida"gi Qonunning 21, 42-1-moddalariga muvofiq:
1. Qarzdorning barcha bank hisobvaraqlariga band solish;
2. Uning nomidagi ko'chmas mulk va avtotransport vositalarini xatlash;
3. Qarzdorning O'zbekiston Respublikasidan chetga chiqish huquqini vaqtincha cheklash ("Zapret" qo'yish) choralarini ko'rishingizni so'rayman.

Sana: [Kun.Oy.Yil]
Imzo: ____________ [Undiruvchi F.I.Sh.]`
  },
  {
    id: 'doc-ariza-tuhmat',
    title: 'Ichki ishlar bo\'limiga ariza (Tuhmat va haqorat yuzasidan)',
    badge: 'Huquqni muhofaza qilish',
    icon: '🛡️',
    description: 'MJtK 40, 41-moddalari va JK 139-moddasi bo\'yicha shaxsning sha\'nini kamsitgan shaxsga nisbatan qonuniy chora ko\'rish arizasi.',
    fields: ['IIB tuman bo\'limi', 'Ariza beruvchi F.I.Sh.', 'Qonunbuzar shaxs ma\'lumotlari', 'Voqea sodir bo\'lgan sana va dalillar'],
    sampleText: `[Tuman nomi] tuman Ichki ishlar bo'limi boshlig'iga

Ariza beruvchi: [F.I.Sh.], Yashash manzili: [Manzil], Tel: [Telefon]

ARIZA
(Tuhmat va haqorat qilganlik uchun chora ko'rish to'g'risida)

Men ushbu arizani yozib shuni ma'lum qilamanki, [Sana] kuni fuqaro [Qonunbuzar F.I.Sh.] o'zining [Ijtimoiy tarmoq / bevosita uchrashuv] orqali meni bila turib boshqa shaxslar oldida haqorat qilib, sha'nim va qadr-qimmatimni kamsituvchi, haqiqatga to'g'ri kelmaydigan yolg'on uydirmalarni (tuhmat) tarqatdi.

Ushbu holatni tasdiqlovchi dalillar (skrinshotlar, audio/video yozuvlar hamda guvohlarning ko'rsatmalari) mavjud.

O'zbekiston Respublikasi Ma'muriy javobgarlik to'g'risidagi kodeksning 40-moddasi (Tuhmat) va 41-moddasi (Haqorat qilish) talablariga asosan, fuqaro [Qonunbuzar F.I.Sh.]ning harakatlariga qonuniy baho berib, unga nisbatan tegishli javobgarlik chorasini ko'rishingizni so'rayman.

Ilova: Skrinshotlar va audio yozuvlar nusxasi.

Sana: [Kun.Oy.Yil]
Imzo: ____________ [Ariza beruvchi F.I.Sh.]`
  }
];

// Law reform comparisons (Old vs New)
export const LAW_COMPARISONS = [
  {
    id: 'cmp-mehnat',
    title: 'Mehnat kodeksi: Eski (1995) vs Yangi (2023)',
    status: 'Yangi O\'RQ-798 kuchda',
    badge: 'Eng muhim islohot',
    icon: '💼',
    points: [
      {
        topic: 'Sinov muddati',
        old: 'Barcha xodimlar uchun bir xil 3 oygacha.',
        current: 'Oddiy xodimlar uchun 3 oy, rahbarlar va bosh buxgalterlar uchun 6 oygacha (130-modda). Homilador ayollar, 3 yoshgacha bolasi borlar va bitiruvchilarga sinov taqiqlanadi.'
      },
      {
        topic: 'Yillik mehnat ta\'tili',
        old: 'Kamida 15 ish kuni.',
        current: 'Kamida 21 kalendar kuni (217-modda). Dam olish kunlari ham hisoblanadi.'
      },
      {
        topic: 'Masofaviy ish (Frelans & Remote)',
        old: 'Qonunda aniq tartibga solinmagan edi.',
        current: 'Masofaviy ish, moslashuvchan grafik va elektron mehnat shartnomalari to\'liq qonuniy asosga ega bo\'ldi (453-464-moddalar).'
      },
      {
        topic: 'Ishdan bo\'shatish nafaqasi',
        old: 'O\'rtacha oylik ish haqidan kam bo\'lmagan miqdorda (staj hisobga olinmasdi).',
        current: 'Xodimning tashkilotdagi ish stajiga qarab tabaqalashtirilgan: 3 yilgacha 50%, 3 yildan 5 yilgacha 75%, 5 yildan 10 yilgacha 100%, 10 yildan 15 yilgacha 150%, 15 yildan ortiq staj uchun 200% oylik to\'lanadi (173-modda).'
      }
    ],
    lexUrl: 'https://lex.uz/docs/6257288'
  },
  {
    id: 'cmp-konstitutsiya',
    title: 'Konstitutsiya: 1992-yilgi vs 2023-yilgi Yangi Tahrir',
    status: 'Oliy yuridik kuchga ega',
    badge: 'Ijtimoiy Davlat',
    icon: '🏛',
    points: [
      {
        topic: 'Davlatning asosiy ta\'rifi',
        old: 'Suveren demokratik respublika.',
        current: 'O\'zbekiston — boshqaruvning respublika shakliga ega bo\'lgan suveren, demokratik, huquqiy, ijtimoiy va dunyoviy davlat (1-modda).'
      },
      {
        topic: 'Inson huquqlari ustuvorligi',
        old: 'Davlat, uning organlari huquqlarni ta\'minlaydi.',
        current: 'Inson sha\'ni va qadr-qimmati daxlsizdir. Inson bilan davlat munosabatlarida barcha ziddiyatlar inson foydasiga talqin etiladi (20-modda).'
      },
      {
        topic: 'Uy-joy daxlsizligi ("Snos" qoidalari)',
        old: 'Sud qarorisiz mulkdan mahrum etish amaliyotda uchrab turardi.',
        current: 'Hech kim sud qarorisiz va qonunga zid holda uy-joyidan mahrum etilishi mumkin emas. Qonuniy kompensatsiya oldindan to\'liq to\'lanmaguncha buzish qat\'iyan taqiqlanadi (47-modda).'
      },
      {
        topic: 'Advokatura va himoya kafolatlari',
        old: 'Advokat huquqlari cheklangan edi.',
        current: 'Advokatga o\'z vazifasini bajarishi uchun sud va tergovda prokuror bilan mutlaq teng huquqlar konstitutsiyaviy darajada kafolatlandi (141-142-moddalar).'
      }
    ],
    lexUrl: 'https://lex.uz/docs/6445145'
  },
  {
    id: 'cmp-jarima',
    title: 'Yo\'l jarimalari: Eski to\'lov vs 15 kunlik 50% chegirma',
    status: 'MJtK 332-1 amalda',
    badge: '50% tejamkorlik',
    icon: '🚗',
    points: [
      {
        topic: 'Chegirma muddati',
        old: 'Faqat 15 kun ichida 30% chegirma berilar edi.',
        current: 'Jarima to\'g\'risidagi qaror chiqarilgan kundan boshlab 15 KUN ICHIDA to\'lansa — 50 FOIZ CHEGIRMA beriladi!'
      },
      {
        topic: '30 kunlik muddat',
        old: 'Muddat o\'tsa darhol MIBga yuborilardi.',
        current: 'Agar 30 kun ichida to\'lansa — 70 foiz to\'lash imkoniyati (30% chegirma) saqlanib qoladi. 30 kundan so\'ng to\'liq 100% undiriladi.'
      },
      {
        topic: 'Radar va kamera jarimalari',
        old: 'Xat kech kelishi oqibatida chegirmadan quruq qolinar edi.',
        current: '15 kunlik muddat SMS xabarnoma kelgan yoki buyurtma xat rasman topshirilgan kundan e\'tiboran hisoblanadi.'
      }
    ],
    lexUrl: 'https://lex.uz/docs/97664'
  }
];

// MIB Assistance Section
export const MIB_TOPICS = [
  {
    id: 'mib-aliment',
    title: 'Aliment undirish tartibi va miqdori',
    icon: '👶',
    summary: 'Voyaga yetmagan bolalar uchun qonun bo\'yicha aliment miqdorlari va MIB orqali undirish choralari.',
    details: `📌 **Aliment miqdori (Oila kodeksi 99-moddasi):**
• 1 nafar bola uchun — ota-ona daromadining 1/4 qismi (25%);
• 2 nafar bola uchun — daromadning 1/3 qismi (33.3%);
• 3 va undan ortiq bola uchun — daromadning yarmi (50%).

⚠️ **Eng kam miqdor kafolati:**
Har bir bola uchun undiriladigan aliment miqdori qonunchilikda belgilangan mehnatga haq to'lash eng kam miqdorining 26.5 foizidan kam bo'lmasligi shart.

🏛 **Ishlamaydigan qarzdordan aliment hisoblash:**
Agar qarzdor rasman ishlamasa, aliment O'zbekiston Respublikasidagi o'rtacha oylik ish haqi miqdoridan kelib chiqib hisoblanadi!`,
    lexUrl: 'https://lex.uz/docs/104720'
  },
  {
    id: 'mib-zapret',
    title: 'Chet elga chiqish taqiqini ("Zapret") tekshirish va bekor qilish',
    icon: '✈️',
    summary: 'MIB tomonidan qo\'yilgan xorijga chiqish cheklovini tekshirish usullari.',
    details: `📌 **Taqiq qo'yilish asoslari:**
Sud qarori bo'yicha ijro hujjati belgilangan ixtiyoriy muddatda (odatda 10-15 kun) bajarilmasa, MIB davlat ijrochisi qarzdorning chet elga chiqish huquqini vaqtincha cheklaydi ("Sud hujjatlarini ijro etish to'g'risida"gi Qonun 42-1-moddasi).

🔍 **Qanday tekshirish mumkin:**
1️⃣ **MIB rasmiy sayti:** mib.uz orqali JShShIR (PINFL) kiritib tekshirish;
2️⃣ **Telegram boti:** @mibuzbot orqali qarzdorlikni aniqlash;
3️⃣ **Yagona portal:** my.gov.uz orqali "Ijro ishlari bo'yicha qarzdorlikni tekshirish" xizmati.

✅ **Taqiqni yechish:**
Qarzdorlik to'liq to'langach va ijro xarajati qoplangach, davlat ijrochisi 1 ish kuni ichida taqiqni bekor qilish to'g'risida qaror chiqaradi va Ichki ishlar vazirligi hamda Chegara qo'shinlariga elektron yuboradi.`,
    lexUrl: 'https://lex.uz/docs/40540'
  },
  {
    id: 'mib-shikoyat',
    title: 'MIB xodimining harakatsizligi ustidan shikoyat qilish',
    icon: '⚖️',
    summary: 'Ijrochi pulni undirmayotgan bo\'lsa qayerga murojaat qilish kerak?',
    details: `📌 **Shikoyat qilish bosqichlari:**
1️⃣ **Yuqori turuvchi ijrochiga:** Tuman MIB boshlig'iga yoki viloyat MIB boshqarmasiga yozma shikoyat bering (10 kun ichida ko'rib chiqiladi);
2️⃣ **Prokuraturaga:** Yashash joyingizdagi tuman prokuraturasiga nazorat tartibida murojaat qiling;
3️⃣ **Ma'muriy sudga:** Tuman Ma'muriy sudiga davlat ijrochisining harakatsizligini qonunga xilof deb topish haqida ariza kiriting (davlat bojidan ozod qilingansiz).`,
    lexUrl: 'https://lex.uz/docs/40540'
  }
];

// User guide contents
export const USER_GUIDE_TEXT = `📖 **LexAI O'zbekiston — Professional Huquqiy Telegram Platformasi Qo'llanmasi**

🏛 **Platformaning asosiy maqsadi:**
O'zbekiston Respublikasining rasmiy **Lex.uz** (Qonunchilik ma'lumotlari milliy bazasi) me'yorlari asosida fuqarolar, yuristlar va tadbirkorlarga 24/7 tezkor huquqiy yordam berish.

━━━━━━━━━━━━━━━━━━
🔹 **BO'LIMLAR VA ULARDAN FOYDALANISH:**

1️⃣ **⚖️ Huquqiy AI:**
• Istalgan huquqiy savolingizni erkin tilda yozing (masalan: *"Xodimni o'z arizasisiz boshqa ishga o'tkazish mumkinmi?"*).
• Bot soniyalar ichida amaldagi modda, tahlil va amaliy harakatlar ketma-ketligini taqdim etadi.

2️⃣ **📚 Qonunchilik bazasi:**
• O'zbekistonning barcha asosiy kodekslari (Mehnat, Jinoyat, Fuqarolik, Soliq, Oila, MJtK) haqida umumiy ma'lumot va to'g'ridan-to'g'ri Lex.uz sahifalariga o'tish.

3️⃣ **🔍 Modda qidirish:**
• Kodeks va modda raqamini yozing (masalan: *"MK 130"*, *"JK 28"*, *"OK 16"*, *"MJtK 332-1"*).
• Bot to'liq modda matni, sharhi va rasmiy havolasini chiqarib beradi.

4️⃣ **📝 Hujjat tayyorlash:**
• Sud da'vo arizalari, ish beruvchiga arizalar, MIBga talabnomalar va tushuntirish xatlari shablonlarini avtomatik tayyorlash.

5️⃣ **⚖️ Kazus tahlili:**
• Murakkab hayotiy vaziyatingizni batafsil yozib yuboring.
• Tizim: Faktlar -> Buzilgan huquqlar -> Qonuniy moddalar -> Sud istiqbolini bosqichma-bosqich tahlil qilib beradi.

6️⃣ **📊 Qonunlarni solishtirish:**
• Eski (bekor qilingan) va yangi amaldagi qonunlar o'rtasidagi farqlarni ko'rish. Eskirgan qonunlardan ehtiyot bo'lish.

7️⃣ **🏛 MIB bo‘limi:**
• Aliment hisoblash, xorijga chiqish taqiqini tekshirish ("zapret") va ijro hujjatlari bo'yicha yo'riqnomalar.

8️⃣ **⚙️ Sozlamalar:**
• Tilni tanlash (O'zbekcha / Русский) va bot sozlamalarini boshqarish.

━━━━━━━━━━━━━━━━━━
🔒 **YURIDIK MAQOM VA MAS'ULIYAT:**
Tizim bergan ma'lumotlar rasmiy qonun hujjatlariga asoslangan maslahat xarakteriga ega. Murakkab sud ishlarida advokat xizmatidan foydalanish tavsiya etiladi.`;

// Settings text and keyboard
export const SETTINGS_TEXT = `⚙️ **LexAI Tizim Sozlamalari**

Hozirgi sozlamalaringiz:
• **Til:** 🇺🇿 O'zbek tili (Lotin)
• **Huquqiy baza:** 🟢 Lex.uz (Qonunchilik ma'lumotlari milliy bazasi - 2026 amaldagi tahrir)
• **Eski qonunlar filtri:** ✅ Faol (O'z kuchini yo'qotgan hujjatlar qat'iy chetlatiladi)
• **Javob tezligi:** ⚡ 0.01 - 1.5 sek

O'zgartirmoqchi bo'lgan sozlamangizni tanlang:`;

export const SETTINGS_KEYBOARD = {
  inline_keyboard: [
    [
      { text: "🇺🇿 O'zbekcha (Tanlangan)", callback_data: "lang_uz" },
      { text: "🇷🇺 Русский", callback_data: "lang_ru" },
    ],
    [
      { text: "⚡ Javob rejimi: Kengaytirilgan", callback_data: "mode_detailed" },
    ],
    [
      { text: "🔄 Keshni tozalash", callback_data: "clear_cache" },
      { text: "📊 Bot statistikasi", callback_data: "stats" },
    ],
  ],
};
