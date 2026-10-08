import { useEffect, useState } from 'react'
import {
  getAdminNews,
  createAdminNews,
  updateAdminNews,
  deleteAdminNews,
} from '../services/api'
import './Products.css'

function AdminNews({ onBack }) {
  const [news, setNews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [processing, setProcessing] = useState(null)

  const [showForm, setShowForm] = useState(false)
  const [editingNews, setEditingNews] = useState(null)

  const [form, setForm] = useState({
    title: '',
    content: '',
  })

  const fetchNews = async () => {
    try {
      setError('')

      const response = await getAdminNews()

      setNews(response.data || [])
    } catch (error) {
      console.error(
        'Gagal mengambil berita:',
        error
      )

      setError(
        error.message ||
        'Gagal mengambil berita'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNews()
  }, [])

  const resetForm = () => {
    setForm({
      title: '',
      content: '',
    })

    setEditingNews(null)
    setShowForm(false)
  }

  const handleCreate = () => {
    setEditingNews(null)

    setForm({
      title: '',
      content: '',
    })

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

    setForm((current) => ({
      ...current,
      [name]: value,
    }))
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
      setProcessing(
        editingNews
          ? editingNews.id
          : 'create'
      )

      setError('')

      const payload = {
        title: form.title.trim(),
        content: form.content.trim(),
      }

      if (editingNews) {
        await updateAdminNews(
          editingNews.id,
          payload
        )
      } else {
        await createAdminNews(payload)
      }

      resetForm()
      await fetchNews()
    } catch (error) {
      console.error(
        'Gagal menyimpan berita:',
        error
      )

      setError(
        error.message ||
        'Gagal menyimpan berita'
      )
    } finally {
      setProcessing(null)
    }
  }

  const handleDelete = async (item) => {
    const confirmed = window.confirm(
      `Yakin ingin menghapus berita "${item.title}"?`
    )

    if (!confirmed) {
      return
    }

    try {
      setProcessing(item.id)
      setError('')

      await deleteAdminNews(item.id)

      await fetchNews()
    } catch (error) {
      console.error(
        'Gagal menghapus berita:',
        error
      )

      setError(
        error.message ||
        'Gagal menghapus berita'
      )
    } finally {
      setProcessing(null)
    }
  }

  return (
    <div className="products-page">
      <nav className="products-navbar">
        <div className="products-logo">
          PIPB CONTENT MANAGER
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
              CONTENT MANAGER
            </p>

            <h1>
              Kelola Berita
            </h1>

            <p>
              Buat, ubah, dan hapus berita
              serta pengumuman PIPB.
            </p>
          </div>

          <button
            type="button"
            onClick={handleCreate}
          >
            Tambah Berita
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
                {editingNews
                  ? 'Edit Berita'
                  : 'Tambah Berita'}
              </h2>

              <form onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="news-title">
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
                  />
                </div>

                <div>
                  <label htmlFor="news-content">
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
                  />
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={processing !== null}
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
            Memuat berita...
          </p>
        )}

        {!loading && news.length === 0 && (
          <p>
            Belum ada berita.
          </p>
        )}

        {!loading && news.length > 0 && (
          <div className="products-grid">
            {news.map((item) => {
              const isProcessing =
                processing === item.id

              return (
                <article
                  className="product-item"
                  key={item.id}
                >
                  <div className="product-item-content">
                    <span>
                      BERITA
                    </span>

                    <h2>
                      {item.title}
                    </h2>

                    <p>
                      {item.content}
                    </p>

                    <p>
                      Dibuat oleh:{' '}
                      {item.admin?.name ||
                        'Content Manager'}
                    </p>

                    <div>
                      <button
                        type="button"
                        onClick={() =>
                          handleEdit(item)
                        }
                        disabled={isProcessing}
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleDelete(item)
                        }
                        disabled={isProcessing}
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

export default AdminNews