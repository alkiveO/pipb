import { useEffect, useRef, useState } from 'react'
import {
  createProduct,
  getCategories,
  uploadProductImages,
} from '../services/api'
import Container from '../components/ui/Container'
import Navbar from '../components/layout/Navbar'

const MAX_IMAGES = 4
const MAX_IMAGE_SIZE = 1024 * 1024 // 1 MB

function CreateProduct({ onBack, onSuccess, onNavigate, page }) {
  const [categories, setCategories] = useState([])
  const [categoryId, setCategoryId] = useState('')
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [initialFund, setInitialFund] = useState('')
  const [targetFund, setTargetFund] = useState('')
  const [launchDate, setLaunchDate] = useState('')

  const [imageFiles, setImageFiles] = useState([])
  const [coverIndex, setCoverIndex] = useState(0)
  const [previews, setPreviews] = useState([])
  const [documentFile, setDocumentFile] = useState(null)

  const [dragActive, setDragActive] = useState(false)
  const [loadingCategories, setLoadingCategories] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const fileInputRef = useRef(null)

  // === Fetch kategori ===
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setError('')
        const data = await getCategories()
        setCategories(data.data || [])
      } catch (error) {
        console.error('Gagal mengambil kategori:', error)
        setError(error.message || 'Gagal mengambil kategori')
      } finally {
        setLoadingCategories(false)
      }
    }

    fetchCategories()
  }, [])

  // === Preview URL management ===
  useEffect(() => {
    const urls = imageFiles.map((file) => URL.createObjectURL(file))
    setPreviews(urls)

    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url))
    }
  }, [imageFiles])

  // === Handle images ===
  const processFiles = (fileList) => {
    const files = Array.from(fileList || [])
    if (files.length === 0) return

    if (files.length !== MAX_IMAGES) {
      setError(
        `Produk wajib memiliki tepat ${MAX_IMAGES} gambar: 1 foto utama dan ${
          MAX_IMAGES - 1
        } foto tambahan.`
      )
      return
    }

    const invalid = files.find((file) => file.size > MAX_IMAGE_SIZE)
    if (invalid) {
      setError(`Ukuran gambar "${invalid.name}" melebihi 1 MB.`)
      return
    }

    setImageFiles(files)
    setCoverIndex(0)
    setError('')
  }

  const handleImageChange = (event) => {
    processFiles(event.target.files)
    event.target.value = ''
  }

  const handleDrop = (event) => {
    event.preventDefault()
    setDragActive(false)
    processFiles(event.dataTransfer.files)
  }

  const removeImage = (index) => {
    setImageFiles((current) => {
      const next = current.filter((_, i) => i !== index)
      if (coverIndex >= next.length) {
        setCoverIndex(Math.max(0, next.length - 1))
      } else if (index < coverIndex) {
        setCoverIndex((c) => c - 1)
      }
      return next
    })
  }

  // === Handle document ===
  const handleDocumentChange = (event) => {
    const file = event.target.files?.[0] || null
    if (!file) {
      setDocumentFile(null)
      return
    }

    const minimumFileSize = 10 * 1024 * 1024 // 10 MB

    if (file.type !== 'application/pdf') {
      setError('Dokumen pendukung wajib berupa file PDF.')
      event.target.value = ''
      setDocumentFile(null)
      return
    }

    if (file.size < minimumFileSize) {
      setError(`Ukuran dokumen "${file.name}" harus minimal 10 MB.`)
      event.target.value = ''
      setDocumentFile(null)
      return
    }

    setDocumentFile(file)
    setError('')
  }

  // === Upload dokumen ===
  const uploadProductDocument = async (productId, file) => {
    const token = localStorage.getItem('token')
    const formData = new FormData()
    formData.append('document', file)

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
      throw new Error(data.message || 'Gagal mengunggah dokumen pendukung.')
    }
    return data
  }

  // === Submit ===
  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    if (imageFiles.length !== MAX_IMAGES) {
      setError(`Silakan pilih tepat ${MAX_IMAGES} gambar produk.`)
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
      const productResponse = await createProduct(
        categoryId,
        name,
        description,
        initialFund,
        targetFund,
        launchDate
      )

      const productId = productResponse.data.id

      // Urutkan: cover dulu, lalu sisanya sesuai urutan asli
      const orderedIndexes = [
        coverIndex,
        ...imageFiles.map((_, i) => i).filter((i) => i !== coverIndex),
      ]

      await uploadProductImages(
        productId,
        orderedIndexes.map((i) => imageFiles[i])
      )

      await uploadProductDocument(productId, documentFile)

      alert(
        'Produk berhasil diajukan, 4 gambar dan dokumen pendukung berhasil diupload. Produk sedang menunggu persetujuan Content Manager.'
      )

      onSuccess()
    } catch (error) {
      console.error('Gagal membuat produk:', error)
      setError(
        error.message ||
          'Gagal membuat produk. Pastikan backend Laravel sedang berjalan.'
      )
    } finally {
      setLoading(false)
    }
  }

  // === Progress ===
  const requiredFields = [
    name,
    description,
    categoryId,
    initialFund,
    targetFund,
    launchDate,
  ]
  const filledRequired = requiredFields.filter(
    (value) => value !== '' && value !== null && value !== undefined
  ).length
  const formProgress = Math.round((filledRequired / requiredFields.length) * 100)
  const photoProgress = imageFiles.length === MAX_IMAGES ? 100 : 0

  const inputClass =
    'w-full rounded-lg border border-line bg-paper px-4 py-2.5 text-sm text-ink outline-none transition focus:border-ink focus:ring-2 focus:ring-ink/10'

  return (
    <div className="min-h-screen bg-paper">
      <Navbar
        authenticated
        onNavigate={onNavigate}
        page={page || 'create-product'}
      />

      <main className="pb-24 pt-16">
        <Container>
          {/* Header */}
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-muted">
              Produk Baru
            </p>

            <h1 className="mt-4 font-sans text-4xl font-bold tracking-tight text-ink md:text-5xl">
              Ajukan Produk
            </h1>

            <p className="mt-3 max-w-2xl leading-relaxed text-muted">
              Isi informasi produk, tambahkan 4 gambar, dan upload dokumen
              pendukung produk yang ingin kamu ajukan melalui PIPB.
            </p>
          </div>

          {/* ============ FORM ============ */}
          <form onSubmit={handleSubmit} className="mt-12">
            <div className="grid gap-8 lg:grid-cols-[1fr_18rem]">
              {/* ============ KOLOM UTAMA ============ */}
              <div className="space-y-6">
                {/* Section 1 — Info Produk */}
                <section className="rounded-2xl border border-line bg-paper">
                  <header className="flex items-center gap-3 border-b border-line px-6 py-5 md:px-8">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-ink text-xs font-medium text-paper">
                      1
                    </span>
                    <div className="flex-1">
                      <h2 className="font-sans text-lg font-bold tracking-tight text-ink">
                        Informasi Produk
                      </h2>
                      <p className="text-xs text-muted">
                        Data dasar tentang produk kamu.
                      </p>
                    </div>
                    {formProgress === 100 && (
                      <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                        Lengkap
                      </span>
                    )}
                  </header>

                  <div className="space-y-6 p-6 md:p-8">
                    <div className="space-y-2">
                      <label htmlFor="category" className="block text-sm font-medium text-ink">
                        Kategori
                      </label>
                      <select
                        id="category"
                        value={categoryId}
                        onChange={(e) => setCategoryId(e.target.value)}
                        required
                        disabled={loadingCategories}
                        className={inputClass}
                      >
                        <option value="">
                          {loadingCategories ? 'Memuat kategori...' : 'Pilih kategori'}
                        </option>
                        {categories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="product-name" className="block text-sm font-medium text-ink">
                        Nama Produk
                      </label>
                      <input
                        id="product-name"
                        type="text"
                        placeholder="Masukkan nama produk"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className={inputClass}
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="description" className="block text-sm font-medium text-ink">
                        Deskripsi
                      </label>
                      <textarea
                        id="description"
                        placeholder="Jelaskan produk yang ingin dikembangkan"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows="6"
                        required
                        className={inputClass}
                      />
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="space-y-2">
                        <label htmlFor="initial-fund" className="block text-sm font-medium text-ink">
                          Dana Awal
                        </label>
                        <input
                          id="initial-fund"
                          type="number"
                          min="0"
                          placeholder="Contoh: 100000"
                          value={initialFund}
                          onChange={(e) => setInitialFund(e.target.value)}
                          required
                          className={inputClass}
                        />
                        <p className="text-xs text-muted">
                          Dana yang sudah dimiliki atau dikeluarkan sebagai modal awal.
                        </p>
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="target-fund" className="block text-sm font-medium text-ink">
                          Target Dana
                        </label>
                        <input
                          id="target-fund"
                          type="number"
                          min="0"
                          placeholder="Contoh: 500000"
                          value={targetFund}
                          onChange={(e) => setTargetFund(e.target.value)}
                          required
                          className={inputClass}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="launch-date" className="block text-sm font-medium text-ink">
                        Rencana Launch
                      </label>
                      <input
                        id="launch-date"
                        type="date"
                        value={launchDate}
                        onChange={(e) => setLaunchDate(e.target.value)}
                        className={inputClass}
                      />
                    </div>
                  </div>
                </section>

                {/* Section 2 — Foto */}
                <section className="rounded-2xl border border-line bg-paper">
                  <header className="flex items-center gap-3 border-b border-line px-6 py-5 md:px-8">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-ink text-xs font-medium text-paper">
                      2
                    </span>
                    <div className="flex-1">
                      <h2 className="font-sans text-lg font-bold tracking-tight text-ink">
                        Foto Produk
                      </h2>
                      <p className="text-xs text-muted">
                        JPG, PNG, atau WEBP · maks 1 MB · {MAX_IMAGES} foto.
                      </p>
                    </div>
                    {imageFiles.length > 0 && (
                      <span className="rounded-full bg-surface px-3 py-1 text-xs font-medium text-muted">
                        {imageFiles.length} / {MAX_IMAGES}
                      </span>
                    )}
                  </header>

                  <div className="p-6 md:p-8">
                    {/* Dropzone */}
                    <div
                      onDragOver={(event) => {
                        event.preventDefault()
                        setDragActive(true)
                      }}
                      onDragLeave={() => setDragActive(false)}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className={`group flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed px-6 py-10 text-center transition-all ${
                        dragActive
                          ? 'scale-[1.01] border-ink bg-surface'
                          : 'border-line hover:border-ink/40 hover:bg-surface/50'
                      }`}
                    >
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-full text-xl transition-colors ${
                          dragActive
                            ? 'bg-ink text-paper'
                            : 'bg-surface text-muted group-hover:bg-ink group-hover:text-paper'
                        }`}
                      >
                        ↑
                      </div>

                      <div>
                        <p className="text-sm font-medium text-ink">
                          {dragActive
                            ? 'Lepaskan foto di sini'
                            : 'Klik atau seret foto ke sini'}
                        </p>
                        <p className="mt-1 text-xs text-muted">
                          {imageFiles.length > 0
                            ? `${imageFiles.length} foto dipilih — klik untuk mengganti`
                            : 'Belum ada foto dipilih'}
                        </p>
                      </div>

                      <input
                        ref={fileInputRef}
                        id="product-image"
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        multiple
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </div>

                    {/* Preview + Cover selector */}
                    {imageFiles.length > 0 && previews.length > 0 && (
                      <>
                        <div className="mt-6 grid gap-4 sm:grid-cols-[10rem_1fr]">
                          <div>
                            <p className="text-xs uppercase tracking-[0.15em] text-muted">
                              Cover
                            </p>
                            <div className="mt-2 aspect-square overflow-hidden rounded-xl border border-line bg-surface">
                              <img
                                src={previews[coverIndex]}
                                alt="Cover"
                                className="h-full w-full object-cover"
                              />
                            </div>
                          </div>

                          <div>
                            <p className="text-xs uppercase tracking-[0.15em] text-muted">
                              Foto lain ({imageFiles.length - 1})
                            </p>

                            <div className="mt-2 grid grid-cols-4 gap-2">
                              {imageFiles
                                .map((image, index) => ({ image, index }))
                                .filter(({ index }) => index !== coverIndex)
                                .map(({ image, index }) => (
                                  <button
                                    key={`${image.name}-${index}`}
                                    type="button"
                                    onClick={() => setCoverIndex(index)}
                                    className="group relative aspect-square overflow-hidden rounded-lg border border-line bg-surface transition-colors hover:border-ink/40"
                                    title="Jadikan cover"
                                  >
                                    <img
                                      src={previews[index]}
                                      alt={image.name}
                                      className="h-full w-full object-cover"
                                    />
                                  </button>
                                ))}
                            </div>

                            <p className="mt-3 text-xs text-muted">
                              Klik foto lain untuk menjadikannya cover.
                            </p>
                          </div>
                        </div>

                        {/* Daftar semua foto */}
                        <div className="mt-6 border-t border-line pt-6">
                          <p className="text-xs uppercase tracking-[0.15em] text-muted">
                            Semua foto
                          </p>

                          <div className="mt-3 grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5">
                            {imageFiles.map((image, index) => {
                              const isCover = index === coverIndex

                              return (
                                <div
                                  key={`${image.name}-${index}`}
                                  className={`group relative aspect-square overflow-hidden rounded-xl border-2 bg-surface transition-all ${
                                    isCover
                                      ? 'border-ink ring-2 ring-ink/10'
                                      : 'border-transparent hover:border-line'
                                  }`}
                                >
                                  <img
                                    src={previews[index]}
                                    alt={image.name}
                                    className="h-full w-full object-cover"
                                  />

                                  {isCover && (
                                    <span className="absolute left-1.5 top-1.5 rounded-full bg-ink px-2 py-0.5 text-[10px] font-medium text-paper">
                                      Cover
                                    </span>
                                  )}

                                  <button
                                    type="button"
                                    onClick={(event) => {
                                      event.stopPropagation()
                                      removeImage(index)
                                    }}
                                    className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-ink/70 text-xs text-paper opacity-0 transition-opacity hover:bg-ink group-hover:opacity-100"
                                    title="Hapus foto"
                                  >
                                    ✕
                                  </button>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </section>

                {/* Section 3 — Dokumen */}
                <section className="rounded-2xl border border-line bg-paper">
                  <header className="flex items-center gap-3 border-b border-line px-6 py-5 md:px-8">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-ink text-xs font-medium text-paper">
                      3
                    </span>
                    <div className="flex-1">
                      <h2 className="font-sans text-lg font-bold tracking-tight text-ink">
                        Dokumen Pendukung
                      </h2>
                      <p className="text-xs text-muted">
                        PDF · minimal 10 MB.
                      </p>
                    </div>
                  </header>

                  <div className="p-6 md:p-8">
                    <input
                      id="product-document"
                      type="file"
                      accept="application/pdf,.pdf"
                      onChange={handleDocumentChange}
                      className="block w-full text-sm text-muted file:mr-4 file:rounded-full file:border-0 file:bg-ink file:px-5 file:py-2 file:text-sm file:font-medium file:text-paper hover:file:bg-ink/85"
                    />

                    {documentFile && (
                      <div className="mt-3 rounded-lg border border-line bg-surface px-4 py-3 text-xs">
                        <p className="font-medium text-ink">
                          {documentFile.name}
                        </p>
                        <p className="mt-1 text-muted">
                          {(documentFile.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      </div>
                    )}

                    <p className="mt-3 text-xs text-muted">
                      Wajib 1 dokumen pendukung. Format PDF, ukuran minimal 10 MB.
                    </p>
                  </div>
                </section>

                {/* Error */}
                {error && (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                  </div>
                )}

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="submit"
                    disabled={loading || loadingCategories}
                    className="rounded-full bg-ink px-6 py-3 text-sm font-medium text-paper transition-colors hover:bg-ink/85 disabled:opacity-50"
                  >
                    {loading ? 'Mengajukan produk...' : 'Ajukan Produk'}
                  </button>

                  <button
                    type="button"
                    onClick={onBack}
                    className="rounded-full border border-ink px-6 py-3 text-sm font-medium text-ink transition-colors hover:bg-ink hover:text-paper"
                  >
                    Batal
                  </button>
                </div>
              </div>

              {/* ============ SIDEBAR KANAN ============ */}
              <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
                {/* Progress */}
                <div className="rounded-2xl border border-line bg-paper p-5">
                  <p className="text-xs uppercase tracking-[0.2em] text-muted">
                    Kelengkapan
                  </p>
                  <div className="mt-4 space-y-4">
                    <ProgressRow label="Detail produk" value={formProgress} />
                    <ProgressRow label="Foto produk" value={photoProgress} />
                  </div>
                </div>

                {/* Tips */}
                <div className="rounded-2xl border border-line bg-paper p-5">
                  <p className="text-xs uppercase tracking-[0.2em] text-muted">
                    Tips
                  </p>
                  <ul className="mt-4 space-y-3 text-sm text-muted">
                    <li className="flex gap-2.5">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-ink/40" />
                      <span>Gunakan nama produk yang singkat dan jelas.</span>
                    </li>
                    <li className="flex gap-2.5">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-ink/40" />
                      <span>Deskripsi minimal 3 paragraf agar reviewer mudah menilai.</span>
                    </li>
                    <li className="flex gap-2.5">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-ink/40" />
                      <span>Foto dengan latar netral memberi kesan lebih profesional.</span>
                    </li>
                  </ul>
                </div>

                {/* Info approval */}
                <div className="rounded-2xl border border-line bg-paper p-5">
                  <p className="text-xs font-medium text-ink">Setelah disimpan</p>
                  <p className="mt-1.5 text-xs text-muted">
                    Produk akan berstatus{' '}
                    <span className="font-medium text-ink">Pending</span> sampai
                    direview tim PIPB.
                  </p>
                </div>
              </aside>
            </div>
          </form>
        </Container>
      </main>
    </div>
  )
}

function ProgressRow({ label, value }) {
  return (
    <div>
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted">{label}</span>
        <span className="font-medium text-ink">{value}%</span>
      </div>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            value === 100 ? 'bg-emerald-500' : 'bg-ink'
          }`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  )
}

export default CreateProduct