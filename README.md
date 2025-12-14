# Nexus IRC (Slack-style) – Quasar + AdonisJS

**Technológie:**  

- Frontend: [Quasar (Vue 3, PWA)](https://quasar.dev/)  

- Backend: [AdonisJS](https://adonisjs.com/)  

- Databáza: [SQLite](https://www.sqlite.org/)

---

## 📌 Popis projektu

Aplikácia je semestrálny projekt – textová komunikácia v štýle IRC/Slack.  

Cieľom je vytvoriť prototyp vo Figme a následne funkčnú **progressive web app (PWA)**.  

Použité sú **Quasar, AdonisJS a SQLite**. Ostatné podporné knižnice ktoré sa využívajú (Pinia, axios, linting).

---

## ✨ Funkcionalita

### Autentifikácia

- Registrácia, prihlásenie, odhlásenie
- Používateľ: `firstName`, `lastName`, `nickName (unikátne)`, `email (unikátny)`
- Aktualizácia profilu a statusu

### Kanály

- Typy: public / private
- Admin = zakladateľ kanála
- Operácie: vytvoriť, opustiť, zrušiť
- Kanál neaktívny 30 dní sa automaticky zmaže (uvoľní sa jeho `name`)

### Príkazy

- `/join channelName [private]` – vstup alebo vytvorenie kanála
- `/invite nickName`, `/revoke nickName` – správa pozvánok
- `/kick nickName` – 3 hlasy = ban; admin môže okamžite
- `/quit` – admin ruší kanál
- `/cancel` – používateľ odíde; ak admin odíde → kanál zaniká
- `/list` – zoznam členov kanála
- `/help` – zoznam dostupných príkazov

### Chat

- Mentions: `@nickname` (zvýraznenie)
- História správ + infinite scroll
- Indikátor písania + živý náhľad rozpísaného textu (draft)

### Status & Notifikácie

- Status: online / DND / offline
- Notifikácie len keď appka nie je viditeľná
- Mentions-only režim
- Pri DND žiadne notifikácie
- Offline → správy sa nedoručujú; po návrate sa zosynchronizujú

---

## 🗂 Štruktúra repozitára

```
VPWA/
├── Nexus/              # Frontend (Quasar)
│   ├── src/
│   │   ├── components/  # Vue komponenty
│   │   ├── layouts/    # Layout komponenty
│   │   ├── pages/      # Stránky aplikácie
│   │   ├── stores/     # Pinia stores
│   │   ├── services/    # Command parser
│   │   ├── lib/        # API klient, konštanty
│   │   └── router/     # Vue Router
│   └── quasar.config.ts
└── backend/            # Backend (AdonisJS)
    ├── app/
    │   ├── controllers/ # API controllery
    │   ├── models/      # Lucid modely
    │   ├── validators/  # Validátory
    │   └── middleware/  # Middleware
    ├── database/
    │   └── migrations/  # Databázové migrácie
    └── start/
        └── routes.ts    # API routes
```

---

## 🖥 Frontend (Quasar)

- Inicializovaný projekt s PWA módou
- Routing: `/auth/login`, `/auth/register`, `/chat`, `/chat/:id`, `/profile`, `404`
- Pinia stores: auth, channels, messages, user (status), drawer
- Infinite scroll: paginácia správ
- Notifikácie: Web Notifications (rešpektujú DND/mentions-only)
- Reálny čas: polling (typing indicator, live draft)
- Command line input pre príkazy `/join`, `/invite`, atď.

---

## ⚙️ Backend (AdonisJS + SQLite)

- Autentifikácia: JWT (Access Tokens)
- Databázové entity (Lucid ORM):
  - `users`, `channels`, `channel_members`, `messages`, `kicks`, `access_tokens`
- API:
  - **Auth**: `/auth/register`, `/auth/login`, `/auth/logout`, `/auth/me`, `/auth/profile`, `/auth/status`
  - **Channels**: `/channels` (list), `/channels/join` (create/join), `/channels/:id/members`, `/channels/:id/invite`, `/channels/:id/revoke`, `/channels/:id/kick`, `/channels/:id/leave`, `/channels/:id` (DELETE)
  - **Messages**: `/channels/:channelId/messages` (GET, POST)
  - **Typing**: `/channels/:channelId/typing` (GET, POST)
  - **Draft**: `/channels/:channelId/draft` (POST), `/channels/:channelId/draft/:nickName` (GET)

---

## 📡 Prepojenie FE ↔ BE

- API klient v TypeScripte (fetch)
- Pinia stores pre prácu s kanálmi, správami, prihlásením, prítomnosťou a notifikáciami
- Offline správy sa neodosielajú; po návrate sa správy zosynchronizujú
- App Visibility API → kontrola kedy posielať notifikácie
- Polling pre real-time aktualizácie správ a typing indikátorov

---

## ▶️ Spustenie projektu

### Backend

```bash
cd backend
npm install
node ace migration:run
node ace serve --watch
```

Backend beží na `http://localhost:3333`

### Frontend

```bash
cd Nexus
npm install
quasar dev
```

Frontend beží na `http://localhost:9000`

---

## 📝 Poznámky

- Databáza SQLite sa vytvára automaticky v `backend/tmp/db.sqlite3`
- Pre produkciu je potrebné nastaviť správne environment premenné
- PWA funkcionalita je nakonfigurovaná v `quasar.config.ts`
