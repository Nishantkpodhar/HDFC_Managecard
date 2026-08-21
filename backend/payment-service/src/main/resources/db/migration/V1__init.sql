-- initial schema
CREATE TABLE IF NOT EXISTS payments (
    id VARCHAR(36) PRIMARY KEY,
    customer_id VARCHAR(255),
    from_card_id VARCHAR(255),
    to_account VARCHAR(255),
    amount NUMERIC(19,4),
    currency VARCHAR(255),
    status VARCHAR(255),
    idempotency_key VARCHAR(255),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_payments_customer ON payments(customer_id);
CREATE UNIQUE INDEX IF NOT EXISTS uq_payments_idem ON payments(idempotency_key, customer_id);