import { HeartPulse, RefreshCw } from 'lucide-react';

export function PortalLayout({ eyebrow, title, subtitle, action, children }) {
  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand"><div className="brand-mark"><HeartPulse size={22} /></div><div><strong>Pulseboard</strong><span>Clinical telemetry</span></div></div>
        <div className="live-pill"><span className="live-dot" /> LIVE MONITORING</div>
      </header>
      <section className="intro">
        <div><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p className="subheading">{subtitle}</p></div>
        {action && <button className="sync-button" onClick={action.onClick} type="button"><RefreshCw size={16} /> {action.label}</button>}
      </section>
      {children}
    </main>
  );
}
