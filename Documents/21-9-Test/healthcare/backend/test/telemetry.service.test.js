import test from 'node:test';
import assert from 'node:assert/strict';
import { createTelemetryService } from '../src/modules/telemetry/telemetry.service.js';

function createFakeRepository() {
  const records = [];
  const devices = [];

  return {
    async findDeviceByApiKey(apiKey) {
      return apiKey === 'valid-key' ? { id: 'device-1' } : null;
    },
    async registerDevice(device) {
      devices.push(device);
      return device;
    },
    async listDevices() {
      return devices;
    },
    async insert(input) {
      if (records.some((record) => record.messageId === input.messageId)) return null;
      const record = {
        id: `test-${records.length + 1}`,
        ...input,
        timestamp: input.timestamp.toISOString(),
        serverReceivedAt: new Date().toISOString()
      };
      records.push(record);
      return record;
    },
    async findLatestByDevice(deviceId) {
      return [...records].filter((record) => record.deviceId === deviceId).sort((a, b) => b.timestamp.localeCompare(a.timestamp))[0] ?? null;
    },
    async findByDeviceAndRange(deviceId, from, to) {
      return records.filter((record) => {
        const timestamp = Date.parse(record.timestamp);
        return record.deviceId === deviceId && timestamp >= from.getTime() && timestamp <= to.getTime();
      }).sort((a, b) => a.timestamp.localeCompare(b.timestamp));
    }
  };
}

test('ingest is idempotent by messageId', async () => {
  const service = createTelemetryService(createFakeRepository());
  const payload = {
    deviceId: 'device-1',
    messageId: 'message-1',
    timestamp: '2026-09-21T08:00:00.000Z',
    metrics: [{ type: 'HEART_RATE', value: 78 }]
  };

  const first = await service.ingest('valid-key', payload);
  const duplicate = await service.ingest('valid-key', payload);

  assert.equal(first.duplicate, false);
  assert.equal(duplicate.duplicate, true);
  assert.equal((await service.getLatest('device-1')).latest.messageId, 'message-1');
});

test('history is sorted and filtered by date range', async () => {
  const service = createTelemetryService(createFakeRepository());
  const ingest = (messageId, timestamp) => service.ingest('valid-key', {
    deviceId: 'device-1',
    messageId,
    timestamp,
    metrics: [{ type: 'SPO2', value: 98 }]
  });

  await ingest('message-2', '2026-09-21T08:02:00.000Z');
  await ingest('message-3', '2026-09-21T08:01:00.000Z');

  const result = await service.getHistory('device-1', {
    from: new Date('2026-09-21T08:00:30.000Z'),
    to: new Date('2026-09-21T08:01:30.000Z')
  });

  assert.deepEqual(result.records.map((record) => record.messageId), ['message-3']);
});

test('normalizes Unix timestamps expressed in seconds', async () => {
  const service = createTelemetryService(createFakeRepository());
  const result = await service.ingest('valid-key', {
    deviceId: 'device-1',
    messageId: 'unix-message-1',
    timestamp: 1726900000,
    metrics: [{ type: 'HEART_RATE', value: 78 }]
  });

  assert.equal(result.record.timestamp, '2024-09-21T06:26:40.000Z');
});

test('rejects an invalid ingestion key', async () => {
  const service = createTelemetryService(createFakeRepository());

  await assert.rejects(
    service.ingest('invalid-key', {
      messageId: 'unauthorized-message',
      timestamp: '2026-09-21T08:00:00.000Z',
      metrics: [{ type: 'HEART_RATE', value: 78 }]
    }),
    (error) => error.statusCode === 401
  );
});

test('rejects a deviceId that does not belong to the key', async () => {
  const service = createTelemetryService(createFakeRepository());

  await assert.rejects(
    service.ingest('valid-key', {
      deviceId: 'different-device',
      messageId: 'mismatched-message',
      timestamp: '2026-09-21T08:00:00.000Z',
      metrics: [{ type: 'HEART_RATE', value: 78 }]
    }),
    (error) => error.statusCode === 403
  );
});
