-- __ART__ initial schema
CREATE TABLE IF NOT EXISTS customerProfiles (
    id VARCHAR(36) PRIMARY KEY,
    fullName VARCHAR(255),
    mobile VARCHAR(255),
    email VARCHAR(255),
    segment VARCHAR(255),
    status VARCHAR(255),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_customerProfiles_created ON customerProfiles(created_at);
