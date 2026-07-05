import Sidebar from './Sidebar'
import Topbar from './Topbar'
import { useAuth } from '../../context/AuthContext'

export default function DashboardLayout({ title, children }) {
  const { user } = useAuth()
  return (
    <div className="d-flex" style={{ minHeight: '100vh' }}>
      <Sidebar role={user?.role} />
      <div className="d-flex flex-column flex-grow-1" style={{ minWidth: 0 }}>
        <Topbar title={title} />
        <div className="st-content">{children}</div>
      </div>
    </div>
  )
}
