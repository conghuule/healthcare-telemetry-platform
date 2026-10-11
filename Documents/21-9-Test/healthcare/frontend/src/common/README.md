# Frontend Common

Shared UI primitives không chứa logic patient-specific:

- `PortalLayout.jsx`: shell và page heading thống nhất.
- `StatusBadge.jsx`: trạng thái device/alert.
- `LoadingState.jsx`: loading state chuẩn.

Feature code không nên import ngược từ `common` vào domain-specific modules.
