import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function Topbar({ title }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="st-topbar">
      <h5 className="mb-0">{title}</h5>
      <div className="d-flex align-items-center gap-3">
        <button className="btn btn-sm btn-st-outline">
          <i className="bi bi-bell me-1" /> Notifications
        </button>
        <div className="d-flex align-items-center gap-2">
          <div
            className="rounded-circle d-flex align-items-center justify-content-center"
            style={{ width: 32, height: 32, background: 'var(--red-tint)', color: 'var(--red-dark)', fontWeight: 700 }}
          >
            {user?.name?.[0] ?? '?'}
          </div>
          <div style={{ fontSize: '0.82rem' }}>
            <div style={{ fontWeight: 600 }}>{user?.name}</div>
            <div className="st-eyebrow">{user?.role}</div>
          </div>
        </div>
        <button className="btn btn-sm btn-st-outline" onClick={handleLogout}>
          <i className="bi bi-box-arrow-right me-1" /> Logout
        </button>
      </div>
    </div>
  )
}
