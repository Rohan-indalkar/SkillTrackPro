import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Card from '../../components/common/Card'
import { exportToCSV } from '../../utils/csvExport'
import { studentsData, batchesData, attendanceTrendData, getBatchAvgAttendance } from '../../data/dummyData'

const batchComparison = batchesData
  .filter((b) => b.students > 0)
  .map((b) => ({ name: b.name, attendance: getBatchAvgAttendance(b.name) }))

export default function Reports() {
  const handleExportStudents = () => {
    exportToCSV(
      'student-performance-report',
      studentsData.map((s) => ({
        Name: s.name,
        Email: s.email,
        Batch: s.batch,
        'Attendance %': s.attendance,
        Status: s.status,
      }))
    )
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <DashboardLayout title="Reports & Analytics">
      <div className="d-flex justify-content-end gap-2 mb-3 flex-wrap">
        <button className="btn btn-st-outline btn-sm" onClick={handleExportStudents}>
          <i className="bi bi-file-earmark-spreadsheet me-1" /> Export Excel (CSV)
        </button>
        <button className="btn btn-st-outline btn-sm" onClick={handlePrint}>
          <i className="bi bi-file-earmark-pdf me-1" /> Export / Print PDF
        </button>
      </div>

      <div className="row g-3">
        <div className="col-12 col-lg-6">
          <Card title="Institute attendance trend" eyebrow="Last 8 sessions">
            <div className="pulse-line" />
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={attendanceTrendData}>
                <CartesianGrid stroke="var(--border)" vertical={false} />
                <XAxis dataKey="session" tick={{ fontSize: 12 }} stroke="var(--ink-muted)" />
                <YAxis tick={{ fontSize: 12 }} stroke="var(--ink-muted)" domain={[70, 100]} />
                <Tooltip />
                <Line type="monotone" dataKey="avgAttendance" stroke="var(--red)" strokeWidth={2.5} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </div>

        <div className="col-12 col-lg-6">
          <Card title="Batch comparison" eyebrow="Avg. attendance by batch">
            <div className="pulse-line" />
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={batchComparison}>
                <CartesianGrid stroke="var(--border)" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="var(--ink-muted)" interval={0} angle={-15} textAnchor="end" height={50} />
                <YAxis tick={{ fontSize: 12 }} stroke="var(--ink-muted)" domain={[0, 100]} />
                <Tooltip />
                <Bar dataKey="attendance" fill="var(--red)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        <div className="col-12">
          <Card title="Student performance summary" eyebrow="All students">
            <div className="pulse-line" />
            <div className="table-responsive">
              <table className="table table-borderless align-middle mb-0">
                <thead>
                  <tr className="st-eyebrow">
                    <th>Name</th>
                    <th>Batch</th>
                    <th>Attendance</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {studentsData.map((s) => (
                    <tr key={s.id}>
                      <td style={{ fontWeight: 600 }}>{s.name}</td>
                      <td className="text-muted">{s.batch}</td>
                      <td style={{ minWidth: 140 }}>
                        <div className="pulse-progress">
                          <span style={{ width: `${s.attendance}%` }} />
                        </div>
                        <div className="st-eyebrow mt-1">{s.attendance}%</div>
                      </td>
                      <td>
                        <span className={`st-badge ${s.status === 'At Risk' ? 'st-badge-warning' : 'st-badge-success'}`}>
                          {s.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
