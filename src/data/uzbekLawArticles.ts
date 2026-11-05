export interface LawArticleEntry {
  code: string; // e.g. "JK", "MK", "MJtK", "OK", "FK", "SK", "KRK"
  codeName: string;
  articleNumber: string | number;
  title: string;
  summary: string;
  fullText: string;
  status: 'AMALDAGI' | 'YANGILANGAN' | 'BEKOR_QILINGAN';
  lexDocId: string;
  lexUrl: string;
}

export const UZBEK_LAW_KNOWLEDGE_BASE: LawArticleEntry[] = [
  {
    code: 'JK',
    codeName: "O'zbekiston Respublikasi Jinoyat kodeksi",
    articleNumber: '28',
    title: "28-modda. Jinoyatda ishtirokchilarning turlari",
    summary: "Jinoyatda ishtirokchilar 4 turga bo'linadi: Bajaruvchi, Tashkilotchi, Dalolatchi va Yordamchi.",
    fullText: `⚖️ **O'zbekiston Respublikasi Jinoyat kodeksining 28-moddasi:**

📌 **28-modda. Jinoyatda ishtirokchilarning turlari**

Jinoyatni bajaruvchi bilan bir qatorda **tashkilotchi**, **dalolatchi** va **yordamchi** ham jinoyatda ishtirokchi deb e’tirof etiladi.

1️⃣ **Bajaruvchi** — jinoyatni bevosita sodir etgan yoxud jinoiy javobgarlikka tortilishi mumkin bo‘lmagan shaxslardan yoki boshqa vositalardan foydalanib jinoyat sodir etgan shaxs.

2️⃣ **Tashkilotchi** — jinoyatga tayyorgarlik ko‘rilishiga yoki jinoyat sodir etilishiga rahbarlik qilgan yoxud uyushgan guruh yoki jinoiy uyushma tuzgan yoki ularga rahbarlik qilgan, shuningdek jinoyat rejasini ishlab chiqqan shaxs.

3️⃣ **Dalolatchi** — jinoyat sodir etilishiga qiziqtirgan (ko‘ndirgan, pora bergan, aldagan yoki boshqa yo‘l bilan jalb qilgan) shaxs.

4️⃣ **Yordamchi** — jinoyat sodir etilishiga maslahatlar, ko‘rsatmalar berish, vosita yoki qurollar taqdim etish yoki to‘siqlarni yo‘qotish bilan ko‘maklashgan, shuningdek jinoyatchini, jinoyat qurollari va izlarini yashirishga oldindan va’da bergan shaxs.

🟢 **Maqomi:** ✅ AMALDAGI QONUNCHILIK
📜 **Hujjat:** O'zbekiston Respublikasi Jinoyat kodeksi (111453-sonli hujjat)
🔗 **Lex.uz rasmiy havolasi:** https://lex.uz/docs/111453`,
    status: 'AMALDAGI',
    lexDocId: '111453',
    lexUrl: 'https://lex.uz/docs/111453',
  },
  {
    code: 'JK',
    codeName: "O'zbekiston Respublikasi Jinoyat kodeksi",
    articleNumber: '168',
    title: "168-modda. Firibgarlik",
    summary: "Firibgarlik, ya’ni aldash yoki ishonchni suiiste’mol qilish yo‘li bilan o‘zganing mulkini yoki mulkka bo‘lgan huquqini qo‘lga kiritish.",
    fullText: `⚖️ **O'zbekiston Respublikasi Jinoyat kodeksining 168-moddasi:**

📌 **168-modda. Firibgarlik**
Firibgarlik, ya’ni aldash yoki ishonchni suiiste’mol qilish yo‘li bilan o‘zganing mulkini yoki o‘zganing mulkiga bo‘lgan huquqini qo‘lga kiritish:
• BHMning 50 baravaridan 100 baravarigacha jarima yoki 2 yilgacha axloq tuzatish ishlari yoxud 1 yildan 3 yilgacha ozodlikni cheklash yoki 3 yilgacha ozodlikdan mahrum qilish bilan jazolanadi.
• Og'irlashtiruvchi holatlarda (katta miqdorda, xizmat mavqeidan foydalanib, uyushgan guruh tomonidan) 8 yildan 10 yilgacha ozodlikdan mahrum qilish jazosi belgilanadi.

🟢 **Maqomi:** ✅ AMALDAGI QONUNCHILIK
🔗 **Lex.uz rasmiy havolasi:** https://lex.uz/docs/111453`,
    status: 'AMALDAGI',
    lexDocId: '111453',
    lexUrl: 'https://lex.uz/docs/111453',
  },
  {
    code: 'MK',
    codeName: "O'zbekiston Respublikasi Mehnat kodeksi (Yangi tahrir O'RQ-798)",
    articleNumber: '130',
    title: "130-modda. Dastlabki sinov muddati",
    summary: "Dastlabki sinov muddati 3 oydan, rahbarlar uchun 6 oydan oshmasligi kerak.",
    fullText: `⚖️ **Yangi Mehnat kodeksining 130-moddasi (2023-yil 30-apreldan amalda):**

📌 **130-modda. Dastlabki sinov muddati**
• Dastlabki sinov muddati **3 oydan oshishi mumkin emas**.
• Tashkilotlar rahbarlari va ularning o‘rinbosarlari, bosh buxgalterlar hamda alohida bo‘linmalar rahbarlari uchun esa — **6 oygacha** etib belgilanishi mumkin.
• Vaqtincha mehnatga qobiliyatsizlik davri va xodim haqiqatda ishda bo‘lmagan boshqa davrlar dastlabki sinov muddatiga kiritilmaydi.

⚠️ **Muhim:** 1995-yilgi eski Mehnat kodeksi bekor qilingan! Faqat Yangi Mehnat kodeksi (O'RQ-798) amal qiladi.

🟢 **Maqomi:** ✅ AMALDAGI QONUNCHILIK
🔗 **Lex.uz rasmiy havolasi:** https://lex.uz/docs/6257288`,
    status: 'AMALDAGI',
    lexDocId: '6257288',
    lexUrl: 'https://lex.uz/docs/6257288',
  },
  {
    code: 'MK',
    codeName: "O'zbekiston Respublikasi Mehnat kodeksi (Yangi tahrir O'RQ-798)",
    articleNumber: '161',
    title: "161-modda. Mehnat shartnomasini ish beruvchining tashabbusi bilan bekor qilish asoslari",
    summary: "Ish beruvchi tashabbusi bilan mehnat shartnomasini bekor qilishning qat'iy qonuniy asoslari.",
    fullText: `⚖️ **Yangi Mehnat kodeksining 161-moddasi:**

📌 **161-modda. Ish beruvchining tashabbusi bilan bekor qilish asoslari:**
1) Texnologiyaning, ishlab chiqarish va mehnatni tashkil etishning o‘zgarishi, xodimlar soni (shtati) qisqarganligi;
2) Xodimning malakasi yetarli bo‘lmaganligi sababli egallab turgan lavozimiga noloyiqligi;
3) Xodim o‘z mehnat majburiyatlarini muntazam ravishda buzganligi;
4) Xodim o‘z mehnat majburiyatlarini bir marta qo‘pol ravishda buzganligi.

💡 **Kafolat:** Homilador ayollar va 3 yoshgacha bolasi bor ayollar bilan ish beruvchi tashabbusi bilan shartnomani bekor qilish taqiqlanadi (tashkilot tugatilgan hollar bundan mustasno).

🟢 **Maqomi:** ✅ AMALDAGI QONUNCHILIK
🔗 **Lex.uz rasmiy havolasi:** https://lex.uz/docs/6257288`,
    status: 'AMALDAGI',
    lexDocId: '6257288',
    lexUrl: 'https://lex.uz/docs/6257288',
  },
  {
    code: 'MJTK',
    codeName: "Ma'muriy javobgarlik to'g'risidagi kodeks",
    articleNumber: '332-1',
    title: "332-1-modda. Jarima solish to‘g‘risidagi qarorni ijro etishning soddalashtirilgan tartibi (15 kunlik chegirma)",
    summary: "15 kun ichida jarimaning 50 foizi to'lansa, qolgan qismidan ozod qilinadi.",
    fullText: `⚖️ **Ma'muriy javobgarlik to'g'risidagi kodeksning 332-1-moddasi:**

📌 **332-1-modda. Jarimalar bo'yicha 15 kunlik imtiyozli chegirma:**
• Jarima solish to‘g‘risidagi qaror topshirilgan kundan boshlab **15 kun ichida** jarima miqdorining **50 foizi** ixtiyoriy ravishda to‘langan taqdirda, huquqbuzar jarimaning qolgan qismini to‘lashdan ozod qilinadi.
• Agar sud qarori bilan jarima qo'llanilgan bo'lsa, 15 kun ichida 70% to'langanda qolgan qismidan ozod qilinadi.

🟢 **Maqomi:** ✅ AMALDAGI QONUNCHILIK
🔗 **Lex.uz rasmiy havolasi:** https://lex.uz/docs/97664`,
    status: 'AMALDAGI',
    lexDocId: '97664',
    lexUrl: 'https://lex.uz/docs/97664',
  },
  {
    code: 'OK',
    codeName: "O'zbekiston Respublikasi Oila kodeksi",
    articleNumber: '16',
    title: "16-modda. Nikoh tuzishga monelik qiladigan holatlar",
    summary: "Boshqa nikohda turganlar, yaqin qarindoshlar, muomalaga layoqatsizlar o'rtasida nikoh tuzish taqiqlanadi.",
    fullText: `⚖️ **O'zbekiston Respublikasi Oila kodeksining 16-moddasi:**

📌 **16-modda. Nikoh tuzishga monelik qiladigan holatlar**

Quyidagi shaxslar o‘rtasida nikoh tuzishga yo‘l qo‘yilmaydi:
1️⃣ **Kamida bittasi ro‘yxatga olingan boshqa nikohda turgan** shaxslar o‘rtasida (ko'pxotinlilik taqiqlanadi - JK 126-modda);
2️⃣ **Nasl-nasab shajarasi bo‘yicha to‘g‘ri tutashgan qarindoshlar** (ota-ona va bolalar, bobo-buvi va nevaralar), tug‘ishgan va o‘gay aka-uka hamda opa-singillar o‘rtasida;
3️⃣ **Yaqin qarindoshlar o‘rtasida:** xolavachcha, tog‘avachcha, ammavachcha, amakivachchalar o‘rtasidagi nikoh (genetik kasalliklarning oldini olish maqsadida);
4️⃣ **Farzandlikka oluvchilar bilan farzandlikka olinganlar** o‘rtasida;
5️⃣ **Ruhiyatining buzilishi** (ruhiy kasalligi yoki aqli zaifligi) sababli sud tomonidan muomalaga layoqatsiz deb topilgan shaxslar o‘rtasida.

💡 **Batafsil:**
• **Nikoh yoshi (15-modda):** Erkaklar va ayollar uchun **18 yosh**. Uzrli sabablar bo‘lganda tuman (shahar) hokimi ko'pi bilan 1 yilga kamaytirishi mumkin (17 yosh).
• **Majburiy tibbiy ko'rik (17-modda):** Nikohlanuvchilar FHDYo ro'yxatidan oldin 5 ta yo'nalish bo'yicha davlat poliklinikalarida **bepul** tibbiy ko'rikdan o'tishlari shart.

🟢 **Maqomi:** ✅ AMALDAGI QONUNCHILIK
📜 **Hujjat:** O'zbekiston Respublikasi Oila kodeksi (104720-sonli hujjat)
🔗 **Lex.uz rasmiy havolasi:** https://lex.uz/docs/104720`,
    status: 'AMALDAGI',
    lexDocId: '104720',
    lexUrl: 'https://lex.uz/docs/104720',
  },
  {
    code: 'OK',
    codeName: "O'zbekiston Respublikasi Oila kodeksi",
    articleNumber: '15',
    title: "15-modda. Nikoh yoshi",
    summary: "Erkaklar va ayollar uchun nikoh yoshi 18 yosh etib belgilanadi.",
    fullText: `⚖️ **Oila kodeksining 15-moddasi (Nikoh yoshi):**

📌 **15-modda. Nikoh yoshi:**
• O‘zbekiston Respublikasida nikoh yoshi erkaklar va ayollar uchun **18 yosh** etib belgilanadi.
• Uzrli sabablar bo‘lganda (homiladorlik, bola tug‘ilishi, voyaga yetmagan shaxsning to‘la muomalaga layoqatli deb e’lon qilinishi — emansipatsiya), nikoh tuzishni davlat ro‘yxatidan o‘tkazish joyidagi tuman, shahar hokimi nikohlanuvchilarning iltimosiga ko‘ra nikoh yoshini ko‘pi bilan **1 yilga kamaytirishi** mumkin (17 yoshgacha).

🟢 **Maqomi:** ✅ AMALDAGI QONUNCHILIK
🔗 **Lex.uz rasmiy havolasi:** https://lex.uz/docs/104720`,
    status: 'AMALDAGI',
    lexDocId: '104720',
    lexUrl: 'https://lex.uz/docs/104720',
  },
  {
    code: 'OK',
    codeName: "O'zbekiston Respublikasi Oila kodeksi",
    articleNumber: '99',
    title: "99-modda. Ota-onaning voyaga yetmagan bolalariga to‘laydigan aliment miqdori",
    summary: "1 bolaga - 1/4 (25%), 2 bolaga - 1/3 (33%), 3 va undan ortiq bolaga - 1/2 (50%).",
    fullText: `⚖️ **Oila kodeksining 99-moddasi:**

📌 **99-modda. Aliment miqdori:**
Sud tartibida undirilganda oylik ish haqi va boshqa daromadlarning:
• 1 nafar bola uchun — **to‘rtdan bir qismi (25%)**;
• 2 nafar bola uchun — **uchdan bir qismi (33.3%)**;
• 3 va undan ortiq bola uchun — **yarmisi (50%)** undiriladi.
• Har bir bola uchun eng kam miqdor — MHEKMning 26.5 foizidan kam bo'lmasligi shart.

🟢 **Maqomi:** ✅ AMALDAGI QONUNCHILIK
🔗 **Lex.uz rasmiy havolasi:** https://lex.uz/docs/104720`,
    status: 'AMALDAGI',
    lexDocId: '104720',
    lexUrl: 'https://lex.uz/docs/104720',
  },
  {
    code: 'MK',
    codeName: "O'zbekiston Respublikasi Mehnat kodeksi (Yangi tahrir O'RQ-798)",
    articleNumber: '100',
    title: "100-modda. [ESKI 1995-YILGI MODDA BEKOR QILINGAN! O'rniga Yangi MK 161-modda amal qiladi]",
    summary: "1995-yilgi 100-modda bekor bo'lgan. Ish beruvchi tashabbusi bilan bekor qilish endi Yangi Mehnat kodeksining 161-moddasi bilan tartibga solinadi.",
    fullText: `⚠️ **DIQQAT: 1995-YILGI MEHNAT KODEKSINING 100-MODDASI BUTUNLAY BEKOR BO'LGAN VA AMALIYOTDA QO'LLANILMAYDI!**

🟢 **AMALDAGI QONUNCHILIK (2023-yil 30-apreldan kuchga kirgan Yangi Mehnat kodeksi O'RQ-798):**
Eski 100-modda o'rniga ayni paytda **161-MODDA** amal qiladi.

📌 **161-modda. Mehnat shartnomasini ish beruvchining tashabbusi bilan bekor qilish asoslari:**
1️⃣ Texnologiyaning, ishlab chiqarish va mehnatni tashkil etishning o‘zgarishi, xodimlar soni (shtati) qisqarganligi;
2️⃣ Xodimning malakasi yetarli bo‘lmaganligi sababli egallab turgan lavozimiga noloyiqligi;
3️⃣ Xodim o‘z mehnat majburiyatlarini muntazam ravishda buzganligi (oldingi intizomiy jazo bo'lishi shart);
4️⃣ Xodim o‘z mehnat majburiyatlarini bir marta qo‘pol ravishda buzganligi (ichki qoidalarda aniq ko'rsatilgan bo'lishi shart).

💡 **Qo'shimcha kafolatlar:**
• Homilador ayollar va 3 yoshgacha bolasi bor ayollar bilan ish beruvchi tashabbusi bilan shartnomani bekor qilish taqiqlanadi (tashkilot tugatilgan hollar bundan mustasno).
• Mehnat shartnomasi bekor qilinayotganda xodimga 165-modda bo'yicha yozma ogohlantirish (shtat qisqarganda 2 oy oldin) va 173-modda bo'yicha ishdan bo'shatish nafaqasi to'lanadi.

🟢 **Maqomi:** ✅ YANGI AMALDAGI KODEKS (O'RQ-798, 161-modda)
🔗 **Lex.uz rasmiy havolasi:** https://lex.uz/docs/6257288`,
    status: 'YANGILANGAN',
    lexDocId: '6257288',
    lexUrl: 'https://lex.uz/docs/6257288',
  },
  {
    code: 'MK',
    codeName: "O'zbekiston Respublikasi Mehnat kodeksi (Yangi tahrir O'RQ-798)",
    articleNumber: '99',
    title: "99-modda. [ESKI 1995-YILGI MODDA BEKOR QILINGAN! O'rniga Yangi MK 160-modda amal qiladi]",
    summary: "1995-yilgi 99-modda o'rniga xodimning o'z xohishi bilan shartnomani bekor qilishi Yangi MK 160-moddasi bilan tartibga solinadi.",
    fullText: `⚠️ **DIQQAT: 1995-YILGI MEHNAT KODEKSINING 99-MODDASI BEKOR QILINGAN!**

🟢 **AMALDAGI QONUNCHILIK:**
Xodimning tashabbusi bilan mehnat shartnomasini bekor qilish Yangi Mehnat kodeksining (O'RQ-798) **160-MODDASI** bo'yicha amalga oshiriladi:
• Xodim nomuayyan muddatli hamda muddatli mehnat shartnomasini **14 kalendar kun oldin** ish beruvchini yozma ravishda ogohlantirgan holda bekor qilishga haqlidir.
• Xodim ogohlantirish muddati davomida istalgan vaqtda arizasini qaytarib olishga haqli.
• Agar xodimning ishni davom ettirishiga imkon bermaydigan uzrli sabablar (pensiyaga chiqish, o'qishga kirish va h.k.) bo'lsa, ariza berilgan kundan boshlab bekor qilinadi.

🟢 **Maqomi:** ✅ AMALDAGI QONUNCHILIK (O'RQ-798, 160-modda)
🔗 **Lex.uz rasmiy havolasi:** https://lex.uz/docs/6257288`,
    status: 'YANGILANGAN',
    lexDocId: '6257288',
    lexUrl: 'https://lex.uz/docs/6257288',
  },
  {
    code: 'MK',
    codeName: "O'zbekiston Respublikasi Mehnat kodeksi (Yangi tahrir O'RQ-798)",
    articleNumber: '84',
    title: "84-modda. [ESKI MODDA BEKOR QILINGAN! O'rniga Yangi MK 129-132-moddalar amal qiladi]",
    summary: "Dastlabki sinov muddati Yangi Mehnat kodeksining 129, 130, 131, 132-moddalari bilan tartibga solinadi.",
    fullText: `⚠️ **DIQQAT: 1995-yilgi eski Mehnat kodeksining 84-moddasi bekor qilingan!**

🟢 **AMALDAGI QONUNCHILIK:**
Dastlabki sinov Yangi Mehnat kodeksining (O'RQ-798) **129, 130, 131, 132-moddalari** bo'yicha tartibga solinadi:
• **129-modda:** Sinov muddati faqat xodimning roziligi bilan mehnat shartnomasida kelishilgan holda belgilanadi. Homilador ayollar, 3 yoshgacha bolasi bor shaxslar, oliy o'quv yurtlarini tamomlagan bitiruvchilar uchun dastlabki sinov belgilanmaydi!
• **130-modda:** Dastlabki sinov muddati oddiy xodimlar uchun **3 oydan**, tashkilot rahbarlari, o'rinbosarlari va bosh buxgalterlar uchun esa **6 oydan** oshishi mumkin emas.

🟢 **Maqomi:** ✅ AMALDAGI QONUNCHILIK (Yangi Mehnat kodeksi 130-modda)
🔗 **Lex.uz rasmiy havolasi:** https://lex.uz/docs/6257288`,
    status: 'YANGILANGAN',
    lexDocId: '6257288',
    lexUrl: 'https://lex.uz/docs/6257288',
  },
  {
    code: 'MK',
    codeName: "O'zbekiston Respublikasi Mehnat kodeksi (Yangi tahrir O'RQ-798)",
    articleNumber: '217',
    title: "217-modda. Har yilgi asosiy eng kam mehnat ta'tili muddati (21 kun)",
    summary: "Har yilgi mehnat ta'tilining eng kam muddati 21 kalendar kuni etib belgilangan. Eski 15 ish kuni qoidasi bekor qilingan!",
    fullText: `⚖️ **Yangi Mehnat kodeksining 217-moddasi:**

📌 **217-modda. Har yilgi asosiy eng kam mehnat ta'tili muddati:**
• Xodimlarga davomiyligi **kamida yigirma bir kalendar kuni** bo‘lgan har yilgi asosiy eng kam mehnat ta’tili beriladi.
⚠️ **Muhim:** Eski 1995-yilgi Mehnat kodeksidagi 15 ish kuni miqdori butunlay bekor qilingan!

🟢 **Maqomi:** ✅ AMALDAGI QONUNCHILIK
🔗 **Lex.uz rasmiy havolasi:** https://lex.uz/docs/6257288`,
    status: 'AMALDAGI',
    lexDocId: '6257288',
    lexUrl: 'https://lex.uz/docs/6257288',
  },
  {
    code: 'MK',
    codeName: "O'zbekiston Respublikasi Mehnat kodeksi (Yangi tahrir O'RQ-798)",
    articleNumber: '253',
    title: "253-modda. Ish haqi to'lash muddatlari",
    summary: "Ish haqi har yarim oyda kamida bir marta to'lanadi. Kechiktirilgan har bir kun uchun MB stavkasida kompensatsiya to'lanishi shart (333-modda).",
    fullText: `⚖️ **Yangi Mehnat kodeksining 253 va 333-moddalari:**

📌 **253-modda. Ish haqi to'lash muddatlari:**
• Ish haqi har yarim oyda kamida bir marta (oyiga 2 marta) to'lanadi.
• To'lov kuni dam olish yoki bayram kuniga to'g'ri kelsa, to'lov ushbu kun arafasida to'lanadi.
• **333-modda:** Kechiktirilgan har bir kun uchun Markaziy bank qayta moliyalash stavkasi miqdorida majburiy pulli kompensatsiya to'lanishi shart!

🟢 **Maqomi:** ✅ AMALDAGI QONUNCHILIK
🔗 **Lex.uz rasmiy havolasi:** https://lex.uz/docs/6257288`,
    status: 'AMALDAGI',
    lexDocId: '6257288',
    lexUrl: 'https://lex.uz/docs/6257288',
  },
  {
    code: 'MK',
    codeName: "O'zbekiston Respublikasi Mehnat kodeksi (Yangi tahrir O'RQ-798)",
    articleNumber: '312',
    title: "312-modda. Intizomiy jazo choralari",
    summary: "Mehnat intizomini buzganlik uchun hayfsan, o'rtacha oylik ish haqining 30-50% miqdorida jarima yoki shartnomani bekor qilish qo'llaniladi.",
    fullText: `⚖️ **Yangi Mehnat kodeksining 312-moddasi:**

📌 **312-modda. Intizomiy jazolar:**
Xodimga mehnat intizomini buzganligi uchun faqat quyidagi intizomiy jazo choralari qo‘llanilishi mumkin:
1) **Hayfsan**;
2) **Jarima** (xodim o‘rtacha oylik ish haqining o‘ttiz foizidan, ichki tartibda nazarda tutilgan hollarda esa ellik foizidan oshmasligi kerak);
3) **Mehnat shartnomasini bekor qilish** (161-modda ikkinchi qismining 3 va 4-bandlari).
⚠️ Qonunda nazarda tutilmagan boshqa intizomiy jazolarni qo'llash qat'iyan taqiqlanadi!

🟢 **Maqomi:** ✅ AMALDAGI QONUNCHILIK
🔗 **Lex.uz rasmiy havolasi:** https://lex.uz/docs/6257288`,
    status: 'AMALDAGI',
    lexDocId: '6257288',
    lexUrl: 'https://lex.uz/docs/6257288',
  },
  {
    code: 'KRK',
    codeName: "O'zbekiston Respublikasi Konstitutsiyasi (Yangi tahrir 2023)",
    articleNumber: '42',
    title: "42-modda. Mehnat qilish va adolatli mehnat sharoitlariga ega bo'lish huquqi",
    summary: "Har kim munosib mehnat qilish, adolatli mehnat sharoitlariga ega bo'lish huquqiga ega. Majburiy mehnat taqiqlanadi.",
    fullText: `🏛 **Yangi tahrirdagi O'zbekiston Respublikasi Konstitutsiyasining 42-moddasi:**

📌 **42-modda:**
• Har kim munosib mehnat qilish, kasb va faoliyat turini erkin tanlash, xavfsizlik va gigiyena talablariga javob beradigan qulay mehnat sharoitlarida ishlash, shuningdek mehnati uchun hech qanday kamsitishlarsiz hamda mehnatga haq to‘lashning belgilangan eng kam miqdoridan kam bo‘lmagan tarzda adolatli haq olish huquqiga ega.
• Majburiy mehnat taqiqlanadi.

🟢 **Maqomi:** ✅ AMALDAGI KONSTITUTSIYA (2023-yil 30-aprel referendumi)
🔗 **Lex.uz rasmiy havolasi:** https://lex.uz/docs/6445145`,
    status: 'AMALDAGI',
    lexDocId: '6445145',
    lexUrl: 'https://lex.uz/docs/6445145',
  },
  {
    code: 'KRK',
    codeName: "O'zbekiston Respublikasi Konstitutsiyasi (Yangi tahrir 2023)",
    articleNumber: '55',
    title: "55-modda. Sud orqali himoyalanish huquqi",
    summary: "Har kimga o'z huquq va erkinliklarini sud orqali himoya qilish huquqi kafolatlanadi.",
    fullText: `🏛 **Yangi tahrirdagi O'zbekiston Respublikasi Konstitutsiyasining 55-moddasi:**

📌 **55-modda:**
• Har kimga o‘z huquq va erkinliklarini sud orqali himoya qilish, davlat organlarining, fuqarolar o‘zini o‘zi boshqarish organlarining, ular mansabdor shaxslarining qonunga xilof qarorlari, harakatlari va harakatsizligi ustidan sudga shikoyat qilish huquqi kafolatlanadi.
• Har kimga buzilgan huquq va erkinliklarini tiklash uchun uning ishi qonunda belgilangan muddatlarda vakolatli, mustaqil hamda xolis sud tomonidan ko‘rib chiqilishi huquqi beriladi.

🟢 **Maqomi:** ✅ AMALDAGI KONSTITUTSIYA (2023)
🔗 **Lex.uz rasmiy havolasi:** https://lex.uz/docs/6445145`,
    status: 'AMALDAGI',
    lexDocId: '6445145',
    lexUrl: 'https://lex.uz/docs/6445145',
  },
];

/**
 * Super-fast direct lookup for article queries (e.g. "jinoyat kodeksi 28 modda", "jk 28", "mehnat 130")
 * Runs in under 5 milliseconds!
 */
export function fastLookupArticle(query: string): LawArticleEntry | null {
  const q = query.toLowerCase().trim();

  // Oila kodeksi - Nikoh monelik qiladigan holatlar & Nikoh yoshi
  if (q.includes('monelik') || q.includes('to\'siq') || (q.includes('nikoh') && (q.includes('shart') || q.includes('mumkin emas') || q.includes('taqiq') || q.includes('qarindosh') || q.includes('16') || q.includes('yosh') || q.includes('tuzish')))) {
    if (q.includes('yosh') && !q.includes('monelik')) {
      return UZBEK_LAW_KNOWLEDGE_BASE.find((a) => a.code === 'OK' && a.articleNumber === '15') || null;
    }
    return UZBEK_LAW_KNOWLEDGE_BASE.find((a) => a.code === 'OK' && a.articleNumber === '16') || null;
  }

  // Jinoyat kodeksi
  if (q.includes('jinoyat') || q.includes('jk') || q.includes('crim')) {
    if (q.includes('28')) {
      return UZBEK_LAW_KNOWLEDGE_BASE.find((a) => a.code === 'JK' && a.articleNumber === '28') || null;
    }
    if (q.includes('168')) {
      return UZBEK_LAW_KNOWLEDGE_BASE.find((a) => a.code === 'JK' && a.articleNumber === '168') || null;
    }
  }

  // Mehnat kodeksi
  if (q.includes('mehnat') || q.includes('mk') || q.includes('sinov') || q.includes('ta\'til') || q.includes('ishdan')) {
    if (q.includes('100')) {
      return UZBEK_LAW_KNOWLEDGE_BASE.find((a) => a.code === 'MK' && a.articleNumber === '100') || null;
    }
    if (q.includes('99')) {
      return UZBEK_LAW_KNOWLEDGE_BASE.find((a) => a.code === 'MK' && a.articleNumber === '99') || null;
    }
    if (q.includes('84') || q.includes('85')) {
      return UZBEK_LAW_KNOWLEDGE_BASE.find((a) => a.code === 'MK' && a.articleNumber === '84') || null;
    }
    if (q.includes('130') || q.includes('sinov')) {
      return UZBEK_LAW_KNOWLEDGE_BASE.find((a) => a.code === 'MK' && a.articleNumber === '130') || null;
    }
    if (q.includes('161') || q.includes("bo'shatish") || q.includes('tashabbus')) {
      return UZBEK_LAW_KNOWLEDGE_BASE.find((a) => a.code === 'MK' && a.articleNumber === '161') || null;
    }
    if (q.includes('217') || q.includes('ta\'til')) {
      return UZBEK_LAW_KNOWLEDGE_BASE.find((a) => a.code === 'MK' && a.articleNumber === '217') || null;
    }
    if (q.includes('253') || q.includes('maosh') || q.includes('oylik')) {
      return UZBEK_LAW_KNOWLEDGE_BASE.find((a) => a.code === 'MK' && a.articleNumber === '253') || null;
    }
    if (q.includes('312') || q.includes('hayfsan') || q.includes('intizom')) {
      return UZBEK_LAW_KNOWLEDGE_BASE.find((a) => a.code === 'MK' && a.articleNumber === '312') || null;
    }
  }

  // Konstitutsiya
  if (q.includes('konstitutsiya') || q.includes('bosh qomus')) {
    if (q.includes('42') || q.includes('mehnat huquqi')) {
      return UZBEK_LAW_KNOWLEDGE_BASE.find((a) => a.code === 'KRK' && a.articleNumber === '42') || null;
    }
    if (q.includes('55') || q.includes('sud himoyasi') || q.includes('shikoyat')) {
      return UZBEK_LAW_KNOWLEDGE_BASE.find((a) => a.code === 'KRK' && a.articleNumber === '55') || null;
    }
  }

  // MJtK (Jarima, chegirma)
  if (q.includes('mjtk') || q.includes('ma\'muriy') || q.includes('jarima') || q.includes('chegirma')) {
    if (q.includes('332') || q.includes('15 kun') || q.includes('chegirma')) {
      return UZBEK_LAW_KNOWLEDGE_BASE.find((a) => a.code === 'MJTK' && a.articleNumber === '332-1') || null;
    }
  }

  // Oila kodeksi (Aliment)
  if (q.includes('oila') || q.includes('aliment') || q.includes('bola')) {
    if (q.includes('99') || q.includes('aliment')) {
      return UZBEK_LAW_KNOWLEDGE_BASE.find((a) => a.code === 'OK' && a.articleNumber === '99') || null;
    }
  }

  return null;
}
