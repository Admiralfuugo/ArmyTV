# ArmTv frontend

`АРМТВ.pdf` taqdimoti asosida qurilgan, o‘zbek lotin tilidagi responsive **Next.js App Router + TypeScript** frontend. Qora/navy fon, oltin aksentlar va PDFdan ajratilgan muqovalar ishlatilgan.

## Ishga tushirish

Node.js 20.9 yoki yangiroq versiya kerak. [Next.js talablari](https://nextjs.org/docs/app/getting-started/installation).

```bash
npm ci
npm run dev
```

Terminalda ko‘rsatilgan manzilni oching. Standart port `3000`; band bo‘lsa, Next.js keyingi bo‘sh portni tanlaydi. Aniq port uchun:

```bash
npm run dev -- --port 3001
```

## Bo‘limlar

| Manzil | Imkoniyatlar |
| --- | --- |
| `/` | Bannerlar, tavsiyalar, platforma bo‘limlari, bolalar kontenti |
| `/filmlar/` | Tur, janr, yil, reyting va nom bo‘yicha katalog |
| `/tarjima/` | Tarjima filmlar va audio tili filtri |
| `/film/[id]/` | Film haqida, saqlash, qismlar va video namuna |
| `/jonli-efir/` | 6 telekanal tanlovi va namunaviy dasturlar jadvali |
| `/bolalar/` | Yosh bo‘yicha saralangan bolalar kontenti |
| `/kutubxona/` | E-kitob, audiokitob, matbuot, o‘qish oynasi va xatcho‘plar |
| `/talim/` | 3 mini kurs, 9 matnli dars, amaliy mashqlar va saqlanadigan jarayon |
| `/testlar/` | 8 savol, yakka/jamoa rejimi, ball, javoblar tahlili va shaxsiy rekord |
| `/yangiliklar/` | Mavzu filtrlari va namunaviy maqolalar |
| `/saqlanganlar/` | Saqlangan film va multfilmlar |
| `/obuna/` | Oylik/yillik tarif, to‘lov usuli tanlovi va demo obuna |

Global qidiruv film, kitob va kurslarni topadi. `Ctrl+K` yoki `⌘K` orqali ochiladi. Kitob va kurs natijalari tegishli kartochkaga olib boradi. Oynalar `Escape` bilan yopiladi, klaviatura fokusi oyna ichida saqlanadi. Mobil ko‘rinishda pastki navigatsiya va ochiladigan yon menyu mavjud.

## Frontend chegaralari

- Backend, API, SMS autentifikatsiya, haqiqiy to‘lov, DRM va jonli efir ulanmagan.
- Profil, obuna, saqlanganlar, darslar va test natijalari `localStorage`da shu brauzerda saqlanadi. Bu haqiqiy autentifikatsiya yoki obuna huquqini tekshirish emas.
- Video pleyer **10 soniyali ovozsiz mahalliy namuna**ni ijro etadi. Film tugmalari asl film o‘rniga shu ochiq belgilangan lavhani ko‘rsatadi. Film tavsifi, reytingi, yili va davomiyligi namunaviy ma’lumotlardir.
- Audio tili tanlovi afzallikni saqlaydi; haqiqiy ovoz yo‘laklari yo‘q. Audiokitob namunasida qurilmadagi brauzer ovozidan foydalaniladi, o‘zbekcha ovoz mavjudligi qurilmaga bog‘liq.
- Kutubxonadagi matnlar qisqa tanishuvlar; to‘liq kitoblar yoki rasmiy gazeta/jurnal sonlari emas. Yangiliklar, jadval va umumiy reyting namuna sifatida belgilangan.
- Jamoa viktorinasi bitta qurilmada birga ishlanadi. Masofaviy musobaqa yoki server reytingi yo‘q.
- Tariflar taqdimotdagi taxminiy narxlar: oyiga 30 000 so‘m, yiliga 299 000 so‘m.

## Production va tekshiruv

```bash
npm run lint
npm run typecheck
npm run build
npm start
```

`npm run build` natijasi `out/` papkasiga statik HTML/CSS/JS sifatida chiqariladi. `npm start` shu papkani Node.js orqali xizmat qiladi; video uchun byte-range so‘rovlari ham qo‘llanadi. Portni `PORT=4000 npm start` orqali o‘zgartirish mumkin. `out/`ni statik hostingga ham joylash mumkin.

```bash
npm run test:e2e
```

E2E testlari o‘rnatilgan Google Chrome’dan foydalanadi, production buildni yaratadi va `3100` portda tekshiradi. Testlar qidiruv, saqlash, video ijrosi, kutubxona, dars natijalari, viktorina, demo profil/obuna, TV jadvali va mobil sahifalarni qamraydi. Mavjud serverni tekshirish uchun `PLAYWRIGHT_BASE_URL=http://localhost:3001 npm run test:e2e` ishlatiladi.

## Kod va resurslar

- `src/app/` — marshrutlar va umumiy uslublar.
- `src/components/app-shell.tsx` — navigatsiya, qidiruv va yordam oynalari.
- `src/components/armtv-provider.tsx` — brauzer holati, profil va video pleyer.
- `src/components/media-pages.tsx` — katalog, jonli TV va film tafsilotlari.
- `src/components/learning-pages.tsx` — kutubxona, kurslar, viktorina va maqolalar.
- `src/lib/data.ts` — media katalogi.
- `src/lib/learning-data.ts` — kitoblar, kurslar, savollar va maqolalar.
- `public/images/` — foydalanuvchi taqdim etgan PDFdan ajratilgan tasvirlar.
- `public/media/armtv-preview.mp4` — PDF banneri asosida yaratilgan namuna lavhasi.

Keyingi integratsiyada media katalogini API ma’lumotlariga, pleyerdagi mahalliy lavhani haqiqiy manbalarga va demo profil/obunani server tekshiruviga almashtirish mumkin.
