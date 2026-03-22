# Mono Aurel - Vercel Deployment Guide

## Frontend Deployment (Vercel)

### Adım 1: Vercel'e Bağlan
1. [vercel.com](https://vercel.com) adresine git
2. GitHub ile giriş yap
3. "Import Project" tıkla
4. `monoaurel` reposunu seç

### Adım 2: Build Ayarları
Vercel otomatik olarak algılayacak ama manuel olarak da ayarlayabilirsin:

- **Framework Preset:** Create React App
- **Root Directory:** `frontend`
- **Build Command:** `yarn build`
- **Output Directory:** `build`

### Adım 3: Environment Variables
Vercel dashboard'da şu environment variable'ı ekle:

```
REACT_APP_BACKEND_URL=https://your-backend-url.com
```

### Adım 4: Deploy
"Deploy" butonuna tıkla ve bekle!

---

## Backend Deployment

Backend (FastAPI + MongoDB) için önerilen platformlar:
- **Railway.app** (MongoDB dahil)
- **Render.com**
- **Fly.io**

### Backend Environment Variables
```
MONGO_URL=mongodb+srv://...
DB_NAME=mono_aurel
CORS_ORIGINS=https://your-vercel-domain.vercel.app
STRIPE_API_KEY=sk_live_...
```

---

## Proje Yapısı

```
monoaurel/
├── frontend/           # React uygulaması (Vercel'e deploy)
│   ├── package.json
│   ├── vercel.json
│   └── src/
└── backend/            # FastAPI uygulaması (Railway/Render'a deploy)
    ├── requirements.txt
    └── server.py
```

## Teknik Notlar

- React 18.2.0 kullanılıyor (Vercel uyumlu)
- Craco kaldırıldı, saf react-scripts kullanılıyor
- Tailwind CSS 3.4 entegre
- Stripe test modunda (production için key değiştir)
