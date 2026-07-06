import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function Topbar({ title, onToggleSidebar }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="st-topbar">
      <div className="d-flex align-items-center gap-2" style={{ minWidth: 0 }}>
        <button
          className="btn btn-sm btn-st-outline d-lg-none"
          onClick={onToggleSidebar}
          aria-label="Toggle menu"
        >
          <i className="bi bi-list" style={{ fontSize: '1rem' }} />
        </button>
        <h5 className="mb-0 text-truncate">{title}</h5>
      </div>

      <div className="d-flex align-items-center gap-2 gap-md-3">
        <button className="btn btn-sm btn-st-outline">
          <i className="bi bi-bell" />
          <span className="d-none d-md-inline ms-1">Notifications</span>
        </button>

        <div className="d-flex align-items-center gap-2">
          <div
            className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
            style={{ width: 32, height: 32, background: 'var(--red-tint)', color: 'var(--red-dark)', fontWeight: 700 }}
          >
            {user?.name?.[0] ?? '?'}
          </div>
          <div className="d-none d-sm-block" style={{ fontSize: '0.82rem' }}>
            <div style={{ fontWeight: 600 }}>{user?.name}</div>
            <div className="st-eyebrow">{user?.role}</div>
          </div>
        </div>

        <button className="btn btn-sm btn-st-outline" onClick={handleLogout} aria-label="Logout">
          <i className="bi bi-box-arrow-right" />
          <span className="d-none d-md-inline ms-1">Logout</span>
        </button>
      </div>
    </div>
  )
}
