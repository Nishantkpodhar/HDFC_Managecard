-- __ART__ initial schema
CREATE TABLE IF NOT EXISTS transactions (
    id VARCHAR(36) PRIMARY KEY,
    customerId VARCHAR(255),
    cardId VARCHAR(255),
    description VARCHAR(255),
    amount NUMERIC(19,4),
    currency VARCHAR(255),
    state VARCHAR(255),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_transactions_created ON transactions(created_at);
