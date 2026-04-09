# Hangman (React + Vite + DynamoDB)

**Git repository:** [https://github.com/Rezkid29/hangman](https://github.com/Rezkid29/hangman)

A Hangman game with a **player profile** stored in **Amazon DynamoDB** (or **DynamoDB Local** in Docker), a small **Express + AWS SDK** API, and a **React** UI that uses **`fetch` with `async/await`**.

---

## **Features**

- **Hangman gameplay**: staged figure, letter keyboard, chosen letters, new game, win/loss modal.
- **Player name**: sign-in form; **login button is removed after** a successful session (player held in React state).
- **Dynamo-backed profiles**: wins and losses persisted per player.
- **Win rate on the home screen**: shows **player name**, wins, losses, and **winning percentage** (one decimal; `0%` if no games yet).
- **API flow**:
  - **`GET /players/:name`** — look up player; **404** if new.
  - **`POST /players`** — create `{ name }` with `wins: 0`, `losses: 0` (handles **409** race with a follow-up **GET**).
  - **`PUT /players/:name`** — update `{ wins, losses }` after a round ends.
- **Local-first stat update**: when the round ends, React **updates wins/losses in state first**, then sends **PUT**.
- **Docker Compose**: **DynamoDB Local**, **API**, and **web** (Nginx + static build, **`/api` → API**).
- **Unit tests**: API routes (Vitest + Supertest + mocked Dynamo) and UI (Vitest + Testing Library).

---

## **Project layout**

| Area | Path |
|------|------|
| React app | `src/` |
| Player API | `server/` (`app.js`, `index.js`, `dynamo.js`) |
| Hangman stage images | `public/hangman/*.svg` |
| Compose stack | `docker-compose.yml` |
| Nginx (Compose, with API proxy) | `nginx.compose.conf` |
| Nginx (static only, default image) | `nginx.public.conf` |

---

## **API reference (Postman)**

Use **[Postman](https://www.postman.com/downloads/)** against the API **before** wiring the UI.

1. Start **DynamoDB Local** and the **API** (see **Docker Compose** below), or run **`npm run dev:api`** with `DYNAMODB_ENDPOINT` set if using local Dynamo.
2. Base URL (direct to API): **`http://localhost:3001`**

- **`GET /health`** — `{ "ok": true }`
- **`GET /players/:name`** — existing player JSON, or **404** if missing.
- **`POST /players`** — body **`{ "name": "Ada" }`** → **201** with `{ name, wins, losses }`.
- **`PUT /players/:name`** — body **`{ "wins": 2, "losses": 1 }`** → **200** with updated player.

Headers for JSON bodies: **`Content-Type: application/json`**.

---

## **Run locally (recommended dev flow)**

You need **two terminals**: API + Vite. The UI calls **`/api/...`**; Vite **proxies** `/api` → **`http://localhost:3001`** (see `vite.config.js`).

### **1. API + DynamoDB Local**

```bash
# Terminal A — DynamoDB Local (example; or use Docker only for Dynamo)
docker run --rm -p 8000:8000 amazon/dynamodb-local:latest \
  -jar DynamoDBLocal.jar -sharedDb -inMemory
```

```bash
# Terminal B — API
cd server
export AWS_REGION=us-east-1
export AWS_ACCESS_KEY_ID=local
export AWS_SECRET_ACCESS_KEY=local
export DYNAMODB_ENDPOINT=http://localhost:8000
export PLAYERS_TABLE=HangmanPlayers
npm start
```

### **2. Frontend**

```bash
# Terminal C
npm install
npm run dev
```

Open the URL Vite prints (e.g. **http://localhost:5173**).

---

## **Docker Compose (full stack)**

From the repo root:

```bash
docker compose up --build
```

- **Web app**: [http://localhost:8080](http://localhost:8080) — Nginx serves the SPA and proxies **`/api`** to the API container.
- **API**: [http://localhost:3001](http://localhost:3001) (also reachable from the host).
- **DynamoDB Local**: [http://localhost:8000](http://localhost:8000) (AWS CLI / SDK endpoint).

The API **creates the `HangmanPlayers` table** on startup if it does not exist (on-demand billing, partition key **`playerName`**).

---

## **Production build env**

The static build reads **`VITE_API_URL`** at build time. **Docker Compose** sets **`VITE_API_URL=/api`** so the browser uses same-origin **`/api`**. For other hosts, set **`VITE_API_URL`** to your public API base (no trailing slash) before **`npm run build`**.

---

## **Scripts**

| Command | Description |
|---------|-------------|
| **`npm run dev`** | Vite dev server (with **`/api` proxy**). |
| **`npm run dev:api`** | Start API from **`server/`** (set env vars as above). |
| **`npm run build`** | Production frontend build → **`dist/`**. |
| **`npm run preview`** | Preview **`dist/`**. |
| **`npm run lint`** | ESLint. |
| **`npm test`** | **Server** tests, then **client** tests. |
| **`npm run test:server`** | API unit tests. |
| **`npm run test:client`** | React / util unit tests. |

---

## **Standalone frontend image (no API in Compose)**

The default **`Dockerfile`** uses **`nginx.public.conf`** so a plain **`docker build` / `docker run`** still serves the SPA. Configure **`VITE_API_URL`** at build time if the API is on another origin.

---

## **Prototype / assignment checklist**

- [x] Show current hangman status with staged pictures  
- [x] Allow user to select letters  
- [x] Show user-chosen letters  
- [x] New game button  
- [x] Win/loss popup  
- [x] Track player name (session state + Dynamo)  
- [x] Track wins / losses and show **win %** + name  
- [x] **GET** → **POST** (if new) login flow; hide login after success  
- [x] **PUT** after game over; **local state updated before PUT**  
- [x] **fetch** + **async/await** on the client  
- [x] **Docker Compose** with Dynamo-style local DB + API + web  
- [x] **Unit tests** for API and UI  

---

## **Tech notes**

- **AWS SDK v3**: `@aws-sdk/client-dynamodb` + `@aws-sdk/lib-dynamodb` in **`server/`**.
- **CORS** enabled on the API for local dev; in Compose the browser typically hits **`/api`** on the same origin.
