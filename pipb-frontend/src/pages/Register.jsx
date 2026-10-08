import { useState } from 'react'
import { register } from '../services/api'
import './Register.css'

function Register({ onRegister }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirmation, setPasswordConfirmation] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()

    setError('')

    if (password !== passwordConfirmation) {
      setError('Konfirmasi password tidak sama.')
      return
    }

    setLoading(true)

    try {
      await register(
        name,
        email,
        password,
        passwordConfirmation
      )

      alert('Registrasi berhasil! Silakan login.')

      onRegister()
    } catch (error) {
      console.error('Registrasi gagal:', error)

      setError(error.message || 'Registrasi gagal')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="register-page">
      <div className="register-card">
        <div className="register-header">
          <p className="register-label">
            PIPB
          </p>

          <h1>Buat Akun</h1>

          <p>
            Daftar sebagai mahasiswa untuk mulai
            mengembangkan produk di PIPB.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">
              Nama
            </label>

            <input
              id="name"
              type="text"
              placeholder="Masukkan nama"
              value={name}
              onChange={(event) =>
                setName(event.target.value)
              }
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="register-email">
              Email
            </label>

            <input
              id="register-email"
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
            <label htmlFor="register-password">
              Password
            </label>

            <input
              id="register-password"
              type="password"
              placeholder="Minimal 8 karakter"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              minLength={8}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password-confirmation">
              Konfirmasi Password
            </label>

            <input
              id="password-confirmation"
              type="password"
              placeholder="Ulangi password"
              value={passwordConfirmation}
              onChange={(event) =>
                setPasswordConfirmation(event.target.value)
              }
              minLength={8}
              required
            />
          </div>

          {error && (
            <p className="register-error">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="register-button"
            disabled={loading}
          >
            {loading ? 'Mendaftarkan...' : 'Daftar'}
          </button>
        </form>

        <button
          type="button"
          className="back-button"
          onClick={onRegister}
        >
          Kembali ke Login
        </button>
      </div>
    </div>
  )
}

export default Register