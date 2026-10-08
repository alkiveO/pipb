import { useEffect, useState } from 'react'
import {
  createProduct,
  getCategories,
  uploadProductImages,
} from '../services/api'
import './CreateProduct.css'

function CreateProduct({ onBack, onSuccess }) {
  const [categories, setCategories] = useState([])
  const [categoryId, setCategoryId] = useState('')
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [initialFund, setInitialFund] = useState('')
  const [targetFund, setTargetFund] = useState('')
  const [launchDate, setLaunchDate] = useState('')

  const [imageFiles, setImageFiles] = useState([])
  const [documentFile, setDocumentFile] = useState(null)

  const [loadingCategories, setLoadingCategories] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setError('')

        const data = await getCategories()

        setCategories(data.data || [])
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
        setLoadingCategories(false)
      }
    }

    fetchCategories()
  }, [])

  const handleImageChange = (event) => {
    const files = Array.from(
      event.target.files || []
    )

    if (files.length === 0) {
      return
    }

    if (files.length !== 4) {
      setError(
        'Produk wajib memiliki tepat 4 gambar: 1 foto utama dan 3 foto tambahan.'
      )

      event.target.value = ''
      setImageFiles([])

      return
    }

    const maxFileSize = 1024 * 1024

    const invalidFile = files.find(
      (file) => file.size > maxFileSize
    )

    if (invalidFile) {
      setError(
        `Ukuran gambar "${invalidFile.name}" melebihi 1 MB.`
      )

      event.target.value = ''
      setImageFiles([])

      return
    }

    setImageFiles(files)
    setError('')
  }

  const handleDocumentChange = (event) => {
    const file =
      event.target.files?.[0] || null

    if (!file) {
      setDocumentFile(null)
      return
    }

    const minimumFileSize = 10 * 1024 * 1024

    if (file.type !== 'application/pdf') {
      setError(
        'Dokumen pendukung wajib berupa file PDF.'
      )

      event.target.value = ''
      setDocumentFile(null)

      return
    }

    if (file.size < minimumFileSize) {
      setError(
        `Ukuran dokumen "${file.name}" harus minimal 10 MB.`
      )

      event.target.value = ''
      setDocumentFile(null)

      return
    }

    setDocumentFile(file)
    setError('')
  }

  const uploadProductDocument = async (
    productId,
    file
  ) => {
    const token = localStorage.getItem('token')

    const formData = new FormData()

    formData.append(
      'document',
      file
    )

    const response = await fetch(
      `http://127.0.0.1:8000/api/products/${productId}/documents`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    )

    const data = await response.json()

    if (!response.ok) {
      throw new Error(
        data.message ||
        'Gagal mengunggah dokumen pendukung.'
      )
    }

    return data
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    setError('')

    if (imageFiles.length !== 4) {
      setError(
        'Silakan pilih tepat 4 gambar produk.'
      )

      return
    }

    if (!documentFile) {
      setError(
        'Silakan pilih 1 dokumen pendukung dalam format PDF dengan ukuran minimal 10 MB.'
      )

      return
    }

    setLoading(true)

    try {
      const productResponse =
        await createProduct(
          categoryId,
          name,
          description,
          initialFund,
          targetFund,
          launchDate
        )

      const productId =
        productResponse.data.id

      await uploadProductImages(
        productId,
        imageFiles
      )

      await uploadProductDocument(
        productId,
        documentFile
      )

      alert(
        'Produk berhasil diajukan, 4 gambar dan dokumen pendukung berhasil diupload. Produk sedang menunggu persetujuan Content Manager.'
      )

      onSuccess()
    } catch (error) {
      console.error(
        'Gagal membuat produk:',
        error
      )

      setError(
        error.message ||
        'Gagal membuat produk. Pastikan backend Laravel sedang berjalan.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="create-product-page">
      <nav className="create-product-navbar">
        <div className="create-product-logo">
          PIPB
        </div>

        <button
          type="button"
          className="create-product-back"
          onClick={onBack}
        >
          Kembali
        </button>
      </nav>

      <main className="create-product-main">
        <div className="create-product-header">
          <p className="create-product-label">
            PRODUK BARU
          </p>

          <h1>
            Ajukan Produk
          </h1>

          <p>
            Isi informasi produk, tambahkan 4 gambar,
            dan upload dokumen pendukung produk yang
            ingin kamu ajukan melalui PIPB.
          </p>
        </div>

        <div className="create-product-card">
          <form onSubmit={handleSubmit}>
            <div className="create-form-group">
              <label htmlFor="category">
                Kategori
              </label>

              <select
                id="category"
                value={categoryId}
                onChange={(event) =>
                  setCategoryId(
                    event.target.value
                  )
                }
                required
                disabled={
                  loadingCategories
                }
              >
                <option value="">
                  {loadingCategories
                    ? 'Memuat kategori...'
                    : 'Pilih kategori'}
                </option>

                {categories.map(
                  (category) => (
                    <option
                      key={category.id}
                      value={category.id}
                    >
                      {category.name}
                    </option>
                  )
                )}
              </select>
            </div>

            <div className="create-form-group">
              <label htmlFor="product-name">
                Nama Produk
              </label>

              <input
                id="product-name"
                type="text"
                placeholder="Masukkan nama produk"
                value={name}
                onChange={(event) =>
                  setName(
                    event.target.value
                  )
                }
                required
              />
            </div>

            <div className="create-form-group">
              <label htmlFor="description">
                Deskripsi
              </label>

              <textarea
                id="description"
                placeholder="Jelaskan produk yang ingin dikembangkan"
                value={description}
                onChange={(event) =>
                  setDescription(
                    event.target.value
                  )
                }
                rows="6"
                required
              />
            </div>

            <div className="create-form-group">
              <label htmlFor="initial-fund">
                Dana Awal
              </label>

              <input
                id="initial-fund"
                type="number"
                min="0"
                placeholder="Contoh: 100000"
                value={initialFund}
                onChange={(event) =>
                  setInitialFund(
                    event.target.value
                  )
                }
                required
              />

              <small className="image-help">
                Dana yang sudah dimiliki atau
                dikeluarkan sebagai modal awal
                produk.
              </small>
            </div>

            <div className="create-form-group">
              <label htmlFor="target-fund">
                Target Dana
              </label>

              <input
                id="target-fund"
                type="number"
                min="0"
                placeholder="Contoh: 500000"
                value={targetFund}
                onChange={(event) =>
                  setTargetFund(
                    event.target.value
                  )
                }
                required
              />
            </div>

            <div className="create-form-group">
              <label htmlFor="launch-date">
                Rencana Launch
              </label>

              <input
                id="launch-date"
                type="date"
                value={launchDate}
                onChange={(event) =>
                  setLaunchDate(
                    event.target.value
                  )
                }
              />
            </div>

            <div className="create-form-group">
              <label htmlFor="product-image">
                Gambar Produk
              </label>

              <input
                id="product-image"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                onChange={handleImageChange}
                required
              />

              {imageFiles.length > 0 && (
                <div className="selected-images">
                  <p>
                    {imageFiles.length} gambar
                    dipilih:
                  </p>

                  {imageFiles.map(
                    (file, index) => (
                      <p
                        className="selected-image"
                        key={`${file.name}-${file.lastModified}`}
                      >
                        {index === 0
                          ? `Foto utama: ${file.name}`
                          : `Foto tambahan ${index}: ${file.name}`}
                      </p>
                    )
                  )}
                </div>
              )}

              <small className="image-help">
                Wajib 4 gambar: gambar pertama
                menjadi foto utama, lalu 3 gambar
                berikutnya menjadi foto tambahan.
                Format JPG, JPEG, PNG, atau WEBP.
                Maksimal 1 MB per gambar.
              </small>
            </div>

            <div className="create-form-group">
              <label htmlFor="product-document">
                Dokumen Pendukung
              </label>

              <input
                id="product-document"
                type="file"
                accept="application/pdf,.pdf"
                onChange={
                  handleDocumentChange
                }
                required
              />

              {documentFile && (
                <div className="selected-images">
                  <p>
                    Dokumen dipilih:
                  </p>

                  <p className="selected-image">
                    {documentFile.name}
                  </p>

                  <p className="selected-image">
                    Ukuran:{' '}
                    {(
                      documentFile.size /
                      (1024 * 1024)
                    ).toFixed(2)}{' '}
                    MB
                  </p>
                </div>
              )}

              <small className="image-help">
                Wajib 1 dokumen pendukung.
                Format PDF dan ukuran minimal
                10 MB.
              </small>
            </div>

            {error && (
              <p className="create-product-error">
                {error}
              </p>
            )}

            <div className="create-product-info">
              <strong>
                Status pengajuan
              </strong>

              <p>
                Produk yang kamu ajukan akan
                berstatus
                <b> pending review </b>
                dan harus menunggu persetujuan
                <b> Content Manager </b>
                sebelum dapat ditampilkan secara
                publik.
              </p>
            </div>

            <button
              type="submit"
              className="create-product-button"
              disabled={
                loading ||
                loadingCategories
              }
            >
              {loading
                ? 'Mengajukan produk...'
                : 'Ajukan Produk'}
            </button>
          </form>
        </div>
      </main>
    </div>
  )
}

export default CreateProduct