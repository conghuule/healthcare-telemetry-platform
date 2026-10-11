const apiUrl = process.env.API_URL ?? 'http://localhost:3000/api/v1/telemetry/ingest';
const deviceId = process.env.DEVICE_ID ?? 'bioheart-sensor-001';
const apiKey = process.env.API_KEY;
const intervalMs = Number(process.env.INTERVAL_MS ?? 3000);

async function sendTelemetry() {
  const payload = {
    deviceId,
    messageId: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    timestamp: new Date().toISOString(),
    metrics: [
      {
        type: 'HEART_RATE',
        value: Math.floor(65 + Math.random() * 35)
      },
      {
        type: 'SPO2',
        value: Math.floor(95 + Math.random() * 5)
      }
    ]
  };

  try {
    if (!apiKey) throw new Error('API_KEY is required');

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-API-Key': apiKey },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    console.log(`[${new Date().toISOString()}] ${deviceId} telemetry sent`, payload.metrics);
  } catch (error) {
    console.error('Device sync offline/retry...', error.message);
  }
}

console.log(`Mock device started: ${deviceId} -> ${apiUrl} every ${intervalMs}ms`);
sendTelemetry();
setInterval(sendTelemetry, intervalMs);
