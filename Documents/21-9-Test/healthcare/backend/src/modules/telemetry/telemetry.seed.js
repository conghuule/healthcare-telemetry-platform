const demoPatients = [
  { id: 'patient-001', fullName: 'Nguyen Minh Anh', age: 34, hometown: 'Da Nang' },
  { id: 'patient-002', fullName: 'Tran Gia Han', age: 52, hometown: 'Ha Noi' },
  { id: 'patient-003', fullName: 'Le Hoang Nam', age: 41, hometown: 'Hai Phong' },
  { id: 'patient-004', fullName: 'Pham Thu Ha', age: 67, hometown: 'Can Tho' }
];

const demoDevices = [
  { id: 'bioheart-sensor-001', apiKey: '9d6f7b4e-1a21-4f18-8d02-000000000001', patientId: 'patient-001', deviceName: 'BioHeart Pro 01', patientName: 'Nguyen Minh Anh', status: 'ACTIVE' },
  { id: 'bioheart-sensor-002', apiKey: '9d6f7b4e-1a21-4f18-8d02-000000000002', patientId: 'patient-002', deviceName: 'BioHeart Pro 02', patientName: 'Tran Gia Han', status: 'ACTIVE' },
  { id: 'spo2-sensor-003', apiKey: '9d6f7b4e-1a21-4f18-8d02-000000000003', patientId: 'patient-003', deviceName: 'OxyTrack 03', patientName: 'Le Hoang Nam', status: 'ACTIVE' },
  { id: 'bioheart-sensor-004', apiKey: '9d6f7b4e-1a21-4f18-8d02-000000000004', patientId: 'patient-004', deviceName: 'BioHeart Pro 04', patientName: 'Pham Thu Ha', status: 'INACTIVE' }
];

const profiles = [
  { heartRate: 76, spo2: 98, drift: 4 },
  { heartRate: 84, spo2: 97, drift: 7 },
  { heartRate: 72, spo2: 99, drift: 3 },
  { heartRate: 128, spo2: 94, drift: 5 }
];

export async function seedDemoData(repository, now = new Date()) {
  for (const patient of demoPatients) {
    await repository.registerPatient(patient);
  }

  for (const [deviceIndex, device] of demoDevices.entries()) {
    await repository.registerDevice(device);
    const profile = profiles[deviceIndex];

    for (let sampleIndex = 0; sampleIndex < 24; sampleIndex += 1) {
      const timestamp = new Date(now.getTime() - (23 - sampleIndex) * 15 * 60 * 1000);
      const wave = Math.round(Math.sin(sampleIndex / 2) * profile.drift);
      const isLatestAlert = deviceIndex === 3 && sampleIndex >= 21;
      const heartRate = isLatestAlert ? profile.heartRate + sampleIndex - 21 : profile.heartRate + wave;

      await repository.insert({
        deviceId: device.id,
        messageId: `demo-${device.id}-${sampleIndex}`,
        timestamp,
        metrics: [
          { type: 'HEART_RATE', value: heartRate },
          { type: 'SPO2', value: profile.spo2 - (sampleIndex % 3 === 0 ? 1 : 0) }
        ]
      });
    }
  }
}