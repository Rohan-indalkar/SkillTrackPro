export default function Card({ title, eyebrow, action, children, className = '' }) {
  return (
    <div className={`st-card ${className}`}>
      {(title || eyebrow) && (
        <div className="d-flex align-items-start justify-content-between mb-1">
          <div>
            {eyebrow && <div className="st-eyebrow">{eyebrow}</div>}
            {title && <div className="st-card-title mt-1">{title}</div>}
          </div>
          {action}
        </div>
      )}
      {children}
    </div>
  )
}
