import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center text-center" style={{ minHeight: '100vh' }}>
      <div className="stat-number" style={{ fontSize: '4rem', color: 'var(--red)' }}>404</div>
      <h3 className="mt-2">This page hasn't been marked present.</h3>
      <p className="st-eyebrow mb-4">The page you're looking for doesn't exist or was moved.</p>
      <Link to="/login" className="btn btn-st-primary">Back to sign in</Link>
    </div>
  )
}
