import DashboardLayout from '../../components/layout/DashboardLayout'
import Card from '../../components/common/Card'
import LoadingSkeleton from '../../components/common/LoadingSkeleton'
import useAsync from '../../hooks/useAsync'
import { useAuth } from '../../context/AuthContext'
import { api } from '../../services/mockApi'

async function load(email) {
  const student = await api.students.findByEmail(email)
  if (!student) return null

  const assignments = await api.assignments.getAll({ batch: student.batch })
  const submissionChecks = await Promise.all(
    assignments.map((a) => api.assignments.getSubmission(a.id, student.id))
  )
  const submittedCount = submissionChecks.filter(Boolean).length
  const assignmentCompletion = assignments.length ? Math.round((submittedCount / assignments.length) * 100) : 100

  const myAssessments = await api.marks.getForStudent(student.name, { batch: student.batch })
  const marksAvg = myAssessments.length
    ? Math.round(myAssessments.reduce((sum, m) => sum + m.percent, 0) / myAssessments.length)
    : 0

  const recommendation = await api.ai.studyRecommendation(student, myAssessments)

  return { student, assignmentCompletion, marksAvg, myAssessments, recommendation }
}

export default function Progress() {
  const { user } = useAuth()
  const { data, loading } = useAsync(() => load(user.email), [user.email])

  if (loading) {
    return (
      <DashboardLayout title="My Progress">
        <LoadingSkeleton variant="card" />
      </DashboardLayout>
    )
  }

  if (!data) {
    return (
      <DashboardLayout title="My Progress">
        <Card>
          <p className="text-muted mb-0">No student profile found for this account.</p>
        </Card>
      </DashboardLayout>
    )
  }

  const { student, assignmentCompletion, marksAvg, myAssessments, recommendation } = data

  const weakest = myAssessments.length ? myAssessments.slice().sort((a, b) => a.percent - b.percent)[0] : null

  const metrics = [
    { label: 'Attendance', value: student.attendance, icon: 'bi-check2-square' },
    { label: 'Assignment Completion', value: assignmentCompletion, icon: 'bi-clipboard-check' },
    { label: 'Marks Average', value: marksAvg, icon: 'bi-graph-up' },
  ]

  const readinessScore = Math.round(metrics.reduce((sum, m) => sum + m.value, 0) / metrics.length)
  const readinessLabel = readinessScore >= 85 ? 'Ready for placement' : readinessScore >= 65 ? 'On track' : 'Needs focus'
  const readinessBadge = readinessScore >= 85 ? 'st-badge-success' : readinessScore >= 65 ? 'st-badge-warning' : 'st-badge-red'

  return (
    <DashboardLayout title="My Progress">
      <div className="row g-3">
        <div className="col-12 col-lg-4">
          <Card title="Placement readiness" eyebrow={student.batch}>
            <div className="pulse-line" />
            <div className="stat-number" style={{ fontSize: '2.2rem' }}>
              {readinessScore}%
            </div>
            <span className={`st-badge ${readinessBadge} mt-2`}>{readinessLabel}</span>
            <div className="st-eyebrow mt-3">Based on attendance, assignments, and marks (equal weight)</div>
          </Card>
        </div>

        <div className="col-12 col-lg-8">
          <Card title="Breakdown" eyebrow="Contributing factors">
            <div className="pulse-line" />
            <div className="d-flex flex-column gap-3">
              {metrics.map((m) => (
                <div key={m.label}>
                  <div className="d-flex justify-content-between mb-1" style={{ fontSize: '0.85rem' }}>
                    <span>
                      <i className={`bi ${m.icon} me-1`} /> {m.label}
                    </span>
                    <span style={{ fontWeight: 600 }}>{m.value}%</span>
                  </div>
                  <div className="pulse-progress">
                    <span style={{ width: `${m.value}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="col-12">
          <Card
            title={
              <span>
                <i className="bi bi-stars me-2" style={{ color: 'var(--red)' }} />
                AI Study Recommendation
              </span>
            }
            eyebrow="Focus area"
          >
            <div className="pulse-line" />
            <div style={{ fontWeight: 700, marginBottom: 6 }}>{recommendation.headline}</div>
            <ul className="mb-0" style={{ fontSize: '0.88rem', paddingLeft: '1.1rem' }}>
              {recommendation.bullets.map((b, i) => (
                <li key={i} className="mb-1">
                  {b}
                </li>
              ))}
            </ul>
            {weakest && (
              <div className="st-eyebrow mt-2">
                Lowest score: {weakest.title} ({weakest.percent}%)
              </div>
            )}
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
