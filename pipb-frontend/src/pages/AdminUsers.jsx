import { useEffect, useState } from 'react'
import {
  getAdminUsers,
  createAdminUser,
  updateAdminUser,
  deleteAdminUser,
} from '../services/api'
import Container from '../components/ui/Container'
import Navbar from '../components/layout/Navbar'

function AdminUsers({ onBack, onNavigate, page }) {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [processing, setProcessing] = useState(null)

  const [showForm, setShowForm] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'mahasiswa',
  })

  const fetchUsers = async () => {
    try {
      setError('')
      const response = await getAdminUsers()
      setUsers(response.data || [])
    } catch (error) {
      console.error('Gagal mengambil data user:', error)
      setError(error.message || 'Gagal mengambil data user')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const resetForm = () => {
    setForm({ name: '', email: '', password: '', role: 'mahasiswa' })
    setEditingUser(null)
    setShowForm(false)
  }

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({
      ...current,
      [name]: value,
    }))
  }

  const handleCreate = () => {
    setEditingUser(null)
    setForm({ name: '', email: '', password: '', role: 'mahasiswa' })
    setShowForm(true)
    setError('')
  }

  const handleEdit = (user) => {
    setEditingUser(user)
    setForm({
      name: user.name || '',
      email: user.email || '',
      password: '',
      role: user.role || 'mahasiswa',
    })
    setShowForm(true)
    setError('')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!form.name.trim()) {
      setError('Nama user wajib diisi.')
      return
    }
    if (!form.email.trim()) {
      setError('Email user wajib diisi.')
      return
    }
    if (!editingUser && !form.password.trim()) {
      setError('Password wajib diisi saat membuat user.')
      return
    }

    try {
      setProcessing(editingUser ? editingUser.id : 'create')
      setError('')

      const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
        role: form.role,
      }

      if (form.password.trim()) {
        payload.password = form.password.trim()
      }

      if (editingUser) {
        await updateAdminUser(editingUser.id, payload)
      } else {
        await createAdminUser(payload)
      }

      resetForm()
      await fetchUsers()
    } catch (error) {
      console.error('Gagal menyimpan user:', error)
      setError(error.message || 'Gagal menyimpan user')
    } finally {
      setProcessing(null)
    }
  }

  const handleDelete = async (user) => {
    const confirmed = window.confirm(
      `Yakin ingin menghapus akun ${user.name}?`
    )
    if (!confirmed) return

    try {
      setProcessing(user.id)
      setError('')
      await deleteAdminUser(user.id)
      await fetchUsers()
    } catch (error) {
      console.error('Gagal menghapus user:', error)
      setError(error.message || 'Gagal menghapus user')
    } finally {
      setProcessing(null)
    }
  }

  const getRoleLabel = (role) => {
    if (role === 'admin') return 'Admin'
    if (role === 'content_manager') return 'Content Manager'
    return 'Mahasiswa'
  }

  return (
    <div className="min-h-screen bg-paper">
      <Navbar authenticated onNavigate={onNavigate} page={page || 'admin-users'} />

      <main className="pb-24 pt-16">
        <Container>
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-muted">
                Admin
              </p>
              <h1 className="mt-4 font-sans text-4xl font-bold tracking-tight text-ink md:text-5xl">
                Kelola User
              </h1>
              <p className="mt-3 max-w-xl leading-relaxed text-muted">
                Kelola akun Admin, Content Manager, dan Mahasiswa.
              </p>
            </div>

            <button
              type="button"
              onClick={handleCreate}
              className="self-start rounded-full bg-ink px-6 py-3 text-sm font-medium text-paper transition-colors hover:bg-ink/85 md:self-auto"
            >
              Tambah User
            </button>
          </div>

          {error && (
            <div className="mt-8 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {showForm && (
            <div className="mt-10 rounded-2xl border border-line bg-surface/50 p-6 md:p-8">
              <h2 className="font-sans text-xl font-bold tracking-tight text-ink">
                {editingUser ? 'Edit User' : 'Tambah User'}
              </h2>

              <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                <div className="space-y-2">
                  <label htmlFor="name" className="block text-sm font-medium text-ink">
                    Nama
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Nama user"
                    required
                    className="w-full rounded-lg border border-line bg-paper px-4 py-2.5 text-sm text-ink outline-none transition focus:border-ink focus:ring-2 focus:ring-ink/10"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium text-ink">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Email user"
                    required
                    className="w-full rounded-lg border border-line bg-paper px-4 py-2.5 text-sm text-ink outline-none transition focus:border-ink focus:ring-2 focus:ring-ink/10"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="password" className="block text-sm font-medium text-ink">
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder={
                      editingUser
                        ? 'Kosongkan jika tidak ingin mengganti'
                        : 'Password user'
                    }
                    required={!editingUser}
                    className="w-full rounded-lg border border-line bg-paper px-4 py-2.5 text-sm text-ink outline-none transition focus:border-ink focus:ring-2 focus:ring-ink/10"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="role" className="block text-sm font-medium text-ink">
                    Role
                  </label>
                  <select
                    id="role"
                    name="role"
                    value={form.role}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-line bg-paper px-4 py-2.5 text-sm text-ink outline-none transition focus:border-ink focus:ring-2 focus:ring-ink/10"
                  >
                    <option value="admin">Admin</option>
                    <option value="content_manager">Content Manager</option>
                    <option value="mahasiswa">Mahasiswa</option>
                  </select>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    type="submit"
                    disabled={processing !== null}
                    className="rounded-full bg-ink px-6 py-2.5 text-sm font-medium text-paper transition-colors hover:bg-ink/85 disabled:opacity-50"
                  >
                    {processing !== null
                      ? 'Menyimpan...'
                      : editingUser
                        ? 'Simpan Perubahan'
                        : 'Tambah User'}
                  </button>

                  <button
                    type="button"
                    onClick={resetForm}
                    disabled={processing !== null}
                    className="rounded-full border border-ink px-6 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-ink hover:text-paper disabled:opacity-50"
                  >
                    Batal
                  </button>
                </div>
              </form>
            </div>
          )}

          {loading && (
            <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="rounded-2xl border border-line bg-paper p-6">
                  <div className="h-3 w-20 animate-pulse rounded bg-surface" />
                  <div className="mt-4 h-5 w-2/3 animate-pulse rounded bg-surface" />
                  <div className="mt-3 h-3 w-1/3 animate-pulse rounded bg-surface" />
                </div>
              ))}
            </div>
          )}

          {!loading && users.length === 0 && (
            <div className="mt-16 rounded-2xl border border-line bg-surface px-6 py-16 text-center">
              <h2 className="font-sans text-2xl font-bold tracking-tight text-ink">
                Belum ada user
              </h2>
            </div>
          )}

          {!loading && users.length > 0 && (
            <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {users.map((user) => {
                const isProcessing = processing === user.id

                return (
                  <article
                    key={user.id}
                    className="rounded-2xl border border-line bg-paper p-6 transition-all hover:shadow-lg"
                  >
                    <p className="text-xs uppercase tracking-[0.2em] text-muted">
                      {getRoleLabel(user.role)}
                    </p>

                    <h2 className="mt-2 text-lg font-semibold text-ink">
                      {user.name}
                    </h2>

                    <p className="mt-1 text-sm text-muted">{user.email}</p>

                    {user.role === 'mahasiswa' && (
                      <p className="mt-3 text-xs text-muted">
                        Produk: {user.products_count || 0}
                      </p>
                    )}

                    {user.role === 'content_manager' && (
                      <p className="mt-3 text-xs text-muted">
                        Penilaian: {user.votes_count || 0}
                      </p>
                    )}

                    <div className="mt-6 flex flex-wrap gap-2 border-t border-line pt-4">
                      <button
                        type="button"
                        onClick={() => handleEdit(user)}
                        disabled={isProcessing}
                        className="rounded-full border border-ink px-4 py-1.5 text-xs font-medium text-ink transition-colors hover:bg-ink hover:text-paper disabled:opacity-50"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(user)}
                        disabled={isProcessing}
                        className="rounded-full border border-red-200 bg-red-50 px-4 py-1.5 text-xs font-medium text-red-700 transition-colors hover:bg-red-100 disabled:opacity-50"
                      >
                        {isProcessing ? 'Menghapus...' : 'Hapus'}
                      </button>
                    </div>
                  </article>
                )
              })}
            </div>
          )}
        </Container>
      </main>
    </div>
  )
}

export default AdminUsers