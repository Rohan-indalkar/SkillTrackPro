import { useState } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Card from '../../components/common/Card'
import useCrud from '../../hooks/useCrud'
import { notificationsData } from '../../data/dummyData'

const TYPES = ['All', 'Announcement', 'Assignment', 'Attendance', 'Quiz']

const TYPE_BADGE = {
  Announcement: 'st-badge-red',
  Assignment: 'st-badge-success',
  Attendance: 'st-badge-warning',
  Quiz: 'st-badge-success',
}

export default function Notifications() {
  const { items, update } = useCrud(notificationsData)
  const [filter, setFilter] = useState('All')

  const visible = (filter === 'All' ? items : items.filter((n) => n.type === filter))
    .slice()
    .sort((a, b) => (a.date < b.date ? 1 : -1))

  const unreadCount = items.filter((n) => !n.read).length

  const markRead = (id) => update(id, { read: true })
  const markAllRead = () => items.forEach((n) => !n.read && update(n.id, { read: true }))

  return (
    <DashboardLayout title="Notifications">
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

        {visible.length === 0 && <p className="text-muted mb-0">No notifications in this category.</p>}

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
      </Card>
    </DashboardLayout>
  )
}
