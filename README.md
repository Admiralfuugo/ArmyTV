# ArmyTv

Next.js asosidagi o‘zbekcha media platforma. `npm run build` barcha sahifalarni
statik HTML, CSS va JavaScript fayllariga aylantirib, `out/` papkasiga chiqaradi.
GitHub Pages va boshqa statik hostinglar shu papkani e’lon qilishi kerak.

## GitHub Pages orqali ishga tushirish

1. O‘zgarishlarni GitHubdagi `main` branchga push qiling.
2. Repozitoriyda **Settings → Pages → Build and deployment → Source** orqali
   **GitHub Actions** ni tanlang.
3. **Actions → Deploy ArmyTv to GitHub Pages → Run workflow** ni bosing.
4. Deploy muvaffaqiyatli tugagach, manzil **Settings → Pages** da ko‘rinadi.
   Domen ulanmagan bo‘lsa, ushbu repo manzili: <https://admiralfuugo.github.io/ArmyTV/>.

Keyingi `main` pushlari saytni avtomatik yangilaydi. Workflow `npm ci` bilan
kutubxonalarni o‘rnatadi, kodni tekshiradi, build qiladi va `out/` ni e’lon qiladi.
Source sifatida `Deploy from a branch / main / (root)` tanlansa, Next.js manba
fayllari build qilinmaydi va sayt ochilmaydi.

## O‘z domeningizni ulash

1. **Settings → Pages → Custom domain** ga domenni kiriting va saqlang.
2. Domen provayderingizdagi DNS yozuvlarini GitHub Pagesga yo‘naltiring:

   | Turi | Nomi | Qiymati |
   | --- | --- | --- |
   | A | `@` | `185.199.108.153` |
   | A | `@` | `185.199.109.153` |
   | A | `@` | `185.199.110.153` |
   | A | `@` | `185.199.111.153` |
   | CNAME | `www` | `admiralfuugo.github.io` |

   `www` orqali ochmoqchi bo‘lsangiz, Custom domain maydoniga ham `www` bilan
   yozing. CNAME qiymatiga `https://` yoki `/ArmyTV` qo‘shilmaydi.
3. Domen qo‘shilganda, almashtirilganda yoki olib tashlanganda **Actions → Deploy
   ArmyTv to GitHub Pages → Run workflow** orqali qayta build qiling. Workflow
   GitHub Pages sozlamasidan sayt yo‘lini oladi: repo manzilida `/ArmyTV`, shaxsiy
   domenda esa bo‘sh yo‘l. Rasm, video va sahifa havolalari shu qiymatga moslashadi.
4. DNS tekshiruvi tugagach **Enforce HTTPS** ni yoqing. DNS va sertifikat
   yangilanishi 24 soatgacha vaqt olishi mumkin.

GitHub Actions bilan deploy qilinganda `CNAME` fayli talab qilinmaydi; domen
**Settings → Pages** orqali boshqariladi.
[GitHubning domen ulash bo‘yicha rasmiy qo‘llanmasi](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site).

## Boshqa hosting

- **Vercel:** GitHub repozitoriyini import qiling, Next.js presetini tanlang.
- **Statik hosting:** build buyrug‘i `npm run build`, e’lon qilinadigan papka `out`.
- **cPanel / oddiy web hosting:** builddan keyin `out/` ichidagi barcha fayllarni
  (jumladan `_next/`, `images/`, `media/`) domenning `public_html/` papkasiga yuklang.

Domenning boshida ochiladigan sayt uchun `NEXT_PUBLIC_BASE_PATH` bo‘sh qoladi.
Sayt ichki papkada joylashsa, masalan `/ArmyTV/`, builddan oldin
`NEXT_PUBLIC_BASE_PATH=/ArmyTV` belgilang. Bu qiymat build vaqtida qo‘llanadi.

## Kompyuterda ishga tushirish

Node.js 22 va npm kerak.

```sh
npm ci
npm run dev
```

Production buildni ko‘rish:

```sh
npm run build
npm start
```

Sayt <http://localhost:3000/> da ochiladi. `npm start` tayyor `out/` papkasini
ko‘rsatadi. `node_modules/`, `.next/` va `out/` avtomatik yaratiladi; ular manba
kodining bir qismi emas. `package-lock.json` repozitoriyda saqlanadi.

## Tekshirish

```sh
npm run typecheck
npm run lint
npm run test:e2e
```

Brauzer testlari Google Chrome ishlatadi va production buildni avtomatik qiladi.
Builddan keyin `postbuild` Windowsda noto‘g‘ri joyga chiqarilgan Next.js navigatsiya
fayllari uchun kerakli nomdagi nusxalarni tayyorlaydi. Shu sababli deploy uchun
`npm run build` buyrug‘ini ishlating.
GitHub Pagesdagi ichki yo‘lni Windows PowerShellda tekshirish:

```powershell
$env:NEXT_PUBLIC_BASE_PATH = "/ArmyTV"
npm run test:e2e
Remove-Item Env:NEXT_PUBLIC_BASE_PATH
```

Oddiy domen uchun buildga qaytishdan oldin shu o‘zgaruvchini olib tashlang va
`npm run build` ni qayta bajaring.

## Kontent

Hozirgi loyiha frontend demo: video namuna, profil va obuna holati brauzerda
saqlanadi. Haqiqiy to‘lov, akkaunt serveri va jonli efir manbalari hali ulanmagan.
