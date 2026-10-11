# Telemetry Module

Feature boundary cho ingestion và patient portal.

- `telemetry.routes.js`: URL và request validation boundary.
- `telemetry.controller.js`: HTTP response mapping.
- `telemetry.service.js`: business rules, idempotency result và history downsampling.
- `telemetry.repository.js`: PostgreSQL queries duy nhất của feature.
- `telemetry.validation.js`: payload/date parsing.
- `telemetry.seed.js`: demo patient/device data, idempotent seed.
