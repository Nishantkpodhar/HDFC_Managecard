#!/usr/bin/env bash
# Start the full Banking360 backend cluster against the local PostgreSQL on port 5433.
# Compatible with bash 3.2 (macOS default).
set -u
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-5433}"
DB_USER="${DB_USER:-banking360}"
DB_PASS="${DB_PASS:-banking360}"
LOG_DIR="${LOG_DIR:-/tmp/banking360-svcs}"
mkdir -p "$LOG_DIR"

# service|database pairs
PAIRS="identity-service|identity_db
customer-service|customer_db
product-service|product_db
card-service|card_db
transaction-service|transaction_db
payment-service|payment_db
ledger-service|ledger_db
reward-service|reward_db
emi-service|emi_db
loan-service|loan_db
fastag-service|fastag_db
offer-service|offer_db
notification-service|notification_db
service-request-service|servicerequest_db
configuration-service|configuration_db
feature-flag-service|featureflag_db
audit-service|audit_db
cms-service|cms_db
admin-service|admin_db
reporting-service|reporting_db"

echo "== Creating databases on ${DB_HOST}:${DB_PORT} =="
echo "$PAIRS" | while IFS='|' read -r svc db; do
  [ -z "$svc" ] && continue
  exists=$(PGPASSWORD="$DB_PASS" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -tAc "SELECT 1 FROM pg_database WHERE datname='$db'" 2>/dev/null)
  if [ "$exists" != "1" ]; then
    PGPASSWORD="$DB_PASS" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -c "CREATE DATABASE $db" >/dev/null 2>&1 && echo "created $db" || echo "FAILED create $db"
  else
    echo "exists $db"
  fi
done

echo "== Launching services =="
echo "$PAIRS" | while IFS='|' read -r svc db; do
  [ -z "$svc" ] && continue
  jar="$ROOT/backend/$svc/target/$svc.jar"
  [ -f "$jar" ] || { echo "MISSING $jar"; continue; }
  DB_URL="jdbc:postgresql://${DB_HOST}:${DB_PORT}/${db}"
  nohup env DB_URL="$DB_URL" DB_USERNAME="$DB_USER" DB_PASSWORD="$DB_PASS" \
    SPRING_DATASOURCE_HIKARI_MAXIMUM_POOL_SIZE=4 \
    java -jar "$jar" > "$LOG_DIR/$svc.log" 2>&1 &
  echo "started $svc (pid $!) -> $DB_URL"
done

GW_JAR=$(ls "$ROOT"/backend/api-gateway/target/api-gateway*.jar 2>/dev/null | head -1)
if [ -n "$GW_JAR" ] && [ -f "$GW_JAR" ]; then
  nohup env DB_URL="jdbc:postgresql://${DB_HOST}:${DB_PORT}/identity_db" DB_USERNAME="$DB_USER" DB_PASSWORD="$DB_PASS" \
    SPRING_DATASOURCE_HIKARI_MAXIMUM_POOL_SIZE=4 \
    java -jar "$GW_JAR" > "$LOG_DIR/api-gateway.log" 2>&1 &
  echo "started api-gateway (pid $!)"
fi

echo "== All launch commands issued. Logs in $LOG_DIR =="