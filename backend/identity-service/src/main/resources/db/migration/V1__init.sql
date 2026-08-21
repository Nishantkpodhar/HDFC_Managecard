-- Banking360 Identity Service schema (development/demo, fictional data)
CREATE TABLE otp_challenge (
    id UUID PRIMARY KEY,
    mobile VARCHAR(20) NOT NULL,
    otp_hash VARCHAR(128) NOT NULL,
    channel VARCHAR(20) NOT NULL DEFAULT 'SMS',
    verified BOOLEAN NOT NULL DEFAULT FALSE,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    attempt_count INT NOT NULL DEFAULT 0
);

CREATE INDEX idx_otp_challenge_mobile ON otp_challenge (mobile);
CREATE INDEX idx_otp_challenge_expires ON otp_challenge (expires_at);