import { Link } from 'react-router-dom'

export default function Unauthorized() {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center text-center" style={{ minHeight: '100vh' }}>
      <i className="bi bi-shield-lock" style={{ fontSize: '2.5rem', color: 'var(--red)' }} />
      <h3 className="mt-3">You don't have access to this page.</h3>
      <p className="st-eyebrow mb-4">This area is restricted to a different role.</p>
      <Link to="/login" className="btn btn-st-primary">Back to sign in</Link>
    </div>
  )
}
