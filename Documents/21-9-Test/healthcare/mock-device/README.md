# Mock Device Worker

Worker mô phỏng thiết bị IoT gửi `HEART_RATE` và `SPO2` tới ingestion API theo interval cấu hình.

## Commands

Chạy local:

```bash
npm start
```

Chạy trong Docker cùng toàn bộ hệ thống:

```bash
npm run docker:up
npm run docker:logs -- mock-device
```

## Environment

- `API_URL`: endpoint ingestion, mặc định `http://localhost:3000/api/v1/telemetry/ingest`.
- `DEVICE_ID`: device ID gửi dữ liệu, mặc định `bioheart-sensor-001`.
- `API_KEY`: ingestion key của device, bắt buộc; worker gửi qua header `X-API-Key`.
- `INTERVAL_MS`: chu kỳ gửi, mặc định `3000`.

Worker không chứa business logic backend; nó chỉ tạo payload hợp lệ và gửi request. Mỗi lần gửi thành công đều log device ID và metrics để dễ quan sát trong Docker.
