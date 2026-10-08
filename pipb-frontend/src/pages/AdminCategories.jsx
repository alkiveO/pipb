import { useEffect, useState } from 'react'
import {
  getCategories,
  createAdminCategory,
  updateAdminCategory,
  deleteAdminCategory,
} from '../services/api'
import './Products.css'

function AdminCategories({ onBack }) {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [processing, setProcessing] = useState(null)

  const [showForm, setShowForm] = useState(false)
  const [editingCategory, setEditingCategory] =
    useState(null)
  const [name, setName] = useState('')

  const fetchCategories = async () => {
    try {
      setError('')

      const response = await getCategories()

      setCategories(response.data || [])
    } catch (error) {
      console.error(
        'Gagal mengambil kategori:',
        error
      )

      setError(
        error.message ||
        'Gagal mengambil kategori'
      )
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
      setProcessing(
        editingCategory
          ? editingCategory.id
          : 'create'
      )

      setError('')

      if (editingCategory) {
        await updateAdminCategory(
          editingCategory.id,
          name.trim()
        )
      } else {
        await createAdminCategory(
          name.trim()
        )
      }

      resetForm()
      await fetchCategories()
    } catch (error) {
      console.error(
        'Gagal menyimpan kategori:',
        error
      )

      setError(
        error.message ||
        'Gagal menyimpan kategori'
      )
    } finally {
      setProcessing(null)
    }
  }

  const handleDelete = async (category) => {
    const confirmed = window.confirm(
      `Yakin ingin menghapus kategori "${category.name}"?`
    )

    if (!confirmed) {
      return
    }

    try {
      setProcessing(category.id)
      setError('')

      await deleteAdminCategory(
        category.id
      )

      await fetchCategories()
    } catch (error) {
      console.error(
        'Gagal menghapus kategori:',
        error
      )

      setError(
        error.message ||
        'Gagal menghapus kategori'
      )
    } finally {
      setProcessing(null)
    }
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
              Kelola Kategori
            </h1>

            <p>
              Tambah, ubah, dan hapus kategori
              produk PIPB.
            </p>
          </div>

          <button
            type="button"
            onClick={handleCreate}
          >
            Tambah Kategori
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
                {editingCategory
                  ? 'Edit Kategori'
                  : 'Tambah Kategori'}
              </h2>

              <form
                onSubmit={handleSubmit}
              >
                <div>
                  <label htmlFor="category-name">
                    Nama Kategori
                  </label>

                  <input
                    id="category-name"
                    type="text"
                    value={name}
                    onChange={(event) =>
                      setName(
                        event.target.value
                      )
                    }
                    placeholder="Contoh: F&B"
                    required
                  />
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
                      : editingCategory
                        ? 'Simpan Perubahan'
                        : 'Tambah Kategori'}
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
            Memuat kategori...
          </p>
        )}

        {!loading &&
          categories.length === 0 && (
            <p>
              Belum ada kategori.
            </p>
          )}

        {!loading &&
          categories.length > 0 && (
            <div className="products-grid">
              {categories.map((category) => {
                const isProcessing =
                  processing === category.id

                return (
                  <article
                    className="product-item"
                    key={category.id}
                  >
                    <div className="product-item-content">
                      <span>
                        KATEGORI
                      </span>

                      <h2>
                        {category.name}
                      </h2>

                      <p>
                        ID Kategori:{' '}
                        {category.id}
                      </p>

                      <div>
                        <button
                          type="button"
                          onClick={() =>
                            handleEdit(
                              category
                            )
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
                            handleDelete(
                              category
                            )
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

export default AdminCategories