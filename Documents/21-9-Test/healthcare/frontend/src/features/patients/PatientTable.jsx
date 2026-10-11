import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatTime } from '../../domain/telemetry.js';
import { StatusBadge } from '../../common/StatusBadge.jsx';

export function PatientTable({ devices }) {
  return <div className="table-wrap"><table className="patient-table"><thead><tr><th>STT</th><th>Bệnh nhân</th><th>Thiết bị</th><th>Trạng thái</th><th>Cập nhật gần nhất</th><th /></tr></thead><tbody>{devices.map((device, index) => <tr key={device.id}><td className="row-number">{String(index + 1).padStart(2, '0')}</td><td><Link className="patient-link" to={`/patients/${device.patientId}`}><strong>{device.patientName}</strong><span>{device.patientId}</span></Link></td><td><div className="device-cell"><span className="device-cell-icon" /><div><strong>{device.deviceName}</strong><span>{device.id}</span></div></div></td><td><StatusBadge status={device.status} alert={device.alert} /></td><td className="muted-cell">{formatTime(device.latest)}</td><td><Link className="detail-button" to={`/patients/${device.patientId}`} aria-label={`Xem chi tiết ${device.patientName}`}>Chi tiết <ArrowUpRight size={15} /></Link></td></tr>)}</tbody></table></div>;
}
