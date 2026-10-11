# Frontend Portal

React/Vite portal cho patient directory và patient detail.

## Cấu trúc

- `src/App.jsx`: route map của portal.
- `src/common/`: layout, loading state và status primitives dùng chung.
- `src/features/patients/`: patient list table và patient detail page.
- `src/components/`: telemetry presentation components như metric card, alert panel và line chart.
- `src/hooks/`: polling/data-fetching hooks.
- `src/api/`: API client boundary.
- `src/domain/`: business rules và metric helpers.
- `test/`: frontend domain unit tests.

## Routes

- `/`: danh sách patient/device.
- `/patients/:patientId`: hồ sơ, thiết bị, chỉ số và biểu đồ.

## Commands

Chạy Vite dev server:

```bash
npm run dev
```

Build production:

```bash
npm run build
```

Chạy frontend unit tests:

```bash
npm test
```

Preview production build:

```bash
npm run preview
```
