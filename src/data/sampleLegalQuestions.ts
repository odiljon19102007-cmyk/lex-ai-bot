import { LegalTopic } from '../types';

export const MAJOR_LEGAL_TOPICS: LegalTopic[] = [
  {
    id: 'mehnat',
    title: "Mehnat huquqi (Yangi Kodeks)",
    iconName: 'Briefcase',
    codeName: "O'zbekiston Respublikasining Mehnat kodeksi (O'RQ-798, 2023-yil)",
    lexUrl: 'https://lex.uz/docs/6257288',
    sampleQuestions: [
      "Yangi Mehnat kodeksida xodim uchun sinov muddati maksimal necha oy bo'lishi mumkin?",
      "Ish beruvchi tashabbusi bilan ishdan bo'shatilganda qanday kompensatsiyalar to'lanadi?",
      "Yillik asosiy mehnat ta'tili minimal necha ish kuni etib belgilangan?",
      "Eski 1995-yilgi Mehnat kodeksi bo'yicha ishdan bo'shatish to'g'rimi?",
    ],
  },
  {
    id: 'mamuriy',
    title: "Ma'muriy & Yo'l Harakati",
    iconName: 'Car',
    codeName: "Ma'muriy javobgarlik to'g'risidagi kodeks (MJtK)",
    lexUrl: 'https://lex.uz/docs/97664',
    sampleQuestions: [
      "Yo'l harakati qoidabuzarligi jarimasini 15 kun ichida to'lasa necha foiz chegirma beriladi?",
      "Haydovchilik guvohnomasisiz mashina boshqarish jarimasi qancha?",
      "Tadbirkorlik faoliyatini davlat ro'yxatidan o'tmasdan amalga oshirganlik uchun javobgarlik bormi?",
    ],
  },
  {
    id: 'oila',
    title: "Oila & Fuqarolik huquqi",
    iconName: 'HeartHandshake',
    codeName: "Oila kodeksi & Fuqarolik kodeksi",
    lexUrl: 'https://lex.uz/docs/104720',
    sampleQuestions: [
      "1 nafar bola uchun oylik aliment miqdori qanday hisoblanadi va eng kam chegarasi qancha?",
      "Ijara shartnomasini soliq organlarida (ijara.soliq.uz) ro'yxatdan o'tkazish majburiymi?",
      "Meros qoldiruvchi vasiyatnoma yozmagan bo'lsa, meros qanday taqsimlanadi?",
    ],
  },
  {
    id: 'soliq',
    title: "Tadbirkorlik & Soliqlar",
    iconName: 'Building2',
    codeName: "Soliq kodeksi & Tadbirkorlik to'g'risidagi qonunchilik",
    lexUrl: 'https://lex.uz/docs/4674902',
    sampleQuestions: [
      "Yakka tartibdagi tadbirkor (YATT) nechtagacha yollanma xodim olishi mumkin?",
      "O'zini o'zi band qilgan shaxslar qanday faoliyat turlari bilan shug'ullana oladi va soliq to'laydimi?",
      "MChJ tashkil qilish uchun ustav kapitali minimal talabi bormi?",
    ],
  },
  {
    id: 'konstitutsiya',
    title: "Konstitutsiya & Inson huquqlari",
    iconName: 'Scale',
    codeName: "O'zbekiston Respublikasi Konstitutsiyasi (Yangi tahrir 2023)",
    lexUrl: 'https://lex.uz/docs/6445145',
    sampleQuestions: [
      "Yangi Konstitutsiyaga ko'ra shaxsni sud qarorisiz 48 soatdan ortiq ushlab turish mumkinmi (Habeas Corpus)?",
      "Uy-joyidan sud qarorisiz mahrum etilishga yo'l qo'yiladimi?",
    ],
  },
];
