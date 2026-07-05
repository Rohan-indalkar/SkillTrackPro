import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const ROLE_HOME = {
  ADMIN: '/admin/dashboard',
  TRAINER: '/trainer/dashboard',
  STUDENT: '/student/dashboard',
}

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    const result = login(email, password)
    if (!result.success) {
      setError(result.message)
      return
    }
    navigate(ROLE_HOME[result.user.role])
  }

  return (
    <div className="d-flex" style={{ minHeight: '100vh' }}>
      {/* Left panel — brand / signature */}
      <div
        className="d-none d-md-flex flex-column justify-content-between p-5"
        style={{ width: '42%', background: 'var(--ink)', color: '#fff' }}
      >
        <div>
          <div className="d-flex align-items-center gap-2 mb-5">
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--red)', display: 'inline-block' }} />
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.2rem' }}>
              SkillTrack Pro
            </span>
          </div>
          <h1 style={{ fontSize: '2.1rem', lineHeight: 1.25, maxWidth: 380 }}>
            One dashboard, <span style={{ color: '#ff5470' }}>zero spreadsheets.</span>
          </h1>
          <p style={{ color: '#c9c3c2', maxWidth: 360, marginTop: '1rem' }}>
            Attendance, daily topics, marks and progress — tracked live, not
            reconstructed at the end of the month.
          </p>
        </div>

        {/* Signature: pulse line ticking upward, standing in for a live attendance/progress feed */}
        <div>
          <div className="st-eyebrow" style={{ color: '#9b9392' }}>Today's Batch — Java Full Stack A</div>
          <div className="d-flex align-items-end gap-2 mt-3" style={{ height: 60 }}>
            {[38, 52, 45, 60, 70, 55, 80, 66, 90].map((h, i) => (
              <div
                key={i}
                style={{
                  width: 8,
                  height: `${h}%`,
                  borderRadius: 4,
                  background: i === 8 ? 'var(--red)' : 'rgba(255,255,255,0.18)',
                }}
              />
            ))}
          </div>
          <div className="st-eyebrow mt-2" style={{ color: '#9b9392' }}>
            Attendance trend, last 9 sessions
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="d-flex flex-column justify-content-center align-items-center flex-grow-1 p-4">
        <div style={{ width: '100%', maxWidth: 380 }}>
          <h3 className="mb-1">Sign in</h3>
          <p className="st-eyebrow mb-4">Use your institute credentials</p>

          {error && (
            <div className="st-badge st-badge-warning mb-3" style={{ display: 'block', padding: '0.6rem 0.9rem' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label st-eyebrow">Email</label>
              <input
                type="email"
                className="form-control"
                placeholder="you@skilltrack.dev"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label st-eyebrow">Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-st-primary w-100 mt-2">
              Sign in
            </button>
          </form>

          <div className="pulse-line" />
          <div className="st-eyebrow mb-2">Demo accounts</div>
          <ul style={{ fontSize: '0.8rem', color: 'var(--ink-muted)', paddingLeft: '1rem' }}>
            <li>admin@skilltrack.dev / admin123</li>
            <li>trainer@skilltrack.dev / trainer123</li>
            <li>student@skilltrack.dev / student123</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
