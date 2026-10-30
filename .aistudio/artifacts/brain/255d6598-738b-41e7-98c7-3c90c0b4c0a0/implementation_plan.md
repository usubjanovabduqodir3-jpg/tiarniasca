# Ko'p Tilli Til O'rganish Platformasi (LingoSphere)

O'zbek, Ingliz, Rus, Ispan, Nemis va Fransuz tillarini interaktiv tarzda o'rganish uchun mo'ljallangan, Web Speech API orqali nutqni tinglash (Text-to-Speech) va mikrofondan talaffuzni tekshirish (Speech Recognition), so'z boyligi, grammatika, alifbo va test sinovlarini o'z ichiga olgan zamonaviy ta'lim platformasi.

### User Review & Critical Decisions

> [!IMPORTANT]
> Quyidagi asosiy parametrlar foydalanuvchi javoblari asosida tasdiqlandi va amalga oshiriladi:

- **Dastlabki Tillar**: O'zbekcha, Inglizcha, Ruscha, Ispancha, Nemischa va Fransuzcha (har biri uchun alohida audio kodlari, so'zlar bazasi, alifbo va grammatika).
- **Ta'lim Bo'limlari**: Alifbo (harflar & tovushlar), Asosiy va kundalik so'zlar (kartochkalar, transkripsiya, tarjima), Grammatika qoidalari va namunalar, Ovozli talaffuz mashqlari, hamda bilimlarni tekshiruvchi interaktiv testlar va XP/ballar tizimi.
- **Interfeys Tili**: Boshqaruv menyusi va yo'riqnomalar to'liq o'zbek tilida, shuningdek foydalanuvchi istasa UI tilini tez almashtirish imkoniyati (UZ / EN / RU).
- **Responsive Dizayn**: 300px, 320px, 330px, 340px, 350px, 360px va 760px gacha bo'lgan barcha ultra-ixcham mobil ekranlar hamda to'liq ekranli monitorlar uchun moslashgan CSS.

---

### 1. Overview & Core Concept

- **Asosiy Maqsad**: Foydalanuvchiga xorijiy tillarni eshitish va to'g'ridan-to'g'ri o'z ovozi bilan talaffuz qilib ko'rish imkonini beruvchi gamifikatsiyalashgan ta'lim muhiti.
- **Maqsadli Auditoriya**: Yangi til o'rganuvchilar, maktab va universitet talabalari, sayohatga tayyorlanayotganlar hamda chet tili talaffuzini mustaqil charxlashni istaganlar.
- **Asosiy Qiymat**: Shunchaki matn o'qish emas, balki Web Speech API orqali real vaqtda mikrofondan ovozni yozib olib, har bir so'zning to'g'ri yoki noto'g'ri aytilganini tekshiruvchi interaktiv murabbiy.

---

### 2. User Experience & Visual Design

#### A. Asosiy Foydalanuvchi Ssenariylari
1. **Bosh Sahifa (Til Tanlash)**: Foydalanuvchi 6 ta jahon tillaridan birini (bayroq, o'rganuvchilar soni, qiyinlik darajasi bilan) tanlaydi.
2. **Til O'rganish Markazi**:
   - **Alifbo (Alphabet)**: Harflar, xalqaro fonetik transkripsiyasi (IPA), talaffuz tugmasi va misol so'z.
   - **So'zlar Kartochkalari (Flashcards)**: Kartochka bosilganda transkripsiya, imlo (spelling) ko'rinadi va ovozli o'qiladi.
   - **Talaffuz Mashqi (Voice Practice Studio)**: "Gapirib ko'rish" tugmasi bosiladi, mikrofon ochiladi, foydalanuvchi aytgan so'z AI/Web Speech tomonidan tahlil qilinadi, to'g'ri bo'lsa yashil animatsiya va "+10 XP", noto'g'ri bo'lsa qizil xabar va takrorlash imkoni beriladi.
   - **Grammatika (Grammar Guide)**: Qisqa, tushunarli qoidalar va real misollar.
   - **Interaktiv Test (Quiz Arena)**: Variantli savollar, eshitib topish testlari va yakuniy natijalar hisobi.
3. **Statistika va Yutuqlar**: Jamg'arilgan tajriba ballari (XP), to'g'ri aytilgan so'zlar hisoblagichi va kunlik seriya (streak).

#### B. Vizual Identitet va Ranglar Palitrasi (60-30-10 Qoidasi)
- **60% Asosiy Zamin**: Toza, o'qishga qulay och fon (`#F8FAFC` slate-50 / qorong'u rejimda `#0F172A`).
- **30% Strukturaviy Elementlar**: Oq kartochkalar (`#FFFFFF` / `#1E293B`), nozik hoshiyalar (`border-slate-200 / border-slate-800`), zamonaviy soyalar.
- **10% Aktsent Ranglar**: 
  - Asosiy ta'lim ko'k rangi: `#2563EB` (Royal Blue)
  - Muvaffaqiyat va yashil indikator: `#10B981` (Emerald Green)
  - Xatolik va ogohlantirish: `#EF4444` (Coral Red)
  - Oltin XP va natija: `#F59E0B` (Amber)

#### C. Tipografiya va Zero-Pill Intizomi
- **Shrift**: Zamonaviy, o'ta o'qishli `Plus Jakarta Sans` / tizimli sans-serif.
- **Zero-Pill Qoidasi**: Metama'lumotlar statik tabletka/kapsula qutilarga o'ralmaydi; silliq matn va nuqta (`·`) yoki bo'lish belgilari bilan tartiblanadi.
- **Tugmalar**: Aniq, bir qatorli, hover va faol bosilish animatsiyalariga ega interaktiv elementlar.

---

### 3. Key Product Decisions & Trade-Offs

- **Web Speech API Integratsiyasi**:
  - *Tanlangan usul*: Brauzerning o'rnatilgan `window.speechSynthesis` (Text-to-Speech) va `window.SpeechRecognition || window.webkitSpeechRecognition` (Audio Input) API laridan foydalanish.
  - *Sababi*: Tashqi serverga ulanmasdan, nol kechikish bilan barcha brauzerlarda to'g'ridan-to'g'ri mikrofondan ovoz olish va audioni ijro etish.
  - *Qo'shimcha himoya*: Agar brauzerda mikrofon cheklangan bo'lsa yoki Web Speech Recognition bo'lmasa, tushunarli ogohlantirish va simulyatsiya/matnli kiritish yordamchisi taqdim etiladi.
- **Ko'p Tilli Ma'lumotlar Strukturasi**:
  - Har bir til uchun modulli va mustaqil lug'at ob'ektlari (alifbo, kategoriyalar: salomlashish, oila, sayohat, ish, taomlar, sonlar; grammatika; viktorina savollari).
  - Yangi til yoki so'zlarni osongina qo'shish imkonini beruvchi toza TypeScript interfeyslari.
- **Ultra-Moslashuvchan Mobil Moslashuv (Media Queries)**:
  - Maxsus `@media (max-width: 300px)`, `(max-width: 320px)`, `(max-width: 340px)`, `(max-width: 360px)` va `(max-width: 768px)` qoidalari orqali kichik ekranlarda shriftlar, paddinglar va kartochka o'lchamlari bir tekis moslashadi.

---

### 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│                        LingoSphere Application                         │
├────────────────────────────────────────────────────────────────────────┤
│  Top Navigation (Brand · Tillar Menyusi · Til Almashuvchi · XP Hisob) │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│  ┌─────────────────────────────────┐  ┌─────────────────────────────┐  │
│  │     1. Til Tanlash (Home)       │  │    2. Foydalanuvchi Zali    │  │
│  │  - Uzbek, English, Russian...   │  │  - O'rganish statistikasi   │  │
│  │  - Qiyinlik, bayroqlar, kirish  │  │  - Daily Streak & XP Ballar │  │
│  └────────────────┬────────────────┘  └─────────────────────────────┘  │
│                   │ tanlanganda                                         │
│  ┌────────────────▼─────────────────────────────────────────────────┐  │
│  │             O'rganish Studiyasi (Study Dashboard)                │  │
│  │  ┌───────────┬──────────────┬─────────────┬───────────────────┐  │  │
│  │  │  Alifbo   │ So'z Boyligi │ Grammatika  │ Interaktiv Test   │  │  │
│  │  └───────────┴──────┬───────┴─────────────┴───────────────────┘  │  │
│  │                     │                                            │  │
│  │  ┌──────────────────▼─────────────────────────────────────────┐  │  │
│  │  │       Interaktiv So'z Kartochkasi & Talaffuz Markazi       │  │  │
│  │  │  - So'z: "Hello" [həˈloʊ]                                  │  │  │
│  │  │  - [🔊 Ovozli eshitish (TTS)] -> uz-UZ, en-US, ru-RU...     │  │  │
│  │  │  - [🎤 Gapirib ko'rish] -> SpeechRecognition faollashadi   │  │  │
│  │  │  - Natija tekshiruvi:                                      │  │  │
│  │  │      * To'g'ri: Yashil indikator + "To'g'ri aytdingiz! 🎉" │  │  │
│  │  │      * Noto'g'ri: Qizil indikator + "Qaytadan urinib... 🔄"│  │  │
│  │  └────────────────────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                        │
│  Storage: LocalStorage (Tanlangan til, XP ballar, o'rganilgan so'zlar)  │
└────────────────────────────────────────────────────────────────────────┘
```

#### Ma'lumotlar Tuzilishi (Data Types)
- `Language`: `id, name, localName, flag, code (en-US, ru-RU, uz-UZ, es-ES, de-DE, fr-FR), level, description, wordCount`
- `AlphabetLetter`: `letter, phonetic, exampleWord, exampleTranslation, sound`
- `VocabWord`: `id, word, translation, phonetic, category, exampleSentence, exampleTranslation, audioCode`
- `GrammarRule`: `id, title, explanation, examples: { native, target }[]`
- `QuizQuestion`: `id, question, type ('multiple_choice' | 'pronounce' | 'listen'), options, correctAnswer, explanation`
- `LearningProgress`: `xp, streak, masteredWords: string[], completedQuizzes: string[]`

---

### 5. Implementation Phases (Execution Steps)

1. **Strukturaviy Ma'lumotlar va Utillar**:
   - `data/languages.ts`: 6 ta til uchun to'liq alifbo, 100+ so'zlar to'plami, grammatika va test savollari.
   - `lib/speech.ts`: Web Speech API (TTS ijro etuvchi va SpeechRecognition talaffuzni qabul qiluvchi) mustahkam drayveri.
2. **Asosiy Sahifa va Navigatsiya**:
   - `components/Navbar.tsx`: Brand logotipi, XP ballar paneli, UI til almashtiruvchi (UZ / EN / RU), rejim boshqaruvi.
   - `components/LanguageSelector.tsx`: Chiroyli bayroqlar, statistika va animatsiyaga ega 6 ta til kartochkalari.
3. **Interaktiv O'quv Studiyasi**:
   - `components/VocabularyDeck.tsx`: 3D-flip va ochiluvchi so'z kartochkalari, spelling, transkripsiya, TTS eshitish.
   - `components/PronunciationStudio.tsx`: Jonli mikrofon to'lqin animatsiyasi, nutqni matnga aylantirish, fonetik tekshiruv, "To'g'ri aytdingiz!" / "Noto'g'ri aytdingiz, qaytadan urinib ko'ring!" yashil va qizil indikatorlari.
   - `components/AlphabetView.tsx`: Harflar gridi, bosilganda ovozli eshittirish.
   - `components/GrammarGuide.tsx`: Vizual misollar bilan grammatika darslari.
   - `components/QuizArena.tsx`: Gamifikatsiyalangan mini-viktorina, audio testlar va natijalar.
4. **CSS Responsive Sozlamalari**:
   - `app/globals.css`: 300px, 320px, 330px, 340px, 350px, 360px mobil ekranlar uchun maxsus media-query qoidalari, chiroyli gradientlar va animatsiyalar.
5. **Kompilyatsiya va Test**:
   - `metadata.json` va `app/layout.tsx` sozlamalari, build tekshiruvi.
