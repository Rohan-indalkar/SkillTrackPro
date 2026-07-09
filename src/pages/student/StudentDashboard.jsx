import DashboardLayout from '../../components/layout/DashboardLayout'
import StatCard from '../../components/cards/StatCard'
import Card from '../../components/common/Card'
import LoadingSkeleton from '../../components/common/LoadingSkeleton'
import useAsync from '../../hooks/useAsync'
import { useAuth } from '../../context/AuthContext'
import { api } from '../../services/mockApi'

async function loadDashboard(email) {
  const student = await api.students.findByEmail(email)
  if (!student) return null

  const [assignments, topics, myAssessments] = await Promise.all([
    api.assignments.getAll({ batch: student.batch }),
    api.topics.getAll({ batch: student.batch }),
    api.marks.getForStudent(student.name, { batch: student.batch }),
  ])

  const recommendation = await api.ai.studyRecommendation(student, myAssessments)

  return { student, assignments, topics, myAssessments, recommendation }
}

export default function StudentDashboard() {
  const { user } = useAuth()
  const { data, loading } = useAsync(() => loadDashboard(user.email), [user.email])

  if (!loading && !data) {
    return (
      <DashboardLayout title="Student Dashboard">
        <Card>
          <p className="text-muted mb-0">No student profile found for this account.</p>
        </Card>
      </DashboardLayout>
    )
  }

  const student = data?.student
  const assignments = data?.assignments || []
  const topics = data?.topics || []
  const myAssessments = data?.myAssessments || []
  const openAssignments = assignments.filter((a) => a.status === 'Open')

  const avgPercent = myAssessments.length
    ? Math.round(myAssessments.reduce((sum, m) => sum + m.percent, 0) / myAssessments.length)
    : 0

  const latestTopic = topics[0]

  const stats = [
    { label: 'Attendance', value: student?.attendance ?? 0, suffix: '%', icon: 'bi-check2-square' },
    { label: 'Open Assignments', value: openAssignments.length, icon: 'bi-clipboard-check' },
    { label: 'Avg. Marks', value: avgPercent, suffix: '%', icon: 'bi-graph-up' },
    { label: 'Batch', value: student?.batch || '—', icon: 'bi-collection' },
  ]

  return (
    <DashboardLayout title="Student Dashboard">
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

      {!loading && data?.recommendation && (
        <div className="row g-3 mb-3">
          <div className="col-12">
            <Card
              title={
                <span>
                  <i className="bi bi-stars me-2" style={{ color: 'var(--red)' }} />
                  AI Study Recommendation
                </span>
              }
              eyebrow="Based on your attendance & scores"
            >
              <div className="pulse-line" />
              <div style={{ fontWeight: 700, marginBottom: 6 }}>{data.recommendation.headline}</div>
              <ul className="mb-0" style={{ fontSize: '0.88rem', paddingLeft: '1.1rem' }}>
                {data.recommendation.bullets.map((b, i) => (
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
          <Card title="Today's topic" eyebrow={student?.batch}>
            <div className="pulse-line" />
            {loading ? (
              <LoadingSkeleton variant="rows" rows={2} />
            ) : latestTopic ? (
              <>
                <div style={{ fontWeight: 600 }}>{latestTopic.topic}</div>
                <div className="st-eyebrow mt-1">{latestTopic.date}</div>
                {latestTopic.homework && (
                  <div className="mt-2" style={{ fontSize: '0.85rem' }}>
                    <strong>Homework:</strong> {latestTopic.homework}
                  </div>
                )}
              </>
            ) : (
              <p className="text-muted mb-0">No topics logged yet for your batch.</p>
            )}
          </Card>
        </div>

        <div className="col-12 col-lg-6">
          <Card title="Assignments due" eyebrow="Upcoming">
            <div className="pulse-line" />
            {loading ? (
              <LoadingSkeleton variant="rows" rows={2} />
            ) : openAssignments.length === 0 ? (
              <p className="text-muted mb-0">Nothing due right now. Nice!</p>
            ) : (
              <div className="d-flex flex-column gap-2">
                {openAssignments.map((a) => (
                  <div
                    key={a.id}
                    className="d-flex align-items-center justify-content-between flex-wrap gap-2 p-2"
                    style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)' }}
                  >
                    <span style={{ fontWeight: 600 }}>{a.title}</span>
                    <span className="st-badge st-badge-warning">Due {a.dueDate}</span>
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
