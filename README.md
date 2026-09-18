# Sunday Planner ☀️

**Boʻsh kuningni bizga topshir. Mazali reja bilan qaytaramiz.**

Foydalanuvchining boʻsh kuni + vaqti + budjeti + joylashuvi + qiziqishlari →
soatma-soat tayyor dam olish rejasi.

---

## Tez ishga tushirish

```bash
npm install     # client va server birga oʻrnatiladi (npm workspaces)
npm run dev     # backend :5050, frontend :5173
```

Brauzerda: **http://localhost:5173**

Alohida ishga tushirish kerak boʻlsa:

```bash
npm run dev:server
npm run dev:client
npm run build      # production frontend → client/dist
npm start          # faqat backend (production)
```

Talab: **Node.js 18+** (tavsiya 20+).

---

## Vercel'ga joylash

Loyiha Vercel uchun tayyor: frontend statik sayt, backend esa serverless
funksiya boʻlib ishlaydi (`api/index.js` — oʻsha Express ilovasining oʻzi).

### 1-usul: GitHub orqali (tavsiya etiladi)

1. Loyihani GitHub'ga yuklang:

```bash
git init
git add .
git commit -m "Sunday Planner"
git branch -M main
git remote add origin https://github.com/FOYDALANUVCHI/sunday-planner.git
git push -u origin main
```

2. [vercel.com/new](https://vercel.com/new) → **Import Git Repository** → shu repo.
3. Sozlamalarni **oʻzgartirmang** — `vercel.json` ichida hammasi yozilgan:

| Maydon | Qiymat |
| --- | --- |
| Build Command | `npm run build` |
| Output Directory | `client/dist` |
| Install Command | `npm install` |

4. **Environment Variables** boʻlimiga (ixtiyoriy) qoʻshing:

```
GOOGLE_MAPS_API_KEY = AIza...      # joylarning real fotosuratlari
ANTHROPIC_API_KEY   = sk-ant-...   # AI yozadigan sarlavha
```

5. **Deploy**. Tayyor: `https://sizning-loyiha.vercel.app`

Keyin har bir `git push` avtomatik yangi deploy qiladi.

### 2-usul: CLI orqali

```bash
npm i -g vercel
vercel login
vercel          # sinov deploy
vercel --prod   # asosiy domenga
```

### Tekshirish

Deploydan soʻng:

- `https://loyiha.vercel.app/` — sayt ochiladi
- `https://loyiha.vercel.app/api/health` — `{"ok":true,...}` qaytadi

Agar `/api/health` ishlamasa, Vercel'da **Functions** logini oching —
xato oʻsha yerda koʻrinadi.

### Nimaga eʼtibor berish kerak

- Joylar bazasi **modul** sifatida import qilinadi (`places.data.js`), fayl
  tizimidan oʻqilmaydi — serverless muhitda shu ishonchli.
- `GOOGLE_MAPS_API_KEY` faqat serverda qoladi, brauzerga chiqmaydi.
- Wikipedia fotosuratlari brauzerdan olinadi — hech qanday kalit kerak emas,
  deploydan keyin darhol ishlaydi.
- Bepul tarifda funksiya "sovuq" boshlanishi mumkin: birinchi soʻrov
  1–2 soniya sekinroq boʻladi.

---

## Sozlash (.env)

`.env.example` dan nusxa oling:

```bash
cp .env.example .env
```

| Oʻzgaruvchi | Nima uchun | Boʻlmasa nima boʻladi |
| --- | --- | --- |
| `PORT` | Backend porti (default 5050) | 5050 ishlatiladi |
| `GOOGLE_MAPS_API_KEY` | **Joylarning real fotosuratlari** | Rasm oʻrniga jonli SVG sahna |
| `ANTHROPIC_API_KEY` | Reja sarlavhasini AI yozadi | Shablon matn ishlatiladi |
| `AI_MODEL` | AI model nomi | `claude-sonnet-5` |

Frontend uchun `client/.env`:

| Oʻzgaruvchi | Nima uchun |
| --- | --- |
| `VITE_MEDIA_ENABLED=true` | Oʻz rasm/videolaringizni yoqadi |
| `VITE_HERO_VIDEO=/media/hero.mp4` | Bosh sahifadagi showreel oʻrniga real video |
| `VITE_OFFLINE=true` | Serversiz statik build (reja brauzerda tuziladi) |

---

## Yoʻl vaqtlari

Joylar orasidagi yoʻl **haqiqiy koʻchalar boʻyicha** hisoblanadi:
[OSRM](https://project-osrm.org) (OpenStreetMap marshrutlash) real masofa va
davomiylikni qaytaradi, ustiga shahar tirbandligi uchun 25% zaxira qoʻshiladi.
1.6 km gacha — piyoda, undan uzoq — taksi (narx taxminiy tarif boʻyicha).

Xizmat javob bermasa, avtomatik ravishda toʻgʻri chiziq masofasiga asoslangan
taxminiy hisobga oʻtadi va birinchi xatodan keyin qolgan soʻrovlar yuborilmaydi
— shuning uchun foydalanuvchi kutib qolmaydi. Natija sahifasida qaysi usul
ishlatilgani koʻrsatiladi ("real marshrut" / "taxminiy").

Oʻz OSRM serveringiz boʻlsa: `OSRM_URL=http://localhost:5000`.

---

## Real fotosuratlar

Rasm uch manbadan olinadi, shu tartibda:

1. **Google Places Photos** — aynan oʻsha joyning oʻz fotosi (API kalit kerak)
2. **Wikimedia Commons** — mashhur joylar uchun erkin litsenziyali fotosuratlar
   (Minor masjidi, Chorsu bozori, Yaponiya bogʻi, Amir Temur muzeyi).
   `client/src/data/photos.js` ichida, muallif va litsenziya bilan.
3. **Oʻzingiz qoʻshgan rasm/video** (`client/public/media/`)

Hech biri boʻlmasa — kategoriya uchun chizilgan jonli SVG sahna koʻrsatiladi.

### Google Places Photos

1. [Google Cloud Console](https://console.cloud.google.com) → yangi loyiha
2. **Places API (New)** ni yoqing
3. *Credentials* → *Create credentials* → *API key*
4. `.env` ga yozing:

```
GOOGLE_MAPS_API_KEY=AIza...
```

5. Serverni qayta ishga tushiring.

Shundan soʻng har bir joyning rasmi `/api/places/:id/photo` orqali keladi.
API kaliti **brauzerga chiqmaydi** — rasm server orqali uzatiladi va 6 soat
kesh qilinadi.

**Kalit boʻlmasa yoki rasm yuklanmasa** interfeys oʻzining jonli SVG sahnasiga
qaytadi (`PlaceArt`) — sahifada hech qachon "singan rasm" chiqmaydi.

### Oʻz rasm/videolaringiz

`client/src/services/media.js` faylini oching:

```js
const CATEGORY_PHOTOS = { kino: '/media/kino.jpg' };
const PLACE_PHOTOS    = { 'kafe-1': '/media/cafe-bon.jpg' };
const PLACE_VIDEOS    = { 'entertainment-1': '/media/magic-city.mp4' };
```

Fayllarni `client/public/media/` ichiga tashlang va `client/.env` ga
`VITE_MEDIA_ENABLED=true` yozing.

Tartib: **video → rasm → jonli sahna**. Yuklanmasa avtomatik keyingisiga oʻtadi.

---

## Joylar maʼlumoti

`server/src/data/places.json` — **47 ta real Toshkent joyi**.

Nom, manzil, koordinata, telefon, reyting, ish vaqti va `placeId` —
**Google Places** maʼlumotlari asosida.

**Narxlar — taxminiy oraliq.** Ular kategoriya boʻyicha belgilangan va
interfeysda "Narx taxminiy" deb koʻrsatiladi. Aniq narxni joyning oʻzi aytadi.

Yangi joy qoʻshish: `server/src/data/places.json` ga yozing va
`client/src/data/demoPlaces.js` (offline nusxa) ni ham yangilang.

---

## Xarita

- **Asosiy:** Leaflet + OpenStreetMap plitkalari — real koʻchalar, masshtab, zoom.
- **Zaxira:** plitkalar ochilmasa (internet yoʻq / CSP bloklagan) sxematik SVG
  xarita koʻrsatiladi — nuqtalar baribir real koordinatada qoladi.
- Har bir joy uchun **Google Maps**, **Yoʻnalish** va **Yandex** havolalari.
- Butun kun marshruti bitta Google Maps havolasida (waypoint'lar bilan).

---

## Arxitektura

```
sunday-planner/
├─ client/                     React + Vite + Framer Motion
│  ├─ public/media/            oʻz rasm/videolaringiz uchun
│  └─ src/
│     ├─ components/
│     │  ├─ layout/            Navbar, Footer, Aurora (fon), MobileTabs
│     │  ├─ ui/                Button, Chip, Modal, Meter, Tilt, PlaceArt, PlaceMedia
│     │  ├─ home/              Hero, Showreel, HowItWorks, Features
│     │  ├─ planner/           Wizard + 6 qadam, GenerateOverlay
│     │  └─ result/            Timeline, BudgetPanel, RouteMap, modallar
│     ├─ context/              Theme, Motion, Plan, Favorites, Toast
│     ├─ services/             apiClient, plannerService, media, engine (offline nusxa)
│     ├─ hooks/ utils/ data/ i18n/ styles/
├─ server/                     Node.js + Express
│  └─ src/
│     ├─ controllers/ routes/ middleware/ utils/
│     ├─ services/             plannerEngine, placesService, photoService, aiService
│     └─ data/places.json
└─ package.json                workspaces + dev skriptlari
```

### API

| Metod | Yoʻl | Vazifa |
| --- | --- | --- |
| `GET` | `/api/health` | Server holati, yoqilgan xizmatlar |
| `POST` | `/api/plan` | Yangi reja tuzish |
| `POST` | `/api/plan/swap` | Bitta qadamni almashtirish |
| `POST` | `/api/plan/optimize` | Rejani budjetga moslashtirish |
| `GET` | `/api/places` | Joylar roʻyxati (`?city=&category=&q=`) |
| `GET` | `/api/places/:id` | Bitta joy |
| `GET` | `/api/places/:id/photo` | Real fotosurat (Google Places) |

### Reja generatori

`server/src/services/plannerEngine.js`:

1. Kayfiyatga qarab **maqsadli sarf** aniqlanadi (tejamkor ~50%, luxury ~92%).
2. Har qadamda shu qadamga tegishli **pul limiti** hisoblanadi.
3. Nomzodlar baholanadi: qiziqish, kayfiyat, reyting, ish vaqti, **masofa**.
4. Yoʻl vaqti jadvalga, yoʻl puli budjetga qoʻshiladi.
5. Har qadam uchun 4 tagacha **alternativa** tayyorlanadi.

Budjet majburan sarflanmaydi — arzonroq yaxshi reja chiqsa, oʻsha taklif qilinadi.

---

## Xususiyatlar

- 6 qadamli planner (kun, vaqt, budjet, kim bilan, qiziqishlar, kayfiyat)
- Timeline + budjet nazorati + "Budjetga moslashtirish"
- Har bir qadamni almashtirish (budjet darhol qayta hisoblanadi)
- Statistika, xarita, ulashish, chop etish
- ❤️ Sevimli joylar va saqlangan rejalar (localStorage)
- 🌗 Dark / Light rejim
- ✨ Animatsiya rejimi (tizimda "reduce motion" boʻlsa ham yoqish mumkin)
- 🇺🇿 / 🇷🇺 / 🇬🇧 til almashtirish (asosiy til — oʻzbekcha, fallback bilan)
- Server oʻchsa — reja brauzerda tuziladi (offline rejim)
- Barcha loading / error / empty holatlar, ErrorBoundary

---

## Litsenziya va manbalar

- Joylar maʼlumoti: **Google Places**
- Xarita: **OpenStreetMap** hissadorlari
- Shriftlar: Bricolage Grotesque, Manrope (Google Fonts)
- Illustratsiyalar: loyiha uchun maxsus chizilgan SVG sahnalar
