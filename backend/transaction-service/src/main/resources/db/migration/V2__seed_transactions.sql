-- __ART__ seed fictional transactions (DEVELOPMENT / DEMO ONLY)
-- All data is simulated. No real financial information.

INSERT INTO transactions (id, customerId, cardId, description, amount, currency, state, created_at, updated_at)
VALUES
    ('txn-3001', '9999999999', 'card-2001', 'Amazon.in', 1299.00, 'INR', 'SETTLED', NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days'),
    ('txn-3002', '9999999999', 'card-2001', 'Swiggy', 349.50, 'INR', 'SETTLED', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day'),
    ('txn-3003', '9999999999', 'card-2002', 'Reliance Fresh', 2150.75, 'INR', 'PENDING', NOW() - INTERVAL '12 hours', NOW() - INTERVAL '12 hours'),
    ('txn-3004', '9999999999', 'card-2001', 'Uber', 187.00, 'INR', 'AUTHORIZED', NOW() - INTERVAL '6 hours', NOW() - INTERVAL '6 hours'),
    ('txn-3005', '9999999999', 'card-2002', 'IRCTC', 542.00, 'INR', 'UNSETTLED', NOW() - INTERVAL '3 hours', NOW() - INTERVAL '3 hours'),
    ('txn-3006', '9999999999', 'card-2001', 'Starbucks', 420.00, 'INR', 'REFUNDED', NOW() - INTERVAL '30 minutes', NOW() - INTERVAL '20 minutes'),
    ('txn-3007', '9999999998', 'card-2003', 'BigBasket', 1899.00, 'INR', 'SETTLED', NOW() - INTERVAL '4 days', NOW() - INTERVAL '4 days')
ON CONFLICT (id) DO NOTHING;