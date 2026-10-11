const metricTypes = new Set(['HEART_RATE', 'SPO2', 'STEPS']);

export function parseTimestamp(value) {
  if (typeof value === 'number' || (typeof value === 'string' && /^\d+$/.test(value))) {
    const numericValue = Number(value);
    return new Date(numericValue < 1e12 ? numericValue * 1000 : numericValue);
  }

  return new Date(value);
}

export function validateIngestPayload(payload = {}) {
  const { deviceId, messageId, timestamp, metrics } = payload;

  if (deviceId !== undefined && (typeof deviceId !== 'string' || !deviceId.trim())) return 'deviceId must be a string';
  if (typeof messageId !== 'string' || !messageId.trim()) return 'messageId is required';
  if (!timestamp) return 'timestamp is required';
  if (!Array.isArray(metrics) || metrics.length === 0) return 'metrics must be a non-empty array';

  if (metrics.some((metric) => (
    !metric ||
    !metricTypes.has(metric.type) ||
    !Number.isFinite(Number(metric.value))
  ))) {
    return 'metrics contain an invalid type or value';
  }

  if (Number.isNaN(parseTimestamp(timestamp).getTime())) return 'timestamp must be a valid date';
  return null;
}

export function parseDateRange(from, to) {
  const fromDate = from ? new Date(from) : new Date(0);
  const toDate = to ? new Date(to) : new Date();

  if (Number.isNaN(fromDate.getTime())) return { error: 'from must be a valid date' };
  if (Number.isNaN(toDate.getTime())) return { error: 'to must be a valid date' };
  if (fromDate > toDate) return { error: 'from must be before or equal to to' };

  return { from: fromDate, to: toDate };
}
