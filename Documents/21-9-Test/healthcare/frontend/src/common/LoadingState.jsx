export function LoadingState({ label = 'Đang tải dữ liệu...' }) {
  return <div className="loading-state"><span className="loading-spinner" />{label}</div>;
}
