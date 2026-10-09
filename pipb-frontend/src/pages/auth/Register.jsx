import { useState } from 'react'
import { register } from '../../services/api'
import AuthLayout from '../../components/layout/AuthLayout'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'

function Register({ onRegister }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirmation, setPasswordConfirmation] = useState('')
  const [message, setMessage] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setMessage('')
    setFieldErrors({})

    if (password !== passwordConfirmation) {
      setFieldErrors({
        password_confirmation: ['Konfirmasi password tidak sama.'],
      })
      return
    }

    setLoading(true)

    try {
      await register(name, email, password, passwordConfirmation)
      if (onRegister) onRegister()
    } catch (error) {
      console.error('Registrasi gagal:', error)

      if (error?.errors) {
        setFieldErrors(error.errors)
      } else {
        setMessage(error.message || 'Registrasi gagal')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout
      title="Buat Akun"
      subtitle="Daftar untuk mulai mengembangkan produk di PIPB."
      footer={
        <>
          Sudah punya akun?{' '}
          <button
            type="button"
            onClick={onRegister}
            className="font-semibold text-ink underline decoration-ink/30 underline-offset-4 transition-colors hover:decoration-ink"
          >
            Masuk sekarang
          </button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          id="name"
          label="Nama Lengkap"
          type="text"
          autoComplete="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Masukkan nama lengkap"
          error={fieldErrors.name?.[0]}
          required
        />

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
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Minimal 8 karakter"
          error={fieldErrors.password?.[0]}
          minLength={8}
          required
        />

        <Input
          id="password_confirmation"
          label="Konfirmasi Password"
          type="password"
          autoComplete="new-password"
          value={passwordConfirmation}
          onChange={(e) => setPasswordConfirmation(e.target.value)}
          placeholder="Ulangi password"
          error={fieldErrors.password_confirmation?.[0]}
          minLength={8}
          required
        />

        {message && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {message}
          </div>
        )}

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? 'Mendaftarkan...' : 'Buat Akun'}
        </Button>

        <p className="text-center text-xs text-muted">
          Dengan mendaftar, kamu menyetujui syarat dan ketentuan PIPB.
        </p>
      </form>
    </AuthLayout>
  )
}

export default Register