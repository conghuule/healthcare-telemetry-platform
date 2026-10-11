import cors from 'cors';
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import { config } from './config.js';
import { openApiSpec } from './docs/openapi.js';
import { createTelemetryController } from './modules/telemetry/telemetry.controller.js';
import { createTelemetryRouter } from './modules/telemetry/telemetry.routes.js';

export function createApp(service) {
  const app = express();
  const controller = createTelemetryController(service);

  app.use(cors());
  app.use(express.json({ limit: config.bodyLimit }));
  app.get('/docs.json', (_req, res) => res.json(openApiSpec));
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(openApiSpec, { explorer: true }));
  app.use('/api/v1', createTelemetryRouter(controller));

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok', service: 'healthcare-telemetry-api' });
  });

  app.use((error, _req, res, _next) => {
    console.error(error);
    res.status(error.statusCode ?? 500).json({ error: error.message ?? 'Internal server error' });
  });

  return app;
}
