import { useState } from 'react'
import { login } from '../../services/api'
import AuthLayout from '../../components/layout/AuthLayout'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'

function Login({ onLogin, onRegister }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setMessage('')
    setFieldErrors({})
    setLoading(true)

    try {
      const response = await login(email, password)
      const token = response.data.token
      const user = response.data.user

      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))

      if (onLogin) onLogin()
    } catch (error) {
      console.error('Login gagal:', error)

      // Cek apakah error punya validasi field
      if (error?.errors) {
        setFieldErrors(error.errors)
      } else {
        setMessage(error.message || 'Login gagal')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout
      title="Selamat Datang"
      subtitle="Masuk untuk melanjutkan ke platform PIPB."
      footer={
        <>
          Belum punya akun?{' '}
          <button
            type="button"
            onClick={onRegister}
            className="font-semibold text-ink underline decoration-ink/30 underline-offset-4 transition-colors hover:decoration-ink"
          >
            Daftar sekarang
          </button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          id="email"
          label="Email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="nama@email.com"
          error={fieldErrors.email?.[0]}
          required
        />

        <Input
          id="password"
          label="Password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Masukkan password"
          error={fieldErrors.password?.[0]}
          required
        />

        {message && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {message}
          </div>
        )}

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? 'Memproses...' : 'Masuk'}
        </Button>
      </form>
    </AuthLayout>
  )
}

export default Login