import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../../services/mockApi'

const TYPE_BADGE = {
  Announcement: 'st-badge-red',
  Assignment: 'st-badge-success',
  Attendance: 'st-badge-warning',
  Quiz: 'st-badge-success',
}

export default function NotificationBell({ role }) {
  const [open, setOpen] = useState(false)
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const ref = useRef(null)
  const navigate = useNavigate()

  const load = () => {
    setLoading(true)
    api.notifications.getForRole(role).then((data) => {
      setItems(data)
      setLoading(false)
    })
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role])

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const unreadCount = items.filter((n) => !n.read).length
  const recent = items.slice(0, 5)

  const handleToggle = () => {
    if (!open) load()
    setOpen((v) => !v)
  }

  const handleMarkRead = async (id, e) => {
    e.stopPropagation()
    await api.notifications.markRead(id)
    load()
  }

  const goToAll = () => {
    setOpen(false)
    navigate(`/${role.toLowerCase()}/notifications`)
  }

  return (
    <div className="position-relative" ref={ref}>
      <button className="btn btn-sm btn-st-outline position-relative" onClick={handleToggle}>
        <i className="bi bi-bell" />
        <span className="d-none d-md-inline ms-1">Notifications</span>
        {unreadCount > 0 && (
          <span
            className="position-absolute translate-middle rounded-pill"
            style={{
              top: 2,
              right: 2,
              background: 'var(--red)',
              color: '#fff',
              fontSize: '0.6rem',
              fontWeight: 700,
              padding: '1px 5px',
              lineHeight: 1.3,
            }}
          >
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div
          className="st-card position-absolute"
          style={{
            top: 'calc(100% + 8px)',
            right: 0,
            width: 320,
            maxWidth: '90vw',
            zIndex: 1060,
            boxShadow: 'var(--shadow-md)',
            padding: '0.75rem',
          }}
        >
          <div className="d-flex align-items-center justify-content-between mb-2">
            <span className="st-card-title">Notifications</span>
            {unreadCount > 0 && <span className="st-badge st-badge-red">{unreadCount} new</span>}
          </div>
          <div className="pulse-line" />

          {loading ? (
            <div className="d-flex flex-column gap-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="st-skeleton" style={{ height: 40, borderRadius: 'var(--radius-sm)' }} />
              ))}
            </div>
          ) : recent.length === 0 ? (
            <p className="text-muted mb-0" style={{ fontSize: '0.85rem' }}>
              No notifications yet.
            </p>
          ) : (
            <div className="d-flex flex-column gap-2" style={{ maxHeight: 320, overflowY: 'auto' }}>
              {recent.map((n) => (
                <div
                  key={n.id}
                  className="p-2"
                  style={{
                    borderRadius: 'var(--radius-sm)',
                    background: n.read ? 'transparent' : 'var(--red-tint)',
                    border: '1px solid var(--border)',
                  }}
                >
                  <div className="d-flex align-items-center gap-2 flex-wrap mb-1">
                    <span className={`st-badge ${TYPE_BADGE[n.type] || 'st-badge-success'}`} style={{ fontSize: '0.65rem' }}>
                      {n.type}
                    </span>
                    <span className="st-eyebrow">{n.date}</span>
                  </div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 600 }}>{n.title}</div>
                  <div className="text-muted" style={{ fontSize: '0.78rem' }}>
                    {n.message}
                  </div>
                  {!n.read && (
                    <button
                      className="btn btn-sm btn-st-outline mt-1"
                      style={{ fontSize: '0.7rem', padding: '2px 8px' }}
                      onClick={(e) => handleMarkRead(n.id, e)}
                    >
                      Mark read
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          <button className="btn btn-st-primary btn-sm w-100 mt-2" onClick={goToAll}>
            View all notifications
          </button>
        </div>
      )}
    </div>
  )
}
