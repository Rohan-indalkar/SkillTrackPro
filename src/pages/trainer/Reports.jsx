import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Card from '../../components/common/Card'
import LoadingSkeleton from '../../components/common/LoadingSkeleton'
import ChartTooltip from '../../components/dashboard/ChartTooltip'
import useAsync from '../../hooks/useAsync'
import { useAuth } from '../../context/AuthContext'
import { exportToCSV } from '../../utils/csvExport'
import { api } from '../../services/mockApi'

async function loadReports(email) {
  const trainer = await api.trainers.findByEmail(email)
  if (!trainer) return null
  const batches = await api.batches.getByTrainer(trainer.name)
  const studentsByBatch = await Promise.all(batches.map((b) => api.students.getByBatch(b.name)))
  const students = studentsByBatch.flat()
  const assignmentsByBatch = await Promise.all(batches.map((b) => api.assignments.getAll({ batch: b.name })))
  const assignments = assignmentsByBatch.flat()
  const batchAttendance = batches
    .filter((b) => students.some((s) => s.batch === b.name))
    .map((b) => ({ name: b.name, attendance: api.reports.batchAvgAttendance(b.name) }))

  return { students, assignments, batchAttendance }
}

export default function Reports() {
  const { user } = useAuth()
  const { data, loading } = useAsync(() => loadReports(user.email), [user.email])

  const students = data?.students || []
  const assignments = data?.assignments || []
  const batchAttendance = data?.batchAttendance || []
  const atRiskStudents = students.filter((s) => s.attendance < 75)

  const handleExport = () => {
    exportToCSV(
      'my-batch-performance',
      students.map((s) => ({ Name: s.name, Batch: s.batch, 'Attendance %': s.attendance, Status: s.status }))
    )
  }

  return (
    <DashboardLayout title="My Reports">
      <div className="d-flex justify-content-end mb-3">
        <button className="btn btn-st-outline btn-sm" onClick={handleExport} disabled={loading}>
          <i className="bi bi-file-earmark-spreadsheet me-1" /> Export Excel (CSV)
        </button>
      </div>

      <div className="row g-3">
        <div className="col-12 col-lg-6">
          <Card title="Attendance by my batches" eyebrow="Average %">
            <div className="pulse-line" />
            {loading ? (
              <LoadingSkeleton variant="card" />
            ) : (
              <ResponsiveContainer width="100%" height={230}>
                <BarChart data={batchAttendance}>
                  <CartesianGrid stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'var(--ink-muted)' }} axisLine={{ stroke: 'var(--border)' }} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: 'var(--ink-muted)' }} axisLine={false} tickLine={false} domain={[0, 100]} width={36} />
                  <Tooltip content={<ChartTooltip />} cursor={{ fill: 'var(--surface-hover)' }} />
                  <Bar dataKey="attendance" fill="var(--red)" radius={[6, 6, 0, 0]} maxBarSize={48} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </Card>
        </div>

        <div className="col-12 col-lg-6">
          <Card title="Assignment completion" eyebrow="My assignments">
            <div className="pulse-line" />
            {loading ? (
              <LoadingSkeleton variant="rows" rows={3} />
            ) : assignments.length === 0 ? (
              <p className="text-muted mb-0">No assignments yet.</p>
            ) : (
              <div className="d-flex flex-column gap-2">
                {assignments.map((a) => (
                  <div key={a.id}>
                    <div className="d-flex justify-content-between flex-wrap gap-1" style={{ fontSize: '0.85rem' }}>
                      <span style={{ fontWeight: 600 }}>{a.title}</span>
                      <span className="st-eyebrow">
                        {a.submissions}/{a.totalStudents}
                      </span>
                    </div>
                    <div className="pulse-progress mt-1">
                      <span style={{ width: `${Math.round((a.submissions / (a.totalStudents || 1)) * 100)}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        <div className="col-12">
          <Card title="Students needing attention" eyebrow="Attendance below 75%">
            <div className="pulse-line" />
            {loading ? (
              <LoadingSkeleton variant="rows" rows={2} />
            ) : atRiskStudents.length === 0 ? (
              <p className="text-muted mb-0">No students currently below the attendance threshold. Nice work!</p>
            ) : (
              <div className="table-responsive">
                <table className="table table-borderless align-middle mb-0">
                  <thead>
                    <tr className="st-eyebrow">
                      <th>Name</th>
                      <th>Batch</th>
                      <th>Attendance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {atRiskStudents.map((s) => (
                      <tr key={s.id}>
                        <td style={{ fontWeight: 600 }}>{s.name}</td>
                        <td className="text-muted">{s.batch}</td>
                        <td>
                          <span className="st-badge st-badge-warning">{s.attendance}%</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
