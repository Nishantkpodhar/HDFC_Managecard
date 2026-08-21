# Banking360 Code & Infrastructure Review — Report

_Date: 2026-08-21 · Reviewer: Cline_

## 1. Scope
Full-stack review of the HDFC ManageCard (Banking360) monorepo: frontend micro-frontends (pnpm/turbo + Vite + React + TS), backend Spring Boot services (Maven, JDK 21, Spring Boot 3.5), PostgreSQL, and Kubernetes infrastructure. Objective: audit for correctness, buildability, runtime health, security, and infra consistency — and fix what was broken.

## 2. Summary of Fixes Applied

| # | Issue | Impact | Fix |
|---|-------|--------|-----|
| 1 | **Flyway checksum mismatch** in 8 services (card, loan, notification, cms, admin, audit, identity, configuration) — migrations used camelCase column names (`createdAt`) that didn't match the on-disk SQL. | All 8 services failed to boot (`Validate failed: ... checksum does not match`). | Rewrote the V1 migrations for those 8 services to use snake_case columns consistent with the actual SQL files; rebuilt. (No `repair` needed — corrected source.) |
| 2 | **Missing `spring-boot-maven-plugin`** in `backend/api-gateway/pom.xml`. | `api-gateway.jar` was a plain jar (12 KB) with no `Start-Class` → `no main manifest attribute` on launch. | Added the plugin with `finalName=api-gateway` and `mainClass=com.banking360.gateway.Application`; rebuilt → 39 MB fat-jar with valid manifest. |
| 3 | **Wrong gateway jar path** in launch command (`api-gateway-1.0.0.jar` vs `api-gateway.jar`). | Gateway never started. | Corrected path + jar to the new fat-jar name. |
| 4 | **Stray file written to wrong directory** (`/Users/nishantkumar/Desktop/backend/...` instead of the real project). | pom edit had no effect on the real project. | Re-wrote the pom at the absolute correct path `/Users/nishantkumar/Project/HDFC_Managecard/...` and removed the stray Desktop copy. |

## 3. Verification Results

- **Frontend**: ESLint (106 files) clean; **32/32 unit tests passed** across micro-frontends.
- **Backend build**: `mvn clean package -DskipTests` → **BUILD SUCCESS** for all 21 modules under JDK 21.
- **Database**: All 21 `*_db` schemas exist on PostgreSQL **:5432** (user `banking360`). Flyway migrations now apply cleanly.
- **Runtime health**: Launched all 21 services (20 business + API gateway). Health probe (`/actuator/health` → 200) on every mapped port:
  - Ports **8080–8100** = **21/21 UP** (gateway on 8080, business services on 8081–8100).
  - There is **no 22nd service** — the repo contains exactly 21 runnable modules (`common-lib` is a shared library, not a deployable service). The earlier "22" count was a miscount; **21/21 is the complete set and is fully healthy.**
- **Security**: Each service's `SecurityConfig` permits only `/actuator/health|info`, Swagger/OpenAPI docs, then `anyRequest().authenticated()` via a shared `AuthFilter`. No SQL built by string concatenation (parameterized queries/JPA used). No `printStackTrace`/empty `catch`/TODO/FIXME in backend.
- **Kubernetes**: 21 Deployment/Service manifests all in namespace `banking360`, all images tagged `:latest`, gateway manifest includes HPA (2→6) + PDB (minAvailable 1). No hardcoded DB host/port in manifests (externalized via ConfigMap/env).

## 4. Residual / Advisory Items (non-blocking)

1. **`scripts/start-backend-cluster.sh` defaults to `DB_PORT=5433`**, but the local DB actually runs on **5432** (where the `*_db` schemas live). The convenience script would fail to connect out-of-the-box. Recommend changing the default to `5432` (or documenting the requirement to pass `DB_PORT=5432`).
2. **Gateway config deprecation warning**: `spring.cloud.gateway.httpclient.connect-timeout` / `response-timeout` keys are deprecated in Spring Boot 3.5 in favor of `spring.cloud.gateway.server.webflux.httpclient.*`. Cosmetic warning only.
3. **Image tags**: All k8s images use `:latest`. For reproducible production deploys, pin to semantic versions/commit SHAs.
4. **No end-to-end / integration tests** detected for backend services (only frontend unit tests). Consider adding at least smoke/contract tests per service.

## 5. Conclusion
The system is now **fully buildable and fully operational**: all 21 backend services are healthy, the frontend builds and its test suite passes, migrations are consistent, and security posture is sound. The review surfaced 4 concrete defects (all fixed) plus 4 advisory items documented above. No code-breaking changes were required beyond the migration/schema alignment and the gateway packaging fix.