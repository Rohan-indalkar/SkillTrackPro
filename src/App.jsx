import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './routes/ProtectedRoute'

import Login from './pages/auth/Login'
import NotFound from './pages/errors/NotFound'
import Unauthorized from './pages/errors/Unauthorized'
import AdminDashboard from './pages/admin/AdminDashboard'
import Trainers from './pages/admin/Trainers'
import Students from './pages/admin/Students'
import Batches from './pages/admin/Batches'
import Courses from './pages/admin/Courses'
import AdminReports from './pages/admin/Reports'
import AdminNotifications from './pages/admin/Notifications'
import TrainerDashboard from './pages/trainer/TrainerDashboard'
import Attendance from './pages/trainer/Attendance'
import Topics from './pages/trainer/Topics'
import Assignments from './pages/trainer/Assignments'
import Marks from './pages/trainer/Marks'
import TrainerReports from './pages/trainer/Reports'
import TrainerNotifications from './pages/trainer/Notifications'
import PlaceholderPage from './pages/PlaceholderPage'

function App() {
  return (
    <AuthProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Admin */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/trainers"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <Trainers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/students"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <Students />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/batches"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <Batches />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/courses"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <Courses />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/reports"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminReports />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/notifications"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminNotifications />
              </ProtectedRoute>
            }
          />

          {/* Trainer */}
          <Route
            path="/trainer/dashboard"
            element={
              <ProtectedRoute allowedRoles={['TRAINER']}>
                <TrainerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/trainer/attendance"
            element={
              <ProtectedRoute allowedRoles={['TRAINER']}>
                <Attendance />
              </ProtectedRoute>
            }
          />
          <Route
            path="/trainer/topics"
            element={
              <ProtectedRoute allowedRoles={['TRAINER']}>
                <Topics />
              </ProtectedRoute>
            }
          />
          <Route
            path="/trainer/assignments"
            element={
              <ProtectedRoute allowedRoles={['TRAINER']}>
                <Assignments />
              </ProtectedRoute>
            }
          />
          <Route
            path="/trainer/marks"
            element={
              <ProtectedRoute allowedRoles={['TRAINER']}>
                <Marks />
              </ProtectedRoute>
            }
          />
          <Route
            path="/trainer/reports"
            element={
              <ProtectedRoute allowedRoles={['TRAINER']}>
                <TrainerReports />
              </ProtectedRoute>
            }
          />
          <Route
            path="/trainer/notifications"
            element={
              <ProtectedRoute allowedRoles={['TRAINER']}>
                <TrainerNotifications />
              </ProtectedRoute>
            }
          />

          {/* Student */}
          {['dashboard', 'attendance', 'topics', 'assignments', 'marks', 'progress'].map((slug) => (
            <Route
              key={slug}
              path={`/student/${slug}`}
              element={
                <ProtectedRoute allowedRoles={['STUDENT']}>
                  <PlaceholderPage title={`Student ${slug[0].toUpperCase() + slug.slice(1)}`} />
                </ProtectedRoute>
              }
            />
          ))}

          <Route path="*" element={<NotFound />} />
        </Routes>
    </AuthProvider>
  )
}

export default App
