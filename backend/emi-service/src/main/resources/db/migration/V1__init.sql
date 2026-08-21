-- Banking360 EMI Service schema (development/demo, fictional data)
CREATE TABLE IF NOT EXISTS emi_plans (
    id VARCHAR(36) PRIMARY KEY,
    customer_id VARCHAR(255),
    card_id VARCHAR(255),
    tenure INTEGER,
    principal NUMERIC(19,4),
    interest_rate NUMERIC(19,4),
    status VARCHAR(255),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_emi_plans_created ON emi_plans(created_at);
