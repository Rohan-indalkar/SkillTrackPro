import { Link } from 'react-router-dom'
import DashboardLayout from '../../components/layout/DashboardLayout'
import StatCard from '../../components/cards/StatCard'
import Card from '../../components/common/Card'
import LoadingSkeleton from '../../components/common/LoadingSkeleton'
import useAsync from '../../hooks/useAsync'
import { useAuth } from '../../context/AuthContext'
import { api } from '../../services/mockApi'

async function loadDashboard(email) {
  const trainer = await api.trainers.findByEmail(email)
  if (!trainer) return null

  const batches = await api.batches.getByTrainer(trainer.name)
  const studentsByBatch = await Promise.all(batches.map((b) => api.students.getByBatch(b.name)))
  const students = studentsByBatch.flat()

  const assignmentsByBatch = await Promise.all(batches.map((b) => api.assignments.getAll({ batch: b.name })))
  const assignments = assignmentsByBatch.flat()

  const topicsByBatch = await Promise.all(batches.map((b) => api.topics.getAll({ batch: b.name })))
  const topics = topicsByBatch.flat().sort((a, b) => (a.date < b.date ? 1 : -1))

  const insight = batches[0]
    ? await api.ai.batchInsight(
        batches[0].name,
        students.filter((s) => s.batch === batches[0].name),
        (await api.marks.getAll({ batch: batches[0].name }))
      )
    : null

  return { trainer, batches, students, assignments, topics, insight }
}

export default function TrainerDashboard() {
  const { user } = useAuth()
  const { data, loading } = useAsync(() => loadDashboard(user.email), [user.email])

  if (!loading && !data) {
    return (
      <DashboardLayout title="Trainer Dashboard">
        <Card>
          <p className="text-muted mb-0">No trainer profile found for this account.</p>
        </Card>
      </DashboardLayout>
    )
  }

  const batches = data?.batches || []
  const students = data?.students || []
  const assignments = data?.assignments || []
  const topics = data?.topics || []
  const pendingAssignments = assignments.filter((a) => a.status === 'Open')

  const stats = [
    { label: 'My Batches', value: batches.length, icon: 'bi-collection' },
    { label: 'Total Students', value: students.length, icon: 'bi-people' },
    { label: 'Pending Assignments', value: pendingAssignments.length, icon: 'bi-clipboard-check' },
    { label: 'Topics Logged', value: topics.length, icon: 'bi-journal-text' },
  ]

  return (
    <DashboardLayout title="Trainer Dashboard">
      <div className="row g-3 mb-3">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div className="col-12 col-sm-6 col-lg-3" key={i}>
                <LoadingSkeleton variant="stat" />
              </div>
            ))
          : stats.map((s) => (
              <div className="col-12 col-sm-6 col-lg-3" key={s.label}>
                <StatCard {...s} />
              </div>
            ))}
      </div>

      {!loading && data?.insight && (
        <div className="row g-3 mb-3">
          <div className="col-12">
            <Card
              title={
                <span>
                  <i className="bi bi-stars me-2" style={{ color: 'var(--red)' }} />
                  AI Batch Insight
                </span>
              }
              eyebrow="Auto-generated from attendance & marks"
            >
              <div className="pulse-line" />
              <div style={{ fontWeight: 700, marginBottom: 6 }}>{data.insight.headline}</div>
              <ul className="mb-0" style={{ fontSize: '0.88rem', paddingLeft: '1.1rem' }}>
                {data.insight.bullets.map((b, i) => (
                  <li key={i} className="mb-1">
                    {b}
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </div>
      )}

      <div className="row g-3">
        <div className="col-12 col-lg-6">
          <Card title="My batches today" eyebrow="Quick access">
            <div className="pulse-line" />
            {loading ? (
              <LoadingSkeleton variant="rows" rows={2} />
            ) : batches.length === 0 ? (
              <p className="text-muted mb-0">No batches assigned yet.</p>
            ) : (
              <div className="d-flex flex-column gap-2">
                {batches.map((b) => (
                  <div
                    key={b.id}
                    className="d-flex align-items-center justify-content-between flex-wrap gap-2 p-2"
                    style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)' }}
                  >
                    <div>
                      <div style={{ fontWeight: 600 }}>{b.name}</div>
                      <div className="st-eyebrow">
                        {students.filter((s) => s.batch === b.name).length} students &middot; {b.status}
                      </div>
                    </div>
                    <Link to="/trainer/attendance" className="btn btn-sm btn-st-outline">
                      Mark attendance
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        <div className="col-12 col-lg-6">
          <Card title="Pending assignments" eyebrow="Needs review">
            <div className="pulse-line" />
            {loading ? (
              <LoadingSkeleton variant="rows" rows={2} />
            ) : pendingAssignments.length === 0 ? (
              <p className="text-muted mb-0">Nothing pending. Great work!</p>
            ) : (
              <div className="d-flex flex-column gap-2">
                {pendingAssignments.map((a) => (
                  <div key={a.id} className="p-2" style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)' }}>
                    <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
                      <span style={{ fontWeight: 600 }}>{a.title}</span>
                      <span className="st-badge st-badge-warning">Due {a.dueDate}</span>
                    </div>
                    <div className="pulse-progress mt-2">
                      <span style={{ width: `${Math.round((a.submissions / (a.totalStudents || 1)) * 100)}%` }} />
                    </div>
                    <div className="st-eyebrow mt-1">
                      {a.submissions}/{a.totalStudents} submitted &middot; {a.batch}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        <div className="col-12">
          <Card title="Recent topic logs" eyebrow="Last sessions">
            <div className="pulse-line" />
            {loading ? (
              <LoadingSkeleton variant="rows" rows={3} />
            ) : topics.length === 0 ? (
              <p className="text-muted mb-0">Nothing logged yet.</p>
            ) : (
              <div className="row g-2">
                {topics.slice(0, 3).map((t) => (
                  <div className="col-12 col-md-4" key={t.id}>
                    <div className="p-2 h-100" style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)' }}>
                      <span className="st-badge st-badge-red">{t.batch}</span>
                      <div style={{ fontWeight: 600, marginTop: 6 }}>{t.topic}</div>
                      <div className="st-eyebrow mt-1">{t.date}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
