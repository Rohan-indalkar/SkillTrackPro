import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Card from '../../components/common/Card'
import LoadingSkeleton from '../../components/common/LoadingSkeleton'
import ChartTooltip from '../../components/dashboard/ChartTooltip'
import useAsync from '../../hooks/useAsync'
import { exportToCSV } from '../../utils/csvExport'
import { api } from '../../services/mockApi'

const STATUS_COLORS = ['var(--success)', 'var(--warning)']

export default function Reports() {
  const { data, loading } = useAsync(
    () =>
      Promise.all([
        api.students.getAll(),
        api.reports.attendanceTrend(),
        api.reports.batchComparison(),
        api.reports.statusDistribution(),
      ]),
    []
  )

  const [students, attendanceTrend, batchComparison, statusDistribution] = data || [[], [], [], []]

  const handleExportStudents = () => {
    exportToCSV(
      'student-performance-report',
      students.map((s) => ({
        Name: s.name,
        Email: s.email,
        Batch: s.batch,
        'Attendance %': s.attendance,
        Status: s.status,
      }))
    )
  }

  const handlePrint = () => window.print()

  return (
    <DashboardLayout title="Reports & Analytics">
      <div className="d-flex justify-content-end gap-2 mb-3 flex-wrap">
        <button className="btn btn-st-outline btn-sm" onClick={handleExportStudents} disabled={loading}>
          <i className="bi bi-file-earmark-spreadsheet me-1" /> Export Excel (CSV)
        </button>
        <button className="btn btn-st-outline btn-sm" onClick={handlePrint} disabled={loading}>
          <i className="bi bi-file-earmark-pdf me-1" /> Export / Print PDF
        </button>
      </div>

      <div className="row g-3">
        <div className="col-12 col-lg-7">
          <Card title="Institute attendance trend" eyebrow="Last 8 sessions">
            <div className="pulse-line" />
            {loading ? (
              <LoadingSkeleton variant="card" />
            ) : (
              <ResponsiveContainer width="100%" height={240}>
                <AreaChart data={attendanceTrend}>
                  <defs>
                    <linearGradient id="attendanceFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--red)" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="var(--red)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="session" tick={{ fontSize: 12, fill: 'var(--ink-muted)' }} axisLine={{ stroke: 'var(--border)' }} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: 'var(--ink-muted)' }} axisLine={false} tickLine={false} domain={[70, 100]} width={36} />
                  <Tooltip content={<ChartTooltip />} />
                  <Area type="monotone" dataKey="avgAttendance" stroke="var(--red)" strokeWidth={2.5} fill="url(#attendanceFill)" dot={{ r: 3, fill: 'var(--red)' }} activeDot={{ r: 5 }} />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </Card>
        </div>

        <div className="col-12 col-lg-5">
          <Card title="Student status" eyebrow="Active vs. at-risk">
            <div className="pulse-line" />
            {loading ? (
              <LoadingSkeleton variant="card" />
            ) : (
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie
                    data={statusDistribution}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={3}
                  >
                    {statusDistribution.map((entry, i) => (
                      <Cell key={entry.name} fill={STATUS_COLORS[i % STATUS_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<ChartTooltip suffix="" />} />
                  <Legend
                    verticalAlign="bottom"
                    height={24}
                    formatter={(value) => <span style={{ color: 'var(--ink-muted)', fontSize: '0.8rem' }}>{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </Card>
        </div>

        <div className="col-12">
          <Card title="Batch comparison" eyebrow="Avg. attendance by batch">
            <div className="pulse-line" />
            {loading ? (
              <LoadingSkeleton variant="card" />
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={batchComparison}>
                  <CartesianGrid stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'var(--ink-muted)' }} axisLine={{ stroke: 'var(--border)' }} tickLine={false} interval={0} angle={-15} textAnchor="end" height={55} />
                  <YAxis tick={{ fontSize: 12, fill: 'var(--ink-muted)' }} axisLine={false} tickLine={false} domain={[0, 100]} width={36} />
                  <Tooltip content={<ChartTooltip />} cursor={{ fill: 'var(--surface-hover)' }} />
                  <Bar dataKey="attendance" fill="var(--red)" radius={[6, 6, 0, 0]} maxBarSize={48} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </Card>
        </div>

        <div className="col-12">
          <Card title="Student performance summary" eyebrow="All students">
            <div className="pulse-line" />
            {loading ? (
              <LoadingSkeleton variant="rows" rows={5} />
            ) : (
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
                    {students.map((s) => (
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
            )}
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
