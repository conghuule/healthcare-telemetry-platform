import { createApp } from './app.js';
import { config } from './config.js';
import { createDatabasePool, initializeDatabase } from './db/database.js';
import { createTelemetryRepository } from './modules/telemetry/telemetry.repository.js';
import { createTelemetryService } from './modules/telemetry/telemetry.service.js';
import { seedDemoData } from './modules/telemetry/telemetry.seed.js';

const pool = createDatabasePool(config.databaseUrl);
const repository = createTelemetryRepository(pool);
const service = createTelemetryService(repository);

await initializeDatabase(pool);
await seedDemoData(repository);

const app = createApp(service);
const server = app.listen(config.port, () => {
  console.log(`Telemetry API listening on http://localhost:${config.port}`);
});

async function shutdown(signal) {
  console.log(`${signal} received, shutting down`);
  server.close(async () => {
    await pool.end();
    process.exit(0);
  });
}

process.once('SIGTERM', () => shutdown('SIGTERM'));
process.once('SIGINT', () => shutdown('SIGINT'));
