import { useEffect, useState } from 'react'
import {
  getCategories,
  createAdminCategory,
  updateAdminCategory,
  deleteAdminCategory,
} from '../services/api'
import Container from '../components/ui/Container'
import Navbar from '../components/layout/Navbar'

function AdminCategories({ onBack, onNavigate, page }) {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [processing, setProcessing] = useState(null)

  const [showForm, setShowForm] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)
  const [name, setName] = useState('')

  const fetchCategories = async () => {
    try {
      setError('')
      const response = await getCategories()
      setCategories(response.data || [])
    } catch (error) {
      console.error('Gagal mengambil kategori:', error)
      setError(error.message || 'Gagal mengambil kategori')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  const resetForm = () => {
    setName('')
    setEditingCategory(null)
    setShowForm(false)
  }

  const handleCreate = () => {
    setName('')
    setEditingCategory(null)
    setShowForm(true)
    setError('')
  }

  const handleEdit = (category) => {
    setEditingCategory(category)
    setName(category.name || '')
    setShowForm(true)
    setError('')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!name.trim()) {
      setError('Nama kategori wajib diisi.')
      return
    }

    try {
      setProcessing(editingCategory ? editingCategory.id : 'create')
      setError('')

      if (editingCategory) {
        await updateAdminCategory(editingCategory.id, name.trim())
      } else {
        await createAdminCategory(name.trim())
      }

      resetForm()
      await fetchCategories()
    } catch (error) {
      console.error('Gagal menyimpan kategori:', error)
      setError(error.message || 'Gagal menyimpan kategori')
    } finally {
      setProcessing(null)
    }
  }

  const handleDelete = async (category) => {
    const confirmed = window.confirm(
      `Yakin ingin menghapus kategori "${category.name}"?`
    )
    if (!confirmed) return

    try {
      setProcessing(category.id)
      setError('')
      await deleteAdminCategory(category.id)
      await fetchCategories()
    } catch (error) {
      console.error('Gagal menghapus kategori:', error)
      setError(error.message || 'Gagal menghapus kategori')
    } finally {
      setProcessing(null)
    }
  }

  return (
    <div className="min-h-screen bg-paper">
      <Navbar authenticated onNavigate={onNavigate} page={page || 'categories'} />

      <main className="pb-24 pt-16">
        <Container>
          {/* Header */}
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-muted">
                Admin
              </p>
              <h1 className="mt-4 font-sans text-4xl font-bold tracking-tight text-ink md:text-5xl">
                Kelola Kategori
              </h1>
              <p className="mt-3 max-w-xl leading-relaxed text-muted">
                Tambah, ubah, dan hapus kategori produk PIPB.
              </p>
            </div>

            <button
              type="button"
              onClick={handleCreate}
              className="self-start rounded-full bg-ink px-6 py-3 text-sm font-medium text-paper transition-colors hover:bg-ink/85 md:self-auto"
            >
              Tambah Kategori
            </button>
          </div>

          {/* Error */}
          {error && (
            <div className="mt-8 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Form */}
          {showForm && (
            <div className="mt-10 rounded-2xl border border-line bg-surface/50 p-6 md:p-8">
              <h2 className="font-sans text-xl font-bold tracking-tight text-ink">
                {editingCategory ? 'Edit Kategori' : 'Tambah Kategori'}
              </h2>

              <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                <div className="space-y-2">
                  <label
                    htmlFor="category-name"
                    className="block text-sm font-medium text-ink"
                  >
                    Nama Kategori
                  </label>
                  <input
                    id="category-name"
                    type="text"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Contoh: F&B"
                    required
                    className="w-full rounded-lg border border-line bg-paper px-4 py-2.5 text-sm text-ink outline-none transition focus:border-ink focus:ring-2 focus:ring-ink/10"
                  />
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    type="submit"
                    disabled={processing !== null}
                    className="rounded-full bg-ink px-6 py-2.5 text-sm font-medium text-paper transition-colors hover:bg-ink/85 disabled:opacity-50"
                  >
                    {processing !== null
                      ? 'Menyimpan...'
                      : editingCategory
                        ? 'Simpan Perubahan'
                        : 'Tambah Kategori'}
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

          {/* Loading */}
          {loading && (
            <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-line bg-paper p-6"
                >
                  <div className="h-3 w-20 animate-pulse rounded bg-surface" />
                  <div className="mt-4 h-5 w-2/3 animate-pulse rounded bg-surface" />
                  <div className="mt-3 h-3 w-1/3 animate-pulse rounded bg-surface" />
                </div>
              ))}
            </div>
          )}

          {/* Empty */}
          {!loading && categories.length === 0 && (
            <div className="mt-16 rounded-2xl border border-line bg-surface px-6 py-16 text-center">
              <h2 className="font-sans text-2xl font-bold tracking-tight text-ink">
                Belum ada kategori
              </h2>
              <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted">
                Tambah kategori pertama untuk produk PIPB.
              </p>
            </div>
          )}

          {/* Grid */}
          {!loading && categories.length > 0 && (
            <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {categories.map((category) => {
                const isProcessing = processing === category.id

                return (
                  <article
                    key={category.id}
                    className="rounded-2xl border border-line bg-paper p-6 transition-all hover:shadow-lg"
                  >
                    <p className="text-xs uppercase tracking-[0.2em] text-muted">
                      Kategori
                    </p>

                    <h2 className="mt-2 text-lg font-semibold text-ink">
                      {category.name}
                    </h2>

                    <p className="mt-1 text-xs text-muted">
                      ID: {category.id}
                    </p>

                    <div className="mt-6 flex flex-wrap gap-2 border-t border-line pt-4">
                      <button
                        type="button"
                        onClick={() => handleEdit(category)}
                        disabled={isProcessing}
                        className="rounded-full border border-ink px-4 py-1.5 text-xs font-medium text-ink transition-colors hover:bg-ink hover:text-paper disabled:opacity-50"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(category)}
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

export default AdminCategories