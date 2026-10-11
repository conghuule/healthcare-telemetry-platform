import { Router } from 'express';
import { asyncHandler } from '../../common/asyncHandler.js';
import { validateIngestPayload, parseDateRange } from './telemetry.validation.js';

export function createTelemetryRouter(controller) {
  const router = Router();

  const requireIngestionKey = (req, res, next) => {
    const apiKey = req.get('x-api-key');
    if (!apiKey) return res.status(401).json({ error: 'Missing X-API-Key header' });
    req.ingestionApiKey = apiKey;
    return next();
  };

  router.post('/telemetry/ingest', requireIngestionKey, (req, res, next) => {
    const validationError = validateIngestPayload(req.body);
    if (validationError) return res.status(400).json({ error: validationError });
    return asyncHandler(controller.ingest)(req, res, next);
  });

  router.get('/portal/devices/:deviceId/latest', asyncHandler(controller.latest));

  router.get('/portal/devices', asyncHandler(controller.devices));

  router.get('/portal/patients/:patientId', asyncHandler(controller.patient));

  router.get('/portal/devices/:deviceId/history', (req, res, next) => {
    const dateRange = parseDateRange(req.query.from, req.query.to);
    if (dateRange.error) return res.status(400).json({ error: dateRange.error });
    req.dateRange = dateRange;
    return asyncHandler(controller.history)(req, res, next);
  });

  return router;
}
