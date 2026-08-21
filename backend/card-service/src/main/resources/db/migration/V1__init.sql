CREATE TABLE IF NOT EXISTS cards (
    id VARCHAR(64) PRIMARY KEY,
    customer_id VARCHAR(64) NOT NULL,
    masked_number VARCHAR(32),
    last_four VARCHAR(4),
    card_holder_name VARCHAR(128),
    type VARCHAR(32),
    product_name VARCHAR(128),
    status VARCHAR(32) NOT NULL DEFAULT 'ACTIVE',
    expiry_month INTEGER,
    expiry_year INTEGER,
    credit_limit NUMERIC(19,4),
    available_limit NUMERIC(19,4),
    annual_fee NUMERIC(19,4),
    domestic_enabled BOOLEAN DEFAULT TRUE,
    international_enabled BOOLEAN DEFAULT TRUE,
    online_enabled BOOLEAN DEFAULT TRUE,
    contactless_enabled BOOLEAN DEFAULT TRUE,
    pin_set BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT now(),
    updated_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_cards_customer ON cards(customer_id);
ALTER TABLE cards ADD COLUMN IF NOT EXISTS idempotency_key VARCHAR(255);
CREATE UNIQUE INDEX IF NOT EXISTS uq_cards_idem ON cards(idempotency_key);
