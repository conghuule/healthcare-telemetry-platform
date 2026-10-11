export function createTelemetryRepository(pool) {
  return {
    async registerPatient(patient) {
      const result = await pool.query(
        `INSERT INTO patients (id, full_name, age, hometown)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (id) DO UPDATE SET
           full_name = EXCLUDED.full_name,
           age = EXCLUDED.age,
           hometown = EXCLUDED.hometown
         RETURNING id, full_name AS "fullName", age, hometown`,
        [patient.id, patient.fullName, patient.age, patient.hometown]
      );
      return result.rows[0];
    },

    async registerDevice(device) {
      const result = await pool.query(
        `INSERT INTO devices (id, patient_id, device_name, patient_name, api_key, status)
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT (id) DO UPDATE SET
           patient_id = EXCLUDED.patient_id,
           device_name = EXCLUDED.device_name,
           patient_name = EXCLUDED.patient_name,
           api_key = EXCLUDED.api_key,
           status = EXCLUDED.status
         RETURNING id, patient_id AS "patientId", device_name AS "deviceName",
                   patient_name AS "patientName", status`,
        [device.id, device.patientId, device.deviceName, device.patientName, device.apiKey, device.status]
      );
      return result.rows[0];
    },

    async listDevices() {
      const result = await pool.query(
        `SELECT d.id, d.patient_id AS "patientId", d.device_name AS "deviceName",
          COALESCE(p.full_name, d.patient_name) AS "patientName",
          p.age, p.hometown, d.status
         FROM devices d
         LEFT JOIN patients p ON p.id = d.patient_id
         ORDER BY d.created_at, d.id`
      );
      return result.rows;
    },

    async findDeviceByApiKey(apiKey) {
      const result = await pool.query(
        `SELECT id, patient_id AS "patientId", device_name AS "deviceName", status
         FROM devices WHERE api_key = $1 LIMIT 1`,
        [apiKey]
      );
      return result.rows[0] ?? null;
    },

    async findPatientById(patientId) {
      const patientResult = await pool.query(
        `SELECT id, full_name AS "fullName", age, hometown
         FROM patients WHERE id = $1`,
        [patientId]
      );
      if (!patientResult.rows[0]) return null;

      const devicesResult = await pool.query(
        `SELECT id, patient_id AS "patientId", device_name AS "deviceName", status
         FROM devices WHERE patient_id = $1 ORDER BY created_at, id`,
        [patientId]
      );

      return { ...patientResult.rows[0], devices: devicesResult.rows };
    },

    async insert({ deviceId, messageId, timestamp, metrics }) {
      const result = await pool.query(
        `INSERT INTO telemetry_records (device_id, message_id, metrics, recorded_at)
         VALUES ($1, $2, $3::jsonb, $4)
         ON CONFLICT (message_id) DO NOTHING
         RETURNING id, device_id AS "deviceId", message_id AS "messageId",
                   metrics, recorded_at AS timestamp, server_received_at AS "serverReceivedAt"`,
        [deviceId, messageId, JSON.stringify(metrics), timestamp]
      );

      return result.rows[0] ?? null;
    },

    async findLatestByDevice(deviceId) {
      const result = await pool.query(
        `SELECT id, device_id AS "deviceId", message_id AS "messageId", metrics,
                recorded_at AS timestamp, server_received_at AS "serverReceivedAt"
         FROM telemetry_records
         WHERE device_id = $1
         ORDER BY recorded_at DESC, server_received_at DESC
         LIMIT 1`,
        [deviceId]
      );
      return result.rows[0] ?? null;
    },

    async findByDeviceAndRange(deviceId, from, to) {
      const result = await pool.query(
        `SELECT id, device_id AS "deviceId", message_id AS "messageId", metrics,
                recorded_at AS timestamp, server_received_at AS "serverReceivedAt"
         FROM telemetry_records
         WHERE device_id = $1 AND recorded_at >= $2 AND recorded_at <= $3
         ORDER BY recorded_at ASC`,
        [deviceId, from, to]
      );
      return result.rows;
    }
  };
}
