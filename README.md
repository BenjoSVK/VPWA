# Nexus IRC (Slack-style) – Quasar + AdonisJS

**Technológie:**  
- Frontend: [Quasar (Vue 3, PWA)](https://quasar.dev/)  
- Backend: [AdonisJS](https://adonisjs.com/)  
- Databáza: [PostgreSQL](https://www.postgresql.org)

---

## 📌 Popis projektu
Aplikácia je semestrálny projekt – textová komunikácia v štýle IRC/Slack.  
Cieľom je vytvoriť prototyp vo Figme a následne funkčnú **progressive web app (PWA)**.  

Použité sú **Quasar, AdonisJS a PostgreSQL**. Ostatné podporné knižnice ktoré sa využívaju (Pinia, axios, linting) .

---

## ✨ Funkcionalita

### Autentifikácia
- Registrácia, prihlásenie, odhlásenie
- Používateľ: `meno`, `priezvisko`, `nickName (unikátne)`, `email (unikátny)`

### Kanály
- Typy: public / private
- Admin = zakladateľ kanála
- Operácie: vytvoriť, opustiť, zrušiť
- Kanál neaktívny 30 dní sa automaticky zmaže (uvoľní sa jeho `channelName`)

### Príkazy
- `/join channelName [private]` – vstup alebo vytvorenie kanála
- `/invite nickName`, `/revoke nickName` – správa pozvánok
- `/kick nickName` – 3 hlasy = ban; admin môže okamžite
- `/quit` – admin ruší kanál
- `/cancel` – používateľ odíde; ak admin odíde → kanál zaniká
- `/list` – zoznam členov kanála

### Chat
- Mentions: `@nickname` (zvýraznenie)
- História správ + infinite scroll
- Indikátor písania + živý náhľad rozpísaného textu

### Status & Notifikácie
- Status: online / DND / offline
- Notifikácie len keď appka nie je viditeľná
- Mentions-only režim
- Pri DND žiadne notifikácie
- Offline → správy sa nedoručujú; po návrate sa zosynchronizujú

---

## 🚀 Fázy projektu

### Fáza 1
- Klikateľný responzívny prototyp v Quasare (SPA)
- UML logický model (JPG export)

### Fáza 2
- Plná PWA s real-time backendom
- Migrácie databázy
- Dokumentácia a seed dáta

### Fáza 3
- Možný deployment v budúcnosti
---

## 🗂 Štruktúra repozitára

---

## 🖥 Frontend (Quasar)
- Inicializovaný projekt s PWA módou
- Routing: `/login`, `/signup`, `/channels`, `/c/:channelName`, `/settings`, `404`
- Pinia stores: user, channels, messages, invites, notifications, presence
- Infinite scroll: `QVirtualScroll` + lazy loading
- Notifikácie: Web Notifications (rešpektujú DND/mentions-only)
- Reálny čas: websocket (typing indicator, live draft)
- Command line input pre príkazy `/join`, `/invite`, atď.

---

## ⚙️ Backend (AdonisJS + PostgreSQL)
- Autentifikácia: JWT
- Databázové entity (Lucid ORM):
  - `users`, `channels`, `channel_members`, `messages`, `invites`, `kick_votes`, `channel_bans`
- API:
  - **Auth**: `/auth/signup`, `/auth/login`, `/auth/logout`, `/me`
  - **Channels**: list/create/close/join/leave/invite/revoke/kick/listMembers
  - **Messages**: fetch history, post message/command
  - **Presence**: update status, typing, draft_update
- WebSocket kanály:
  - `presence:{channelId}`
  - `messages:{channelId}`
  - `invites:{userId}`

---

## 📡 Prepojenie FE ↔ BE
- API klient v TypeScripte (axios/fetch)
- Pinia stores pre prácu s kanálmi, správami, prihlásením, prítomnosťou a notifikáciami
- Offline správy sa neodosielajú; po návrate sa správy zosynchronizujú
- App Visibility API → kontrola kedy posielať notifikácie

---

## 📄 Dokumentácia
- UML model: Mermaid + PlantUML (+ JPG export)
- `/docs/ARCHITEKTURA.md` – popis architektúry
- `/docs/POZADAVKY.md` – mapovanie požiadaviek na riešenie
- README so spustením projektu a seed skriptami

---

## ▶️ Spustenie projektu

### Frontend
```bash
cd app/frontend
npm install
quasar dev

cd app/backend
npm install
node ace serve --watch
