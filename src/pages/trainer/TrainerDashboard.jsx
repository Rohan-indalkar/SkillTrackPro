import { Link } from 'react-router-dom'
import DashboardLayout from '../../components/layout/DashboardLayout'
import StatCard from '../../components/cards/StatCard'
import Card from '../../components/common/Card'
import { CURRENT_TRAINER_NAME, batchesData, assignmentsData, topicLogsData, getStudentsByBatch } from '../../data/dummyData'

export default function TrainerDashboard() {
  const myBatches = batchesData.filter((b) => b.trainer === CURRENT_TRAINER_NAME)
  const myAssignments = assignmentsData.filter((a) => myBatches.some((b) => b.name === a.batch))
  const pendingAssignments = myAssignments.filter((a) => a.status === 'Open')
  const myTopics = topicLogsData
    .filter((t) => myBatches.some((b) => b.name === t.batch))
    .slice()
    .sort((a, b) => (a.date < b.date ? 1 : -1))

  const totalStudents = myBatches.reduce((sum, b) => sum + getStudentsByBatch(b.name).length, 0)

  const stats = [
    { label: 'My Batches', value: myBatches.length, icon: 'bi-collection' },
    { label: 'Total Students', value: totalStudents, icon: 'bi-people' },
    { label: 'Pending Assignments', value: pendingAssignments.length, icon: 'bi-clipboard-check' },
    { label: 'Topics Logged', value: myTopics.length, icon: 'bi-journal-text' },
  ]

  return (
    <DashboardLayout title="Trainer Dashboard">
      <div className="row g-3 mb-3">
        {stats.map((s) => (
          <div className="col-12 col-sm-6 col-lg-3" key={s.label}>
            <StatCard {...s} />
          </div>
        ))}
      </div>

      <div className="row g-3">
        <div className="col-12 col-lg-6">
          <Card title="My batches today" eyebrow="Quick access">
            <div className="pulse-line" />
            {myBatches.length === 0 && <p className="text-muted mb-0">No batches assigned yet.</p>}
            <div className="d-flex flex-column gap-2">
              {myBatches.map((b) => (
                <div
                  key={b.id}
                  className="d-flex align-items-center justify-content-between flex-wrap gap-2 p-2"
                  style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)' }}
                >
                  <div>
                    <div style={{ fontWeight: 600 }}>{b.name}</div>
                    <div className="st-eyebrow">{getStudentsByBatch(b.name).length} students &middot; {b.status}</div>
                  </div>
                  <Link to="/trainer/attendance" className="btn btn-sm btn-st-outline">
                    Mark attendance
                  </Link>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="col-12 col-lg-6">
          <Card title="Pending assignments" eyebrow="Needs review">
            <div className="pulse-line" />
            {pendingAssignments.length === 0 && <p className="text-muted mb-0">Nothing pending. Great work!</p>}
            <div className="d-flex flex-column gap-2">
              {pendingAssignments.map((a) => (
                <div key={a.id} className="p-2" style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)' }}>
                  <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
                    <span style={{ fontWeight: 600 }}>{a.title}</span>
                    <span className="st-badge st-badge-warning">Due {a.dueDate}</span>
                  </div>
                  <div className="pulse-progress mt-2">
                    <span style={{ width: `${Math.round((a.submissions / a.totalStudents) * 100)}%` }} />
                  </div>
                  <div className="st-eyebrow mt-1">
                    {a.submissions}/{a.totalStudents} submitted &middot; {a.batch}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="col-12">
          <Card title="Recent topic logs" eyebrow="Last sessions">
            <div className="pulse-line" />
            {myTopics.length === 0 && <p className="text-muted mb-0">Nothing logged yet.</p>}
            <div className="row g-2">
              {myTopics.slice(0, 3).map((t) => (
                <div className="col-12 col-md-4" key={t.id}>
                  <div className="p-2 h-100" style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)' }}>
                    <span className="st-badge st-badge-red">{t.batch}</span>
                    <div style={{ fontWeight: 600, marginTop: 6 }}>{t.topic}</div>
                    <div className="st-eyebrow mt-1">{t.date}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
