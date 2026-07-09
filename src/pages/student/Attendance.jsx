import DashboardLayout from '../../components/layout/DashboardLayout'
import Card from '../../components/common/Card'
import LoadingSkeleton from '../../components/common/LoadingSkeleton'
import useAsync from '../../hooks/useAsync'
import { useAuth } from '../../context/AuthContext'
import { api } from '../../services/mockApi'

const STATUS_BADGE = {
  Present: 'st-badge-success',
  Absent: 'st-badge-warning',
  Late: 'st-badge-red',
}

async function load(email) {
  const student = await api.students.findByEmail(email)
  if (!student) return null
  const history = await api.attendance.history(student.id)
  return { student, history }
}

export default function Attendance() {
  const { user } = useAuth()
  const { data, loading } = useAsync(() => load(user.email), [user.email])

  const student = data?.student
  const history = data?.history || []

  const counts = history.reduce(
    (acc, s) => {
      acc[s.status] = (acc[s.status] || 0) + 1
      return acc
    },
    { Present: 0, Absent: 0, Late: 0 }
  )

  return (
    <DashboardLayout title="Attendance">
      <Card title="My attendance" eyebrow={student?.batch}>
        <div className="pulse-line" />

        {loading ? (
          <LoadingSkeleton variant="rows" rows={4} />
        ) : (
          <>
            <div className="row g-3 mb-3">
              <div className="col-12 col-md-4">
                <div className="stat-number" style={{ fontSize: '2rem' }}>
                  {student?.attendance}%
                </div>
                <div className="pulse-progress mt-1">
                  <span style={{ width: `${student?.attendance}%` }} />
                </div>
                <div className="st-eyebrow mt-1">Overall attendance</div>
              </div>
              <div className="col-12 col-md-8 d-flex align-items-center gap-2 flex-wrap">
                <span className="st-badge st-badge-success">Present: {counts.Present}</span>
                <span className="st-badge st-badge-warning">Absent: {counts.Absent}</span>
                <span className="st-badge st-badge-red">Late: {counts.Late}</span>
              </div>
            </div>

            {history.length === 0 ? (
              <p className="text-muted mb-0">No attendance sessions recorded yet.</p>
            ) : (
              <div className="table-responsive">
                <table className="table table-borderless align-middle mb-0">
                  <thead>
                    <tr className="st-eyebrow">
                      <th>Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((s) => (
                      <tr key={s.date}>
                        <td>{s.date}</td>
                        <td>
                          <span className={`st-badge ${STATUS_BADGE[s.status]}`}>{s.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </Card>
    </DashboardLayout>
  )
}
