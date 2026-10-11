import { parseTimestamp } from './telemetry.validation.js';

function downsample(records, maxPoints) {
  if (records.length <= maxPoints) return records;

  const step = (records.length - 1) / (maxPoints - 1);
  return Array.from({ length: maxPoints }, (_, index) => records[Math.round(index * step)]);
}

export function createTelemetryService(repository) {
  return {
    async ingest(apiKey, { deviceId, messageId, timestamp, metrics }) {
      const device = await repository.findDeviceByApiKey(apiKey);
      if (!device) {
        const error = new Error('Invalid ingestion API key');
        error.statusCode = 401;
        throw error;
      }

      if (deviceId && deviceId !== device.id) {
        const error = new Error('API key does not belong to deviceId');
        error.statusCode = 403;
        throw error;
      }

      const record = await repository.insert({
        deviceId: device.id,
        messageId: messageId.trim(),
        timestamp: parseTimestamp(timestamp),
        metrics: metrics.map((metric) => ({ ...metric, value: Number(metric.value) }))
      });

      return { duplicate: !record, record };
    },

    async getLatest(deviceId) {
      const latest = await repository.findLatestByDevice(deviceId);
      return { deviceId, latest, status: latest ? 'Normal' : 'No signal' };
    },

    async listDevices() {
      const devices = await repository.listDevices();
      return Promise.all(devices.map(async (device) => {
        const latest = await repository.findLatestByDevice(device.id);
        const heartRate = latest?.metrics.find((metric) => metric.type === 'HEART_RATE')?.value ?? null;

        return {
          ...device,
          latest: latest?.serverReceivedAt ?? null,
          alert: heartRate !== null && heartRate > 120
        };
      }));
    },

    async getPatient(patientId) {
      const patient = await repository.findPatientById(patientId);
      if (!patient) return null;

      const devices = await Promise.all(patient.devices.map(async (device) => {
        const history = await repository.findByDeviceAndRange(device.id, new Date(Date.now() - 24 * 60 * 60 * 1000), new Date());
        return {
          ...device,
          latest: await repository.findLatestByDevice(device.id),
          history: downsample(history, 48)
        };
      }));

      return { ...patient, devices };
    },

    async getHistory(deviceId, range) {
      const records = await repository.findByDeviceAndRange(deviceId, range.from, range.to);
      return { deviceId, records };
    }
  };
}
