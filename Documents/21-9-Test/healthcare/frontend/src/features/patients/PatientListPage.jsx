import { Users } from 'lucide-react';
import { PortalLayout } from '../../common/PortalLayout.jsx';
import { LoadingState } from '../../common/LoadingState.jsx';
import { useDevices } from '../../hooks/useDevices.js';
import { PatientTable } from './PatientTable.jsx';

export function PatientListPage() {
  const { devices, loading, error, refresh } = useDevices();

  return <PortalLayout eyebrow="PATIENT DIRECTORY" title="Danh sách bệnh nhân" subtitle="Theo dõi thiết bị và mở hồ sơ chi tiết của từng bệnh nhân." action={{ label: 'Làm mới', onClick: refresh }}>
    {error && <div className="error-banner">{error}</div>}
    <section className="directory-summary"><div className="summary-icon"><Users size={20} /></div><div><strong>{devices.length} bệnh nhân</strong><span>Đang được theo dõi trong hệ thống</span></div><span className="summary-meta">LIVE DIRECTORY</span></section>
    {loading ? <LoadingState /> : <PatientTable devices={devices} />}
  </PortalLayout>;
}
