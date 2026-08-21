-- __ART__ initial schema
CREATE TABLE IF NOT EXISTS offers (
    id VARCHAR(36) PRIMARY KEY,
    title VARCHAR(255),
    category VARCHAR(255),
    segment VARCHAR(255),
    status VARCHAR(255),
    min_spend NUMERIC(19,4),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_offers_created ON offers(created_at);
