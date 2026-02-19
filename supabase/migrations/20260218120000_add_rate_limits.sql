-- Rate limiting table for AI chat widget
-- Tracks request counts per IP address within a 24-hour rolling window

CREATE TABLE IF NOT EXISTS rate_limits (
  ip TEXT PRIMARY KEY,
  count INTEGER NOT NULL DEFAULT 1,
  window_start TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Allow the service role to read/write (used by the edge function)
ALTER TABLE rate_limits ENABLE ROW LEVEL SECURITY;

-- Edge function uses service role key, which bypasses RLS
-- No public access needed
