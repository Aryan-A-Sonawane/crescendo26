ALTER TABLE registrations
ADD COLUMN auth_provider TEXT NOT NULL DEFAULT 'otp',
ADD COLUMN google_id TEXT,
ADD COLUMN password_hash TEXT;

CREATE UNIQUE INDEX registrations_google_id_key ON registrations(google_id);
