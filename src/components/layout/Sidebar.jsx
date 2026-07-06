import { NavLink } from 'react-router-dom'

const NAV_BY_ROLE = {
  ADMIN: [
    { to: '/admin/dashboard', label: 'Dashboard', icon: 'bi-grid-1x2' },
    { to: '/admin/trainers', label: 'Trainers', icon: 'bi-person-badge' },
    { to: '/admin/students', label: 'Students', icon: 'bi-people' },
    { to: '/admin/batches', label: 'Batches', icon: 'bi-collection' },
    { to: '/admin/courses', label: 'Courses', icon: 'bi-book' },
    { to: '/admin/reports', label: 'Reports', icon: 'bi-bar-chart' },
    { to: '/admin/notifications', label: 'Notifications', icon: 'bi-bell' },
  ],
  TRAINER: [
    { to: '/trainer/dashboard', label: 'Dashboard', icon: 'bi-grid-1x2' },
    { to: '/trainer/attendance', label: 'Attendance', icon: 'bi-check2-square' },
    { to: '/trainer/topics', label: 'Daily Topics', icon: 'bi-journal-text' },
    { to: '/trainer/assignments', label: 'Assignments', icon: 'bi-clipboard-check' },
    { to: '/trainer/marks', label: 'Marks', icon: 'bi-graph-up' },
    { to: '/trainer/reports', label: 'Reports', icon: 'bi-bar-chart' },
    { to: '/trainer/notifications', label: 'Notifications', icon: 'bi-bell' },
  ],
  STUDENT: [
    { to: '/student/dashboard', label: 'Dashboard', icon: 'bi-grid-1x2' },
    { to: '/student/attendance', label: 'Attendance', icon: 'bi-check2-square' },
    { to: '/student/topics', label: 'Topics', icon: 'bi-journal-text' },
    { to: '/student/assignments', label: 'Assignments', icon: 'bi-clipboard-check' },
    { to: '/student/marks', label: 'Marks', icon: 'bi-graph-up' },
    { to: '/student/progress', label: 'Progress', icon: 'bi-speedometer2' },
  ],
}

/**
 * Responsive behavior:
 * - Desktop (>=992px): sticky, always visible, part of normal flow.
 * - Tablet/mobile (<992px): fixed off-canvas panel, hidden by default,
 *   slides in via the `.open` class, dismissed by the backdrop or a link click.
 */
export default function Sidebar({ role, open, onClose }) {
  const items = NAV_BY_ROLE[role] || []

  return (
    <>
      {open && <div className="st-sidebar-backdrop d-lg-none" onClick={onClose} />}
      <aside className={`st-sidebar ${open ? 'open' : ''}`}>
        <div className="d-flex align-items-center justify-content-between">
          <div className="st-sidebar-brand">
            <span className="dot" />
            SkillTrack <span style={{ color: 'var(--red)' }}>Pro</span>
          </div>
          <button className="btn btn-sm d-lg-none me-2" onClick={onClose} aria-label="Close menu">
            <i className="bi bi-x-lg" />
          </button>
        </div>
        <div className="px-3 pt-2 pb-1">
          <div className="st-eyebrow">{role}</div>
        </div>
        <nav className="mt-1 flex-grow-1">
          {items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={({ isActive }) => `st-nav-link ${isActive ? 'active' : ''}`}
            >
              <i className={`bi ${item.icon}`} />
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="px-3 py-3" style={{ borderTop: '1px solid var(--border)' }}>
          <div className="pulse-line" />
          <div className="st-eyebrow">v0.1 &mdash; MVP</div>
        </div>
      </aside>
    </>
  )
}
