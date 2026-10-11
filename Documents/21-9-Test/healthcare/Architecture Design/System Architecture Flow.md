# System Architecture Flow

```mermaid
flowchart LR
    DEVICE[Mock Device / IoT Client]
    API[Express API]
    SERVICE[Telemetry Service]
    DB[(PostgreSQL)]
    PORTAL[React Portal]

    DEVICE -->|POST telemetry| API
    API -->|validate request| SERVICE
    SERVICE -->|unique message_id + write| DB
    DB -->|latest/history/patient detail| SERVICE
    SERVICE -->|JSON response| PORTAL
    PORTAL -->|poll every 3 seconds| API

    classDef source fill:#e8f4ff,stroke:#1976d2,stroke-width:2px,color:#123;
    classDef service fill:#fff4df,stroke:#d97706,stroke-width:2px,color:#432;
    classDef data fill:#eaf7ee,stroke:#2e7d32,stroke-width:2px,color:#132;
    classDef client fill:#f4eaff,stroke:#7e22ce,stroke-width:2px,color:#312;

    class DEVICE source;
    class API,SERVICE service;
    class DB data;
    class PORTAL client;
```

## Runtime Services

| Service       | Responsibility                          | Local port |
| ------------- | --------------------------------------- | ---------: |
| `db`          | PostgreSQL persistence                  |     `5432` |
| `backend`     | Ingestion API and patient portal API    |     `3000` |
| `mock-device` | Sends telemetry every 3 seconds         |   internal |
| `frontend`    | React production bundle served by Nginx |     `8080` |
