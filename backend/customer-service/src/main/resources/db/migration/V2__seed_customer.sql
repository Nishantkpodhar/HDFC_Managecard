-- DEVELOPMENT-ONLY seed data (fictional). Never use in production.
-- Customer mobile is the JWT subject used by Identity Service (9999999999).

INSERT INTO customerProfiles (id, fullName, mobile, email, segment, status, created_at, updated_at)
VALUES
  ('11111111-1111-1111-1111-111111111111', 'Aarav Sharma', '9999999999', 'aarav.demo@banking360.example', 'PRIORITY', 'ACTIVE', now(), now()),
  ('22222222-2222-2222-2222-222222222222', 'Diya Patel',   '9999999998', 'diya.demo@banking360.example',   'CLASSIC', 'ACTIVE', now(), now())
ON CONFLICT (id) DO NOTHING;