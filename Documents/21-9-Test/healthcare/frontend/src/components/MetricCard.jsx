export function MetricCard({ label, value, unit, icon: Icon, tone }) {
  return (
    <article className={`vital-card ${tone}`}>
      <div className="vital-heading"><span>{label}</span><Icon size={18} strokeWidth={1.8} /></div>
      <strong>{value ?? '--'} <small>{value === null ? '' : unit}</small></strong>
    </article>
  );
}
