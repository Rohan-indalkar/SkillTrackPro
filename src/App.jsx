import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import { ToastProvider } from './context/ToastContext'
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
import StudentDashboard from './pages/student/StudentDashboard'
import StudentAttendance from './pages/student/Attendance'
import StudentTopics from './pages/student/Topics'
import StudentAssignments from './pages/student/Assignments'
import StudentMarks from './pages/student/Marks'
import StudentProgress from './pages/student/Progress'
import StudentNotifications from './pages/student/Notifications'

function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
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
          <Route
            path="/student/dashboard"
            element={
              <ProtectedRoute allowedRoles={['STUDENT']}>
                <StudentDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/attendance"
            element={
              <ProtectedRoute allowedRoles={['STUDENT']}>
                <StudentAttendance />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/topics"
            element={
              <ProtectedRoute allowedRoles={['STUDENT']}>
                <StudentTopics />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/assignments"
            element={
              <ProtectedRoute allowedRoles={['STUDENT']}>
                <StudentAssignments />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/marks"
            element={
              <ProtectedRoute allowedRoles={['STUDENT']}>
                <StudentMarks />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/progress"
            element={
              <ProtectedRoute allowedRoles={['STUDENT']}>
                <StudentProgress />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/notifications"
            element={
              <ProtectedRoute allowedRoles={['STUDENT']}>
                <StudentNotifications />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  )
}

export default App
