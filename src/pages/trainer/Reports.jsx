import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Card from '../../components/common/Card'
import { exportToCSV } from '../../utils/csvExport'
import {
  CURRENT_TRAINER_NAME,
  batchesData,
  assignmentsData,
  getStudentsByBatch,
  getBatchAvgAttendance,
} from '../../data/dummyData'

export default function Reports() {
  const myBatches = batchesData.filter((b) => b.trainer === CURRENT_TRAINER_NAME)
  const myStudents = myBatches.flatMap((b) => getStudentsByBatch(b.name))
  const myAssignments = assignmentsData.filter((a) => myBatches.some((b) => b.name === a.batch))
  const atRiskStudents = myStudents.filter((s) => s.attendance < 75)

  const batchAttendance = myBatches
    .filter((b) => b.students > 0)
    .map((b) => ({ name: b.name, attendance: getBatchAvgAttendance(b.name) }))

  const handleExport = () => {
    exportToCSV(
      'my-batch-performance',
      myStudents.map((s) => ({ Name: s.name, Batch: s.batch, 'Attendance %': s.attendance, Status: s.status }))
    )
  }

  return (
    <DashboardLayout title="My Reports">
      <div className="d-flex justify-content-end mb-3">
        <button className="btn btn-st-outline btn-sm" onClick={handleExport}>
          <i className="bi bi-file-earmark-spreadsheet me-1" /> Export Excel (CSV)
        </button>
      </div>

      <div className="row g-3">
        <div className="col-12 col-lg-6">
          <Card title="Attendance by my batches" eyebrow="Average %">
            <div className="pulse-line" />
            <ResponsiveContainer width="100%" height={230}>
              <BarChart data={batchAttendance}>
                <CartesianGrid stroke="var(--border)" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="var(--ink-muted)" />
                <YAxis tick={{ fontSize: 12 }} stroke="var(--ink-muted)" domain={[0, 100]} />
                <Tooltip />
                <Bar dataKey="attendance" fill="var(--red)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        <div className="col-12 col-lg-6">
          <Card title="Assignment completion" eyebrow="My assignments">
            <div className="pulse-line" />
            <div className="d-flex flex-column gap-2">
              {myAssignments.map((a) => (
                <div key={a.id}>
                  <div className="d-flex justify-content-between flex-wrap gap-1" style={{ fontSize: '0.85rem' }}>
                    <span style={{ fontWeight: 600 }}>{a.title}</span>
                    <span className="st-eyebrow">
                      {a.submissions}/{a.totalStudents}
                    </span>
                  </div>
                  <div className="pulse-progress mt-1">
                    <span style={{ width: `${Math.round((a.submissions / a.totalStudents) * 100)}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="col-12">
          <Card title="Students needing attention" eyebrow="Attendance below 75%">
            <div className="pulse-line" />
            {atRiskStudents.length === 0 ? (
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
