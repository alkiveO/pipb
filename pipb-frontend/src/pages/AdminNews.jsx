import { useEffect, useState } from 'react'
import {
  getAdminNews,
  createAdminNews,
  updateAdminNews,
  deleteAdminNews,
} from '../services/api'
import Container from '../components/ui/Container'
import Navbar from '../components/layout/Navbar'

function AdminNews({ onBack, onNavigate, page }) {
  const [news, setNews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [processing, setProcessing] = useState(null)

  const [showForm, setShowForm] = useState(false)
  const [editingNews, setEditingNews] = useState(null)
  const [form, setForm] = useState({ title: '', content: '' })

  const fetchNews = async () => {
    try {
      setError('')
      const response = await getAdminNews()
      setNews(response.data || [])
    } catch (error) {
      console.error('Gagal mengambil berita:', error)
      setError(error.message || 'Gagal mengambil berita')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNews()
  }, [])

  const resetForm = () => {
    setForm({ title: '', content: '' })
    setEditingNews(null)
    setShowForm(false)
  }

  const handleCreate = () => {
    setEditingNews(null)
    setForm({ title: '', content: '' })
    setShowForm(true)
    setError('')
  }

  const handleEdit = (item) => {
    setEditingNews(item)
    setForm({
      title: item.title || '',
      content: item.content || '',
    })
    setShowForm(true)
    setError('')
  }

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!form.title.trim()) {
      setError('Judul berita wajib diisi.')
      return
    }
    if (!form.content.trim()) {
      setError('Isi berita wajib diisi.')
      return
    }

    try {
      setProcessing(editingNews ? editingNews.id : 'create')
      setError('')

      const payload = {
        title: form.title.trim(),
        content: form.content.trim(),
      }

      if (editingNews) {
        await updateAdminNews(editingNews.id, payload)
      } else {
        await createAdminNews(payload)
      }

      resetForm()
      await fetchNews()
    } catch (error) {
      console.error('Gagal menyimpan berita:', error)
      setError(error.message || 'Gagal menyimpan berita')
    } finally {
      setProcessing(null)
    }
  }

  const handleDelete = async (item) => {
    const confirmed = window.confirm(
      `Yakin ingin menghapus berita "${item.title}"?`
    )
    if (!confirmed) return

    try {
      setProcessing(item.id)
      setError('')
      await deleteAdminNews(item.id)
      await fetchNews()
    } catch (error) {
      console.error('Gagal menghapus berita:', error)
      setError(error.message || 'Gagal menghapus berita')
    } finally {
      setProcessing(null)
    }
  }

  return (
    <div className="min-h-screen bg-paper">
      <Navbar authenticated onNavigate={onNavigate} page={page || 'admin-news'} />

      <main className="pb-24 pt-16">
        <Container>
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-muted">
                Content Manager
              </p>
              <h1 className="mt-4 font-sans text-4xl font-bold tracking-tight text-ink md:text-5xl">
                Kelola Berita
              </h1>
              <p className="mt-3 max-w-xl leading-relaxed text-muted">
                Buat, ubah, dan hapus berita serta pengumuman PIPB.
              </p>
            </div>

            <button
              type="button"
              onClick={handleCreate}
              className="self-start rounded-full bg-ink px-6 py-3 text-sm font-medium text-paper transition-colors hover:bg-ink/85 md:self-auto"
            >
              Tambah Berita
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
                {editingNews ? 'Edit Berita' : 'Tambah Berita'}
              </h2>

              <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                <div className="space-y-2">
                  <label
                    htmlFor="news-title"
                    className="block text-sm font-medium text-ink"
                  >
                    Judul
                  </label>
                  <input
                    id="news-title"
                    name="title"
                    type="text"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="Judul berita"
                    required
                    className="w-full rounded-lg border border-line bg-paper px-4 py-2.5 text-sm text-ink outline-none transition focus:border-ink focus:ring-2 focus:ring-ink/10"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="news-content"
                    className="block text-sm font-medium text-ink"
                  >
                    Isi Berita
                  </label>
                  <textarea
                    id="news-content"
                    name="content"
                    value={form.content}
                    onChange={handleChange}
                    placeholder="Isi berita atau pengumuman"
                    rows="8"
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
                      : editingNews
                        ? 'Simpan Perubahan'
                        : 'Tambah Berita'}
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
                <div
                  key={i}
                  className="rounded-2xl border border-line bg-paper p-6"
                >
                  <div className="h-3 w-20 animate-pulse rounded bg-surface" />
                  <div className="mt-4 h-5 w-2/3 animate-pulse rounded bg-surface" />
                  <div className="mt-3 h-3 w-full animate-pulse rounded bg-surface" />
                </div>
              ))}
            </div>
          )}

          {!loading && news.length === 0 && (
            <div className="mt-16 rounded-2xl border border-line bg-surface px-6 py-16 text-center">
              <h2 className="font-sans text-2xl font-bold tracking-tight text-ink">
                Belum ada berita
              </h2>
              <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted">
                Tambah berita pertama untuk PIPB.
              </p>
            </div>
          )}

          {!loading && news.length > 0 && (
            <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {news.map((item) => {
                const isProcessing = processing === item.id

                return (
                  <article
                    key={item.id}
                    className="flex flex-col rounded-2xl border border-line bg-paper p-6 transition-all hover:shadow-lg"
                  >
                    <p className="text-xs uppercase tracking-[0.2em] text-muted">
                      Berita
                    </p>

                    <h2 className="mt-3 text-lg font-semibold leading-snug text-ink">
                      {item.title}
                    </h2>

                    <p className="mt-3 line-clamp-4 flex-1 text-sm leading-relaxed text-muted">
                      {item.content}
                    </p>

                    <p className="mt-4 text-xs text-muted">
                      Oleh: {item.admin?.name || 'Content Manager'}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-2 border-t border-line pt-4">
                      <button
                        type="button"
                        onClick={() => handleEdit(item)}
                        disabled={isProcessing}
                        className="rounded-full border border-ink px-4 py-1.5 text-xs font-medium text-ink transition-colors hover:bg-ink hover:text-paper disabled:opacity-50"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(item)}
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

export default AdminNews