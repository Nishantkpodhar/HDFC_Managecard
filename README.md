# Banking360 — Enterprise Digital Banking Platform

> A full-stack, microservices-based digital banking monorepo: a Spring Boot backend (24 services behind an API Gateway), a React + Vite Module-Federation frontend (separate **Customer** and **Admin** portals), and a set of shared packages.

---

## Table of Contents
1. [Purpose](#purpose)
2. [Repository Layout](#repository-layout)
3. [Architecture Overview](#architecture-overview)
4. [End-to-End Request Flow](#end-to-end-request-flow)
5. [Prerequisites](#prerequisites)
6. [One-Time Setup](#one-time-setup)
7. [Run the Whole Stack (End-to-End)](#run-the-whole-stack-end-to-end)
8. [Run Individual Components](#run-individual-components)
9. [Service & Port Reference](#service--port-reference)
10. [Frontend Modules](#frontend-modules)
11. [Useful Scripts](#useful-scripts)
12. [Stopping Everything](#stopping-everything)
13. [Notes & Troubleshooting](#notes--troubleshooting)

---

## Purpose
Banking360 is an enterprise banking demonstration platform that models real-world digital-banking capabilities:

- **Customer portal** — cards, accounts, transactions, payments, loans, EMIs, rewards, offers, FASTag, notifications, profile, and support.
- **Admin portal** — operations, user/role/permission management, customer servicing, ledger, audit, CMS, configuration, feature-flag control, and system-health monitoring.

The goal of this repository is an **end-to-end runnable system**: a database-backed Spring Boot microservice backend exposed through an API Gateway, consumed by two independently deployable React frontends built with Module Federation.

---

## Repository Layout
```
.
├── packages/                 # Shared libraries (consumed by frontend micro-frontends)
│   ├── design-system/        # Reusable UI primitives (Button, Card, Input, …)
│   ├── api-contracts/        # Shared TypeScript types/API contracts
│   ├── auth-client/          # Auth hooks & token helpers
│   └── shared-utils/         # Common utilities
├── backend/                  # 24 Spring Boot microservices (Maven) + API Gateway
│   ├── api-gateway/          # Spring Cloud Gateway (single entry point)
│   ├── identity-service/     # Auth, JWT, OTP, user identity
│   ├── customer-service/ … reporting-service/  # Domain services
│   └── <service>/src/main/resources/db/migration/  # Flyway V1__init.sql per service
├── frontend/
│   ├── customer/            # Customer portal (shell + micro-frontends)
│   └── admin/               # Admin portal (shell + micro-frontends)
├── scripts/                 # Launchers & generators
│   ├── start-frontend.sh    # Start BOTH shells + all micro-frontends
│   ├── start-backend-cluster.sh  # Build (if needed) & run all backend jars
│   ├── start-backend.sh     # Run a single backend service (java -jar)
│   ├── start-svc.sh         # Run a single service with env overrides (dev)
│   └── gen-admin-mfs.sh     # Scaffold admin micro-frontends
├── docs/                    # Design & implementation docs
├── docker-compose.yml       # Postgres, Redis, Kafka (infra)
├── turbo.json               # Turborepo task pipeline
└── package.json             # Root workspace scripts (pnpm)
```

---

## Architecture Overview
```
                         ┌─────────────────────────────────────────────┐
                         │                Browser                       │
                         │                                              │
                         │   Customer (Vite :5173)   Admin (Vite :5174) │
                         │        shells (Module Federation hosts)      │
                         └───────────────┬─────────────────┬───────────┘
                                         │                 │
                          loads MFs      │                 │  loads MFs
                                         ▼                 ▼
                         ┌───────────────────────┐  ┌───────────────────────┐
                         │  Customer micro-      │  │  Admin micro-         │
                         │  frontends (auth,     │  │  frontends (users,    │
                         │  cards, txns, …)      │  │  roles, ledger, …)    │
                         └───────────┬──────────┘  └───────────┬──────────┘
                                     │                        │
                                     ▼   HTTP (REST)          ▼
                         ┌──────────────────────────────────────────────┐
                         │              API Gateway  (:8080)             │
                         │        Spring Cloud Gateway (RouteConfig)     │
                         └───────────────┬──────────────────────────────┘
                                         │  routes to downstream services
         ┌──────────────┬───────────────┼───────────────┬──────────────┐
         ▼              ▼               ▼               ▼              ▼
   identity      customer        transaction      payment        … (24 services)
     :8081          :8082           :8085            :8086
         │              │               │               │
         └──────────────┴───────┬───────┴───────────────┘
                                ▼
                ┌───────────────────────────────┐
                │  PostgreSQL (:5433)  Redis    │  Kafka
                │  (one DB per service,         │  (event bus)
                │   Flyway-managed schemas)     │
                └───────────────────────────────┘
```

- **Backend**: Spring Boot 3 + Spring Cloud Gateway, Maven, Java 17. Each domain service has its **own PostgreSQL database** and a Flyway `V1__init.sql` migration. Cross-service communication and resilience are handled inside the gateway routing layer (`RouteConfig.java`).
- **Frontend**: React 18 + TypeScript + Vite, composed with **Module Federation** (`@module-federation/vite`). Each `*-mf` is a remote; the `*shell` is the host that lazy-loads them at runtime. Shared UI/state live in `packages/design-system` and the `auth-client`.
- **Build orchestration**: Turborepo (`turbo.json`) runs `dev`/`build`/`test`/`lint`/`typecheck` across the workspace in parallel.

---

## End-to-End Request Flow
1. The user opens the **Customer** (`http://localhost:5173`) or **Admin** (`http://localhost:5174`) portal in the browser.
2. The Vite **shell** boots and, via Module Federation, dynamically loads the relevant micro-frontend(s) (e.g. `auth-mf`, `cards-mf`, `users-mf`).
3. A micro-frontend makes a REST call to the backend — typically through the **API Gateway** on `:8080` (or directly to a service port in local dev).
4. The gateway (`RouteConfig`) routes the request to the correct downstream Spring Boot service (e.g. `identity-service` → `:8081`, `transaction-service` → `:8085`).
5. The service reads/writes its **PostgreSQL** database (and may publish/consume **Kafka** events or use **Redis** for caching/sessions).
6. The response flows back through the gateway to the micro-frontend, which renders the result.

This is the default path exercised when you **run the whole stack** below.

---

## Prerequisites
| Tool | Version | Used for |
|------|---------|----------|
| Java | 17+ | Compiling/running Spring Boot services |
| Maven | 3.8+ | Building backend jars (`mvn`) |
| Node.js | ≥ 20 | Running the Vite frontend |
| pnpm | ≥ 9 | Workspace/package management (`packageManager: pnpm@9.0.0`) |
| Docker | latest | Running Postgres, Redis, Kafka via `docker-compose.yml` |
| PostgreSQL client | any | Verifying/creating the `banking360` role & DBs (if not using Docker) |

> The backend expects **PostgreSQL on port `5433`**, a role named **`banking360`** (password `banking360`), and one database per service (e.g. `identity_db`, `customer_db`, `transaction_db`, …). Flyway creates/updates the schemas automatically on startup from each service's `V1__init.sql`.

---

## One-Time Setup
```bash
# 1. Install JS dependencies (root + all workspace packages & MFs)
pnpm install

# 2. Start infrastructure (Postgres :5433, Redis, Kafka) via Docker
pnpm db:up
#    → equivalent to: docker compose -f docker-compose.yml up -d postgres redis kafka

# 3. (Optional) Build all backend jars once, so the cluster launcher can run them instantly.
#    The start-backend-cluster.sh script also builds any missing jars automatically.
( cd backend && for s in */; do ( cd "$s" && mvn -q -DskipTests package ); done )
```

> **Already running?** If Postgres (`:5433`) and the `banking360` databases already exist on your machine, you can skip steps 2 and 3 and jump straight to [Run the Whole Stack](#run-the-whole-stack-end-to-end).

---

## Run the Whole Stack (End-to-End)
From the repository root, start the backend and the frontend. Both steps are independent and can run in separate terminals (or as background processes).

### Terminal 1 — Backend (all 24 services + gateway)
```bash
# Builds any missing jars, then launches every service as `java -jar`.
# PIDs are written to /tmp/banking360-svcs/pids.txt
bash scripts/start-backend-cluster.sh
```
- First boot compiles/packages services — allow ~1–3 minutes for all services to become healthy.
- Verify: `curl -s -o /dev/null -w "%{http_code}\n" http://localhost:8080/actuator/health` (gateway).

### Terminal 2 — Frontend (customer + admin portals + all MFs)
```bash
# Starts BOTH shells and every micro-frontend via pnpm --parallel.
# PIDs are written to /tmp/banking360-fe/pids.txt
bash scripts/start-frontend.sh
```
- Customer shell → http://localhost:5173
- Admin shell → http://localhost:5174

### Open in the browser
- **Customer portal:** http://localhost:5173
- **Admin portal:** http://localhost:5174

You now have a fully running, database-backed, end-to-end system.

> **All-in-one alternative (Turborepo):** `pnpm dev` runs every `dev` task in the workspace (frontend shells/MFs *and* backend services via `mvn spring-boot:run`). This is heavier (Maven boots each service in-process) but requires no scripts. Use the launcher scripts above for the fastest, most reliable local experience.

---

## Run Individual Components

### Frontend only
```bash
# Both portals
pnpm frontend:dev

# Just the admin portal (shell + admin MFs)
pnpm --filter @banking360/admin-shell dev
# → http://localhost:5174

# Just the customer portal (shell + customer MFs)
pnpm --filter @banking360/customer-shell dev
# → http://localhost:5173

# A single admin micro-frontend (example: dashboard)
pnpm --filter @banking360/admin-dashboard-mf dev
```

### Backend only
```bash
# All services at once (Turborepo → mvn spring-boot:run per service)
pnpm backend:dev

# A single service, built & run as a jar (recommended for focused work)
bash scripts/start-backend.sh identity-service

# A single service with custom env overrides (dev convenience)
DB_URL="jdbc:postgresql://localhost:5433/reward_db" \
DB_USERNAME=banking360 DB_PASSWORD=banking360 \
SERVER_PORT=8199 \
bash scripts/start-svc.sh reward-service /tmp/svc-reward.log
```

### Database only
```bash
pnpm db:up      # start postgres + redis + kafka
pnpm db:down    # stop them
pnpm services:up / services:down   # full docker-compose stack
```

---

## Service & Port Reference
The **API Gateway** (`:8080`) is the single frontend-facing entry point. Downstream services are also reachable directly on their ports for local debugging.

| Service | Port | Service | Port |
|---------|------|---------|------|
| api-gateway | 8080 | emi-service | 8089 |
| identity-service | 8081 | loan-service | 8090 |
| customer-service | 8082 | fastag-service | 8091 |
| product-service | 8083 | offer-service | 8092 |
| card-service | 8084 | service-request-service | 8094 |
| transaction-service | 8085 | configuration-service | 8095 |
| payment-service | 8086 | feature-flag-service | 8096 |
| ledger-service | 8087 | audit-service | 8097 |
| reward-service | 8088 | cms-service | 8098 |
| | | admin-service | 8099 |
| | | reporting-service | 8100 |

Each service owns its own PostgreSQL database (e.g. `identity_db`, `customer_db`, …) and applies its `db/migration/V1__init.sql` via Flyway on startup.

---

## Frontend Modules
Composed with Module Federation. The `*-shell` is the host; each `*-mf` is a remote loaded at runtime.

### Customer portal (`frontend/customer`, shell → `:5173`)
`auth-mf`, `dashboard-mf`, `cards-mf`, `transactions-mf`, `payments-mf`, `loans-mf`, `emi-mf`, `rewards-mf`, `offers-mf`, `fastag-mf`, `notifications-mf`, `profile-mf`, `support-mf`

### Admin portal (`frontend/admin`, shell → `:5174`)
`dashboard-mf`, `users-mf`, `roles-mf`, `permissions-mf`, `customers-mf`, `cards-mf`, `transactions-mf`, `payments-mf`, `loans-mf`, `emi-mf`, `rewards-mf`, `offers-mf`, `fastag-mf`, `ledger-mf`, `audit-mf`, `cms-mf`, `configuration-mf`, `feature-flags-mf`, `system-health-mf`

> New admin micro-frontends can be scaffolded with `bash scripts/gen-admin-mfs.sh`.

---

## Useful Scripts (root `package.json`)
| Script | What it does |
|--------|--------------|
| `pnpm dev` | Run **all** `dev` tasks (frontend + backend) via Turborepo |
| `pnpm build` | Build every package/service |
| `pnpm lint` / `pnpm typecheck` | Lint / type-check the workspace |
| `pnpm test` / `pnpm test:ui` | Run unit tests (Vitest) / UI test runner |
| `pnpm format` | Prettier format (`**/*.{ts,tsx,json,md,yml,yaml}`) |
| `pnpm frontend:dev` | Run only the two frontend shells + MFs |
| `pnpm backend:dev` | Run only the backend services (Maven) |
| `pnpm db:up` / `pnpm db:down` | Start/stop Postgres, Redis, Kafka |
| `pnpm services:up` / `pnpm services:down` | Full Docker stack up/down |
| `pnpm clean` | Remove build artifacts & `node_modules` |

---

## Stopping Everything
```bash
# Frontend (Vite) processes
pkill -f "node.*vite" 2>/dev/null; pkill -f "pnpm --filter" 2>/dev/null; pkill -f start-frontend.sh 2>/dev/null

# Backend (Java) processes
pkill -f "java -jar" 2>/dev/null

# Infrastructure
pnpm db:down
```
The launcher scripts also record PIDs in `/tmp/banking360-fe/pids.txt` and `/tmp/banking360-svcs/pids.txt` for targeted cleanup.

---

## Notes & Troubleshooting
- **First backend launch is slow.** `start-backend-cluster.sh` packages any service whose `target/*.jar` is missing. Subsequent runs start instantly.
- **Database not found?** Ensure Postgres is on `:5433` with role `banking360`/`banking360` and the per-service databases exist. `pnpm db:up` provisions the containers; for a local (non-Docker) Postgres, create the role and databases manually.
- **Frontend can't reach backend?** Confirm the gateway is healthy on `:8080`, or that the micro-frontend's API base URL points to the correct service port. The gateway routes are defined in `backend/api-gateway/.../RouteConfig.java`.
- **JWT secret:** Default dev secret is set in `backend/api-gateway/src/main/resources/application.yml` (`APP_JWT_SECRET`). Override via env for non-dev use.
- **Port conflicts:** Shells are pinned to `5173`/`5174`; services to `8080–8100`. Free those ports before launching.
- **Docs:** See `docs/IMPLEMENTATION_PLAN.md` for design rationale and milestones.