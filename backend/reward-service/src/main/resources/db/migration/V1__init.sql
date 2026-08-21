-- __ART__ initial schema
CREATE TABLE IF NOT EXISTS rewardaccounts (
    id VARCHAR(36) PRIMARY KEY,
    customerId VARCHAR(255),
    balance NUMERIC(19,4),
    currency VARCHAR(255),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_rewardaccounts_created ON rewardaccounts(created_at);
