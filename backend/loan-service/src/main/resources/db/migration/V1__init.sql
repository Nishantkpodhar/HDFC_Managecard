-- Banking360 Loan Service schema (development/demo, fictional data)
CREATE TABLE IF NOT EXISTS loan_applications (
    id VARCHAR(36) PRIMARY KEY,
    customer_id VARCHAR(255),
    product VARCHAR(255),
    amount NUMERIC(19,4),
    status VARCHAR(255),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_loan_applications_created ON loan_applications(created_at);
