import { useState } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Card from '../../components/common/Card'
import LoadingSkeleton from '../../components/common/LoadingSkeleton'
import EmptyState from '../../components/common/EmptyState'
import useCrudAsync from '../../hooks/useCrudAsync'
import { useToast } from '../../context/ToastContext'
import { api } from '../../services/mockApi'

const TYPES = ['All', 'Announcement', 'Assignment', 'Attendance', 'Quiz']

const TYPE_BADGE = {
  Announcement: 'st-badge-red',
  Assignment: 'st-badge-success',
  Attendance: 'st-badge-warning',
  Quiz: 'st-badge-success',
}

export default function Notifications() {
  const { items, loading, reload } = useCrudAsync(() => api.notifications.getForRole('ADMIN'), api.notifications)
  const toast = useToast()
  const [filter, setFilter] = useState('All')
  const [broadcastOpen, setBroadcastOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)

  const visible = (filter === 'All' ? items : items.filter((n) => n.type === filter))

  const unreadCount = items.filter((n) => !n.read).length

  const markRead = async (id) => {
    await api.notifications.markRead(id)
    reload()
  }

  const markAllRead = async () => {
    await api.notifications.markAllRead('ADMIN')
    reload()
    toast.success('All notifications marked as read.')
  }

  const handleBroadcast = async (e) => {
    e.preventDefault()
    if (!title.trim()) return
    setSending(true)
    await api.notifications.broadcast({ title, message })
    setSending(false)
    setTitle('')
    setMessage('')
    setBroadcastOpen(false)
    reload()
    toast.success('Announcement sent to everyone.')
  }

  return (
    <DashboardLayout title="Notifications">
      <div className="row g-3">
        <div className="col-12 col-lg-8">
          <Card
            title="All notifications"
            eyebrow={`${unreadCount} unread`}
            action={
              <button className="btn btn-sm btn-st-outline" onClick={markAllRead} disabled={unreadCount === 0}>
                Mark all read
              </button>
            }
          >
            <div className="pulse-line" />

            <div className="d-flex flex-wrap gap-2 mb-3">
              {TYPES.map((t) => (
                <button
                  key={t}
                  className={t === filter ? 'btn btn-st-primary btn-sm' : 'btn btn-st-outline btn-sm'}
                  onClick={() => setFilter(t)}
                >
                  {t}
                </button>
              ))}
            </div>

            {loading ? (
              <LoadingSkeleton variant="rows" rows={4} />
            ) : visible.length === 0 ? (
              <EmptyState icon="bi-bell" title="No notifications in this category" />
            ) : (
              <div className="d-flex flex-column gap-2">
                {visible.map((n) => (
                  <div
                    key={n.id}
                    className="d-flex justify-content-between align-items-start flex-wrap gap-2 p-2"
                    style={{
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius-sm)',
                      background: n.read ? 'transparent' : 'var(--red-tint)',
                    }}
                  >
                    <div style={{ minWidth: 0 }}>
                      <div className="d-flex align-items-center gap-2 flex-wrap">
                        <span className={`st-badge ${TYPE_BADGE[n.type] || 'st-badge-success'}`}>{n.type}</span>
                        <span className="st-eyebrow">{n.date}</span>
                        {!n.read && <span className="st-badge st-badge-red">New</span>}
                      </div>
                      <div style={{ fontWeight: 600, marginTop: 4 }}>{n.title}</div>
                      <div className="text-muted" style={{ fontSize: '0.85rem' }}>
                        {n.message}
                      </div>
                    </div>
                    {!n.read && (
                      <button className="btn btn-sm btn-st-outline flex-shrink-0" onClick={() => markRead(n.id)}>
                        Mark read
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        <div className="col-12 col-lg-4">
          <Card title="Broadcast an announcement" eyebrow="Send to everyone">
            <div className="pulse-line" />
            {!broadcastOpen ? (
              <button className="btn btn-st-primary w-100" onClick={() => setBroadcastOpen(true)}>
                <i className="bi bi-megaphone me-1" /> New announcement
              </button>
            ) : (
              <form onSubmit={handleBroadcast}>
                <div className="mb-2">
                  <label className="form-label st-eyebrow">Title</label>
                  <input className="form-control" value={title} onChange={(e) => setTitle(e.target.value)} required />
                </div>
                <div className="mb-3">
                  <label className="form-label st-eyebrow">Message</label>
                  <textarea className="form-control" rows={3} value={message} onChange={(e) => setMessage(e.target.value)} />
                </div>
                <div className="d-flex gap-2">
                  <button type="submit" className="btn btn-st-primary flex-grow-1" disabled={sending}>
                    {sending ? 'Sending…' : 'Send'}
                  </button>
                  <button type="button" className="btn btn-st-outline" onClick={() => setBroadcastOpen(false)}>
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
