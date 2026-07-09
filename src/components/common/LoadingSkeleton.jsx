/**
 * variant "rows"  — table-style loading rows (for DataTable)
 * variant "card"  — a single card-shaped placeholder
 * variant "stat"  — small stat-card-shaped placeholder
 */
export default function LoadingSkeleton({ variant = 'rows', rows = 4 }) {
  if (variant === 'card') {
    return <div className="st-skeleton" style={{ height: 160, borderRadius: 'var(--radius-lg)' }} />
  }

  if (variant === 'stat') {
    return (
      <div className="st-card h-100">
        <div className="st-skeleton" style={{ height: 12, width: '50%', marginBottom: 10 }} />
        <div className="st-skeleton" style={{ height: 28, width: '40%' }} />
      </div>
    )
  }

  return (
    <div className="d-flex flex-column gap-2">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="st-skeleton" style={{ height: 44, borderRadius: 'var(--radius-sm)' }} />
      ))}
    </div>
  )
}
