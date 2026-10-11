import test from 'node:test';
import assert from 'node:assert/strict';
import { getMetric, isHeartRateAlert, formatTime } from '../src/domain/telemetry.js';

test('getMetric returns the requested metric from a telemetry record', () => {
  const record = { metrics: [{ type: 'HEART_RATE', value: 82 }, { type: 'SPO2', value: 98 }] };
  assert.equal(getMetric(record, 'HEART_RATE'), 82);
  assert.equal(getMetric(record, 'STEPS'), null);
});

test('isHeartRateAlert follows the clinical threshold', () => {
  assert.equal(isHeartRateAlert(120), false);
  assert.equal(isHeartRateAlert(121), true);
  assert.equal(isHeartRateAlert(null), false);
});

test('formatTime returns a safe empty state for missing values', () => {
  assert.equal(formatTime(null), 'Chưa có dữ liệu');
});
