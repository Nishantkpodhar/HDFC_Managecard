# Banking360 — Enterprise Digital Banking Platform

A modular banking platform built with a **Spring Boot microservices backend** (21 services behind an API Gateway) and a **Module-Federation micro-frontend** frontend (customer + admin shells). This README documents how to install dependencies and run the full stack.

---

## 1. Prerequisites

| Tool | Version | Notes |
|------|---------|-------|
| **Node.js** | >= 20.0.0 | Used for the frontend (pnpm workspace) |
| **pnpm** | >= 9.0.0 | Package manager (`corepack enable` or `npm i -g pnpm@9`) |
| **Java (JDK)** | 21 | (`java.version=21` in `backend/pom.xml`) |
| **Maven** | 3.9+ | Builds the backend (no `mvnw` wrapper is committed; use system `mvn`) |
| **PostgreSQL** | 16 (or Docker) | Backend datasource |
| **Docker** (optional) | - | For Postgres / Redis / Kafka infra via `docker-compose.yml` |

Verify locally:
```bash
node -v && pnpm -v && java -version && mvn -v && psql --version
```

---

## 2. Install

### 2.1 Frontend dependencies
From the repository root:
```bash
pnpm install
```
This installs the entire pnpm workspace (frontend shells, micro-frontends, and shared `packages/*`).

### 2.2 Backend dependencies
The backend uses Maven. Build all service jars (skips tests for speed):
```bash
mvn -q -f backend/pom.xml install -DskipTests
```
Each service produces a runnable jar at `backend/<service>/target/<service>.jar` and `backend/api-gateway/target/api-gateway-*.jar`.

### 2.3 Start infrastructure (database)
You can either run a local PostgreSQL (recommended for fast iteration) or use Docker.

**Option A — Docker (spins up Postgres 16, Redis 7, Kafka 3.7, Zookeeper):**
```bash
pnpm db:up        # docker compose up -d postgres redis kafka
pnpm db:down      # stop them
```
This creates a `banking360` database on **port 5432** with user/password `banking360`/`banking360`.

**Option B — Local PostgreSQL:** ensure a Postgres instance is reachable on `localhost:5432` with a `banking360` superuser (password `banking360`). The backend cluster script (below) auto-creates the per-service databases.

---

## 3. Run

### 3.1 Backend (API + 21 microservices)
Use the provided cluster launcher. It creates the per-service databases (`*_db`) and starts each jar:

```bash
# Defaults to DB_PORT=5433. For local Postgres on 5432:
DB_PORT=5432 bash scripts/start-backend-cluster.sh
```

The script:
1. Creates one database per service (e.g. `identity_db`, `customer_db`, `card_db` …) on the configured host/port.
2. Launches every service via `java -jar` with Flyway migrations applied automatically on startup.
3. Starts the **API Gateway** last.

> Logs are written to `/tmp/banking360-svcs/<service>.log`.

**Health checks:**
```bash
curl -s http://localhost:8080/actuator/health     # API Gateway
curl -s http://localhost:8081/actuator/health     # identity-service (and 8082-8100 for the rest)
```
Gateway Swagger UI: **http://localhost:8080/swagger-ui.html**

### 3.2 Frontend (Customer + Admin shells)
> ⚠️ The root `pnpm frontend:dev` script uses incorrect turbo filter names (`customer-shell`/`admin-shell`) and fails with *"No package found with name"*. Use the explicit, working command instead:

```bash
pnpm turbo run dev --filter=@banking360/customer-shell --filter=@banking360/admin-shell
```

This starts:
- **Customer shell** → **http://localhost:5173/**
- **Admin shell** → **http://localhost:5174/**

> Harmless warning: Vite prints `[ Module Federation DTS ] Failed to download types archive …` for the remote micro-frontends. These are only type-generation hints (the remote MFs are bundled via the shell, not run as standalone dev servers) and do not affect runtime.

---

## 4. Common Commands

From the repo root (`package.json`):
```bash
pnpm dev                # turbo run dev (all packages that define a dev script)
pnpm build              # turbo run build
pnpm lint               # turbo run lint
pnpm typecheck          # turbo run typecheck
pnpm test               # turbo run test
pnpm format             # prettier --write
pnpm clean              # clean build artifacts
```

> ⚠️ `pnpm dev` runs ~34 persistent dev tasks (one Vite server per micro-frontend). `turbo.json` sets `"concurrency": "50"` so the default 10-process cap does not abort the run with *"You have N persistent tasks but turbo is configured for concurrency of 10"*. If you raise the number of MFs, increase that value accordingly.

Full backend via Docker Compose (alternative to the jar launcher):
```bash
pnpm services:up       # docker compose up -d  (all backend services + infra)
pnpm services:down
```

---

## 5. Architecture Snapshot

- **Backend:** `backend/` — Maven multi-module. API Gateway (port 8080) routes to 21 services (identity, customer, product, card, transaction, payment, ledger, reward, emi, loan, fastag, offer, notification, service-request, configuration, feature-flag, audit, cms, admin, reporting, …). Each service owns its own `*_db` and migrates via Flyway (`src/main/resources/db/migration/V1__init.sql`).
- **Frontend:** `frontend/customer/*` and `frontend/admin/*` — Vite + Module Federation. `shell` hosts the app; `*-mf` are federated remote modules. Shared logic in `packages/*` (design-system, auth-client, api-contracts, shared-types, etc.).
- **Infra:** `infrastructure/kubernetes/*.yaml` and `docker-compose.yml`.

---

## 6. Troubleshooting

| Symptom | Fix |
|---------|-----|
| `pnpm frontend:dev` → *No package found with name 'customer-shell'* | Use the explicit filter command in §3.2 |
| Service won't start / DB connection refused | Confirm Postgres is up on the port the cluster script targets (`DB_PORT`, default 5433) and `banking360`/`banking360` credentials exist |
| `java: command not found` | Install JDK 21 and set `JAVA_HOME` (e.g. `export JAVA_HOME=$(/usr/libexec/java_home -v 21)`) |
| Port 5173/5174 already in use | Kill stray Vite: `pkill -f "vite --port 517"` |