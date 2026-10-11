import { getMetric } from '../domain/telemetry.js';

const CHART_WIDTH = 720;
const CHART_HEIGHT = 280;
const PADDING = { top: 18, right: 20, bottom: 42, left: 48 };

function formatChartTime(value) {
  return new Intl.DateTimeFormat('vi-VN', { hour: '2-digit', minute: '2-digit' }).format(new Date(value));
}

export function VitalChart({ records }) {
  const points = records
    .map((record) => ({ record, value: getMetric(record, 'HEART_RATE') }))
    .filter((point) => point.value !== null);
  const plotWidth = CHART_WIDTH - PADDING.left - PADDING.right;
  const plotHeight = CHART_HEIGHT - PADDING.top - PADDING.bottom;
  const minValue = Math.max(0, Math.floor(Math.min(...points.map((point) => point.value), 60) / 10) * 10 - 10);
  const maxValue = Math.ceil(Math.max(...points.map((point) => point.value), 120) / 10) * 10 + 10;
  const yTicks = Array.from({ length: 5 }, (_, index) => minValue + ((maxValue - minValue) / 4) * index);
  const chartPoints = points.map((point, index) => ({
    ...point,
    x: PADDING.left + (points.length === 1 ? plotWidth / 2 : (index / (points.length - 1)) * plotWidth),
    y: PADDING.top + ((maxValue - point.value) / (maxValue - minValue)) * plotHeight
  }));
  const line = chartPoints.map((point) => `${point.x},${point.y}`).join(' ');
  const timeLabels = chartPoints.filter((_, index) => index === 0 || index === chartPoints.length - 1 || index % Math.max(1, Math.floor(chartPoints.length / 3)) === 0);

  return (
    <article className="chart-panel">
      <div className="panel-heading"><div><p className="eyebrow">REAL-TIME SERIES</p><h2>Nhịp tim</h2></div><span className="chart-legend"><i /> BPM</span></div>
      {chartPoints.length ? <div className="line-chart-wrap"><svg className="line-chart" viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`} role="img" aria-label="Biểu đồ đường nhịp tim theo thời gian">
        <text className="axis-title" x="12" y="16">BPM</text>
        {yTicks.map((tick) => {
          const y = PADDING.top + ((maxValue - tick) / (maxValue - minValue)) * plotHeight;
          return <g key={tick}><line className="grid-line" x1={PADDING.left} x2={CHART_WIDTH - PADDING.right} y1={y} y2={y} /><text className="axis-label" x={PADDING.left - 10} y={y + 4} textAnchor="end">{Math.round(tick)}</text></g>;
        })}
        <line className="axis-line" x1={PADDING.left} x2={CHART_WIDTH - PADDING.right} y1={CHART_HEIGHT - PADDING.bottom} y2={CHART_HEIGHT - PADDING.bottom} />
        <polyline className="trend-line" points={line} />
        {chartPoints.map((point) => <circle className={point.value > 120 ? 'data-point alert-point' : 'data-point'} cx={point.x} cy={point.y} r="4" key={point.record.id}><title>{`${formatChartTime(point.record.timestamp)} · ${point.value} BPM`}</title></circle>)}
        {timeLabels.map((point) => <text className="time-label" key={`time-${point.record.id}`} x={point.x} y={CHART_HEIGHT - 15} textAnchor="middle">{formatChartTime(point.record.timestamp)}</text>)}
      </svg></div> : <div className="empty-chart">Chưa có dữ liệu lịch sử</div>}
    </article>
  );
}
