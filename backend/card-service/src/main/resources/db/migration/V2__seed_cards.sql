-- DEVELOPMENT-ONLY seed data (fictional). Never use in production.
-- NOTE: do not store CVV, PIN or real card numbers. Only masked numbers are stored.
-- customer_id = the JWT principal (mobile) propagated by the gateway X-User-Id header.

INSERT INTO cards (
  id, customer_id, masked_number, last_four, card_holder_name, type, product_name,
  status, expiry_month, expiry_year, credit_limit, available_limit, annual_fee,
  domestic_enabled, international_enabled, online_enabled, contactless_enabled, pin_set,
  created_at, updated_at
) VALUES
  ('card-2001', '9999999999', 'XXXX-XXXX-XXXX-1024', '1024', 'AARAV SHARMA', 'CREDIT', 'Banking360 Rewards Credit',
   'ACTIVE', 11, 2029, 250000.0000, 184500.0000, 0.0000,
   TRUE, TRUE, TRUE, TRUE, TRUE, now(), now()),
  ('card-2002', '9999999999', 'XXXX-XXXX-XXXX-7788', '7788', 'AARAV SHARMA', 'DEBIT', 'Banking360 Platinum Debit',
   'ACTIVE', 3, 2028, NULL, NULL, 0.0000,
   TRUE, FALSE, TRUE, TRUE, TRUE, now(), now()),
  -- Card owned by a DIFFERENT customer (9999999998) to demonstrate object-level authorization (BOLA).
  ('card-2003', '9999999998', 'XXXX-XXXX-XXXX-3310', '3310', 'DIYA PATEL', 'CREDIT', 'Banking360 Classic Credit',
   'BLOCKED', 7, 2027, 100000.0000, 61000.0000, 0.0000,
   TRUE, FALSE, TRUE, TRUE, TRUE, now(), now())
ON CONFLICT (id) DO NOTHING;