import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Card from '../../components/common/Card'
import LoadingSkeleton from '../../components/common/LoadingSkeleton'
import ChartTooltip from '../../components/dashboard/ChartTooltip'
import useAsync from '../../hooks/useAsync'
import { useAuth } from '../../context/AuthContext'
import { api } from '../../services/mockApi'

async function load(email) {
  const student = await api.students.findByEmail(email)
  if (!student) return null
  const myAssessments = await api.marks.getForStudent(student.name, { batch: student.batch })
  return { student, myAssessments }
}

export default function Marks() {
  const { user } = useAuth()
  const { data, loading } = useAsync(() => load(user.email), [user.email])

  const student = data?.student
  const myAssessments = data?.myAssessments || []

  const chartData = myAssessments
    .slice()
    .sort((a, b) => (a.date > b.date ? 1 : -1))
    .map((m) => ({ name: m.title.length > 14 ? m.title.slice(0, 14) + '…' : m.title, percent: m.percent }))

  const average = myAssessments.length
    ? Math.round(myAssessments.reduce((sum, m) => sum + m.percent, 0) / myAssessments.length)
    : 0

  return (
    <DashboardLayout title="Marks">
      <div className="row g-3">
        <div className="col-12 col-lg-5">
          <Card title="Average score" eyebrow={student?.batch}>
            <div className="pulse-line" />
            {loading ? (
              <LoadingSkeleton variant="rows" rows={2} />
            ) : (
              <>
                <div className="stat-number" style={{ fontSize: '2rem' }}>
                  {average}%
                </div>
                <div className="pulse-progress mt-1">
                  <span style={{ width: `${average}%` }} />
                </div>
                <div className="st-eyebrow mt-2">Across {myAssessments.length} assessments</div>
              </>
            )}
          </Card>
        </div>

        <div className="col-12 col-lg-7">
          <Card title="Score trend" eyebrow="By assessment">
            <div className="pulse-line" />
            {loading ? (
              <LoadingSkeleton variant="card" />
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={chartData}>
                  <defs>
                    <linearGradient id="marksFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--red)" stopOpacity={1} />
                      <stop offset="100%" stopColor="var(--red)" stopOpacity={0.6} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 10, fill: 'var(--ink-muted)' }} axisLine={{ stroke: 'var(--border)' }} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: 'var(--ink-muted)' }} axisLine={false} tickLine={false} domain={[0, 100]} width={36} />
                  <Tooltip content={<ChartTooltip />} cursor={{ fill: 'var(--surface-hover)' }} />
                  <Bar dataKey="percent" fill="url(#marksFill)" radius={[6, 6, 0, 0]} maxBarSize={40} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </Card>
        </div>

        <div className="col-12">
          <Card title="All assessments" eyebrow="Detail">
            <div className="pulse-line" />
            {loading ? (
              <LoadingSkeleton variant="rows" rows={3} />
            ) : myAssessments.length === 0 ? (
              <p className="text-muted mb-0">No assessments recorded yet.</p>
            ) : (
              <div className="table-responsive">
                <table className="table table-borderless align-middle mb-0">
                  <thead>
                    <tr className="st-eyebrow">
                      <th>Assessment</th>
                      <th>Date</th>
                      <th>Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {myAssessments.map((m) => (
                      <tr key={m.id}>
                        <td style={{ fontWeight: 600 }}>{m.title}</td>
                        <td className="text-muted">{m.date}</td>
                        <td style={{ minWidth: 140 }}>
                          <div className="pulse-progress">
                            <span style={{ width: `${m.percent}%` }} />
                          </div>
                          <div className="st-eyebrow mt-1">
                            {m.score} / {m.totalMarks} ({m.percent}%)
                          </div>
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
