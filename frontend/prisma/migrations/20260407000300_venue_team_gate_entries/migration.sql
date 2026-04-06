DO $$ BEGIN
  ALTER TYPE admin_role ADD VALUE IF NOT EXISTS 'VENUE_TEAM';
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS gate_entry_logs (
  id SERIAL PRIMARY KEY,
  participant_email TEXT NOT NULL,
  participant_name TEXT NOT NULL,
  participant_phone TEXT,
  participant_college TEXT,
  qr_token TEXT NOT NULL,
  scanned_by_email TEXT NOT NULL,
  scanned_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  entry_date TEXT NOT NULL
);

DROP INDEX IF EXISTS gate_entry_logs_participant_email_entry_date_key;

CREATE INDEX IF NOT EXISTS gate_entry_logs_scanned_at_idx
  ON gate_entry_logs (scanned_at);

CREATE INDEX IF NOT EXISTS gate_entry_logs_scanned_by_email_scanned_at_idx
  ON gate_entry_logs (scanned_by_email, scanned_at);
