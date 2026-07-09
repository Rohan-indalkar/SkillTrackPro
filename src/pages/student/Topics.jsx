import DashboardLayout from '../../components/layout/DashboardLayout'
import Card from '../../components/common/Card'
import LoadingSkeleton from '../../components/common/LoadingSkeleton'
import useAsync from '../../hooks/useAsync'
import { useAuth } from '../../context/AuthContext'
import { api } from '../../services/mockApi'

async function load(email) {
  const student = await api.students.findByEmail(email)
  if (!student) return null
  const topics = await api.topics.getAll({ batch: student.batch })
  return { student, topics }
}

export default function Topics() {
  const { user } = useAuth()
  const { data, loading } = useAsync(() => load(user.email), [user.email])

  const student = data?.student
  const topics = data?.topics || []

  return (
    <DashboardLayout title="Topics">
      <Card title="Session history" eyebrow={student?.batch}>
        <div className="pulse-line" />
        {loading ? (
          <LoadingSkeleton variant="rows" rows={3} />
        ) : topics.length === 0 ? (
          <p className="text-muted mb-0">No topics logged yet for your batch.</p>
        ) : (
          <div className="d-flex flex-column gap-3">
            {topics.map((t) => (
              <div key={t.id} className="p-2" style={{ borderLeft: '3px solid var(--red)', paddingLeft: '0.75rem' }}>
                <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
                  <span className="st-badge st-badge-red">{t.course}</span>
                  <span className="st-eyebrow">{t.date}</span>
                </div>
                <div style={{ fontWeight: 600, marginTop: 4 }}>{t.topic}</div>
                {t.duration && <div className="st-eyebrow mt-1">Duration: {t.duration} hrs</div>}
                {t.homework && (
                  <div className="mt-1" style={{ fontSize: '0.85rem' }}>
                    <strong>Homework:</strong> {t.homework}
                  </div>
                )}
                {t.remarks && (
                  <div className="text-muted mt-1" style={{ fontSize: '0.85rem' }}>
                    {t.remarks}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>
    </DashboardLayout>
  )
}
