import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import './Admin.css'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function handleLogin(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (authError) {
      setError(authError.message)
    } else {
      navigate('/admin')
    }
  }

  return (
    <div className="admin-login-page">
      <div className="admin-login-card card">
        <div className="admin-login-icon"><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#C8F560" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2C6.5 2 2 6.5 2 12c0 3 1.5 5.5 3.5 7.5C7 21 9.5 22 12 22c5.5 0 10-4.5 10-10" /><path d="M12 2c3 3 4.5 7 4.5 10" /><path d="M12 2v10" /></svg></div>
        <h1>Admin Login</h1>
        <p>Crunchy Wife Community Dashboard</p>

        <form onSubmit={handleLogin}>
          <div className="form-fields">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            {error && <p className="admin-error">{error}</p>}
            <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
