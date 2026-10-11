import { ArrowLeft, MapPin, UserRound } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { AlertPanel } from '../../components/AlertPanel.jsx';
import { MetricCard } from '../../components/MetricCard.jsx';
import { VitalChart } from '../../components/VitalChart.jsx';
import { LoadingState } from '../../common/LoadingState.jsx';
import { PortalLayout } from '../../common/PortalLayout.jsx';
import { StatusBadge } from '../../common/StatusBadge.jsx';
import { usePatient } from '../../hooks/usePatient.js';
import { getMetric, isHeartRateAlert } from '../../domain/telemetry.js';
import { Activity, Droplets } from 'lucide-react';

export function PatientDetailPage() {
  const { patientId } = useParams();
  const { patient, loading, error, refresh } = usePatient(patientId);
  const device = patient?.devices?.[0];
  const latest = device?.latest;
  const heartRate = getMetric(latest, 'HEART_RATE');
  const spo2 = getMetric(latest, 'SPO2');
  const isAlert = isHeartRateAlert(heartRate);

  if (loading) return <PortalLayout eyebrow="PATIENT DETAIL" title="Đang tải hồ sơ" subtitle="Đang lấy dữ liệu hồ sơ và telemetry mới nhất..."><LoadingState /></PortalLayout>;
  if (error || !patient) return <PortalLayout eyebrow="PATIENT DETAIL" title="Không tìm thấy hồ sơ" subtitle={error || 'Bệnh nhân không tồn tại trong hệ thống.'}><Link className="back-link" to="/"><ArrowLeft size={16} /> Quay lại danh sách</Link></PortalLayout>;

  return <PortalLayout eyebrow="PATIENT DETAIL / LIVE" title={patient.fullName} subtitle="Hồ sơ bệnh nhân và chỉ số sinh tồn theo thời gian thực." action={{ label: 'Làm mới', onClick: refresh }}>
    <Link className="back-link" to="/"><ArrowLeft size={16} /> Danh sách bệnh nhân</Link>
    <section className="patient-profile"><div className="profile-avatar"><UserRound size={24} /></div><div className="profile-main"><p className="eyebrow">PATIENT ID / {patient.id}</p><h2>{patient.fullName}</h2><div className="profile-facts"><span><strong>{patient.age}</strong> tuổi</span><span><MapPin size={14} /> {patient.hometown}</span></div></div><div className="profile-device"><span>THIẾT BỊ CHÍNH</span><strong>{device?.deviceName || 'Chưa gán thiết bị'}</strong><StatusBadge status={device?.status} alert={isAlert} /></div></section>
    <section className="metrics-grid"><MetricCard label="Nhịp tim" value={heartRate} unit="BPM" icon={Activity} tone={isAlert ? 'alert' : 'coral'} /><MetricCard label="Oxy trong máu" value={spo2} unit="% SpO₂" icon={Droplets} tone="mint" /><article className="info-card"><span>GHI NHẬN CUỐI</span><strong>{latest?.serverReceivedAt ? new Date(latest.serverReceivedAt).toLocaleTimeString('vi-VN') : '--'}</strong><small>Server received time</small></article></section>
    <section className="content-grid"><VitalChart records={device?.history || []} /><AlertPanel isAlert={isAlert} /></section>
  </PortalLayout>;
}
