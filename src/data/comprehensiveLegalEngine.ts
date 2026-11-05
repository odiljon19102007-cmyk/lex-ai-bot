/**
 * Comprehensive Uzbekistan Legal Knowledge & Problem Solving Engine
 * Covers all legal branches: Mehnat, Oila, Fuqarolik, Jinoyat, Ma'muriy,
 * Uy-joy, Kiberxavfsizlik, Soliq, Iste'molchilar huquqlari, Sud va MIB.
 * 
 * Exhaustive, encyclopedic legal analysis strictly aligned with current
 * 2023-2026 Lex.uz legislation:
 * - Yangi Mehnat kodeksi (O'RQ-798, 2023-yil 30-aprel)
 * - Yangi tahrirdagi O'zbekiston Respublikasi Konstitutsiyasi (2023-yil 30-aprel)
 * - Yangilangan Fuqarolik, Jinoyat, Soliq, Oila, Shaharsozlik va MJtK kodekslari
 * - Oliy Sud Plenumi qarorlari va rasmiy Lex.uz havolalari
 */

export interface LegalAdviceResult {
  matched: boolean;
  category: string;
  title: string;
  answer: string;
  lexUrl: string;
}

interface IntentMatcher {
  id: string;
  category: string;
  title: string;
  lexUrl: string;
  primaryKeywords: string[];
  secondaryKeywords?: string[];
  negativeKeywords?: string[];
  generateAnswer: (query: string) => string;
}

const INTENT_MATCHERS: IntentMatcher[] = [
  // 1. Suv toshishi, tomdan suv oqishi, qo'shni tomonidan mol-mulkka zarar yetkazilishi
  {
    id: 'water_leak_damage',
    category: "Fuqarolik va Uy-joy huquqi",
    title: "Qo'shni suv toshirib mol-mulkka zarar yetkazganda ko'riladigan choralar va to'liq zararni undirish",
    lexUrl: "https://lex.uz/docs/111189",
    primaryKeywords: [
      'suv tosh', 'suv bos', 'suv oq', 'tomdan suv', 'truba yoril', 'suv quyil', 'suv ketdi',
      'tepadan suv', 'qo\'shnim suv', 'qoshnim suv', 'suv toshirib'
    ],
    generateAnswer: () => `⚖️ **Qo'shni suv toshirib xonadonga va mol-mulkka zarar yetkazganda to'liq huquqiy tahlil va harakatlar rejasi:**

📌 **1. Keng qamrovli huquqiy tahlil va qonuniy asoslar:**
O'zbekiston Respublikasi qonunchiligiga ko'ra, har bir fuqaroning mulk huquqi daxlsiz bo'lib, unga yetkazilgan har qanday zarar to'liq hajmda undirilishi kafolatlanadi (Konstitutsiya 65-modda).
• **Fuqarolik kodeksi 985-moddasi (Zarar yetkazganlik uchun umumiy javobgarlik):** G'ayriqonuniy harakat yoki harakatsizlik tufayli fuqaroning shaxsiga yoxud mol-mulkiga yetkazilgan zarar, uni yetkazgan shaxs tomonidan **to'liq hajmda qoplanishi shart**. Zarar yetkazmaganligini isbotlash majburiyati aybdor shaxs zimmasiga yuklatiladi.
• **Fuqarolik kodeksi 14-moddasi (Zararning to'liq qoplanishi):** Zarar tarkibiga jabrlanuvchining buzilgan huquqini tiklash uchun qilgan yoki qilishi lozim bo'lgan xarajatlari (**haqiqiy zarar: qayta ta'mirlash, yangi materiallar, mebel va jihozlar qiymati**), shuningdek agar huquqi buzilmaganida olishi mumkin bo'lgan boy berilgan foyda kiradi.
• **Fuqarolik kodeksi 1021-moddasi (Ma'naviy zararni qoplash):** Fuqaroga uning mulki nobud bo'lishi yoki yashash sharoiti keskin yomonlashishi natijasida yetkazilgan ma'naviy azob-uqubatlar sud tomonidan moddiy kompensatsiya qilinadi.
• **Uy-joy kodeksi 24 va 30-moddalari:** Ko'p kvartirali uyda mulkdor o'z xonadonidagi muhandislik tarmoqlari (quvurlar, kranlar, moslamalar)ni soz holatda saqlashi, qo'shnilarning osoyishtaligi va huquqlarini buzmasligi shart.
• **"Ko'p kvartirali uylarni boshqarish to'g'risida"gi Qonun 15-moddasi:** Agar suv umumiy foydalanishdagi tik quvur (stoyak) yorilishi sababli toshgan bo'lsa, javobgarlik Boshqaruv Servis Kompaniyasi (BSK / JEK) zimmasiga yuklatiladi.

📜 **2. Tegishli Oliy Sud Plenumi qarorlari va sud amaliyoti:**
O'zbekiston Respublikasi Oliy Sudi Plenumining "Sudlar tomonidan fuqarolarga yetkazilgan moddiy va ma'naviy zararlarni undirish qonunchiligini qo'llash amaliyoti to'g'risida"gi qaroriga asosan:
- Zarar yetkazilgan joyda tuzilgan rasmiy dalolatnoma (AKT) va litsenziyaga ega baholovchi tashkilot xulosasi sud uchun hal qiluvchi yozma dalil hisoblanadi;
- Aybdor shaxs dalolatnomani imzolashdan bosh tortsa, bu uning javobgarlikdan ozod bo'lishiga asos bo'la olmaydi.

📋 **3. Qadamma-qadam amaliy harakatlar algoritmi:**
1️⃣ **1-qadam (Shoshilinch xavfsizlik va foto/video dalil):**
   • Zudlik bilan yuqori qavatdagi qo'shniga xabar bering va podvaldagi umumiy suv stoyaklarini o'chiring.
   • Suv toshgan paytning o'zidayoq shift, devorlar, qimmatbaho mebel, pol qoplamalari va maishiy texnikalarga yetkazilgan shikastlarni sana va vaqt ko'ringan holda batafsil foto va videotasvirga muhrlang.
2️⃣ **2-qadam (Rasmiy Dalolatnoma - AKT tuzish):**
   • O'sha kunning o'zida hududga xizmat ko'rsatuvchi **BSK (Boshqaruv servis kompaniyasi / Uy-joy mulkdorlari shirkati)** muhandisi, Mahalla fuqarolar yig'ini (MFY) raisi/faollari hamda kamida 2 nafar qo'shni (xolis guvohlar)ni chaqiring.
   • Dalolatnomada: suv toshishining aniq sababi (masalan, 45-xonadondagi egiluvchan shlang yorilishi yoki kran ochiq qolishi), suv toshgan vaqt va shikastlangan xonalar hamda buyumlar ro'yxati aniq qayd etilib, barcha ishtirokchilar tomonidan imzolanadi. Qo'shni imzolashdan bosh tortsa, "imzolashdan bosh tortdi" deb yoziladi.
3️⃣ **3-qadam (Mustaqil litsenziyaga ega baholash ekspertizasi):**
   • Baholovchilar assotsiatsiyasi a'zosi bo'lgan rasmiy baholovchi tashkilotni chaqirib, ko'rilgan moddiy zarar va qayta tiklash-ta'mirlash smetasining rasmiy hisobotini tuzdiring. Baholovchi xizmati chekini saqlab qo'ying (bu xarajat ham sudda undiriladi).
4️⃣ **4-qadam (Yozma talabnoma - Pretenziya):**
   • Aybdor qo'shniga dalolatnoma va baholash hisoboti nusxasini ilova qilib, zararni 10 kun ichida ixtiyoriy qoplash haqida yozma pretenziya bering (pochta orqali buyurtma xat bilan yoki tilxat olib).
5️⃣ **5-qadam (Sudga da'vo arizasi kiritish):**
   • Ixtiyoriy to'lanmasa, javobgar yashaydigan hududdagi **Fuqarolik ishlari bo'yicha tumanlararo sudiga** (elektron tarzda **my.sud.uz** orqali) "Yetkazilgan moddiy zararni, baholash xarajatlarini, davlat bojini va ma'naviy zararni undirish to'g'risida" da'vo arizasi topshiring.

⏳ **4. Muhim muddatlar, sud yurisdiksiyasi va davlat bojlari:**
• **Da'vo muddati:** Fuqarolik kodeksi 150-moddasiga asosan umumiy da'vo muddati — **3 yil**.
• **Sud yurisdiksiyasi:** Fuqarolik ishlari bo'yicha tumanlararo sudi.
• **Davlat boji stavkasi:** "Davlat boji to'g'risida"gi Qonunga ko'ra, mulkiy da'volar bo'yicha da'vo summasining **4 foizi** (eng kamida BHMning 1 baravari) miqdorida davlat boji to'lanadi.
• **Kompensatsiya kafolati:** FPK 138-moddasiga binoan, sud hal qiluv qarorida jabrlanuvchi to'lagan barcha davlat boji, pochta xarajatlari va baholovchi xizmati haqi **aybdor javobgardan 100% to'liq undirib beriladi**.

🟢 **Maqomi:** ✅ AMALDAGI QONUNCHILIK
🔗 **Lex.uz rasmiy havolalari:**
• Fuqarolik kodeksi: https://lex.uz/docs/111189
• Uy-joy kodeksi: https://lex.uz/docs/106134
• Ko'p kvartirali uylarni boshqarish to'g'risida Qonun: https://lex.uz/docs/4583162`
  },

  // 2. Ishdan bo'shatish tartibi va noqonuniy bo'shatish
  {
    id: 'labor_dismissal',
    category: "Mehnat huquqi",
    title: "Yangi Mehnat kodeksi bo'yicha ishdan bo'shatishning qat'iy tartibi, kafolatlar va sud orqali ishga tiklanish",
    lexUrl: "https://lex.uz/docs/6257288",
    primaryKeywords: [
      'ishdan bo\'shat', 'ishdan boshat', 'ishdan hayda', 'shartnomani bekor', 'uvolneniye',
      'sokratit', 'shtat qisqar', 'ishdan chiqar', 'ishdan ketkaz', 'ishdan bõshat'
    ],
    generateAnswer: () => `⚖️ **Yangi Mehnat kodeksi bo'yicha ishdan bo'shatishning to'liq qonuniy mexanizmi va noqonuniy bo'shatilganda huquqlarni himoya qilish:**

📌 **1. Keng qamrovli huquqiy tahlil va yangi normalar (Yangi Mehnat kodeksi O'RQ-798, 2023-yil 30-apreldan kuchda):**
Konstitutsiyaning 42-moddasiga binoan, har kim munosib mehnat qilish, erkin kasb tanlash va asossiz ishdan bo'shatilishdan himoyalanish huquqiga ega. Ish beruvchi xodimni o'z xohishiga ko'ra istagan vaqtda ishdan bo'shata olmaydi!
• **161-modda (Ish beruvchi tashabbusi bilan shartnomani bekor qilish asoslari):** Mehnat shartnomasi faqat qonunda qat'iy belgilangan asoslar bo'yicha bekor qilinishi mumkin:
  1) Tashkilot (korxona) tugatilishi;
  2) Texnologiya, ishlab chiqarish o'zgarishi yoki ish hajmining qisqarishi sababli xodimlar soni (shtati) qisqarishi;
  3) Xodimning malakasi yetarli emasligi sababli egallab turgan lavozimiga noloyiqligi (faqat attestatsiya xulosasi asosida!);
  4) Xodimning o'z mehnat majburiyatlarini muntazam ravishda buzishi (faqat avval qo'llanilgan intizomiy jazo bo'lsa);
  5) Xodimning mehnat majburiyatlarini bir marta qo'pol ravishda buzishi (ichki mehnat tartibi qoidalarida qo'pol buzilishlar ro'yxati oldindan tasdiqlangan bo'lishi shart);
  6) Rahbar yoki bosh buxgalter tomonidan mulkdor manfaatlariga zarar yetkazilganligi.
• **165-modda (Ogohlantirish muddatlari):** Ish beruvchi shartnomani bekor qilish to'g'risida xodimni yozma ravishda (tilxat olib) quyidagi muddatlarda ogohlantirishi SHART:
  - Shtat qisqarganda yoki korxona tugatilganda — **kamida 2 oy oldin**;
  - Malakasi yetarli bo'lmaganligi sababli — **kamida 2 hafta oldin**;
  - Intizom buzilganligi sababli — **kamida 3 ish kuni oldin**.
  *Muhim:* Ogohlantirish muddati pulli kompensatsiyaga faqat tomonlarning o'zaro yozma kelishuvi bilan almashtirilishi mumkin.
• **173-modda (Ishdan bo'shatish nafaqasi miqdorlari):** Shtat qisqarganda xodimga ish stajiga qarab o'rtacha oylik ish haqining:
  - 3 yilgacha staj bo'lsa — **50 foizi**;
  - 3 yildan 5 yilgacha — **75 foizi**;
  - 5 yildan 10 yilgacha — **100 foizi**;
  - 10 yildan 15 yilgacha — **150 foizi**;
  - 15 yildan ortiq stajda — **200 foizi** miqdorida ishdan bo'shatish nafaqasi to'lanadi.
• **163-modda:** Tashkilot kasaba uyushmasi qo'mitasi mavjud bo'lsa, xodimni bo'shatishdan oldin **kasaba uyushmasining oldindan yozma roziligini olish majburiydir**. Roziliksiz chiqarilgan buyruq sud tomonidan avtomatik ravishda bekor qilinadi.
• **164-modda:** Shtat qisqarganda ishda qolib ketishda imtiyozli huquqlar (malakasi yuqorilar, qaramog'ida 2 yoki undan ortiq kishi borlar, oilada boshqa mustaqil daromadga ega bo'lmaganlar).
• **408-modda (Homilador va bolali ayollar kafolati):** Homilador ayollar va 3 yoshgacha bolasi bor xodimlarni ish beruvchi tashabbusi bilan bo'shatish **QAT'IYAN TAQIQLANADI** (korxona to'liq tugatilgan hollar mustasno).
• **172-modda:** Ishdan bo'shash kuni barcha hisob-kitob pullari (ish haqi, kompensatsiya, foydalanilmagan ta'til pullari) to'liq to'lanishi va mehnat daftarchasi topshirilishi shart.

📋 **2. Noqonuniy ishdan bo'shatilganda nima qilish kerak (Amaliy reja):**
1️⃣ Ishdan bo'shatish to'g'risidagi buyruq nusxasini va mehnat daftarchasi ko'chirmasini (my.mehnat.uz tizimidan) oling.
2️⃣ **Davlat mehnat inspeksiyasiga** (📞 **1282** yoki **dmi.mehnat.uz**) qonunbuzarlik yuzasidan tekshiruv o'tkazish to'g'risida shikoyat bering.
3️⃣ **Fuqarolik ishlari bo'yicha tumanlararo sudiga** "Ishga tiklash, majburiy progul davri uchun o'rtacha ish haqini va ma'naviy zararni undirish to'g'risida" da'vo arizasi kiriting (**my.sud.uz** orqali).
4️⃣ Sud qarori bilan buyruq g'ayriqonuniy deb topiladi, xodim avvalgi ishiga tiklanadi va ishlamagan barcha kunlar uchun to'liq oylik maosh undirib beriladi (MK 568-modda).

⏳ **3. Muhim muddatlar va davlat boji imtiyozlari:**
• **Sudga murojaat qilish muddati (MK 560-modda):** Ishga tiklash bo'yicha — ishdan bo'shatish to'g'risidagi buyruq nusxasi topshirilgan kundan boshlab **1 OY ICHIDA**! (Boshqa mehnat nizolarida — 3 oy). Ushbu muddat o'tib ketsa, faqat kasallik kabi uzrli sabablar bilan tiklanishi mumkin.
• **Davlat boji:** Soliq kodeksi va "Davlat boji to'g'risida"gi Qonunga asosan xodimlar mehnat nizolari bo'yicha sudga murojaat qilganda **DAVLAT BOJIDAN VA BARCHA SUD XARAJATLARIDAN TO'LIQ OZOD QILINGAN!**

🟢 **Maqomi:** ✅ AMALDAGI QONUNCHILIK (O'RQ-798)
🔗 **Lex.uz rasmiy havolasi:** https://lex.uz/docs/6257288`
  },

  // 3. Sinov muddati qoidalari
  {
    id: 'probation_period',
    category: "Mehnat huquqi",
    title: "Yangi Mehnat kodeksi bo'yicha dastlabki sinov muddati, qat'iy cheklovlar va noqonuniy sinovdan himoyalanish",
    lexUrl: "https://lex.uz/docs/6257288",
    primaryKeywords: ['sinov muddati', 'sinov muddat', 'ispytatelny', 'sinov', 'ispytanie'],
    generateAnswer: () => `⚖️ **Yangi Mehnat kodeksi bo'yicha dastlabki sinov muddati qoidalari va xodimning to'liq huquqlari:**

📌 **1. Keng qamrovli huquqiy tahlil va qonuniy asoslar (Yangi Mehnat kodeksi O'RQ-798):**
Sinov muddati ish beruvchi tomonidan xodimning topshirilayotgan ishga muvofiqligini tekshirish maqsadida faqat **ishga qabul qilish paytida va mehnat shartnomasida yozma ravishda kelishilgan holdagina** belgilanadi. Keyinchalik sinov muddati qo'shish qat'iyan man etiladi.
• **130-modda (Sinov muddatining eng ko'p davomiyligi):**
  - Oddiy xodimlar uchun dastlabki sinov muddati **3 OYDAN OSHISHI MUMKIN EMAS**.
  - Faqat tashkilot rahbarlari, ularning o'rinbosarlari, bosh buxgalterlar va alohida bo'linmalar rahbarlari uchun — **6 oygacha** belgilanishi mumkin.
  - Sinov muddatini tomonlarning kelishuvi bilan ham 3 oydan ortiq muddatga uzaytirish **MUTLAQO TAQIQLANADI**!
  - Xodim vaqtincha mehnatga qobiliyatsiz bo'lgan davr (kasallik varaqasi) va ishda haqiqatda bo'lmagan boshqa davrlar sinov muddatiga qo'shilmaydi.
• **129-modda (Sinov muddati belgilash QAT'IYAN TAQIQLANGAN shaxslar ro'yxati):**
  Quyidagi 6 toifa fuqarolarni ishga qabul qilishda sinov muddati belgilash qonunan taqiqlanadi:
  1️⃣ Homilador ayollarga va 3 yoshga to'lmagan bolasi bor shaxslarga;
  2️⃣ Davlat grantlari yoki kontrakt asosida OTM, texnikum yoki kollejlarni tamomlagan va ta'lim muassasasini bitirgan kundan e'tiboran 1 yil ichida birinchi bor ishga kirayotgan bitiruvchilarga;
  3️⃣ 6 oygacha bo'lgan muddatga tuziladigan muddatli mehnat shartnomalari bo'yicha ishga qabul qilinayotgan xodimlarga;
  4️⃣ Korxona boshqaruv organi tanlovidan o'tgan shaxslarga;
  5️⃣ Aholi bandligiga ko'maklashish markazlari (Mehnat birjasi) yo'llanmasi bilan zaxiralangan ish o'rinlariga ishga yuborilganlarga;
  6️⃣ Ish beruvchi bilan alohida o'quv shartnomasi asosida ta'lim olib ishga kirayotgan shaxslarga.
• **131-modda (Sinov davridagi mehnat sharoiti va ish haqi):**
  - Dastlabki sinov davrida xodimga O'zbekiston Respublikasi mehnat qonunchiligi, jamoa shartnomasi va ichki qoidalar **100% to'liq hajmda tatbiq etiladi**.
  - "Sinovdasan" deb xodimga asosiy shtat maoshidan kam maosh to'lash, ustamalarni to'lamaslik yoki ta'tillarni cheklash — **QONUNGA QAT'IYAN ZIDDIR**.
• **132-modda (Sinov natijasi qoniqarsiz bo'lganda shartnomani bekor qilish tartibi):**
  - Ish beruvchi xodim sinovdan o'tmagan deb topsa, sinov muddati tugagunga qadar **kamida 3 kun oldin xodimni yozma ravishda ogohlantirishi SHART**.
  - Ogohlantirish xatida xodim aynan qaysi vazifalarni bajara olmaganligi aniq dalillar (aktlar, bildirishnomalar) bilan ko'rsatilishi shart.
  - Agar sinov muddati tugasa va tomonlarning hech biri shartnomani bekor qilishni talab qilmagan bo'lsa, xodim sinovdan muvaffaqiyatli o'tgan hisoblanadi va keyinchalik uni sinov vajhi bilan bo'shatib bo'lmaydi.
  - Xodim ish beruvchining sinov natijasi bo'yicha qarori ustidan Fuqarolik sudiga da'vo kiritish huquqiga ega.

📋 **2. Noqonuniy sinov muddati belgilanganda nima qilish kerak:**
1️⃣ Mehnat shartnomangizni tekshiring: Agar yuqoridagi 6 toifaga kirsangiz yoki 3 oydan ortiq sinov yozilgan bo'lsa, bu band avtomatik ravishda haqiqiy emas hisoblanadi.
2️⃣ Ish beruvchiga yozma ariza bering yoki Davlat mehnat inspeksiyasiga (**1282**, **dmi.mehnat.uz**) murojaat qiling.
3️⃣ Noqonuniy ravishda sinov muddati bahonasi bilan bo'shatilgan taqdirda, 1 oy ichida Fuqarolik sudiga murojaat qiling (barcha majburiy progul kunlari uchun oylik maosh undirib beriladi).

⏳ **3. Muddatlar va javobgarlik:**
• Noqonuniy sinov muddati belgilagan yoki kamsitishga yo'l qo'ygan ish beruvchiga **MJtK 49-moddasi bo'yicha BHMning 5 dan 10 baravarigacha jarima** qo'llaniladi.

🟢 **Maqomi:** ✅ AMALDAGI QONUNCHILIK (O'RQ-798)
🔗 **Lex.uz rasmiy havolasi:** https://lex.uz/docs/6257288`
  },

  // 4. Ish haqi to'lanmasligi yoki kechikishi
  {
    id: 'unpaid_salary',
    category: "Mehnat huquqi",
    title: "Oylik ish haqi to'lanmaganda yoki kechiktirilganda ko'riladigan barcha qonuniy choralar, kompensatsiya va sud buyrug'i",
    lexUrl: "https://lex.uz/docs/6257288",
    primaryKeywords: ['ish haqi', 'ish haq', 'maosh', 'oylik', 'zarplata', 'oyligim', 'maoshim', 'maosh bermay'],
    generateAnswer: () => `⚖️ **Ish beruvchi ish haqini to'lamasa yoki kechiktirsa, qonuniy kafolatlar, foizlar va undirish mexanizmi:**

📌 **1. Keng qamrovli huquqiy tahlil va qonuniy normalar (Yangi Mehnat kodeksi O'RQ-798):**
Konstitutsiyaning 42-moddasiga ko'ra, har bir inson mehnati uchun hech qanday kamsitishlarsiz hamda mehnatga haq to'lashning belgilangan eng kam miqdoridan kam bo'lmagan miqdorda adolatli haq olish huquqiga ega.
• **253-modda (Ish haqi to'lash muddatlari):**
  - Ish beruvchi xodimga ish haqini har yarim oyda kamida bir marta (oyiga 2 marta) to'lashi shart.
  - To'lov kunlari jamoa shartnomasi yoki ichki hujjatlarda aniq sanalar bilan belgilanadi. Agar to'lov kuni dam olish yoki bayram kuniga to'g'ri kelsa, to'lov bir kun oldin amalga oshiriladi.
• **333-modda (Ish haqini kechiktirganlik uchun MAJBURIY PULLI KOMPENSATSIYA):**
  - Ish beruvchi ish haqini, ta'til haqini yoki xodim bilan hisob-kitob qilish to'lovlarini belgilangan muddatdan kechiktirgan taqdirda, kechiktirilgan har bir kun uchun Markaziy bank qayta moliyalash stavkasidan kam bo'lmagan miqdorda **majburiy pulli foiz (kompensatsiya)** to'lashi SHART!
  - Ushbu to'lov ish beruvchining aybi bor yoki yo'qligidan (hisobida pul yo'qligi, debitorlik qarzdorligi) qat'i nazar to'lanadi.
• **254-modda (Hisob-kitob varaqasi):** Ish beruvchi har oylik maosh to'langanida xodimga unga hisoblangan barcha daromadlar, ushlab qolingan soliqlar va to'lanishi lozim bo'lgan aniq summani yozma yoki elektron shaklda taqdim etishi shart.
• **269-modda (Ish haqidan ushlab qolish cheklovlari):** Xodimning ish haqidan faqat uning yozma roziligi bilan yoki qonunda qat'iy belgilangan sud ijro hujjatlari bo'yicha ushlab qolinishi mumkin. Jami ushlab qolish miqdori umumiy qoidaga ko'ra 50 foizdan oshishi mumkin emas.
• **MJtK 49-moddasi:** Ish haqini to'lamaslik yoki o'z vaqtida bermaslik — mansabdor shaxsga **BHMning 5 baravaridan 10 baravarigacha**, bir yil ichida takrorlansa **15 baravarigacha jarima** solishga sabab bo'ladi.
• **Jinoyat kodeksi 148-moddasi:** Ish haqini g'arazli yoki boshqa past niyatlarda qasddan to'lamaganlik uchun jinoiy javobgarlik belgilanadi.

📋 **2. Ish haqini undirishning qadamma-qadam algoritmi:**
1️⃣ **Yozma talabnoma (Pretenziya):** Ish beruvchi nomiga qarz summasini va MK 333-moddasi bo'yicha kechiktirish kompensatsiyasini 3 kun ichida to'lash talabi bilan rasmiy ariza bering (arizaning nusxasiga kirim raqami qo'ydiring).
2️⃣ **Davlat mehnat inspeksiyasiga shikoyat:**
   • 📞 Ishonch telefoni: **1282**
   • 🌐 Sayt: **dmi.mehnat.uz**
   • Inspeksiya kelib tekshiruv o'tkazadi va ish beruvchiga bajarilishi majburiy bo'lgan ko'rsatma beradi hamda jarima qo'llaydi.
3️⃣ **Fuqarolik sudidan SUD BUYRUG'I chiqarish (Tezkor yo'l):**
   • Agar buxgalteriya ish haqini hisoblagan, lekin to'lamagan bo'lsa, sud majlislari o'tkazilmasdan FPK 238-2-moddasi bo'yicha **3 kun ichida Sud buyrug'i (Sudebniy prikaz)** chiqariladi va darhol MIB orqali korxona bank hisobidan majburiy undiriladi.
4️⃣ **Prokuratura organlariga murojaat:** Bosh prokuraturaning **1007** ishonch telefoniga korxona rahbariyatining noqonuniy harakatlari ustidan ariza qoldiring.

⏳ **3. Imtiyozlar va muddatlar:**
• **Davlat boji:** "Davlat boji to'g'risida"gi Qonunning 8-moddasiga asosan, xodimlar ish haqi va mehnatga oid barcha to'lovlarni undirish bo'yicha sudlarda **DAVLAT BOJIDAN 100% TO'LIQ OZOD QILINGAN!**

🟢 **Maqomi:** ✅ AMALDAGI QONUNCHILIK (O'RQ-798)
🔗 **Lex.uz rasmiy havolasi:** https://lex.uz/docs/6257288`
  },

  // 5. Mehnat ta'tili / Otpusk
  {
    id: 'annual_leave',
    category: "Mehnat huquqi",
    title: "Yangi Mehnat kodeksi bo'yicha yillik asosiy mehnat ta'tili (kamida 21 kun), qo'shimcha ta'tillar va ta'til pulini to'lash tartibi",
    lexUrl: "https://lex.uz/docs/6257288",
    primaryKeywords: ['ta\'til', 'tatil', 'otpusk', 'ta\'til puli', 'tatil puli', 'dam olish ta\'tili', 'otpuska'],
    generateAnswer: () => `⚖️ **Yangi Mehnat kodeksi bo'yicha yillik mehnat ta'tillari, davomiyligi va to'lov kafolatlari:**

📌 **1. Keng qamrovli huquqiy tahlil va me'yorlar (Yangi Mehnat kodeksi O'RQ-798):**
Har bir xodim yil davomida dam olish va mehnat qobiliyatini tiklash uchun haq to'lanadigan yillik mehnat ta'tiliga chiqish huquqiga ega.
• **217-modda (Asosiy eng kam ta'til muddati):**
  - Har yillik asosiy mehnat ta'tilining eng kam davomiyligi — **21 KALENDAR KUNI** etib qat'iy belgilangan.
  - ⚠️ *MUHIM ISLOHOT:* 1995-yilgi eski Mehnat kodeksidagi "15 ish kuni" tushunchasi butunlay bekor qilingan! Yangi qonun bo'yicha barcha ta'tillar kalendar kunlarida hisoblanadi. Bayram kunlari ta'til hisobiga kirmaydi va uning muddatini uzaytiradi.
• **218-modda (Uzaytirilgan asosiy ta'tillar):**
  - 18 yoshga to'lmagan xodimlarga — kamida **30 kalendar kuni**;
  - I va II guruh nogironligi bo'lgan xodimlarga — kamida **30 kalendar kuni** ta'til berilishi shart.
  - Pedagogik va ilmiy xodimlarga ularning lavozimiga qarab — 48 dan 56 kalendar kunigacha.
• **220-modda (Ish staji uchun qo'shimcha ta'tillar):**
  - Bir tashkilotda ishlagan har 5 yillik ish staji uchun xodimga **2 kalendar kuni**, lekin ko'pi bilan 8 kalendar kuni miqdorida qo'shimcha haq to'lanadigan ta'til qo'shiladi.
• **227-modda (Ta'til olish huquqi):**
  - Xodimga birinchi ish yilida yillik ta'tildan foydalanish huquqi korxonada uzluksiz **6 oy ishlaganidan so'ng** vujudga keladi.
  - Homilador ayollar, 14 yoshgacha bolasi borlar va 18 yoshga to'lmagan xodimlar o'z xohishiga ko'ra 6 oy to'lmasdan oldin ham ta'til olish huquqiga egadirlar.
• **233-modda (Ta'til haqini to'lash muddati):**
  - Ish beruvchi ta'til haqini (o'rtacha ish haqi asosida hisoblangan summani) ta'til boshlanishidan **kamida 3 KUN OLDIN** to'lashi SHART.
  - Agar ta'til puli o'z vaqtida to'lanmasa, xodim o'z arizasi bilan ta'tilni boshqa muddatga ko'chirishni talab qilishga haqli.
• **234-modda (Pulli kompensatsiya):** Xodim ishdan bo'shayotganida u foydalanmagan barcha yillardagi ta'tillari uchun to'liq hajmda pulli kompensatsiya to'lab berilishi majburiydir.

🟢 **Maqomi:** ✅ AMALDAGI QONUNCHILIK (O'RQ-798)
🔗 **Lex.uz rasmiy havolasi:** https://lex.uz/docs/6257288`
  },

  // 6. Kafillik va kredit qarzini undirish
  {
    id: 'loan_guarantor',
    category: "Bank va Fuqarolik huquqi",
    title: "Bank kreditiga kafil (poruchitel) bo'lgan shaxsning qonuniy javobgarligi, huquqlari va regress tartibida pulni qaytarib olish",
    lexUrl: "https://lex.uz/docs/111189",
    primaryKeywords: ['kafil', 'kafillik', 'kredit kafil', 'bank kafil', 'poruchitel', 'kafilman', 'kafil bo\'lgandim'],
    generateAnswer: () => `⚖️ **Bank kreditiga kafil bo'lgan shaxsning to'liq huquqiy tahlili, javobgarlik chegaralari va regress mexanizmi:**

📌 **1. Keng qamrovli huquqiy tahlil va moddalar (Fuqarolik kodeksi 292-298-moddalari):**
Kafillik shartnomasi bo'yicha kafil boshqa shaxs (qarz oluvchi) o'z majburiyatini to'liq yoki qisman bajarmaganligi uchun kreditor (bank) oldida javob berishni o'z zimmasiga oladi.
• **293-modda (Kafilning javobgarligi):**
  - Qarz oluvchi kreditni to'lamagan taqdirda, kafil va qarzdor bank oldida **solidar (birgalikda teng)** javobgar bo'ladilar. Bank o'z xohishiga ko'ra qarzni asosiy qarzdordan ham, kafildan ham undirishni talab qilishi mumkin.
  - Kafil qarzning asosiy summasi, hisoblangan foizlar, jarimalar va sud xarajatlari bo'yicha javob beradi.
• **296-modda (KAFILNING REGRESS HUQUQI - ENG ASOSIY HIMOYANGIZ!):**
  - Majburiyatni bajargan (bankka kreditni to'lagan) kafilga bankning kreditor sifatidagi **BARCHA HUQUQLARI TO'LIQ O'TADI**.
  - Kafil bankka to'lagan har bir so'm (asosiy qarz, foizlar, jarima, komissiya, sud xarajatlari) hamda o'ziga yetkazilgan barcha zararlarni **asosiy qarzdordan sud orqali 100% undirib olish huquqiga ega bo'ladi**.
  - Majburiyat to'langach, bank kafilga kredit shartnomasi, to'lov topshiriqnomalari va barcha hujjatlar nusxasini topshirishi shart.
• **298-modda (Kafillikning bekor bo'lishi va muddatlar):**
  Quyidagi holatlarda kafillik qonunan bekor bo'ladi:
  1) Kredit shartnomasida belgilangan muddat tugagan kundan boshlab **1 YIL ICHIDA** bank kafilga nisbatan sudga da'vo qo'zg'atmasa, kafillik o'z kuchini yo'qotadi!
  2) Agar bank kafilning yozma roziligisiz kredit foizini oshirsa, muddatini o'zgartirsa yoki kafil uchun javobgarlikni og'irlashtiruvchi boshqa o'zgartirishlar kiritsa, kafillik to'xtatiladi.
  3) Agar bank kafil taklif qilgan yangi qarz oluvchini asossiz qabul qilmasa.

📋 **2. Kafil qanday harakat qilishi lozim:**
1️⃣ Agar bank sizdan qarz to'lashni talab qilsa yoki kartangizdan pul yechsa, bankdan qarz to'langanligi to'g'risidagi kvitansiyalar va hisobvaraq-fakturalarni rasmiy muhr bilan oling.
2️⃣ Asosiy qarz oluvchiga to'langan summani 10 kun ichida kafilga qaytarish haqida yozma pretenziya bering.
3️⃣ **Fuqarolik ishlari bo'yicha sudga** "Regress tartibida qarz summasini, foizlarni va davlat bojini undirish to'g'risida" da'vo arizasi kiriting.
4️⃣ Da'vo arizasi bilan birga asosiy qarzdorning nomidagi ko'chmas mulk, avtomashina va bank hisoblariga **taqiq (arest)** qo'yish to'g'risida iltimosnoma bering.

🟢 **Maqomi:** ✅ AMALDAGI QONUNCHILIK
🔗 **Lex.uz rasmiy havolasi:** https://lex.uz/docs/111189`
  },

  // 7. Qarz va tilxat (raspiska)
  {
    id: 'debt_receipt',
    category: "Fuqarolik huquqi",
    title: "Tilxat (raspiska) orqali berilgan qarzni sud tartibida 100% undirish va foizlar talab qilish",
    lexUrl: "https://lex.uz/docs/111189",
    primaryKeywords: ['qarz', 'tilxat', 'raspiska', 'pul bergandim', 'qarzni qaytarmay', 'qarzimni bermayapti', 'qarz bergan'],
    negativeKeywords: ['kredit', 'kafil'],
    generateAnswer: () => `⚖️ **Tilxat (raspiska) asosida qarzni sud orqali qaytarib olishning to'liq mexanizmi:**

📌 **1. Keng qamrovli huquqiy tahlil va moddalar (Fuqarolik kodeksi 732-736-moddalari):**
Qarz shartnomasiga muvofiq bir taraf (qarz beruvchi) ikkinchi tarafga (qarz oluvchiga) pul beradi, qarz oluvchi esa xuddi shuncha summani belgilangan muddatda qaytarish majburiyatini oladi.
• **733-modda (Qarz shartnomasining shakli va Tilxat):**
  - Fuqarolar o'rtasida qarz summasi **BHMning 10 baravaridan oshsa**, qarz shartnomasi yozma shaklda tuzilishi shart.
  - Qarz oluvchi tomonidan o'z qo'li bilan yozilgan va imzolangan **TILXAT (RASPISKA)** qonun oldida to'laqonli yozma shartnoma dalili hisoblanadi (notarial tasdiqlanmagan bo'lsa ham sud uni qabul qiladi!).
• **327-modda (Pul majburiyatini bajarmaganlik uchun foizlar):** Qarzni qaytarish kechiktirilgan har bir kun uchun Markaziy bankning amaldagi qayta moliyalash stavkasi miqdorida qo'shimcha foizlar hisoblanadi va aybdordan undiriladi.
• **150-modda (Da'vo muddati):** Umumiy da'vo muddati — **3 YIL**. Muddat tilxatda qarzni qaytarish kuni deb belgilangan kundan boshlab hisoblanadi. Agar muddat ko'rsatilmagan bo'lsa, qarz beruvchi talab qilgan kundan e'tiboran 30 kun o'tgach boshlanadi.

📋 **2. Qadamma-qadam amaliy harakatlar:**
1. Qarz oluvchiga qarzni 30 kun ichida to'lash to'g'risida pochta orqali buyurtma xat bilan talabnoma yuboring.
2. Qarz oluvchi istiqomat qiladigan hududdagi Fuqarolik ishlari bo'yicha tumanlararo sudiga da'vo arizasi topshiring (**my.sud.uz** orqali).
3. Da'vo bilan bir vaqtda qarzdorning mol-mulkiga taqiq (arest) qo'ydirish to'g'risida iltimosnoma kiriting.

🟢 **Maqomi:** ✅ AMALDAGI QONUNCHILIK
🔗 **Lex.uz rasmiy havolasi:** https://lex.uz/docs/111189`
  },

  // 8. Aliment undirish va to'lamaslik choralari
  {
    id: 'alimony_enforcement',
    category: "Oila huquqi",
    title: "Aliment undirish miqdorlari, majburiy eng kam stavkalar, MIB taqiqlari va jinoiy javobgarlik",
    lexUrl: "https://lex.uz/docs/104720",
    primaryKeywords: ['aliment', 'bola puli', 'ta\'minot', 'aliment to\'lamay', 'aliment miqdori', 'aliment undir'],
    generateAnswer: () => `⚖️ **O'zbekistonda aliment undirish, to'lov stavkalari va to'lashdan bo'yin tovlaganlarga nisbatan jazo choralari:**

📌 **1. Keng qamrovli huquqiy tahlil va moddalar (Oila kodeksi 96-147-moddalari):**
Ota-ona voyaga yetmagan bolalariga ta'minot berishi shart (Oila kodeksi 96-moddasi).
• **99-modda (Aliment miqdorlari):**
  - 1 nafar bola uchun — ota-ona oylik daromadining **1/4 qismi (25%)**;
  - 2 nafar bola uchun — daromadning **1/3 qismi (33.3%)**;
  - 3 va undan ortiq bola uchun — daromadning **yarmi (50%)**.
  - *Qonuniy eng kam kafolatlangan miqdor:* Har bir bola uchun undiriladigan aliment miqdori mehnatga haq to'lash eng kam miqdori (MHEKM)ning **26.5 foizidan kam bo'lishi mumkin emas**!
• **102-modda:** Qarzdorning daromadi doimiy bo'lmaganda yoki noaniq bo'lsa, sud alimentni har oyda to'lanadigan qat'iy pul summasida belgilashga haqlidir.
• **118-modda:** Homiladorlik davrida va bola 3 yoshga to'lgunga qadar bolani parvarishlayotgan ona uchun ham eridan qo'shimcha moddiy ta'minot (aliment) undiriladi.
• **MJtK 47-4-moddasi:** Aliment majburiyatini 2 oydan ortiq muddat davomida bajarmagan shaxsga **15 SUTKA MA'MURIY QAMOQ** yoki BHMning 20 baravari miqdorida jarima qo'llaniladi.
• **Jinoyat kodeksi 122-moddasi:** Ma'muriy jazo qo'llanilganidan keyin ham 2 oydan ortiq aliment to'lamaslik — **2 yilgacha ozodlikdan mahrum qilish** yoki axloq tuzatish ishlari bilan jazolanadi.
• **Chet elga chiqishga taqiq:** MIB qarzdorga nisbatan xalqaro chegaralardan chiqishga avtomatik tarzda elektron taqiq (zapret) qo'yadi.

📋 **2. Qayerga murojaat qilinadi:**
• Fuqarolik sudiga aliment undirish to'g'risida Sud buyrug'i berish haqida ariza beriladi (3 kunda ko'rib chiqiladi).
• **Davlat boji:** Aliment undiruvchi shaxslar sudlarda va ijro harakatlarida **DAVLAT BOJIDAN BUTUNLAY OZOD QILINGAN!**

🟢 **Maqomi:** ✅ AMALDAGI QONUNCHILIK
🔗 **Lex.uz rasmiy havolasi:** https://lex.uz/docs/104720`
  },

  // 9. Nikohni bekor qilish / Ajrashish tartibi
  {
    id: 'divorce_procedure',
    category: "Oila huquqi",
    title: "Nikohni bekor qilish tartibi, zarur hujjatlar, yarashtirish muholati va mulk taqsimoti",
    lexUrl: "https://lex.uz/docs/104720",
    primaryKeywords: ['ajrash', 'nikohni bekor', 'nikohdan ajratish', 'ajrim', 'xotinim bilan ajrash', 'erim bilan ajrash'],
    generateAnswer: () => `⚖️ **O'zbekistonda nikohni bekor qilish (ajrashish)ning to'liq qonuniy tartibi:**

📌 **1. Qonuniy asoslar (Oila kodeksi 37-48-moddalari):**
• **FHDYo (ZAGS) orqali bekor qilish (42-modda):** Faqat ikkala taraf roziligi bo'lganda va o'rtada **voyaga yetmagan umumiy bolalar hamda mulkiy nizo bo'lmaganda** amalga oshiriladi. Ariza berilgan kundan 3 oy o'tgach bekor qilinadi.
• **Sud orqali bekor qilish (38-41-moddalar):** O'rtada voyaga yetmagan bola bo'lsa yoki er-xotindan biri ajrashishga rozi bo'lmasa, ish faqat Fuqarolik sudida ko'rib chiqiladi.
• **40-modda (Yarashtirish muddati):** Sud er-xotinni yarashtirish uchun **6 OYGACHA MUHLAT** tayinlashi mumkin. Ushbu muddat o'tib ham oila tiklanmasa, nikoh bekor qilinadi.
• **23-28-moddalar (Birgalikdagi umumiy mulk):** Nikoh davomida orttirilgan barcha mol-mulk (uy, mashina, omonatlar) er va xotin o'rtasida **TENG 50/50 ULUSHDA** taqsimlanadi. Nikohgacha olingan yoki meros/hadya qilingan mulklar bo'linmaydi.

🟢 **Maqomi:** ✅ AMALDAGI QONUNCHILIK
🔗 **Lex.uz rasmiy havolasi:** https://lex.uz/docs/104720`
  },

  // 10. Yo'l jarimalari va 15 kunlik 50% chegirma
  {
    id: 'traffic_fines_discount',
    category: "Yo'l harakati va Ma'muriy huquq",
    title: "Yo'l harakati jarimalarini 15 kunda 50% chegirmada to'lash tartibi va shikoyat qilish",
    lexUrl: "https://lex.uz/docs/97664",
    primaryKeywords: ['jarima', 'radar', '15 kun', 'chegirma', 'yhq jarima', 'skidka'],
    generateAnswer: () => `⚖️ **Yo'l jarimalarini to'lashdagi 15 kunlik 50% imtiyozli chegirma tartibi (MJtK 332-1-moddasi):**

📌 **1. Qonuniy imtiyoz:**
• Huquqbuzar jarima solish to'g'risidagi qaror chiqarilgan kundan boshlab **15 KUN ICHIDA** jarima miqdorining **50 foizini** to'lasa, qolgan 50 foizini to'lashdan to'liq ozod qilinadi!
• 30 kun ichida to'lansa — 70 foizini to'lash imkoniyati beriladi.
• **Shikoyat qilish muddati (MJtK 315-modda):** Agar jarima asossiz qo'llanilgan deb hisoblasangiz, qaror chiqarilgan kundan boshlab **10 KUN ICHIDA** yuqori turuvchi organga (YHX boshqarmasiga) yoki Ma'muriy sudga shikoyat qilishingiz mumkin. Shikoyat berilganda jarimani undirish to'xtatiladi.

🟢 **Maqomi:** ✅ AMALDAGI QONUNCHILIK
🔗 **Lex.uz rasmiy havolasi:** https://lex.uz/docs/97664`
  },

  // 11. Pasport va ID-karta yo'qolishi
  {
    id: 'passport_loss',
    category: "Ma'muriy tartib-taomillar",
    title: "ID-karta yoki Pasport yo'qolganda ko'riladigan choralar, jarimalar va yangi karta olish",
    lexUrl: "https://lex.uz/docs/97664",
    primaryKeywords: [
      'pasport yo\'qol', 'pasportimni yo\'qotdim', 'id karta yo\'qol', 'id-karta yo\'qol',
      'pasport almashtir', 'passport yo\'qol', 'passportim', 'pasport', 'passport',
      'id-karta', 'id karta', 'yo\'qolgan pasport'
    ],
    generateAnswer: () => `⚖️ **ID-karta yoki pasport yo'qolganda ko'riladigan qonuniy choralar:**

📌 **1. Qayerga murojaat qilinadi:**
• Istalgan tuman **Davlat xizmatlari markaziga (DXM)** yoki tuman IIB Migratsiya va fuqarolikni rasmiylashtirish bo'limiga shaxsan borib yoxud **my.gov.uz** portali orqali ariza topshiring.
• Yangi ID-karta **1 ish kuni ichida** tayyorlab beriladi.

📌 **2. Qonuniy jarima va ozod qilish asoslari:**
• **MJtK 223-moddasi:** Pasport yoki ID-kartani ehtiyotsizlikdan yo'qotib qo'yganlik uchun — **BHMning 0.5 baravaridan 3 baravarigacha** jarima qo'llanilishi mumkin.
• *Javobgarlikdan ozod qilish (MJtK 21-modda):* Agar shaxs birinchi marta ehtiyotsizlikdan yo'qotgan bo'lsa, qilmish kam ahamiyatli deb topilib, faqat ogohlantirish berilishi mumkin.
• Agar hujjat o'g'irlangan bo'lsa (IIBdan ma'lumotnoma bilan) yoki favqulodda vaziyatda yo'qolgan bo'lsa — **hech qanday jarima qo'llanilmaydi**!

🟢 **Maqomi:** ✅ AMALDAGI QONUNCHILIK
🔗 **Lex.uz rasmiy havolasi:** https://lex.uz/docs/97664`
  },

  // 12. Kiberfiribgarlik va bank kartasidan pul o'g'irlanishi
  {
    id: 'cyber_fraud',
    category: "Kiberxavfsizlik va Jinoyat huquqi",
    title: "Bank kartasidan pul o'g'irlanganda ko'riladigan shoshilinch choralar, bank charge-back va tergov",
    lexUrl: "https://lex.uz/docs/111453",
    primaryKeywords: ['firibgar', 'kiber', 'karta pul', 'pulimni yechib oldi', 'kod keldi', 'click payme aldadi'],
    generateAnswer: () => `⚖️ **Bank kartasidan pul o'g'irlanganda ko'riladigan shoshilinch choralar:**

📌 **1. Qonuniy jazo (Jinoyat kodeksi 168-moddasi 3-qismi "g" bandi):**
• Axborot texnologiyalari (bank kartasi, mobil ilova, fishing havola)dan foydalanib sodir etilgan firibgarlik uchun — **BHMning 100 baravaridan 300 baravarigacha jarima yoki 5 yildan 8 yilgacha ozodlikdan mahrum qilish** jazosi belgilanadi.

📋 **2. Shoshilinch amaliy qadamlar:**
1️⃣ Kartani mobil ilova yoki bank Call-markazi orqali zudlik bilan bloklang.
2️⃣ Bankdan pul qaysi karta/tranzit hisobga chiqqanini ko'rsatuvchi rasmiy muhrli ko'chirmani (Vipiska) oling.
3️⃣ IIV Kiberxavfsizlik markaziga (📞 **102** yoki **cyber102.uz**) onlayn ariza yuboring. Qabul qiluvchi karta (dropper) darhol bloklanadi va tergov boshlanadi.

🟢 **Maqomi:** ✅ AMALDAGI QONUNCHILIK
🔗 **Lex.uz rasmiy havolasi:** https://lex.uz/docs/111453`
  },

  // 13. Iste'molchilar huquqlari (Tovarni qaytarish va almashtirish)
  {
    id: 'consumer_rights',
    category: "Iste'molchilar huquqlari",
    title: "Iste'molchilar huquqlarini himoya qilish: nuqsonli tovar pulini qaytarish va 10 kunda almashtirish",
    lexUrl: "https://lex.uz/docs/44222",
    primaryKeywords: ['iste\'molchi', 'tovarni qaytar', 'brak tovar', 'magazin pulni', 'nuqsonli tovar'],
    generateAnswer: () => `⚖️ **Iste'molchilar huquqlarini himoya qilish to'g'risidagi qonun bo'yicha to'liq huquqlar:**

📌 **1. Nuqsonli tovar sotilganda (13-17-moddalar):**
• Xaridor o'z xohishiga ko'ra:
  1) Tovarni ayni sifatlisiga almashtirib berishni;
  2) Narxini mutanosib ravishda kamaytirishni;
  3) Shartnomani bekor qilib, **to'langan to'liq pulni qaytarib olishni** talab qilishga haqli!
📌 **2. Nuqsonsiz tovarlarni 10 kunda almashtirish (18-modda):**
• Xaridor 10 kun ichida foydalanilmagan va tovar ko'rinishi saqlangan nooziq-ovqat tovarini boshqa o'lcham yoki rangiga almashtirishga haqli.
• Raqobatni rivojlantirish va iste'molchilar huquqlarini himoya qilish qo'mitasi: 📞 **1159**.
• Sudda iste'molchilar davlat boji to'lashdan to'liq ozod qilingan.

🟢 **Maqomi:** ✅ AMALDAGI QONUNCHILIK
🔗 **Lex.uz rasmiy havolasi:** https://lex.uz/docs/44222`
  },

  // 14. Meros qabul qilish
  {
    id: 'inheritance_rules',
    category: "Fuqarolik huquqi",
    title: "Merosni qabul qilib olishning qat'iy 6 oylik muddati, merosxo'rlar navbati va majburiy ulush",
    lexUrl: "https://lex.uz/docs/111189",
    primaryKeywords: ['meros', 'vasiyat', 'merosxo\'r', 'meros taqsim', 'meros olish'],
    generateAnswer: () => `⚖️ **Meros qabul qilish tartibi va qoidalari (Fuqarolik kodeksi 1112-1157-moddalari):**

📌 **1. Qat'iy 6 oylik muddat (FK 1146-modda):**
• Meros vafot etgan shaxsning o'limi qayd etilgan kundan boshlab **QAT'IY 6 OY ICHIDA** notarial idoraga ariza berish orqali qabul qilinishi shart! 6 oylik muddat o'tib ketsa, meros huquqi faqat sud orqali tiklanishi mumkin.
• **1-navbatdagi merosxo'rlar (1135-modda):** Marhumning bolalari, eri (xotini) va ota-onasi teng ulushlarda meros oladilar.
• **Majburiy ulush (1142-modda):** Marhum vasiyatnoma qoldirgan taqdirda ham, uning voyaga yetmagan yoki mehnatga qobiliyatsiz bolalari va qaramog'idagilar qonun bo'yicha tegishi lozim bo'lgan ulushning kamida yarmini (majburiy ulush) olish huquqiga egadirlar.

🟢 **Maqomi:** ✅ AMALDAGI QONUNCHILIK
🔗 **Lex.uz rasmiy havolasi:** https://lex.uz/docs/111189`
  },

  // 15. Tungi shovqin
  {
    id: 'noise_violation',
    category: "Ma'muriy huquq",
    title: "Tungi vaqtda shovqin solganlik va fuqarolar tinchini buzganlik uchun jazo",
    lexUrl: "https://lex.uz/docs/97664",
    primaryKeywords: ['shovqin', 'musiqa', 'tungi vaqt', 'tinchlik', 'osoyishtalik', 'remont ovozi', 'baqir-chaqir'],
    generateAnswer: () => `⚖️ **Tungi vaqtda fuqarolarning osoyishtaligi va tinchini buzganlik uchun jazo (MJtK 192-moddasi):**

📌 **1. Qonuniy me'yor:**
• Tungi vaqtda — **soat 23:00 dan 06:00 gacha** fuqarolarning tinchini buzish (baland musiqa, ta'mirlash shovqini):
  - Fuqarolarga — **BHMning 1/3 qismi miqdorida**;
  - Mansabdor shaxslarga — **BHMning 1/3 qismidan 1/2 qismigacha** jarima solishga sabab bo'ladi.
  - Bir yil ichida takrorlansa: fuqarolarga **BHMning 1/2 qismi**, mansabdorlarga **1 baravari** jarima.
• Shoshilinch xabar berish: 📞 **102** (profilaktika inspektori dalolatnoma tuzadi).

🟢 **Maqomi:** ✅ AMALDAGI QONUNCHILIK
🔗 **Lex.uz rasmiy havolasi:** https://lex.uz/docs/97664`
  },

  // 16. Chet elga chiqishga taqiq (MIB zapreti)
  {
    id: 'travel_ban_mib',
    category: "Ijro huquqi va MIB",
    title: "Chet elga chiqishga taqiq (Zapret) qo'yilishi va uni bekor qilish tartibi",
    lexUrl: "https://lex.uz/docs/4143851",
    primaryKeywords: ['zapret', 'taqiq', 'chet elga chiqish', 'aeroportda to\'xtatdi', 'mib qarzi', 'zapret tekshirish'],
    generateAnswer: () => `⚖️ **Chet elga chiqishga taqiq (Zapret) va uni zudlik bilan bekor qilish tartibi:**

📌 **1. Qonuniy asos ("Sud hujjatlari va boshqa organlar hujjatlarini ijro etish to'g'risida"gi Qonun 42-1-moddasi):**
• Qarzdorlik belgilangan muddatda to'lanmagan taqdirda, davlat ijrochisi (MIB) fuqaroning O'zbekistondan chiqishini vaqtincha cheklash to'g'risida qaror chiqaradi.
• Taqiqni **mib.uz** rasmiy sayti orqali JSHSHIR (PINFL) kiritib tekshirish mumkin.
• Qarzdorlik to'langach, davlat ijrochisi **1 ish kuni ichida** taqiqni bekor qilish to'g'risida qaror qabul qiladi va elektron tizim orqali cheklov olib tashlanadi.

🟢 **Maqomi:** ✅ AMALDAGI QONUNCHILIK
🔗 **Lex.uz rasmiy havolasi:** https://lex.uz/docs/4143851`
  },

  // 17. Avtohalokat (YTH, Avariya) va sug'urta to'lovi
  {
    id: 'traffic_accident',
    category: "Yo'l harakati va Sug'urta huquqi",
    title: "YTH (Avariya) yuz berganda harakatlar va zararni sug'urtadan undirish",
    lexUrl: "https://lex.uz/docs/97664",
    primaryKeywords: ['avariya', 'yth', 'yo\'l-transport hodisasi', 'mashinamni urib ketdi', 'sug\'urta to\'lamay'],
    generateAnswer: () => `⚖️ **Yo'l-transport hodisasi (YTH / Avariya) sodir bo'lganda ko'riladigan choralar:**

📌 **1. Qonuniy asos va javobgarlik:**
• **MJtK 133-moddasi:** YTH sodir etib transport vositalariga shikast yetkazish — **BHMning 2 baravaridan 4 baravarigacha jarima** yoki 6 oygacha haydovchilik huquqidan mahrum qilish.
• **Majburiy avtosug'urta (OSAGO):** Yetkazilgan zarar **40 million so'mgacha** bo'lgan miqdorda sug'urta kompaniyasi tomonidan to'lanadi. 40 mln so'mdan oshgan qismi Fuqarolik sudi orqali aybdor haydovchidan undiriladi (FK 985-modda).
• YPX chaqirish (📞 **102** / **1102**) yoki tomonlar kelishuvi bilan **Evroprotokol** rasmiylashtirish mumkin.

🟢 **Maqomi:** ✅ AMALDAGI QONUNCHILIK
🔗 **Lex.uz rasmiy havolasi:** https://lex.uz/docs/97664`
  },

  // 18. Tuhmat va Haqorat
  {
    id: 'defamation_insult',
    category: "Jinoyat va Ma'muriy huquq",
    title: "Tuhmat va haqorat qilganlik uchun jazo va ma'naviy zararni undirish",
    lexUrl: "https://lex.uz/docs/97664",
    primaryKeywords: ['tuhmat', 'bo\'hton', 'haqorat', 'so\'kdi', 'kamsitdi', 'sharmanda'],
    generateAnswer: () => `⚖️ **Tuhmat va haqorat uchun qonuniy javobgarlik:**

📌 **1. Ma'muriy va Jinoiy jazolar:**
• **MJtK 40-moddasi (Tuhmat):** Bila turib boshqa shaxsni sharmanda qiladigan uydirmalar tarqatish — **BHMning 20 dan 60 baravarigacha jarima**. Takrorlansa yoki internetda bo'lsa: JK 139-modda bo'yicha jinoiy jazo!
• **MJtK 41-moddasi (Haqorat):** Shaxsning sha’ni va qadr-qimmatini qasddan kamsitish — **BHMning 20 dan 40 baravarigacha jarima**. Ijtimoiy tarmoqda: JK 140-modda.
• Sudda Fuqarolik kodeksi 1021-moddasi bo'yicha yetkazilgan **ma'naviy zararni moddiy undirib olish** huquqi kafolatlanadi.

🟢 **Maqomi:** ✅ AMALDAGI QONUNCHILIK
🔗 **Lex.uz rasmiy havolasi:** https://lex.uz/docs/97664`
  },

  // 19. Qo'shnilar o'rtasida yer nizosi, devor, noqonuniy qurilish
  {
    id: 'land_boundary_dispute',
    category: "Uy-joy va Yer huquqi",
    title: "Qo'shnilar o'rtasida yer chegarasi va noqonuniy devor/imorat nizolari",
    lexUrl: "https://lex.uz/docs/111189",
    primaryKeywords: ['devor', 'yer nizo', 'noqonuniy qurilish', 'kadastr chegarasi', 'snos', 'uchastka chegara'],
    negativeKeywords: ['suv tosh', 'suv bos', 'shovqin'],
    generateAnswer: () => `⚖️ **Qo'shni chegarani buzib noqonuniy devor yoki imorat qurib olganda:**

📌 **1. Qonuniy asos (Fuqarolik kodeksi 212-moddasi):**
• Ruxsatnomasiz yoki shaharsozlik normalarini buzib qurilgan har qanday qurilma — **o'zboshimchalik bilan qurilgan imorat** hisoblanadi.
• Bunday imoratni qurgan shaxs uni **o'z hisobidan majburiy buzib tashlashi shart**!
• Kadastr palatasi chegara dalolatnomasini tuzadi, Qurilish bo'limi ko'rsatma beradi va Fuqarolik sudi orqali majburiy buzdiriladi.

🟢 **Maqomi:** ✅ AMALDAGI QONUNCHILIK
🔗 **Lex.uz rasmiy havolasi:** https://lex.uz/docs/111189`
  },

  // 20. Talaba kontrakti bo'yicha daromad solig'i imtiyozi
  {
    id: 'student_contract_tax',
    category: "Soliq huquqi",
    title: "Talaba kontrakti to'lovidan daromad solig'ini (12%) qaytarib olish tartibi",
    lexUrl: "https://lex.uz/docs/4674902",
    primaryKeywords: ['kontrakt soliq', 'talaba kontrakti', 'soliq imtiyozi', 'kontrakt pulidan soliq'],
    generateAnswer: () => `⚖️ **Talaba kontrakt to'lovidan 12% daromad solig'ini qaytarib olish (Soliq kodeksi 378-moddasi 16-bandi):**

📌 **1. Qonuniy imtiyoz:**
• O'zbekiston Respublikasi OTMlarida o'qiyotgan o'zining yoki 26 yoshga to'lmagan farzandlarining yoxud turmush o'rtog'ining o'qishi uchun to'langan mablag'lar daromad solig'idan **to'liq ozod qilinadi**.
• To'langan kontrakt summasining 12 foizi budjetdan fuqaroning hisob raqamiga qaytarib beriladi (**my3.soliq.uz** portali orqali ariza beriladi).

🟢 **Maqomi:** ✅ AMALDAGI QONUNCHILIK
🔗 **Lex.uz rasmiy havolasi:** https://lex.uz/docs/4674902`
  },

  // 21. Pensiya yoshi va staji
  {
    id: 'pension_retirement',
    category: "Ijtimoiy ta'minot huquqi",
    title: "Yoshga doir pensiyaga chiqish yoshi va talab qilinadigan ish staji",
    lexUrl: "https://lex.uz/docs/111453",
    primaryKeywords: ['pensiya', 'pensiya yoshi', 'pensiyaga chiqish', 'nafaqa', 'pensiya staji'],
    generateAnswer: () => `⚖️ **Yoshga doir pensiyaga chiqish tartibi ("Fuqarolarning davlat pensiya ta'minoti to'g'risida"gi Qonun):**

📌 **1. Qonuniy talablar:**
• **Erkaklar:** 60 yoshga to'lganda, kamida **25 yillik** ish staji bo'lganda;
• **Ayollar:** 55 yoshga to'lganda, kamida **20 yillik** ish staji bo'lganda to'liq pensiya tayinlanadi.
• Kamida **7 yillik staj** bo'lsa — stajga mutanosib to'liqsiz yoshga doir pensiya tayinlanadi.
• Pensiya jamg'armasi ishonch telefoni: **1140**.

🟢 **Maqomi:** ✅ AMALDAGI QONUNCHILIK
🔗 **Lex.uz rasmiy havolasi:** https://lex.uz/docs/111453`
  }
];

export function solveUzbekLegalQuestion(rawQuery: string): LegalAdviceResult {
  const q = rawQuery.toLowerCase().trim();

  // 1. Evaluate intent matchers with scoring
  let bestMatcher: IntentMatcher | null = null;
  let highestScore = 0;

  for (const matcher of INTENT_MATCHERS) {
    let score = 0;

    // Check negative keywords
    if (matcher.negativeKeywords && matcher.negativeKeywords.some(neg => q.includes(neg))) {
      continue;
    }

    // Check primary keywords (high weight)
    for (const kw of matcher.primaryKeywords) {
      if (q.includes(kw)) {
        score += 10;
      }
    }

    // Check secondary keywords (supporting weight)
    if (matcher.secondaryKeywords) {
      for (const kw of matcher.secondaryKeywords) {
        if (q.includes(kw)) {
          score += 3;
        }
      }
    }

    if (score > highestScore) {
      highestScore = score;
      bestMatcher = matcher;
    }
  }

  // If we have a confident match (score >= 10)
  if (bestMatcher && highestScore >= 10) {
    return {
      matched: true,
      category: bestMatcher.category,
      title: bestMatcher.title,
      answer: bestMatcher.generateAnswer(rawQuery),
      lexUrl: bestMatcher.lexUrl,
    };
  }

  // 2. Broad domain detection with extensive multi-article analysis
  const isLabor = q.includes('mehnat') || q.includes('ishchi') || q.includes('xodim') || q.includes('rahbar') || q.includes('ish beruvchi') || q.includes('kasb') || q.includes('ish');
  const isFamily = q.includes('nikoh') || q.includes('oila') || q.includes('xotin') || q.includes('er-xotin') || q.includes('farzand') || q.includes('bola') || q.includes('ota') || q.includes('ona');
  const isCriminal = q.includes('jinoyat') || q.includes('qamoq') || q.includes('tergov') || q.includes('prokuror') || q.includes('iib') || q.includes('sudlangan');
  const isCivil = q.includes('shartnoma') || q.includes('bitim') || q.includes('zarar') || q.includes('sud') || q.includes('notarius') || q.includes('mulk');

  if (isLabor) {
    return {
      matched: false,
      category: "Mehnat huquqi",
      title: "Yangi Mehnat kodeksi (O'RQ-798) bo'yicha to'liq huquqiy tahlil va barcha aloqador moddalar",
      answer: `⚖️ **O'zbekiston Respublikasining Yangi Mehnat kodeksi (O'RQ-798) bo'yicha to'liq va keng qamrovli huquqiy tahlil:**

📌 **1. Konstitutsiyaviy va umumiy kafolatlar:**
• **Konstitutsiyaning 42-moddasi:** Har kim munosib mehnat qilish, kasb va faoliyat turini erkin tanlash, xavfsizlik va gigiyena talablariga javob beradigan qulay mehnat sharoitlarida ishlash huquqiga ega.
• 2023-yil 30-apreldan kuchga kirgan Yangi Mehnat kodeksi xodimning huquqiy himoyasini tubdan kuchaytirgan.

📜 **2. Barcha aloqador asosiy moddalar va qonuniy normalar:**
• **104-108-moddalar:** Mehnat shartnomasini tuzish tartibi va majburiy shartlari (yozma shakl, my.mehnat.uz tizimida elektron ro'yxatga olish).
• **129-130-moddalar:** Dastlabki sinov muddati (maksimal 3 oy, uzaytirish taqiqlanadi, homilador va bitiruvchilarga sinov taqiqlanadi).
• **161-165-moddalar:** Ish beruvchi tashabbusi bilan shartnomani bekor qilishning qat'iy asoslari va majburiy ogohlantirish muddatlari (2 oy, 2 hafta, 3 kun).
• **173-modda:** Ishdan bo'shatish nafaqasi (stajga qarab 50% dan 200% gacha).
• **217-modda:** Yillik asosiy ta'til muddati kamida **21 kalendar kuni** (eski 15 kun bekor qilingan).
• **253-modda:** Ish haqini har yarim oyda kamida bir marta to'lash majburiyati.
• **333-modda:** Ish haqi kechiktirilgan har bir kun uchun Markaziy bank foizi bilan pulli kompensatsiya to'lash.
• **408-modda:** Homilador va 3 yoshgacha bolasi borlarni bo'shatish taqiqlanishi.
• **560-modda:** Mehnat nizolarini sudda ko'rib chiqish muddatlari (ishga tiklashda — 1 oy).

📋 **3. Qadamma-qadam amaliy harakatlar:**
1. Ish beruvchiga yozma ariza bering (nusxasiga kirim raqami qo'ydiring).
2. Davlat mehnat inspeksiyasiga (📞 **1282**, **dmi.mehnat.uz**) shikoyat yuboring.
3. Fuqarolik ishlari bo'yicha sudga murojaat qiling (**my.sud.uz**). Xodimlar barcha sudlarda **DAVLAT BOJIDAN TO'LIQ OZOD QILINGAN!**

🟢 **Maqomi:** ✅ AMALDAGI QONUNCHILIK (O'RQ-798)
🔗 **Lex.uz rasmiy havolasi:** https://lex.uz/docs/6257288`,
      lexUrl: "https://lex.uz/docs/6257288",
    };
  }

  if (isFamily) {
    return {
      matched: false,
      category: "Oila huquqi",
      title: "Oila kodeksi bo'yicha keng qamrovli huquqiy tahlil va tegishli moddalar",
      answer: `⚖️ **O'zbekiston Respublikasi Oila qonunchiligi bo'yicha keng qamrovli huquqiy tahlil:**

📌 **1. Qonuniy asoslar va Konstitutsiyaviy kafolatlar:**
• Konstitutsiyaning 76-78-moddalariga muvofiq, oila jamiyatning asosiy bo'g'inidir hamda jamiyat va davlat muhofazasidadir. Oila qonunchiligi er va xotinning teng huquqliligi, bolalar manfaatlarini ustuvor himoya qilishga asoslanadi.

📜 **2. Barcha aloqador moddalar (Oila kodeksi):**
• **14-17-moddalar:** Nikoh tuzish shartlari, nikoh yoshi (18 yosh), yaqin qarindoshlar o'rtasida nikoh tuzishga yo'l qo'yilmasligi va bepul tibbiy ko'rik.
• **23-28-moddalar:** Er-xotinning birgalikdagi umumiy mulki va uni teng 50/50 ulushda taqsimlash tartibi.
• **38-44-moddalar:** Nikohni sud orqali bekor qilish, 6 oygacha yarashtirish muholati, bolalarning yashash joyini sud orqali belgilash.
• **96-105-moddalar:** Ota-onaning bolalariga aliment to'lash majburiyati (1 bolaga 25%, 2 bolaga 33.3%, 3+ bolaga 50%).
• **MJtK 47-4 va JK 122-moddalari:** Aliment to'lashdan bo'yin tovlaganlik uchun 15 sutka qamoq va 2 yilgacha ozodlikdan mahrum qilish.

📋 **3. Qayerga murojaat qilinadi:**
• Ro'yxatdan o'tkazish: Tuman FHDYo bo'limi;
• Nizoli masalalarda (aliment, mulk, ajrashish): Fuqarolik ishlari bo'yicha tumanlararo sudi (**my.sud.uz**).

🟢 **Maqomi:** ✅ AMALDAGI QONUNCHILIK
🔗 **Lex.uz rasmiy havolasi:** https://lex.uz/docs/104720`,
      lexUrl: "https://lex.uz/docs/104720",
    };
  }

  if (isCriminal) {
    return {
      matched: false,
      category: "Jinoyat huquqi",
      title: "Jinoyat va Jinoiy-protsessual qonunchilik bo'yicha huquqiy xulosa va kafolatlar",
      answer: `⚖️ **O'zbekiston Respublikasi Jinoyat qonunchiligi bo'yicha huquqiy tahlil:**

📌 **1. Qonuniy asoslar:**
• Konstitutsiyaning 26-moddasiga asosan, sud hukmi qonuniy kuchga kirmaguncha hech kim jinoyat sodir etishda aybdor deb hisoblanmaydi (aybsizlik prezumpsiyasi).
• Har bir gumon qilinuvchi va ayblanuvchi advokat xizmatidan foydalanish hamda o'ziga qarshi ko'rsatma bermaslik (sukut saqlash) huquqiga ega.

📜 **2. Aloqador kodekslar va moddalar:**
• **Jinoyat kodeksi (JK):** 168-modda (Firibgarlik), 169-modda (O'g'rilik), 139-140-moddalar (Tuhmat va haqorat), 205-modda (Hokimiyatni suiiste'mol qilish).
• **MJtK:** Ma'muriy huquqbuzarliklar bo'yicha javobgarlik choralari.
• **JPK:** Tergov o'tkazish tartibi, ushlab turish muddati (48 soat) va sud orqali qamoqqa olish sanksiyasi (Habeas Corpus).
• Murojaat: IIB (📞 **102**), Bosh prokuratura (📞 **1007**).

🟢 **Maqomi:** ✅ AMALDAGI QONUNCHILIK
🔗 **Lex.uz rasmiy havolasi:** https://lex.uz/docs/111453`,
      lexUrl: "https://lex.uz/docs/111453",
    };
  }

  // Universal neutral legal solution citing Constitution and Lex.uz
  return {
    matched: false,
    category: "O'zbekiston Qonunchiligi",
    title: "O'zbekiston Respublikasi amaldagi qonunchiligi bo'yicha keng qamrovli huquqiy xulosa",
    answer: `⚖️ **O'zbekiston Respublikasining amaldagi qonunchiligi bo'yicha keng qamrovli huquqiy tahlil:**

📌 **1. Konstitutsiyaviy kafolatlar:**
• O'zbekiston Respublikasining Yangi tahrirdagi Konstitutsiyasining **55-moddasiga** asosan, har bir shaxs o'z huquq va erkinliklarini qonunda taqiqlanmagan barcha vositalar bilan himoya qilishga, shu jumladan buzilgan huquqlari yuzasidan sudga hamda davlat organlariga to'g'ridan-to'g'ri murojaat qilishga haqlidir.
• Ushbu masala O'zbekiston Respublikasining amaldagi kodekslari (Fuqarolik, Mehnat, Ma'muriy, Jinoyat) va qonunlari doirasida to'liq tartibga solinadi.

📋 **2. Qadamma-qadam amaliy harakatlar rejasi:**
1️⃣ **Dalillar to'plang:** Mavzuga oid shartnomalar, arizalar, rasmiy yozishmalar yoki bank kvitansiyalarini saqlang.
2️⃣ **Vakolatli organga murojaat qiling:**
   • Bepul yuridik yordam va maslahat: **Adliya vazirligi (📞 1008)**;
   • Prokuratura nazorati: **Bosh prokuratura (📞 1007)**;
   • Sud himoyasi: **my.sud.uz** portali orqali tegishli tuman sudiga da'vo arizasi kiriting.
3️⃣ **Lex.uz rasmiy bazasi:** O'zbekiston qonunchiligining rasmiy matni bilan Lex.uz portalida tanishing.

🟢 **Maqomi:** ✅ AMALDAGI QONUNCHILIK
🔗 **Lex.uz rasmiy bazasi:** https://lex.uz`,
    lexUrl: `https://lex.uz`,
  };
}
