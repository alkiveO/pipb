import { useEffect, useState } from 'react'
import {
  getAdminUsers,
  createAdminUser,
  updateAdminUser,
  deleteAdminUser,
} from '../services/api'
import './Products.css'

function AdminUsers({ onBack }) {
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
      console.error(
        'Gagal mengambil data user:',
        error
      )

      setError(
        error.message ||
        'Gagal mengambil data user'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const resetForm = () => {
    setForm({
      name: '',
      email: '',
      password: '',
      role: 'mahasiswa',
    })

    setEditingUser(null)
    setShowForm(false)
  }

  const handleChange = (event) => {
    const {
      name,
      value,
    } = event.target

    setForm((current) => ({
      ...current,
      [name]: value,
    }))
  }

  const handleCreate = () => {
    setEditingUser(null)

    setForm({
      name: '',
      email: '',
      password: '',
      role: 'mahasiswa',
    })

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
      setProcessing(
        editingUser
          ? editingUser.id
          : 'create'
      )

      setError('')

      const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
        role: form.role,
      }

      if (form.password.trim()) {
        payload.password =
          form.password.trim()
      }

      if (editingUser) {
        await updateAdminUser(
          editingUser.id,
          payload
        )
      } else {
        await createAdminUser(
          payload
        )
      }

      resetForm()
      await fetchUsers()
    } catch (error) {
      console.error(
        'Gagal menyimpan user:',
        error
      )

      setError(
        error.message ||
        'Gagal menyimpan user'
      )
    } finally {
      setProcessing(null)
    }
  }

  const handleDelete = async (user) => {
    const confirmed = window.confirm(
      `Yakin ingin menghapus akun ${user.name}?`
    )

    if (!confirmed) {
      return
    }

    try {
      setProcessing(user.id)
      setError('')

      await deleteAdminUser(
        user.id
      )

      await fetchUsers()
    } catch (error) {
      console.error(
        'Gagal menghapus user:',
        error
      )

      setError(
        error.message ||
        'Gagal menghapus user'
      )
    } finally {
      setProcessing(null)
    }
  }

  const getRoleLabel = (role) => {
    if (role === 'admin') {
      return 'Admin'
    }

    if (role === 'content_manager') {
      return 'Content Manager'
    }

    return 'Mahasiswa'
  }

  return (
    <div className="products-page">
      <nav className="products-navbar">
        <div className="products-logo">
          PIPB ADMIN
        </div>

        <button
          type="button"
          className="products-back-button"
          onClick={onBack}
        >
          Kembali
        </button>
      </nav>

      <main className="products-main">
        <div className="products-header">
          <div>
            <p className="products-label">
              ADMIN
            </p>

            <h1>
              Kelola User
            </h1>

            <p>
              Kelola akun Admin, Content Manager,
              dan Mahasiswa.
            </p>
          </div>

          <button
            type="button"
            onClick={handleCreate}
          >
            Tambah User
          </button>
        </div>

        {error && (
          <p>
            {error}
          </p>
        )}

        {showForm && (
          <div className="product-item">
            <div className="product-item-content">
              <h2>
                {editingUser
                  ? 'Edit User'
                  : 'Tambah User'}
              </h2>

              <form
                onSubmit={handleSubmit}
              >
                <div>
                  <label htmlFor="name">
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
                  />
                </div>

                <div>
                  <label htmlFor="email">
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
                  />
                </div>

                <div>
                  <label htmlFor="password">
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
                  />
                </div>

                <div>
                  <label htmlFor="role">
                    Role
                  </label>

                  <select
                    id="role"
                    name="role"
                    value={form.role}
                    onChange={handleChange}
                  >
                    <option value="admin">
                      Admin
                    </option>

                    <option value="content_manager">
                      Content Manager
                    </option>

                    <option value="mahasiswa">
                      Mahasiswa
                    </option>
                  </select>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={
                      processing !== null
                    }
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
                    disabled={
                      processing !== null
                    }
                  >
                    Batal
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {loading && (
          <p>
            Memuat user...
          </p>
        )}

        {!loading &&
          users.length === 0 && (
            <p>
              Belum ada user.
            </p>
          )}

        {!loading &&
          users.length > 0 && (
            <div className="products-grid">
              {users.map((user) => {
                const isProcessing =
                  processing === user.id

                return (
                  <article
                    className="product-item"
                    key={user.id}
                  >
                    <div className="product-item-content">
                      <span>
                        {getRoleLabel(
                          user.role
                        )}
                      </span>

                      <h2>
                        {user.name}
                      </h2>

                      <p>
                        <strong>
                          Email:
                        </strong>{' '}
                        {user.email}
                      </p>

                      <p>
                        <strong>
                          Role:
                        </strong>{' '}
                        {getRoleLabel(
                          user.role
                        )}
                      </p>

                      {user.role ===
                        'mahasiswa' && (
                        <p>
                          <strong>
                            Produk:
                          </strong>{' '}
                          {user.products_count ||
                            0}
                        </p>
                      )}

                      {user.role ===
                        'content_manager' && (
                        <p>
                          <strong>
                            Penilaian:
                          </strong>{' '}
                          {user.votes_count ||
                            0}
                        </p>
                      )}

                      <div>
                        <button
                          type="button"
                          onClick={() =>
                            handleEdit(user)
                          }
                          disabled={
                            isProcessing
                          }
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleDelete(user)
                          }
                          disabled={
                            isProcessing
                          }
                        >
                          {isProcessing
                            ? 'Menghapus...'
                            : 'Hapus'}
                        </button>
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>
          )}
      </main>
    </div>
  )
}

export default AdminUsers