# Nexus

IRC-style chat aplikácia postavená na Vue 3, Quasar a AdonisJS. Semestrálny projekt pre VPWA.

## Čo to je?

Nexus je minimalistická chatovacia aplikácia inšpirovaná klasickým IRC protokolom, ale s moderným webovým rozhraním. Funguje ako PWA, takže ju môžeš nainštalovať na desktop aj mobile a používať ju ako natívnu appku.

## Tech stack

**Frontend:**
- Vue 3 (Composition API)
- Quasar Framework
- Pinia pre state management
- Vue Router
- Axios pre API calls

**Backend:**
- AdonisJS 6
- SQLite (alebo PostgreSQL)
- AdonisJS Transmit pre real-time komunikáciu (WebSockets)
- JWT autentifikácia

## Features

- ✅ Real-time messaging cez WebSockets
- ✅ Kanály (verejné aj súkromné)
- ✅ User management (invite, kick, revoke)
- ✅ Typing indicators
- ✅ Draft messages
- ✅ User status (online/offline)
- ✅ PWA podpora
- ✅ IRC-style príkazy (`/join`, `/kick`, `/invite`, atď.)
- ✅ Mentions (`@username`)

## Ako to spustiť

### Backend

```bash
cd backend
npm install

# Skopíruj .env.example do .env a nastav si databázu
cp .env.example .env

# Spusti migrácie
node ace migration:run

# Spusti dev server
npm run dev
```

Backend beží na `http://localhost:3333` (alebo čo máš v .env nastavené).

### Frontend

```bash
cd Nexus
npm install
npm run dev
```

Frontend beží na `http://localhost:9000` (alebo iný port ak je 9000 obsadený).

## Príkazy

Aplikácia podporuje IRC-style príkazy:

- `/join channelName [private]` - Pripojíš sa alebo vytvoríš kanál
- `/invite nickName` - Pozveš používateľa do kanálu
- `/revoke nickName` - Odstrániš používateľa zo súkromného kanálu (len admin)
- `/kick nickName` - Vyhodíš používateľa z verejného kanálu
- `/quit` - Vymažeš kanál (len admin)
- `/cancel` - Opustíš kanál
- `/list` - Zobrazíš členov kanálu
- `/help` - Zobrazíš všetky príkazy

Tiež môžeš používať mentions: `@username` v správe.

## Projektová štruktúra

```
VPWA/
├── backend/          # AdonisJS API
│   ├── app/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── middleware/
│   │   └── validators/
│   └── database/
│       └── migrations/
│
└── Nexus/            # Vue 3 + Quasar frontend
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── stores/   # Pinia stores
    │   ├── layouts/
    │   └── services/
```

## Databáza

Projekt používa SQLite defaultne, ale môžeš prepnúť na PostgreSQL ak chceš. Migrácie sú v `backend/database/migrations/`.

Hlavné tabuľky:
- `users` - používatelia
- `channels` - kanály
- `channel_members` - členovia kanálov
- `messages` - správy
- `kicks` - hlasovanie o kicknutí používateľov

## API endpoints

Všetky endpointy sú v `backend/start/routes.ts`. Hlavné skupiny:

- `/auth/*` - registrácia, login, logout, profil
- `/channels/*` - správa kanálov
- `/channels/:id/messages` - správy v kanáli
- `/channels/:id/typing` - typing indicators
- `/channels/:id/draft` - draft messages

Väčšina endpointov vyžaduje autentifikáciu cez JWT token.

## Poznámky

- Backend používa AdonisJS Transmit pre real-time features, takže potrebuješ WebSocket podporu
- Frontend je PWA-ready, takže sa dá nainštalovať ako appka
- Pre produkciu by som odporučil použiť PostgreSQL namiesto SQLite
