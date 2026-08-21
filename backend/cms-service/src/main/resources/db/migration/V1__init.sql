-- __ART__ initial schema
CREATE TABLE IF NOT EXISTS cms_contents (
    id VARCHAR(36) PRIMARY KEY,
    type VARCHAR(255),
    title VARCHAR(255),
    body VARCHAR(255),
    status VARCHAR(255),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_cms_contents_created ON cms_contents(created_at);