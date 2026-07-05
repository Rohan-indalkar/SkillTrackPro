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

export default function Sidebar({ role }) {
  const items = NAV_BY_ROLE[role] || []
  return (
    <aside className="st-sidebar">
      <div className="st-sidebar-brand">
        <span className="dot" />
        SkillTrack <span style={{ color: 'var(--red)' }}>Pro</span>
      </div>
      <div className="px-3 pt-3 pb-1">
        <div className="st-eyebrow">{role}</div>
      </div>
      <nav className="mt-1 flex-grow-1">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
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
  )
}
