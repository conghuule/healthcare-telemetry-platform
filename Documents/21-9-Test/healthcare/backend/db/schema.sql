CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS patients (
  id VARCHAR(120) PRIMARY KEY,
  full_name VARCHAR(160) NOT NULL,
  age INTEGER NOT NULL CHECK (age BETWEEN 0 AND 150),
  hometown VARCHAR(160) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS devices (
  id VARCHAR(120) PRIMARY KEY,
  patient_id VARCHAR(120) NOT NULL,
  device_name VARCHAR(160) NOT NULL,
  patient_name VARCHAR(160) NOT NULL,
  api_key VARCHAR(120),
  status VARCHAR(32) NOT NULL DEFAULT 'ACTIVE',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE devices ADD COLUMN IF NOT EXISTS patient_name VARCHAR(160);
ALTER TABLE devices ADD COLUMN IF NOT EXISTS api_key VARCHAR(120);

CREATE UNIQUE INDEX IF NOT EXISTS idx_devices_api_key ON devices (api_key)
  WHERE api_key IS NOT NULL;

CREATE TABLE IF NOT EXISTS telemetry_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id VARCHAR(120) NOT NULL REFERENCES devices(id),
  message_id VARCHAR(180) NOT NULL UNIQUE,
  metrics JSONB NOT NULL,
  recorded_at TIMESTAMPTZ NOT NULL,
  server_received_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_telemetry_device_recorded_at
  ON telemetry_records (device_id, recorded_at DESC);

CREATE INDEX IF NOT EXISTS idx_telemetry_server_received_at
  ON telemetry_records (server_received_at DESC);
