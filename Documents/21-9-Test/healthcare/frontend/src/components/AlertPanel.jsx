import { AlertTriangle } from 'lucide-react';
import { ALERT_THRESHOLDS } from '../domain/telemetry.js';

export function AlertPanel({ isAlert }) {
  return (
    <aside className={`alert-panel ${isAlert ? 'has-alert' : ''}`}>
      <div className="alert-icon"><AlertTriangle size={20} /></div>
      <p className="eyebrow">TRẠNG THÁI CẢNH BÁO</p>
      <h2>{isAlert ? 'Cần chú ý' : 'Bình thường'}</h2>
      <p>{isAlert ? 'Nhịp tim đang cao hơn ngưỡng theo dõi.' : 'Các chỉ số đang trong vùng an toàn.'}</p>
      <div className="alert-rule"><span>Ngưỡng nhịp tim</span><strong>&gt; {ALERT_THRESHOLDS.HEART_RATE_HIGH} BPM</strong></div>
    </aside>
  );
}
