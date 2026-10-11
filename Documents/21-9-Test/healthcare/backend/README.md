# Backend Service

Express API cho ingestion telemetry và portal patient. Backend chạy theo flow:

```text
HTTP Route -> Controller -> Service -> PostgreSQL Repository
```

## Cấu trúc

- `src/server.js`: process bootstrap, database pool, schema init, demo seed và graceful shutdown.
- `src/app.js`: composition root của Express app.
- `src/common/`: helper dùng chung cho HTTP layer.
- `src/db/`: PostgreSQL pool và schema initialization.
- `src/modules/telemetry/`: toàn bộ business feature telemetry/patient.
- `db/schema.sql`: schema PostgreSQL và indexes.
- `docs/openapi.yaml`: API contract dùng bởi Swagger UI.
- `test/`: unit tests cho service boundary.

## Commands

Chạy development watcher:

```bash
npm run dev
```

Chạy production:

```bash
npm start
```

Chạy unit tests:

```bash
npm test
```

Kiểm tra syntax nhanh:

```bash
for file in src/app.js src/server.js src/db/*.js src/common/*.js src/modules/telemetry/*.js; do node --check "$file" || exit 1; done
```

## Environment

- `PORT`: mặc định `3000`.
- `DATABASE_URL`: PostgreSQL connection string.
- `BODY_LIMIT`: JSON body limit, mặc định `32kb`.

## API

- `POST /api/v1/telemetry/ingest`
- `GET /api/v1/portal/devices`
- `GET /api/v1/portal/devices/:deviceId/latest`
- `GET /api/v1/portal/devices/:deviceId/history?from=&to=`
- `GET /api/v1/portal/patients/:patientId`
- `GET /health`

Ingestion authentication:

- Worker gửi key qua header `X-API-Key`.
- Backend lookup device từ key trong PostgreSQL.
- `deviceId` trong payload là optional; nếu có, phải khớp device của key.
- Không expose `api_key` trong portal response.

Demo API:

- Swagger UI: `http://localhost:3000/docs`
- OpenAPI JSON: `http://localhost:3000/docs.json`
- In Swagger UI, click **Authorize** and enter the device `X-API-Key` before testing ingest.
