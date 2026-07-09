export default function EmptyState({ icon = 'bi-inbox', title = 'Nothing here yet', message, action }) {
  return (
    <div className="text-center py-5">
      <div
        className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
        style={{ width: 56, height: 56, background: 'var(--red-tint)', color: 'var(--red-dark)' }}
      >
        <i className={`bi ${icon}`} style={{ fontSize: '1.5rem' }} />
      </div>
      <div style={{ fontWeight: 700 }}>{title}</div>
      {message && (
        <p className="text-muted mb-3 mt-1" style={{ fontSize: '0.85rem', maxWidth: 360, marginInline: 'auto' }}>
          {message}
        </p>
      )}
      {action}
    </div>
  )
}
