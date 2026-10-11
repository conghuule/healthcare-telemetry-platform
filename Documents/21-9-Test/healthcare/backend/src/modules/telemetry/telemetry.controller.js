export function createTelemetryController(service) {
  return {
    async ingest(req, res) {
      const result = await service.ingest(req.ingestionApiKey, req.body);

      if (result.duplicate) {
        return res.status(200).json({ status: 'ACK_DUPLICATE', serverTimestamp: Date.now() });
      }

      return res.status(201).json({
        success: true,
        recordId: result.record.id,
        serverTimestamp: Date.now()
      });
    },

    async latest(req, res) {
      return res.json(await service.getLatest(req.params.deviceId));
    },

    async devices(_req, res) {
      return res.json({ devices: await service.listDevices() });
    },

    async patient(req, res) {
      const patient = await service.getPatient(req.params.patientId);
      if (!patient) return res.status(404).json({ error: 'Patient not found' });
      return res.json(patient);
    },

    async history(req, res) {
      return res.json(await service.getHistory(req.params.deviceId, req.dateRange));
    }
  };
}
