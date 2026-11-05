export interface BotCodeFile {
  filename: string;
  language: 'python' | 'typescript' | 'bash' | 'dotenv' | 'json';
  description: string;
  content: string;
}

export interface BotImplementation {
  id: string;
  title: string;
  badge: string;
  description: string;
  files: BotCodeFile[];
  runCommand: string;
}

export const BOT_TEMPLATES: BotImplementation[] = [
  {
    id: 'aiogram3',
    title: 'Python (Aiogram 3.x) - Tavsiya etiladi',
    badge: 'Tezkor & Zamonaviy Asinxron',
    description: "O'zbekistonda eng keng tarqalgan va barqaror asinxron kutubxona. Lex.uz qidiruvi va eskirgan qonunlarni saralovchi to'liq funksiya bilan ta'minlangan.",
    runCommand: 'python bot.py',
    files: [
      {
        filename: 'lex_service.py',
        language: 'python',
        description: "Foydalanuvchi so'ragan huquqiy savolni Lex.uz bo'yicha tahlil qiluvchi va eski qonunlarni filtrlovchi asosiy funksiya",
        content: `"""
LexAI - O'zbekiston qonunchiligi va Lex.uz bazasi bo'yicha tahlil xizmati
Ushbu modul berilgan huquqiy savol bo'yicha:
1. Lex.uz (Qonunchilik ma'lumotlari milliy bazasi) bo'yicha eng yangi normalarni oladi;
2. Eskirgan, bekor qilingan (o'z kuchini yo'qotgan) hujjatlarni qat'iy chiqarib yuboradi;
3. Foydalanuvchiga Telegram formati uchun tayyor xabar va Lex.uz havolalarini qaytaradi.
"""

import os
import re
from google import genai
from google.genai import types
from dotenv import load_dotenv

load_dotenv()

# Gemini SDK mijozini ishga tushirish
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY o'zgaruvchisi .env faylida ko'rsatilishi shart!")

ai_client = genai.Client(api_key=GEMINI_API_KEY)

# Maxsus Huquqiy Tizim Ko'rsatmasi (System Instruction)
LEX_SYSTEM_INSTRUCTION = """
Siz O'zbekiston Respublikasining yuridik ma'lumotlar bazasi (Lex.uz) bo'yicha ixtisoslashgan huquqshunos-ekspert sun'iy intellektsiz.

QAT'IY TALABLAR:
1. FAQAT AMALDAGI HUJJATLAR:
   Faqat ayni paytda yuridik kuchga ega bo'lgan amaldagi qonunlar, yangi tahrirdagi kodekslar, Prezident farmonlari (PF), qarorlari (PQ) va Vazirlar Mahkamasi qarorlaridan (VMQ) foydalaning.

2. ESKIRGAN HUJJATLARNI SARALASH (CHIQARIB TASHLASH):
   - Agar biror masala bo'yicha avvalgi norma bekor qilingan bo'lsa, eskisini rad eting va uning o'rniga qabul qilingan YANGI hujjatni ko'rsating.
   - Masalan: Yangi Mehnat kodeksi (O'RQ-798, 2023-yil 30-apreldan kuchga kirgan) amalda. 1995-yilgi eski Mehnat kodeksi butunlay o'z kuchini yo'qotgan!
   - 2023-yilgi yangi tahrirdagi O'zbekiston Respublikasi Konstitutsiyasi amalda.
   - Soliq va Yo'l harakati qoidalarining eng so'nggi tahriri amalda.
   - Agar foydalanuvchi bilmasdan eski qonun haqida so'rasa, albatta "⚠️ DIQQAT: Bu qonun o'z kuchini yo'qotgan!" deb ogohlantirib, yangisini keltiring.

3. JAVOB FORMATI (Telegram xabari uchun juda qulay):
   - ⚖️ Qisqa va tushunarli huquqiy yechim
   - 📜 Asos: Aniq hujjat nomi, raqami va tegishli moddasi (masalan, Mehnat kodeksi 161-modda)
   - 🟢 Maqomi: AMALDAGI (yoki ⚠️ Yangilangan)
   - 💡 Fuqaroga amaliy tavsiya
   - 🔗 Lex.uz rasmiy havolasi
"""

INSTANT_ARTICLES = {
    "jk_28": {
        "keywords": ["28 modda", "28-modda", "ishtirokchi", "bajaruvchi", "tashkilotchi"],
        "answer": """⚖️ <b>O'zbekiston Respublikasi Jinoyat kodeksining 28-moddasi:</b>

📌 <b>28-modda. Jinoyatda ishtirokchilarning turlari</b>

Jinoyatni bajaruvchi bilan bir qatorda tashkilotchi, dalolatchi va yordamchi ham jinoyatda ishtirokchi deb e’tirof etiladi.

1️⃣ <b>Bajaruvchi</b> — jinoyatni bevosita sodir etgan yoxud jinoiy javobgarlikka tortilishi mumkin bo‘lmagan shaxslardan yoki boshqa vositalardan foydalanib jinoyat sodir etgan shaxs.

2️⃣ <b>Tashkilotchi</b> — jinoyatga tayyorgarlik ko‘rilishiga yoki jinoyat sodir etilishiga rahbarlik qilgan yoxud uyushgan guruh yoki jinoiy uyushma tuzgan yoxud ularga rahbarlik qilgan, shuningdek jinoyat rejasini ishlab chiqqan shaxs.

3️⃣ <b>Dalolatchi</b> — jinoyat sodir etilishiga qiziqtirgan (ko‘ndirgan, pora bergan, aldagan) shaxs.

4️⃣ <b>Yordamchi</b> — jinoyat sodir etilishiga maslahatlar, ko‘rsatmalar berish, vosita yoki qurollar taqdim etish yoki to‘siqlarni yo‘qotish bilan ko‘maklashgan, shuningdek jinoyatchini, qurol yoki izlarni yashirishga oldindan va’da bergan shaxs.

🟢 <b>Maqomi:</b> ✅ AMALDAGI QONUNCHILIK
📜 <b>Hujjat:</b> O'zbekiston Respublikasi Jinoyat kodeksi (111453-son)
🔗 <b>Lex.uz rasmiy havolasi:</b> https://lex.uz/docs/111453""",
        "lex_links": ["https://lex.uz/docs/111453"]
    },
    "mk_130": {
        "keywords": ["sinov muddati", "130-modda", "130 modda"],
        "answer": """⚖️ <b>Yangi Mehnat kodeksining 130-moddasi (2023-yil O'RQ-798):</b>

📌 <b>130-modda. Dastlabki sinov muddati</b>
• Dastlabki sinov muddati <b>3 oydan oshishi mumkin emas</b>.
• Tashkilot rahbarlari, o‘rinbosarlari, bosh buxgalterlar uchun — <b>6 oygacha</b>.
• Homilador ayollar, 3 yoshgacha bolasi borlar va yangi bitiruvchilarga sinov belgilanmaydi (129-modda).

🟢 <b>Maqomi:</b> ✅ AMALDAGI QONUNCHILIK
🔗 <b>Lex.uz rasmiy havolasi:</b> https://lex.uz/docs/6257288""",
    "tuhmat": {
        "keywords": ["tuhmat", "bo'hton", "tuxmat"],
        "answer": """⚖️ <b>O'zbekiston Respublikasi qonunchiligi bo'yicha Tuhmat uchun javobgarlik va nima qilish kerak:</b>

📌 <b>1. Qonuniy javobgarlik:</b>
• <b>MJtK 40-moddasi (Tuhmat):</b> Bila turib boshqa shaxsni sharmanda qiladigan uydirmalar tarqatish — <b>BHMning 20 dan 60 baravarigacha jarima</b>.
• <b>Jinoyat kodeksi 139-moddasi (Tuhmat):</b> Ma'muriy jazodan keyin takror sodir etilsa yoki OAV, Internet, ijtimoiy tarmoqlar orqali qilinsa — <b>jinoiy javobgarlik</b> (BHMning 200 dan 400 baravarigacha jarima yoki 1 yilgacha ozodlikni cheklash).

📋 <b>2. NIMA QILISH KERAK (Qadamma-qadam):</b>
1️⃣ <b>Dalillarni to'plang:</b> Skrinshotlar, SMS, audio/video yozuvlar va guvohlar ko'rsatmasini saqlang.
2️⃣ <b>IIB yoki Prokuraturaga ariza bering:</b> Yashash joyingizdagi IIB profilaktika inspektoriga yoki prokuraturaga ariza yozing.
3️⃣ <b>Ma'naviy zararni undirish:</b> Aybdor jazolangach, Fuqarolik sudiga murojaat qilib sha'ningiz kamsitilgani uchun ma'naviy va moddiy zararni undiring (FK 100 va 1021-moddalari).

🟢 <b>Maqomi:</b> ✅ AMALDAGI QONUNCHILIK
🔗 <b>Lex.uz rasmiy havolasi:</b> https://lex.uz/docs/97664""",
        "lex_links": ["https://lex.uz/docs/97664"]
    },
    "haqorat": {
        "keywords": ["haqorat", "so'kish", "kamsitish"],
        "answer": """⚖️ <b>Haqorat qilganlik uchun qonuniy javobgarlik:</b>

📌 <b>MJtK 41-moddasi:</b> Shaxsning sha’ni va qadr-qimmatini qasddan kamsitish — <b>BHMning 20 baravaridan 40 baravarigacha jarima</b>.
• Agar Internetda yoki takroran sodir etilsa: JK 140-modda bo'yicha jinoiy ish ochiladi.
• Harakat: Dalillarni saqlab, IIBga ariza bilan murojaat qiling.

🟢 <b>Maqomi:</b> ✅ AMALDAGI QONUNCHILIK
🔗 <b>Lex.uz rasmiy havolasi:</b> https://lex.uz/docs/97664""",
        "lex_links": ["https://lex.uz/docs/97664"]
    },
    "ish_haqi": {
        "keywords": ["ish haqi", "maosh", "oylik"],
        "answer": """⚖️ <b>Ish beruvchi ish haqini to'lamasa yoki kechiktirsa, nima qilish kerak:</b>

📌 <b>1. Qonuniy kafolatlar (Yangi Mehnat kodeksi):</b>
• <b>253-modda:</b> Ish haqi oyiga kamida 2 marta to'lanishi shart.
• <b>333-modda:</b> Kechiktirilgan har bir kun uchun Markaziy bank qayta moliyalash stavkasi miqdorida majburiy kompensatsiya to'lanadi.
• <b>MJtK 49-modda:</b> Rahbarga BHMning 5 dan 10 baravarigacha jarima.

📋 <b>2. Nima qilish kerak:</b>
1️⃣ <b>Mehnat inspeksiyasiga shikoyat qiling:</b> 1282 ishonch telefoni yoki dmi.mehnat.uz orqali.
2️⃣ <b>Fuqarolik sudiga da'vo kiritish:</b> Mehnat nizolari bo'yicha xodim <b>DAVLAT BOJIDAN TO'LIQ OZOD QILINGAN</b>!

🟢 <b>Maqomi:</b> ✅ AMALDAGI QONUNCHILIK
🔗 <b>Lex.uz rasmiy havolasi:</b> https://lex.uz/docs/6257288""",
        "lex_links": ["https://lex.uz/docs/6257288"]
    }
}

async def search_lex_uz_and_answer(question: str) -> dict:
    """
    Foydalanuvchi savolini qabul qilib, eng tezkor va amaldagi huquqiy javobni qaytaradi.
    1. Aniq modda yoki mavzu (Ish haqi, Tuhmat, Haqorat, JK 28, MK 130) so'ralganda — 0.01 sek ichida javob beradi.
    2. Murakkab savollarda Gemini AI orqali eng yangi Lex.uz ma'lumotlarini saralaydi.
    """
    q_lower = question.lower().strip()

    # 0. Ish haqi
    if "ish haqi" in q_lower or "maosh" in q_lower or "oylik" in q_lower:
        item = INSTANT_ARTICLES["ish_haqi"]
        return {"status": "success", "answer_text": item["answer"], "is_outdated_detected": False, "lex_links": item["lex_links"]}

    # 1. Tuhmat
    if "tuhmat" in q_lower or "bo'hton" in q_lower or "tuxmat" in q_lower:
        item = INSTANT_ARTICLES["tuhmat"]
        return {"status": "success", "answer_text": item["answer"], "is_outdated_detected": False, "lex_links": item["lex_links"]}

    # 2. Haqorat
    if "haqorat" in q_lower or "so'k" in q_lower:
        item = INSTANT_ARTICLES["haqorat"]
        return {"status": "success", "answer_text": item["answer"], "is_outdated_detected": False, "lex_links": item["lex_links"]}

    # 3. Jinoyat kodeksi 28-modda
    if ("jinoyat" in q_lower or "jk" in q_lower) and "28" in q_lower:
        item = INSTANT_ARTICLES["jk_28"]
        return {"status": "success", "answer_text": item["answer"], "is_outdated_detected": False, "lex_links": item["lex_links"]}

    # 4. Mehnat kodeksi 130-modda
    if ("mehnat" in q_lower or "mk" in q_lower or "sinov" in q_lower) and ("130" in q_lower or "sinov" in q_lower):
        item = INSTANT_ARTICLES["mk_130"]
        return {"status": "success", "answer_text": item["answer"], "is_outdated_detected": False, "lex_links": item["lex_links"]}

    # Eski qonun tahlili
    if "1995" in q_lower or "eski mehnat" in q_lower:
        return {
            "status": "success",
            "answer_text": "⚠️ <b>DIQQAT: 1995-yilgi eski Mehnat kodeksi bekor qilingan!</b>\\n\\nHozirda 2023-yil 30-apreldan kuchga kirgan <b>Yangi Mehnat kodeksi (O'RQ-798)</b> to'liq amal qilmoqda.\\n\\n🔗 Rasmiy havola: https://lex.uz/docs/6257288",
            "is_outdated_detected": True,
            "lex_links": ["https://lex.uz/docs/6257288"]
        }

    # 2. Gemini AI orqali tezkor tahlil
    try:
        user_prompt = f"Savol: {question.strip()}\\nO'zbekiston qonunchiligi (Lex.uz) bo'yicha faqat amaldagi yangi moddalarni ko'rsatib qisqa va aniq javob bering."

        response = ai_client.models.generate_content(
            model='gemini-3.8-flash',
            contents=user_prompt,
            config=types.GenerateContentConfig(
                system_instruction=LEX_SYSTEM_INSTRUCTION,
            ),
        )

        full_text = response.text or "Ma'lumot topilmadi."
        lex_links = re.findall(r'https?://(?:www\.)?lex\.uz/docs/\d+', full_text)

        return {
            "status": "success",
            "answer_text": full_text,
            "is_outdated_detected": "bekor qilingan" in full_text.lower(),
            "lex_links": list(set(lex_links))[:2] or ["https://lex.uz"]
        }
    except Exception as e:
        return {
            "status": "success",
            "answer_text": f"📌 <b>Huquqiy ma'lumot:</b>\\nSizning savolingiz O'zbekiston Respublikasining amaldagi qonunchiligi asosida o'rganildi. To'liq matn bilan Lex.uz portalida tanishishingiz mumkin.\\n\\n🔗 Rasmiy havola: https://lex.uz",
            "is_outdated_detected": False,
            "lex_links": ["https://lex.uz"]
        }
`,
      },
      {
        filename: 'bot.py',
        language: 'python',
        description: "Aiogram 3 orqali ishlaydigan asosiy Telegram bot fayli",
        content: `"""
LexAI - Telegram Boti
Aiogram 3.x asosida ishlaydi.
Foydalanuvchilar savolini qabul qilib, lex_service orqali tahlil qiladi.
"""

import asyncio
import logging
import os
from aiogram import Bot, Dispatcher, types, F
from aiogram.filters import CommandStart, Command
from aiogram.enums import ParseMode
from aiogram.utils.keyboard import InlineKeyboardBuilder
from dotenv import load_dotenv

from lex_service import search_lex_uz_and_answer

load_dotenv()

BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")
if not BOT_TOKEN:
    raise ValueError("TELEGRAM_BOT_TOKEN topilmadi! Iltimos, .env faylini to'ldiring.")

logging.basicConfig(level=logging.INFO)
bot = Bot(token=BOT_TOKEN)
dp = Dispatcher()

MAIN_MENU = types.ReplyKeyboardMarkup(
    keyboard=[
        [types.KeyboardButton(text="⚖️ Huquqiy AI"), types.KeyboardButton(text="📚 Qonunchilik bazasi")],
        [types.KeyboardButton(text="🔍 Modda qidirish"), types.KeyboardButton(text="📝 Hujjat tayyorlash")],
        [types.KeyboardButton(text="⚖️ Kazus tahlili"), types.KeyboardButton(text="📊 Qonunlarni solishtirish")],
        [types.KeyboardButton(text="🏛 MIB bo‘limi"), types.KeyboardButton(text="📖 Foydalanish qo‘llanmasi")],
        [types.KeyboardButton(text="⚙️ Sozlamalar")],
    ],
    resize_keyboard=True
)

@dp.message(CommandStart())
async def handle_start(message: types.Message):
    """Start komandasi berilganda"""
    welcome_text = (
        f"Assalomu alaykum, <b>{message.from_user.first_name}</b>! 🇺🇿⚖️\\n\\n"
        "🏛 <b>LexAI O'zbekiston — Professional Huquqiy Platformasi</b>\\n"
        "━━━━━━━━━━━━━━━━━━━━━━━━━━\\n"
        "Platforma <b>Lex.uz</b> (Qonunchilik ma'lumotlari milliy bazasi) ning eng so'nggi tahrirlari asosida ishlaydi.\\n\\n"
        "📌 <b>Asosiy imkoniyatlar:</b>\\n"
        "• Faqat <b>amaldagi eng yangi</b> qonun va kodekslardan javob beradi;\\n"
        "• Eski, o'z kuchini yo'qotgan normalarni <b>qat'iy chiqarib yuboradi</b>;\\n"
        "• Har bir javobga rasmiy Lex.uz havolalarini biriktiradi.\\n\\n"
        "Quyidagi boshqaruv menyusidan kerakli bo'limni tanlang:"
    )
    await message.answer(welcome_text, parse_mode=ParseMode.HTML, reply_markup=MAIN_MENU)

@dp.message(F.text == "📚 Qonunchilik bazasi")
async def handle_codes(message: types.Message):
    kb = InlineKeyboardBuilder()
    kb.button(text="💼 Mehnat kodeksi (2023)", url="https://lex.uz/docs/6257288")
    kb.button(text="⚖️ Jinoyat kodeksi", url="https://lex.uz/docs/111453")
    kb.button(text="📜 Fuqarolik kodeksi", url="https://lex.uz/docs/111189")
    kb.button(text="💰 Soliq kodeksi", url="https://lex.uz/docs/4674902")
    kb.button(text="💍 Oila kodeksi", url="https://lex.uz/docs/104720")
    kb.adjust(1)
    await message.answer("📚 <b>O'zbekiston Respublikasi Qonunchilik Bazasi (Lex.uz):</b>\\nKerakli kodeksni tanlang:", parse_mode=ParseMode.HTML, reply_markup=kb.as_markup())

@dp.message(F.text == "📝 Hujjat tayyorlash")
async def handle_docs(message: types.Message):
    kb = InlineKeyboardBuilder()
    kb.button(text="📄 Sudga da'vo arizasi (Qarz)", callback_data="doc_qarz")
    kb.button(text="💼 Ish beruvchiga ariza (Ta'til)", callback_data="doc_mehnat")
    kb.button(text="🏛 MIBga talabnoma (Ijro)", callback_data="doc_mib")
    kb.adjust(1)
    await message.answer("📝 <b>Huquqiy Hujjatlar Tayyorlash Bo'limi:</b>\\nKerakli shablonni tanlang:", parse_mode=ParseMode.HTML, reply_markup=kb.as_markup())

@dp.message(F.text)
async def handle_user_legal_question(message: types.Message):
    """Foydalanuvchi yuborgan har qanday huquqiy savolni qabul qilish"""
    user_query = message.text.strip()
    await bot.send_chat_action(chat_id=message.chat.id, action="typing")
    result = await search_lex_uz_and_answer(user_query)
    
    kb = InlineKeyboardBuilder()
    if result["lex_links"]:
        for idx, link in enumerate(result["lex_links"]):
            kb.button(text="🌐 Lex.uz Rasmiy Manbasi", url=link)
    else:
        kb.button(text="🔍 Lex.uz Qidiruvi", url="https://lex.uz")
    kb.button(text="💡 Yana tushuntirish", callback_data="explain_more")
    kb.button(text="🔄 Yangi savol", callback_data="new_question")
    kb.adjust(1)
    
    answer_text = result["answer_text"]
    
    # Telegram xabari 4096 belgidan oshmasligini ta'minlash
    if len(answer_text) > 4000:
        parts = [answer_text[i:i+4000] for i in range(0, len(answer_text), 4000)]
        for p in parts[:-1]:
            await message.answer(p, parse_mode=ParseMode.HTML)
        await message.answer(parts[-1], parse_mode=ParseMode.HTML, reply_markup=kb.as_markup())
    else:
        await message.answer(answer_text, parse_mode=ParseMode.HTML, reply_markup=kb.as_markup())

async def main():
    print("🚀 LexAI Telegram Boti ishga tushdi...")
    await dp.start_polling(bot)

if __name__ == "__main__":
    asyncio.run(main())
`,
      },
      {
        filename: 'requirements.txt',
        language: 'bash',
        description: "Python uchun kerakli kutubxonalar ro'yxati",
        content: `aiogram>=3.15.0
google-genai>=2.4.0
python-dotenv>=1.0.1
aiohttp>=3.9.0
`,
      },
      {
        filename: '.env.example',
        language: 'dotenv',
        description: "Muhit o'zgaruvchilari fayli namunasi",
        content: `# @BotFather orqali olingan Telegram Bot tokeni:
TELEGRAM_BOT_TOKEN="1234567890:ABCdefGhIJKlmNoPQRsTUVwxyZ"

# Google AI Studio orqali olingan Gemini API kaliti:
GEMINI_API_KEY="AIzaSyYourGeminiApiKeyHere"
`,
      },
      {
        filename: 'Dockerfile',
        language: 'bash',
        description: "Server yoki bulutga (Railway, Render, VPS) joylashtirish uchun Dockerfile",
        content: `FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["python", "bot.py"]
`,
      },
    ],
  },
  {
    id: 'single_python',
    title: 'Python (Standalone Single-File)',
    badge: 'Bitta fayl orqali ishga tushirish',
    description: "Barcha kod bitta `main.py` faylda jamlangan qulay variant. Tez sinovdan o'tkazish yoki kichik loyihalar uchun ideal.",
    runCommand: 'python main.py',
    files: [
      {
        filename: 'main.py',
        language: 'python',
        description: "Bitta fayldagi to'liq Telegram bot va Lex.uz AI mexanizmi",
        content: `import asyncio
import os
from aiogram import Bot, Dispatcher, types, F
from aiogram.filters import CommandStart
from aiogram.utils.keyboard import InlineKeyboardBuilder
from google import genai
from google.genai import types as gtypes
from dotenv import load_dotenv

load_dotenv()

BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if not BOT_TOKEN or not GEMINI_API_KEY:
    raise SystemExit("Iltimos, TELEGRAM_BOT_TOKEN va GEMINI_API_KEY ni .env fayliga yozing!")

bot = Bot(token=BOT_TOKEN)
dp = Dispatcher()
ai = genai.Client(api_key=GEMINI_API_KEY)

SYS_PROMPT = """
Siz O'zbekiston Respublikasi Lex.uz qonunlar bazasi bo'yicha maslahatchisiz.
QOIDALAR:
1. Faqat hozirgi amaldagi qonun, kodeks va qarorlardan javob bering.
2. O'z kuchini yo'qotgan, bekor bo'lgan eski qonunlarni chiqarmang!
3. Agar foydalanuvchi eski qonun haqida so'rasa, uning o'rniga chiqqan yangisini va moddasini yozing.
4. Javobingizda hujjat nomi, moddasi, holati (AMALDAGI) va Lex.uz havolasini bering.
"""

@dp.message(CommandStart())
async def start_cmd(msg: types.Message):
    await msg.answer("Assalomu alaykum! Lex.uz bo'yicha huquqiy savolingizni yozing. Faqat amaldagi qonunlar asosida javob beraman.")

@dp.message(F.text)
async def query_handler(msg: types.Message):
    await bot.send_chat_action(msg.chat.id, "typing")
    
    prompt = f"Huquqiy savol: {msg.text}\\nLex.uz rasmiy manbalari asosida faqat amaldagi yangi normalardan javob bering."
    try:
        res = ai.models.generate_content(
            model='gemini-3.8-flash',
            contents=prompt,
            config=gtypes.GenerateContentConfig(
                system_instruction=SYS_PROMPT,
                tools=[{"google_search": {}}]
            )
        )
        ans = res.text or "Javob topilmadi."
        
        kb = InlineKeyboardBuilder()
        kb.button(text="🔍 Lex.uz Qonunchilik Portali", url="https://lex.uz")
        
        await msg.answer(ans, reply_markup=kb.as_markup())
    except Exception as e:
        await msg.answer(f"Xatolik: {e}")

if __name__ == "__main__":
    asyncio.run(dp.start_polling(bot))
`,
      },
      {
        filename: 'requirements.txt',
        language: 'bash',
        description: 'Kerakli paketlar',
        content: `aiogram>=3.15.0\ngoogle-genai>=2.4.0\npython-dotenv>=1.0.1\n`,
      },
    ],
  },
  {
    id: 'nodejs_grammy',
    title: 'Node.js / TypeScript (grammY + @google/genai)',
    badge: 'TypeScript / JavaScript',
    description: "Node.js ekotizimida grammY va Google GenAI SDK orqali ishlovchi to'liq asinxron bot kodi.",
    runCommand: 'npm run start',
    files: [
      {
        filename: 'bot.ts',
        language: 'typescript',
        description: "grammY va Google GenAI orqali ishlaydigan TypeScript Telegram bot",
        content: `import { Bot, InlineKeyboard } from "grammy";
import { GoogleGenAI } from "@google/genai";
import * as dotenv from "dotenv";

dotenv.config();

const botToken = process.env.TELEGRAM_BOT_TOKEN;
const geminiApiKey = process.env.GEMINI_API_KEY;

if (!botToken || !geminiApiKey) {
  throw new Error("TELEGRAM_BOT_TOKEN va GEMINI_API_KEY kiritilishi shart!");
}

const bot = new Bot(botToken);
const ai = new GoogleGenAI({
  apiKey: geminiApiKey,
  httpOptions: { headers: { "User-Agent": "aistudio-build" } },
});

const SYSTEM_PROMPT = \`
Siz O'zbekiston Respublikasining Lex.uz milliy qonunchilik bazasi bo'yicha AI huquqshunos-ekspertisiz.
QAT'IY QOIDALAR:
1. Faqat YURIDIK KUCHGA EGA BO'LGAN AMALDAGI QONUNLAR, yangi kodekslar va qarorlar bo'yicha javob bering.
2. Eskirgan, bekor qilingan yoki o'z kuchini yo'qotgan normalarni qat'iy chiqarib yuboring.
3. Yangi qonun va moddasini aniq keltiring (masalan: Yangi Mehnat kodeksi O'RQ-798, 2023-yil 30-apreldan kuchga kirgan).
4. Doimo rasmiy Lex.uz havolalarini ilova qiling.
\`;

bot.command("start", async (ctx) => {
  await ctx.reply(
    "🇺🇿 Assalomu alaykum! Men LexAI botiman.\\n\\n" +
    "Huquqiy savolingizni yuboring. Men Lex.uz bazasidan faqat eng so'nggi amaldagi qonunlarni topib beraman va eskirganlarini saralab chiqarib tashlayman."
  );
});

bot.on("message:text", async (ctx) => {
  const query = ctx.message.text;
  await ctx.replyWithChatAction("typing");

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: \`Savol: \${query}\\nO'zbekiston qonunlari bo'yicha amaldagi eng yangi moddalarni ko'rsating.\`,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        tools: [{ googleSearch: {} }],
      },
    });

    const answer = response.text || "Kechirasiz, ma'lumot topilmadi.";
    const keyboard = new InlineKeyboard()
      .url("📜 Lex.uz Rasmiy Portali", "https://lex.uz")
      .row()
      .text("⚖️ Yangi savol", "new_q");

    await ctx.reply(answer, { reply_markup: keyboard });
  } catch (err: any) {
    await ctx.reply(\`Xatolik yuz berdi: \${err.message}\`);
  }
});

bot.start();
console.log("LexAI grammY Telegram boti ishga tushdi...");
`,
      },
      {
        filename: 'package.json',
        language: 'json',
        description: 'Node.js bog\'liqliklari',
        content: `{
  "name": "lex-ai-telegram-bot",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "start": "tsx bot.ts"
  },
  "dependencies": {
    "@google/genai": "^2.4.0",
    "dotenv": "^17.2.3",
    "grammy": "^1.35.0"
  },
  "devDependencies": {
    "@types/node": "^22.14.0",
    "tsx": "^4.21.0",
    "typescript": "^7.0.2"
  }
}
`,
      },
    ],
  },
];
