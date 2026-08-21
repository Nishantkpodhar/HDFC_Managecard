-- Banking360 FASTag Service schema (development/demo, fictional data)
CREATE TABLE IF NOT EXISTS fastags (
    id VARCHAR(36) PRIMARY KEY,
    customer_id VARCHAR(255),
    vehicle_number VARCHAR(255),
    status VARCHAR(255),
    balance NUMERIC(19,4),
    currency VARCHAR(255),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_fastags_created ON fastags(created_at);
