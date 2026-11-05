export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  legalBasis: string;
  lexUrl: string;
}

export interface AcademyCourse {
  id: string;
  title: string;
  titleRu: string;
  category: string;
  level: 'boshlangich' | 'orta' | 'professional';
  icon: string;
  description: string;
  descriptionRu: string;
  modulesCount: number;
  durationMinutes: number;
  keyArticles: string[];
  lessons: {
    id: string;
    title: string;
    content: string;
    keyPoints: string[];
  }[];
  questions: QuizQuestion[];
}

export const ACADEMY_COURSES: AcademyCourse[] = [
  {
    id: 'constitution',
    title: "Konstitutsiyaviy Huquq va Inson Qadr-qimmati",
    titleRu: "Конституционное право и права человека",
    category: "Konstitutsiyaviy huquq",
    level: "boshlangich",
    icon: "Landmark",
    description: "Yangi tahrirdagi O'zbekiston Respublikasi Konstitutsiyasining asosiy printsiplari, inson huquqlari, shaxsiy daxlsizlik va sud himoyasi kafolatlari.",
    descriptionRu: "Основные принципы Конституции в новой редакции, гарантии прав и свобод граждан.",
    modulesCount: 4,
    durationMinutes: 45,
    keyArticles: ["1-modda (Ijtimoiy, huquqiy davlat)", "13-modda (Inson qadri oliy qadriyat)", "26-modda (Miranda qoidalari va aybsizlik prezumpsiyasi)", "55-modda (Sud orqali himoyalanish)"],
    lessons: [
      {
        id: 'c1',
        title: "O'zbekiston — Huquqiy va Ijtimoiy Davlat",
        content: "2023-yil 30-aprelda qabul qilingan yangi tahrirdagi Konstitutsiyaning 1-moddasiga ko'ra, O'zbekiston — boshqaruvning respublika shakliga ega bo'lgan suveren, demokratik, huquqiy, ijtimoiy va dunyoviy davlatdir.",
        keyPoints: [
          "Inson huquq va erkinliklari davlat organlari faoliyatining bosh mezoni hisoblanadi (13-modda).",
          "Davlat organlarining qonunlarga zid bo'lgan har qanday harakati noqonuniy deb topiladi.",
          "Har kim o'z huquq va erkinliklarini qonun bilan taqiqlanmagan barcha usullar bilan himoya qilishga haqli."
        ]
      },
      {
        id: 'c2',
        title: "Shaxsiy daxlsizlik va Aybsizlik prezumpsiyasi",
        content: "Konstitutsiyaning 26, 27 va 28-moddalari shaxsning daxlsizligi, erkinligi va aybsizlik prezumpsiyasining konstitutsiyaviy poydevoridir.",
        keyPoints: [
          "Hech kim sud qarorisiz 48 soatdan ortiq ushlab turilishi mumkin emas (Xabeas Korpus).",
          "Shaxsga ushlab turilgan vaqtidayoq uning huquqlari va ushlab turilish asoslari tushuntirilishi shart (Miranda qoidasi).",
          "Ayblanuvchi o'zining aybsizligini isbotlashga majbur emas. Barcha noaniqliklar ayblanuvchi foydasiga hal etiladi."
        ]
      }
    ],
    questions: [
      {
        id: 'cq1',
        question: "Konstitutsiyaning 27-moddasiga ko'ra, shaxs sudning qarorisiz ko'pi bilan necha soat ushlab turilishi mumkin?",
        options: ["24 soat", "48 soat", "72 soat", "10 kun"],
        correctIndex: 1,
        explanation: "Konstitutsiyaning 27-moddasiga binoan, hech kim sudning qarorisiz qirq sakkiz soatdan ortiq muddat ushlab turilishi mumkin emas.",
        legalBasis: "O'zbekiston Respublikasi Konstitutsiyasi 27-moddasi",
        lexUrl: "https://lex.uz/docs/6445145"
      },
      {
        id: 'cq2',
        question: "Ushlangan shaxsga sukut saqlash va himoyachiga ega bo'lish huquqi qachon tushuntirilishi shart?",
        options: ["Faqat tergovchining xonasiga olib kelinganda", "Ushlangan paytning o'zidayoq", "Sud majlisida", "Ayblovi e'lon qilingandan so'ng"],
        correctIndex: 1,
        explanation: "Konstitutsiyaning 27-moddasiga asosan shaxs ushlab turilganida unga sukut saqlash huquqi hamda uning sabablari darhol (ushlangan vaqtda) tushuntirilishi shart.",
        legalBasis: "O'zbekiston Respublikasi Konstitutsiyasi 27-moddasi (Miranda qoidasi)",
        lexUrl: "https://lex.uz/docs/6445145"
      }
    ]
  },
  {
    id: 'labor',
    title: "Yangi Mehnat Kodeksi: Xodim va Ish Beruvchi",
    titleRu: "Новый Трудовой кодекс: Права и Обязанности",
    category: "Mehnat huquqi",
    level: "orta",
    icon: "Briefcase",
    description: "2023-yil 30-apreldan kuchga kirgan yangi Mehnat kodeksi asosida ishga qabul qilish, sinov muddati, mehnat shartnomasini bekor qilish va kafolatlar.",
    descriptionRu: "Трудовой кодекс 2023 года: испытательный срок, отпуска, увольнение и гарантии.",
    modulesCount: 5,
    durationMinutes: 60,
    keyArticles: ["130-modda (Sinov muddati)", "161-modda (Ish beruvchi tashabbusi bilan bekor qilish)", "173-modda (Ishdan bo'shatish nafaqasi)", "216-modda (Mehnat ta'tillari)", "253-modda (Ish haqini to'lash)"],
    lessons: [
      {
        id: 'l1',
        title: "Dastlabki sinov muddati qoidalari",
        content: "Yangi Mehnat kodeksining 129-132 moddalari sinov muddatini belgilaydi. Dastlabki sinov faqat mehnat shartnomasida ko'rsatilgandagina kuchga ega.",
        keyPoints: [
          "Oddiy xodimlar uchun sinov muddati ko'pi bilan 3 oyni tashkil etadi (130-modda).",
          "Tashkilot rahbarlari, o'rinbosarlari va bosh buxgalterlar uchun ko'pi bilan 6 oy.",
          "Homilador ayollar, 3 yoshgacha bolasi bor shaxslar va OTMni 3 yil ichida bitirgan shaxslarga sinov muddati belgilanmaydi (129-modda)."
        ]
      },
      {
        id: 'l2',
        title: "Ish haqi kechiktirilganda javobgarlik",
        content: "Mehnat kodeksining 253 va 333-moddalariga muvofiq, ish haqi har yarim oyda kamida bir marta to'lanishi shart.",
        keyPoints: [
          "Ish haqi belgilangan muddatdan kechiktirilsa, ish beruvchi kechiktirilgan har bir kun uchun Markaziy bank qayta moliyalash stavkasining 10 foizi miqdorida foiz (kompensatsiya) to'lashi shart (MK 333-modda).",
          "Ish beruvchining aybi bo'lishi yoki bo'lmasligidan qat'i nazar bu majburiyat saqlanadi."
        ]
      }
    ],
    questions: [
      {
        id: 'lq1',
        question: "Yangi Mehnat kodeksiga ko'ra, oddiy xodimlar uchun dastlabki sinov muddati ko'pi bilan necha oy bo'lishi mumkin?",
        options: ["1 oy", "2 oy", "3 oy", "6 oy"],
        correctIndex: 2,
        explanation: "Yangi Mehnat kodeksining 130-moddasiga asosan sinov muddati 3 oydan, rahbarlar va bosh buxgalterlar uchun esa 6 oydan oshmasligi kerak.",
        legalBasis: "Yangi Mehnat kodeksi 130-modda",
        lexUrl: "https://lex.uz/docs/6257288"
      },
      {
        id: 'lq2',
        question: "Quyidagi shaxslarning qaysi biriga ishga qabul qilishda sinov muddati belgilash qonun bilan taqiqlanadi?",
        options: ["Oldin boshqa sohada ishlagan xodimga", "Homilador ayollarga va 3 yoshgacha bolasi bor shaxslarga", "50 yoshdan oshgan xodimlarga", "Sinovdan o'tishga o'zi rozi bo'lgan xodimga"],
        correctIndex: 1,
        explanation: "Yangi Mehnat kodeksining 129-moddasiga ko'ra, homilador ayollarga, uch yoshga to'lmagan bolasi bor shaxslarga, ta'lim muassasalarining davlat granti asosida ta'lim olgan bitiruvchilariga sinov muddati belgilanmaydi.",
        legalBasis: "Yangi Mehnat kodeksi 129-modda",
        lexUrl: "https://lex.uz/docs/6257288"
      }
    ]
  },
  {
    id: 'civil',
    title: "Fuqarolik Huquqi: Bitimlar, Majburiyatlar va Zarar",
    titleRu: "Гражданское право: Сделки, обязательства и убытки",
    category: "Fuqarolik huquqi",
    level: "orta",
    icon: "FileText",
    description: "Fuqarolik kodeksi: bitimlarning haqiqiyligi, qarz shartnomasi va tilxat, da'vo muddati va moddiy zararni qoplash.",
    descriptionRu: "Гражданский кодекс: расписки, договоры займа, исковая давность и возмещение ущерба.",
    modulesCount: 4,
    durationMinutes: 50,
    keyArticles: ["150-modda (Umumiy da'vo muddati)", "356-modda (Shartnoma tushunchasi)", "732-modda (Qarz shartnomasi)", "985-modda (Zarar yetkazganlik uchun javobgarlik)"],
    lessons: [
      {
        id: 'civ1',
        title: "Qarz shartnomasi va Tilxat (FK 732-734)",
        content: "Fuqarolar o'rtasida BHMning 10 baravaridan ortiq miqdorda qarz berilganda shartnoma yozma shaklda tuzilishi shart. Tilxat (raspiska) qarz shartnomasining yozma tasdig'i hisoblanadi.",
        keyPoints: [
          "Qarz summasi aniq yozilishi, qarz oluvchining to'liq F.I.O.si va pasport ma'lumotlari kiritilishi shart.",
          "Qarzni qaytarish muddati ko'rsatilmagan bo'lsa, qarz beruvchi talab qo'ygan kundan boshlab 30 kun ichida qaytarilishi kerak (FK 734-modda)."
        ]
      },
      {
        id: 'civ2',
        title: "Da'vo muddati (Iskovaya davnost)",
        content: "Fuqarolik kodeksining 150-moddasiga muvofiq, huquqi buzilgan shaxsning talabi bo'yicha huquqni himoya qilish uchun umumiy da'vo muddati uch yil qilib belgilangan.",
        keyPoints: [
          "Da'vo muddati shaxs o'z huquqi buzilganini bilgan yoki bilishi lozim bo'lgan kundan boshlab o'ta boshlaydi (154-modda).",
          "Da'vo muddati o'tgan bo'lsa ham sud arizani qabul qiladi, faqat qarshi taraf sudga da'vo muddati o'tganini ma'lum qilsagina da'vo rad etiladi."
        ]
      }
    ],
    questions: [
      {
        id: 'civq1',
        question: "Fuqarolik kodeksining 150-moddasiga ko'ra, umumiy da'vo muddati necha yil?",
        options: ["1 yil", "3 yil", "5 yil", "10 yil"],
        correctIndex: 1,
        explanation: "O'zbekiston Respublikasi Fuqarolik kodeksining 150-moddasiga muvofiq, umumiy da'vo muddati — 3 (uch) yil.",
        legalBasis: "Fuqarolik kodeksi 150-modda",
        lexUrl: "https://lex.uz/docs/111189"
      },
      {
        id: 'civq2',
        question: "Agar qarz shartnomasida qarzni qaytarish muddati belgilanmagan bo'lsa, u talab qilingan kundan boshlab necha kunda qaytarilishi kerak?",
        options: ["7 kun", "10 kun", "30 kun", "3 oy"],
        correctIndex: 2,
        explanation: "Fuqarolik kodeksining 734-moddasiga binoan, qarzni qaytarish muddati belgilanmagan bo'lsa, qarz oluvchi qarz beruvchi bu haqda talab qo'ygan kundan boshlab o'ttiz kun ichida qaytarishi shart.",
        legalBasis: "Fuqarolik kodeksi 734-modda",
        lexUrl: "https://lex.uz/docs/180550"
      }
    ]
  },
  {
    id: 'family',
    title: "Oila Huquqi: Nikoh, Mol-mulk va Aliment",
    titleRu: "Семейное право: Брак, имущество и алименты",
    category: "Oila huquqi",
    level: "boshlangich",
    icon: "Scale",
    description: "Oila kodeksi: er-xotinning umumiy mol-mulki, ajralish tartibi va farzandlar uchun aliment hisoblash mezonlari.",
    descriptionRu: "Семейный кодекс: раздел имущества, развод и расчет алиментов на детей.",
    modulesCount: 3,
    durationMinutes: 40,
    keyArticles: ["23-modda (Umumiy mulk)", "96-modda (Ota-onaning ta'minlash majburiyati)", "99-modda (Aliment miqdori)", "102-modda (Qat'iy pul summasidagi aliment)"],
    lessons: [
      {
        id: 'f1',
        title: "Aliment undirish me'yorlari (OK 99)",
        content: "Voyaga yetmagan bolalariga aliment to'lash haqida ota-ona o'rtasida kelishuv bo'lmaganda aliment sud tomonidan ota-onaning har oydagi ish haqi va boshqa daromadlaridan undiriladi.",
        keyPoints: [
          "1 nafar bola uchun — daromadning 1/4 qismi (25%).",
          "2 nafar bola uchun — daromadning 1/3 qismi (33.3%).",
          "3 va undan ortiq bola uchun — daromadning 1/2 qismi (50%).",
          "Har bir bola uchun aliment miqdori MHEKMning 26.5 foizidan kam bo'lmasligi shart (OK 99-modda 3-qism)."
        ]
      }
    ],
    questions: [
      {
        id: 'fq1',
        question: "Oila kodeksining 99-moddasiga ko'ra, 2 nafar farzand uchun ota yoki onadan undiriladigan aliment miqdori qancha?",
        options: ["Daromadning 1/4 qismi", "Daromadning 1/3 qismi", "Daromadning 1/2 qismi", "Daromadning 70 foizi"],
        correctIndex: 1,
        explanation: "Oila kodeksining 99-moddasiga binoan aliment ota-onaning har oydagi ish haqi va (yoki) boshqa daromadining: bir bolaga — to'rtdan bir qismi; ikki bolaga — uchdan bir qismi; uch va undan ortiq bolaga — yarmi miqdorida undiriladi.",
        legalBasis: "Oila kodeksi 99-modda",
        lexUrl: "https://lex.uz/docs/104720"
      }
    ]
  },
  {
    id: 'admin_offense',
    title: "Ma'muriy Javobgarlik (MJtK) va Jarimalar",
    titleRu: "Административная ответственность (КоАО)",
    category: "Ma'muriy huquq",
    level: "orta",
    icon: "ShieldCheck",
    description: "Yo'l harakati qoidalari, tuhmat, haqorat, jamoat tartibi va 15/30 kunlik 50% jarima chegirmasi qoidalari.",
    descriptionRu: "КоАО РУз: штрафы, 50% скидка при оплате за 15 дней, клевета и оскорбления.",
    modulesCount: 4,
    durationMinutes: 45,
    keyArticles: ["40-modda (Tuhmat)", "41-modda (Haqorat qilish)", "128-modda (Yo'l belgilari)", "332-1-modda (Jarima to'lashda 50% chegirma)"],
    lessons: [
      {
        id: 'adm1',
        title: "Jarimalarni to'lashda 50% va 70% chegirma tartibi",
        content: "MJtKning 332-1-moddasiga muvofiq, huquqbuzarga jarima solish to'g'risidagi qaror topshirilgan kundan boshlab soddalashtirilgan to'lov tizimi amal qiladi.",
        keyPoints: [
          "Qaror topshirilgan kundan boshlab 15 kun ichida jarima miqdorining 50 foizi to'lansa, qolgan qismidan ozod qilinadi.",
          "Agar 30 kun ichida to'lansa, jarima miqdorining 70 foizi to'lanadi (30% chegirma).",
          "Sud tomonidan jarima solinganda yoki takroriy huquqbuzarliklarda ushbu qoida qo'llanilmaydigan istisnolar mavjud."
        ]
      }
    ],
    questions: [
      {
        id: 'admq1',
        question: "MJtK 332-1-moddasiga binoan jarima summasining 50 foizini to'lab, qolganidan ozod bo'lish muddati necha kun?",
        options: ["5 kun", "10 kun", "15 kun", "30 kun"],
        correctIndex: 2,
        explanation: "MJtK 332-1-moddasiga ko'ra, jarima solish to'g'risidagi qaror topshirilgan kundan e'tiboran 15 kun ichida 50 foiz to'langan taqdirda, qolgan summadan ozod etiladi.",
        legalBasis: "MJtK 332-1-modda",
        lexUrl: "https://lex.uz/docs/97664"
      }
    ]
  }
];
