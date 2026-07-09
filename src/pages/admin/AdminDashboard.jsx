import DashboardLayout from '../../components/layout/DashboardLayout'
import StatCard from '../../components/cards/StatCard'
import Card from '../../components/common/Card'
import LoadingSkeleton from '../../components/common/LoadingSkeleton'
import useAsync from '../../hooks/useAsync'
import { api } from '../../services/mockApi'

export default function AdminDashboard() {
  const { data, loading } = useAsync(
    () =>
      Promise.all([api.students.getAll(), api.trainers.getAll(), api.batches.getAll(), api.topics.getAll()]),
    []
  )

  const [students, trainers, batches, topics] = data || [[], [], [], []]

  const activeTrainers = trainers.filter((t) => t.status === 'Active').length
  const runningBatches = batches.filter((b) => b.status === 'Running').length
  const avgAttendance = students.length
    ? Math.round(students.reduce((sum, s) => sum + s.attendance, 0) / students.length)
    : 0

  const stats = [
    { label: 'Active Students', value: students.length, icon: 'bi-people' },
    { label: 'Active Trainers', value: activeTrainers, icon: 'bi-person-badge' },
    { label: 'Running Batches', value: runningBatches, icon: 'bi-collection' },
    { label: 'Avg. Attendance', value: avgAttendance, suffix: '%', icon: 'bi-check2-square' },
  ]

  const recentBatches = batches
    .filter((b) => b.status === 'Running')
    .map((b) => ({
      ...b,
      studentCount: students.filter((s) => s.batch === b.name).length,
      avgAttendance: (() => {
        const list = students.filter((s) => s.batch === b.name)
        return list.length ? Math.round(list.reduce((sum, s) => sum + s.attendance, 0) / list.length) : 0
      })(),
    }))

  const latestTopics = topics.slice(0, 3)

  return (
    <DashboardLayout title="Admin Dashboard">
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

      <div className="row g-3">
        <div className="col-lg-8">
          <Card title="Batch overview" eyebrow="Live status">
            <div className="pulse-line" />
            {loading ? (
              <LoadingSkeleton variant="rows" rows={3} />
            ) : (
              <table className="table table-borderless align-middle mb-0">
                <thead>
                  <tr className="st-eyebrow">
                    <th>Batch</th>
                    <th>Trainer</th>
                    <th>Attendance</th>
                    <th>Progress</th>
                  </tr>
                </thead>
                <tbody>
                  {recentBatches.map((b) => (
                    <tr key={b.id}>
                      <td style={{ fontWeight: 600 }}>{b.name}</td>
                      <td className="text-muted">{b.trainer}</td>
                      <td>
                        <span className="st-badge st-badge-success">
                          {b.avgAttendance}% &middot; {b.studentCount} students
                        </span>
                      </td>
                      <td style={{ minWidth: 140 }}>
                        <div className="pulse-progress">
                          <span style={{ width: `${b.progress}%` }} />
                        </div>
                        <div className="st-eyebrow mt-1">{b.progress}% syllabus covered</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </Card>
        </div>

        <div className="col-lg-4">
          <Card title="Recent topic logs" eyebrow="Across batches">
            <div className="pulse-line" />
            {loading ? (
              <LoadingSkeleton variant="rows" rows={3} />
            ) : latestTopics.length === 0 ? (
              <p className="text-muted mb-0">No topics logged yet.</p>
            ) : (
              latestTopics.map((t) => (
                <div key={t.id} className="mb-3">
                  <div className="st-badge st-badge-red mb-1">{t.batch}</div>
                  <div style={{ fontWeight: 600 }}>{t.topic}</div>
                  <div className="st-eyebrow">{t.date}</div>
                </div>
              ))
            )}
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
