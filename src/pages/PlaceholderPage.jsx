import DashboardLayout from '../components/layout/DashboardLayout'
import Card from '../components/common/Card'

// Used for Day 2-5 pages before their real UI is built.
// Swap each one out module by module per the roadmap.
export default function PlaceholderPage({ title }) {
  return (
    <DashboardLayout title={title}>
      <Card eyebrow="Coming up next" title={title}>
        <div className="pulse-line" />
        <p className="text-muted mb-0">
          This module is scheduled next on the build roadmap. Swap this placeholder
          for the real page once its dummy data and components are ready.
        </p>
      </Card>
    </DashboardLayout>
  )
}
