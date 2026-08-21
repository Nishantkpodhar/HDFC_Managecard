-- Seed historical payments for demo customer (fictional/dev-only data)
-- Payment records must be unique on (idempotency_key, customer_id) per service design.
INSERT INTO payments (id, customer_id, from_card_id, to_account, amount, currency, status, idempotency_key, created_at, updated_at)
SELECT 'pay-6001', '9999999999', 'card-2001', 'UTIL-ELECTRICITY', 1245.00, 'INR', 'COMPLETED', 'seed-pay-6001', NOW() - INTERVAL '6 days', NOW() - INTERVAL '6 days'
WHERE NOT EXISTS (SELECT 1 FROM payments WHERE idempotency_key = 'seed-pay-6001');

INSERT INTO payments (id, customer_id, from_card_id, to_account, amount, currency, status, idempotency_key, created_at, updated_at)
SELECT 'pay-6002', '9999999999', 'card-2001', 'MOBILE-RECHARGE', 399.00, 'INR', 'COMPLETED', 'seed-pay-6002', NOW() - INTERVAL '4 days', NOW() - INTERVAL '4 days'
WHERE NOT EXISTS (SELECT 1 FROM payments WHERE idempotency_key = 'seed-pay-6002');

INSERT INTO payments (id, customer_id, from_card_id, to_account, amount, currency, status, idempotency_key, created_at, updated_at)
SELECT 'pay-6003', '9999999999', 'card-2002', 'DTH-TATAPLAY', 599.00, 'INR', 'PROCESSING', 'seed-pay-6003', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day'
WHERE NOT EXISTS (SELECT 1 FROM payments WHERE idempotency_key = 'seed-pay-6003');