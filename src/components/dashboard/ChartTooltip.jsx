export default function ChartTooltip({ active, payload, label, suffix = '%' }) {
  if (!active || !payload || !payload.length) return null

  return (
    <div
      className="st-card"
      style={{ padding: '0.6rem 0.9rem', boxShadow: 'var(--shadow-md)', border: '1px solid var(--border)' }}
    >
      {label && <div className="st-eyebrow mb-1">{label}</div>}
      {payload.map((entry, i) => (
        <div key={i} className="d-flex align-items-center gap-2" style={{ fontSize: '0.82rem' }}>
          <span
            style={{ width: 8, height: 8, borderRadius: '50%', background: entry.color || entry.fill, display: 'inline-block' }}
          />
          <span style={{ fontWeight: 600 }}>
            {entry.value}
            {suffix}
          </span>
          {entry.name && <span className="text-muted">{entry.name}</span>}
        </div>
      ))}
    </div>
  )
}
