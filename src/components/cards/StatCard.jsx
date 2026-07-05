export default function StatCard({ label, value, suffix = '', trend, icon }) {
  return (
    <div className="st-card h-100">
      <div className="d-flex align-items-center justify-content-between">
        <div className="st-eyebrow">{label}</div>
        {icon && (
          <div
            className="d-flex align-items-center justify-content-center rounded-circle"
            style={{ width: 32, height: 32, background: 'var(--red-tint)', color: 'var(--red-dark)' }}
          >
            <i className={`bi ${icon}`} />
          </div>
        )}
      </div>
      <div className="stat-number mt-2" style={{ fontSize: '1.6rem' }}>
        {value}
        <span style={{ fontSize: '1rem', color: 'var(--ink-muted)' }}>{suffix}</span>
      </div>
      {trend && (
        <div className={`st-badge mt-2 ${trend.startsWith('-') ? 'st-badge-warning' : 'st-badge-success'}`}>
          <i className={`bi ${trend.startsWith('-') ? 'bi-arrow-down' : 'bi-arrow-up'}`} />
          {trend}
        </div>
      )}
    </div>
  )
}
