export default function Modal({ open, title, onClose, children, footer }) {
  if (!open) return null
  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center px-3"
      style={{ background: 'rgba(26,20,20,0.45)', zIndex: 1050 }}
      onClick={onClose}
    >
      <div
        className="st-card"
        style={{ width: '100%', maxWidth: 480, maxHeight: '90vh', overflowY: 'auto', background: '#fff' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="d-flex align-items-center justify-content-between mb-2">
          <div className="st-card-title">{title}</div>
          <button
            className="btn btn-sm"
            style={{ color: 'var(--ink-muted)' }}
            onClick={onClose}
            aria-label="Close"
          >
            <i className="bi bi-x-lg" />
          </button>
        </div>
        <div className="pulse-line" />
        <div>{children}</div>
        {footer && <div className="d-flex justify-content-end gap-2 mt-3">{footer}</div>}
      </div>
    </div>
  )
}
