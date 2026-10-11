# Healthcare Telemetry Monitor

## Cấu trúc

- `backend/`: Express API, lưu telemetry bằng PostgreSQL.
- `backend/src/modules/telemetry/`: feature module gồm route, controller, service, validation và repository.
- `mock-device/`: Worker giả lập thiết bị gửi nhịp tim và SpO2 mỗi 3 giây.
- `frontend/`: React/Vite portal; `common/` chứa layout/status/loading primitives, `features/patients/` chứa list/detail flow, còn telemetry chart nằm ở components/domain.
- Mỗi service có README riêng: [backend/README.md](backend/README.md), [frontend/README.md](frontend/README.md), [mock-device/README.md](mock-device/README.md).
- Business requirements: [srs.md](srs.md). Architecture: [Architecture Design/](Architecture%20Design/). API contract: [API Contract.md](Architecture%20Design/API%20Contract.md).

## Chạy local

Tại thư mục `healthcare`, cài dependencies một lần:

```bash
npm run install:all
```

Mở ba terminal:

```bash
npm run dev:backend
```

```bash
npm run start:mock
```

```bash
npm run dev:frontend
```

Kiểm tra trước khi mở pull request:

```bash
npm run check
```

Test riêng từng boundary:

```bash
npm run test:backend
npm run test:frontend
```

## Chạy toàn bộ bằng Docker

Docker Compose khởi động PostgreSQL, backend, mock device worker và frontend production:

```bash
npm run docker:up
```

- Portal: `http://localhost:8080`
- Backend: `http://localhost:3000`
- API demo: `http://localhost:3000/docs`
- PostgreSQL: `localhost:5432`
- Mock device: chạy nền trong service `mock-device`, gửi dữ liệu mỗi 3 giây.

Xem log worker để xác nhận dữ liệu đang được gửi:

```bash
npm run docker:logs -- mock-device
```

Hoặc:

```bash
docker compose logs -f mock-device
```

Dừng services nhưng giữ dữ liệu database:

```bash
npm run docker:down
```

Xóa cả volume PostgreSQL:

```bash
docker compose down -v
```

Dashboard chạy tại `http://localhost:5173`, API chạy tại `http://localhost:3000`.

## API chính

- `POST /api/v1/telemetry/ingest`: nhận telemetry và chống trùng theo `messageId`.
- `GET /api/v1/portal/devices/:deviceId/latest`: lấy telemetry mới nhất.
- `GET /api/v1/portal/devices`: lấy danh sách thiết bị demo và trạng thái cảnh báo.
- `GET /api/v1/portal/patients/:patientId`: lấy hồ sơ patient, thiết bị và telemetry 24 giờ.
- `GET /api/v1/portal/devices/:deviceId/history?from=&to=`: lấy dữ liệu time-series.
- `GET /health`: kiểm tra trạng thái API.
- Swagger UI: `http://localhost:3000/docs`; OpenAPI JSON: `http://localhost:3000/docs.json`.
- Ingestion demo cần header `X-API-Key`; key demo nằm trong `docker-compose.yml` cho `bioheart-sensor-001`.
- Heart rate cảnh báo khi vượt `120 BPM`, theo requirement nghiệp vụ.
- Portal route `/`: table danh sách patient/device; route `/patients/:patientId`: hồ sơ, chỉ số và biểu đồ chi tiết.

> PostgreSQL được provision trong Docker Compose, có volume persistent và backend dùng `DATABASE_URL` để đọc/ghi trực tiếp.
