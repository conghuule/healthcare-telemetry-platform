export function StatusBadge({ status, alert = false }) {
  const label = alert ? 'Cảnh báo' : status === 'ACTIVE' ? 'Đang hoạt động' : 'Không hoạt động';
  return <span className={`status-badge ${alert ? 'warning' : status === 'ACTIVE' ? 'active' : 'inactive'}`}><i />{label}</span>;
}
