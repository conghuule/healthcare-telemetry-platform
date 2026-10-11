const apiBase = '/api/v1/portal/devices';

async function requestJson(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error('Không thể kết nối máy chủ');
  return response.json();
}

export async function getDevices() {
  const result = await requestJson(apiBase);
  return result.devices;
}

export async function getPatient(patientId) {
  return requestJson(`/api/v1/portal/patients/${patientId}`);
}
