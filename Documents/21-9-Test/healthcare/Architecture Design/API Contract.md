# API Contract

OpenAPI là nguồn contract duy nhất của backend.

- Swagger UI: `http://localhost:3000/docs`
- OpenAPI JSON: `http://localhost:3000/docs.json`
- Spec source: [backend/docs/openapi.yaml](../backend/docs/openapi.yaml)

## Endpoint Groups

| Group     | Endpoints                                                                                                                   |
| --------- | --------------------------------------------------------------------------------------------------------------------------- |
| System    | `GET /health`                                                                                                               |
| Ingestion | `POST /api/v1/telemetry/ingest`                                                                                             |
| Devices   | `GET /api/v1/portal/devices`, `GET /api/v1/portal/devices/:deviceId/latest`, `GET /api/v1/portal/devices/:deviceId/history` |
| Patients  | `GET /api/v1/portal/patients/:patientId`                                                                                    |

Ingestion yêu cầu header `X-API-Key`; backend dùng key để xác định device và ghi DB.
Idempotency dùng unique `messageId` trong PostgreSQL. Patient detail trả telemetry tối đa 48 điểm sau khi downsample từ 24 giờ gần nhất.

Ingestion yêu cầu header `X-API-Key`. Swagger UI có nút **Authorize** để nhập key
theo từng device; key không được trả về các endpoint portal.
