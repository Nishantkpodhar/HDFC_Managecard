-- Seed reward account for demo customer (fictional/dev-only data)
-- customerId matches the JWT subject used by identity service for mobile 9999999999
INSERT INTO rewardaccounts (id, customerId, balance, currency, created_at, updated_at)
SELECT 'rwd-5001', '9999999999', 4250.00, 'INR', NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM rewardaccounts WHERE customerId = '9999999999');