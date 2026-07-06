import { useState } from 'react'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import { useAuth } from '../../context/AuthContext'

export default function DashboardLayout({ title, children }) {
  const { user } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="d-flex" style={{ minHeight: '100vh' }}>
      <Sidebar role={user?.role} open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="d-flex flex-column flex-grow-1" style={{ minWidth: 0 }}>
        <Topbar title={title} onToggleSidebar={() => setSidebarOpen((v) => !v)} />
        <div className="st-content">{children}</div>
      </div>
    </div>
  )
}
