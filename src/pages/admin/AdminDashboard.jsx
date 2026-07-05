import DashboardLayout from '../../components/layout/DashboardLayout'
import StatCard from '../../components/cards/StatCard'
import Card from '../../components/common/Card'
import { adminStats, recentBatches, todaysTopics } from '../../data/dummyData'

export default function AdminDashboard() {
  return (
    <DashboardLayout title="Admin Dashboard">
      <div className="row g-3 mb-3">
        {adminStats.map((s) => (
          <div className="col-6 col-lg-3" key={s.label}>
            <StatCard {...s} />
          </div>
        ))}
      </div>

      <div className="row g-3">
        <div className="col-lg-8">
          <Card title="Batch overview" eyebrow="Live status">
            <div className="pulse-line" />
            <table className="table table-borderless align-middle mb-0">
              <thead>
                <tr className="st-eyebrow">
                  <th>Batch</th>
                  <th>Trainer</th>
                  <th>Today</th>
                  <th>Progress</th>
                </tr>
              </thead>
              <tbody>
                {recentBatches.map((b) => (
                  <tr key={b.name}>
                    <td style={{ fontWeight: 600 }}>{b.name}</td>
                    <td className="text-muted">{b.trainer}</td>
                    <td>
                      <span className="st-badge st-badge-success">
                        {b.attendanceToday}/{b.students} present
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
          </Card>
        </div>

        <div className="col-lg-4">
          <Card title="Today's topics" eyebrow="Across batches">
            <div className="pulse-line" />
            {todaysTopics.map((t) => (
              <div key={t.batch} className="mb-3">
                <div className="st-badge st-badge-red mb-1">{t.batch}</div>
                <div style={{ fontWeight: 600 }}>{t.topic}</div>
                <div className="st-eyebrow">by {t.trainer}</div>
              </div>
            ))}
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
