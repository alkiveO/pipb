import { useState } from 'react'
import { login } from '../services/api'
import './Login.css'

function Login({ onLogin, onRegister }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()

    setError('')
    setLoading(true)

    try {
      const response = await login(email, password)

      const token = response.data.token
      const user = response.data.user

      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))

      console.log('Login berhasil')
      console.log('User:', user)

      alert('Login berhasil!')

      onLogin()
    } catch (error) {
      console.error('Login gagal:', error)

      setError(error.message || 'Login gagal')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <p className="login-label">
            PIPB
          </p>

          <h1>
            Selamat Datang
          </h1>

          <p>
            Masuk untuk melanjutkan ke platform PIPB.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">
              Email
            </label>

            <input
              id="email"
              type="email"
              placeholder="Masukkan email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">
              Password
            </label>

            <input
              id="password"
              type="password"
              placeholder="Masukkan password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              required
            />
          </div>

          {error && (
            <p className="login-error">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="login-button"
            disabled={loading}
          >
            {loading ? 'Memproses...' : 'Login'}
          </button>
        </form>

        <div className="register-link">
          <span>
            Belum punya akun?
          </span>

          <button
            type="button"
            onClick={onRegister}
          >
            Daftar
          </button>
        </div>

        <button
          type="button"
          className="back-button"
          onClick={() => window.history.back()}
        >
          Kembali
        </button>
      </div>
    </div>
  )
}

export default Login