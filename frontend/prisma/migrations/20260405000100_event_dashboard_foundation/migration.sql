CREATE TYPE admin_role AS ENUM ('SUPER_ADMIN', 'COORDINATOR');
CREATE TYPE event_format AS ENUM ('SINGLE_PARTICIPANT', 'SINGLE_VS_SINGLE', 'TEAM_SOLO', 'TEAM_VS_TEAM');
CREATE TYPE event_status AS ENUM ('NOT_STARTED', 'STARTED', 'PAUSED', 'COMPLETED');
CREATE TYPE queue_entry_status AS ENUM ('QUEUED', 'IN_PROGRESS', 'COMPLETED');
CREATE TYPE event_round_status AS ENUM ('IN_PROGRESS', 'COMPLETED');

CREATE TABLE admin_access (
  id SERIAL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  role admin_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE managed_events (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL,
  format event_format NOT NULL,
  team_size INTEGER,
  venue TEXT,
  status event_status NOT NULL DEFAULT 'NOT_STARTED',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE coordinator_assignments (
  id SERIAL PRIMARY KEY,
  email TEXT NOT NULL,
  event_id INTEGER NOT NULL REFERENCES managed_events(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (email, event_id)
);

CREATE INDEX coordinator_assignments_email_idx ON coordinator_assignments(email);

CREATE TABLE tickets (
  id SERIAL PRIMARY KEY,
  source_file TEXT NOT NULL,
  source_row INTEGER NOT NULL,
  event_name TEXT NOT NULL,
  event_id INTEGER REFERENCES managed_events(id) ON DELETE SET NULL,
  email TEXT NOT NULL,
  participant_name TEXT NOT NULL,
  phone TEXT,
  qr_token TEXT NOT NULL UNIQUE,
  is_played BOOLEAN NOT NULL DEFAULT FALSE,
  played_at TIMESTAMPTZ,
  played_by_email TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (source_file, source_row)
);

CREATE INDEX tickets_email_idx ON tickets(email);
CREATE INDEX tickets_event_name_idx ON tickets(event_name);

CREATE TABLE event_queue_entries (
  id SERIAL PRIMARY KEY,
  event_id INTEGER NOT NULL REFERENCES managed_events(id) ON DELETE CASCADE,
  ticket_id INTEGER NOT NULL REFERENCES tickets(id) ON DELETE RESTRICT,
  participant_name TEXT NOT NULL,
  participant_email TEXT NOT NULL,
  participant_phone TEXT,
  team_members_json JSONB,
  status queue_entry_status NOT NULL DEFAULT 'QUEUED',
  queued_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ
);

CREATE INDEX event_queue_entries_event_status_idx ON event_queue_entries(event_id, status);

CREATE TABLE event_rounds (
  id SERIAL PRIMARY KEY,
  event_id INTEGER NOT NULL REFERENCES managed_events(id) ON DELETE CASCADE,
  entry_a_id INTEGER NOT NULL REFERENCES event_queue_entries(id) ON DELETE RESTRICT,
  entry_b_id INTEGER REFERENCES event_queue_entries(id) ON DELETE RESTRICT,
  status event_round_status NOT NULL DEFAULT 'IN_PROGRESS',
  score_a INTEGER NOT NULL DEFAULT 0,
  score_b INTEGER,
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ended_at TIMESTAMPTZ
);

CREATE INDEX event_rounds_event_status_idx ON event_rounds(event_id, status);
