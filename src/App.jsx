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
          {['reports', 'notifications'].map((slug) => (
            <Route
              key={slug}
              path={`/admin/${slug}`}
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <PlaceholderPage title={slug[0].toUpperCase() + slug.slice(1)} />
                </ProtectedRoute>
              }
            />
          ))}

          {/* Trainer */}
          {['dashboard', 'attendance', 'topics', 'assignments', 'marks', 'reports'].map((slug) => (
            <Route
              key={slug}
              path={`/trainer/${slug}`}
              element={
                <ProtectedRoute allowedRoles={['TRAINER']}>
                  <PlaceholderPage title={`Trainer ${slug[0].toUpperCase() + slug.slice(1)}`} />
                </ProtectedRoute>
              }
            />
          ))}

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
