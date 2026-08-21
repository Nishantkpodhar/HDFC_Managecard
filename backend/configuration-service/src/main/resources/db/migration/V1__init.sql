-- initial schema
CREATE TABLE IF NOT EXISTS config_entries (
    id VARCHAR(36) PRIMARY KEY,
    config_key VARCHAR(255),
    config_value VARCHAR(255),
    category VARCHAR(255),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_config_entries_created ON config_entries(created_at);
