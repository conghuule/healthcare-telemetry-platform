export const ALERT_THRESHOLDS = {
  HEART_RATE_HIGH: 120
};

export function getMetric(record, type) {
  return record?.metrics?.find((metric) => metric.type === type)?.value ?? null;
}

export function isHeartRateAlert(value) {
  return value !== null && value > ALERT_THRESHOLDS.HEART_RATE_HIGH;
}

export function formatTime(value) {
  if (!value) return 'Chưa có dữ liệu';
  return new Intl.DateTimeFormat('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  }).format(new Date(value));
}

