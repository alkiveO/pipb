import { useEffect, useRef, useState } from 'react'
import {
  createProduct,
  updateProduct,
  getCategories,
  uploadProductImages,
  getProductImages,
  getProductDocuments,
  uploadProductDocument,
} from '../services/api'
import Container from '../components/ui/Container'
import Navbar from '../components/layout/Navbar'

const MAX_IMAGES = 4
const MAX_IMAGE_SIZE = 1024 * 1024
const MAX_DOCUMENT_SIZE = 2 * 1024 * 1024
const API_BASE_URL = 'http://127.0.0.1:8000'

function CreateProduct({
  onBack,
  onSuccess,
  onNavigate,
  page,
  productToEdit = null,
}) {
  const isEditMode = Boolean(productToEdit?.id)

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
  const [existingImages, setExistingImages] = useState([])

  const [documentFile, setDocumentFile] = useState(null)
  const [existingDocument, setExistingDocument] = useState(null)

  const [dragActive, setDragActive] = useState(false)
  const [loadingCategories, setLoadingCategories] = useState(true)
  const [loadingExisting, setLoadingExisting] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const fileInputRef = useRef(null)
  const documentInputRef = useRef(null)

  // Memuat kategori.
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories()
        setCategories(response.data || [])
      } catch (err) {
        console.error('Gagal mengambil kategori:', err)
        setError(err.message || 'Gagal mengambil kategori.')
      } finally {
        setLoadingCategories(false)
      }
    }

    fetchCategories()
  }, [])

  // Mengisi form saat mode edit.
  useEffect(() => {
    if (!productToEdit) return

    setCategoryId(
      productToEdit.category_id
        ? String(productToEdit.category_id)
        : productToEdit.category?.id
          ? String(productToEdit.category.id)
          : ''
    )

    setName(productToEdit.name || '')
    setDescription(productToEdit.description || '')
    setInitialFund(
      productToEdit.initial_fund ??
      productToEdit.investment_amount ??
      ''
    )
    setTargetFund(productToEdit.target_fund ?? '')
    setLaunchDate(
      productToEdit.launch_date
        ? String(productToEdit.launch_date).slice(0, 10)
        : ''
    )
  }, [productToEdit])

  // Memuat gambar dan dokumen lama untuk mode edit.
  useEffect(() => {
    if (!isEditMode) return

    let cancelled = false

    const fetchExistingFiles = async () => {
      setLoadingExisting(true)
      setError('')

      try {
        const [imageResponse, documentResponse] = await Promise.all([
          getProductImages(productToEdit.id),
          getProductDocuments(productToEdit.id),
        ])

        if (cancelled) return

        setExistingImages(imageResponse.data || [])

        const documents = documentResponse.data || []
        setExistingDocument(documents[0] || null)
      } catch (err) {
        if (!cancelled) {
          console.error('Gagal mengambil file produk:', err)
          setError(
            err.message ||
              'Gagal mengambil gambar atau dokumen lama. Silakan coba lagi.'
          )
        }
      } finally {
        if (!cancelled) {
          setLoadingExisting(false)
        }
      }
    }

    fetchExistingFiles()

    return () => {
      cancelled = true
    }
  }, [isEditMode, productToEdit?.id])

  // Mengelola URL preview gambar yang dipilih.
  useEffect(() => {
    const urls = imageFiles.map((file) => URL.createObjectURL(file))
    setPreviews(urls)

    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url))
    }
  }, [imageFiles])

  const getImageUrl = (image) => {
    if (!image) return ''

    if (image.image_url) {
      if (image.image_url.startsWith('http')) {
        return image.image_url
      }

      return `${API_BASE_URL}${image.image_url.startsWith('/') ? '' : '/'}${image.image_url}`
    }

    if (image.image_path) {
      return `${API_BASE_URL}/storage/${image.image_path}`
    }

    return ''
  }

  const getDocumentName = (document) => {
    if (!document) return 'Dokumen PDF lama'

    return (
      document.original_name ||
      document.file_name ||
      document.name ||
      document.document_path?.split('/').pop() ||
      'Dokumen PDF lama'
    )
  }

  // Validasi gambar baru.
  const processFiles = (fileList) => {
    const files = Array.from(fileList || [])

    if (!files.length) return

    if (files.length !== MAX_IMAGES) {
      setError(
        `Pilih tepat ${MAX_IMAGES} gambar jika ingin mengganti gambar lama.`
      )
      return
    }

    const invalidSize = files.find(
      (file) => file.size > MAX_IMAGE_SIZE
    )

    if (invalidSize) {
      setError(`Ukuran gambar "${invalidSize.name}" melebihi 1 MB.`)
      return
    }

    const invalidType = files.find(
      (file) =>
        !['image/jpeg', 'image/png', 'image/webp'].includes(file.type)
    )

    if (invalidType) {
      setError(
        `Format gambar "${invalidType.name}" tidak didukung. Gunakan JPG, PNG, atau WEBP.`
      )
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

      setCoverIndex((currentCover) => {
        if (currentCover === index) return 0
        if (index < currentCover) return currentCover - 1
        return currentCover
      })

      return next
    })
  }

  // Validasi dokumen baru.
  const handleDocumentChange = (event) => {
    const file = event.target.files?.[0] || null

    if (!file) return

    const isPdf =
      file.type === 'application/pdf' ||
      file.name.toLowerCase().endsWith('.pdf')

    if (!isPdf) {
      setError('Dokumen pendukung wajib berupa file PDF.')
      event.target.value = ''
      return
    }

    if (file.size > MAX_DOCUMENT_SIZE) {
      setError(`Ukuran dokumen "${file.name}" maksimal 2 MB.`)
      event.target.value = ''
      return
    }

    setDocumentFile(file)
    setError('')
  }

  // Validasi data sebelum dikirim.
  const validateForm = () => {
    if (!categoryId) {
      return 'Silakan pilih kategori produk.'
    }

    if (!name.trim()) {
      return 'Nama produk wajib diisi.'
    }

    if (!description.trim()) {
      return 'Deskripsi produk wajib diisi.'
    }

    if (
      initialFund === '' ||
      targetFund === '' ||
      !Number.isFinite(Number(initialFund)) ||
      !Number.isFinite(Number(targetFund)) ||
      Number(initialFund) < 0 ||
      Number(targetFund) < 0
    ) {
      return 'Dana awal dan target dana wajib diisi dengan nilai valid.'
    }

    if (!isEditMode && imageFiles.length !== MAX_IMAGES) {
      return `Silakan pilih tepat ${MAX_IMAGES} gambar produk.`
    }

    if (isEditMode && imageFiles.length > 0 &&
        imageFiles.length !== MAX_IMAGES) {
      return `Pilih tepat ${MAX_IMAGES} gambar untuk mengganti gambar lama.`
    }

    if (!isEditMode && !documentFile) {
      return 'Silakan pilih 1 dokumen pendukung berformat PDF.'
    }

    if (documentFile && documentFile.size > MAX_DOCUMENT_SIZE) {
      return 'Ukuran dokumen pendukung maksimal 2 MB.'
    }

    return ''
  }

  // Menyimpan produk baru atau mengedit pengajuan.
  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    const validationError = validateForm()

    if (validationError) {
      setError(validationError)
      return
    }

    setLoading(true)

    try {
      let productId

      if (isEditMode) {
        const response = await updateProduct(
          productToEdit.id,
          {
            category_id: categoryId,
            name: name.trim(),
            description: description.trim(),
            initial_fund: initialFund,
            target_fund: targetFund,
            launch_date: launchDate || null,
          }
        )

        productId = response.data?.id || productToEdit.id
      } else {
        const response = await createProduct(
          categoryId,
          name.trim(),
          description.trim(),
          initialFund,
          targetFund,
          launchDate || null
        )

        productId = response.data?.id

        if (!productId) {
          throw new Error(
            'Produk berhasil diproses, tetapi ID produk tidak ditemukan dari respons server.'
          )
        }
      }

      // Upload gambar hanya jika membuat produk baru
      // atau mahasiswa memilih empat gambar pengganti.
      if (!isEditMode || imageFiles.length > 0) {
        const orderedIndexes = [
          coverIndex,
          ...imageFiles
            .map((_, index) => index)
            .filter((index) => index !== coverIndex),
        ]

        await uploadProductImages(
          productId,
          orderedIndexes.map((index) => imageFiles[index])
        )
      }

      // Dokumen baru bersifat opsional saat edit.
      // Jika tidak diganti, dokumen lama tetap digunakan.
      if (documentFile) {
        await uploadProductDocument(productId, documentFile)
      }

      alert(
        isEditMode
          ? 'Pengajuan berhasil diperbarui dan dikirim kembali untuk review.'
          : 'Produk berhasil diajukan beserta gambar dan dokumen pendukung. Produk sedang menunggu review Content Manager.'
      )

      onSuccess?.()
    } catch (err) {
      console.error(
        isEditMode
          ? 'Gagal mengedit produk:'
          : 'Gagal membuat produk:',
        err
      )

      setError(
        err.message ||
          'Gagal menyimpan produk. Pastikan backend Laravel sedang berjalan.'
      )
    } finally {
      setLoading(false)
    }
  }

  // Progress form.
  const requiredFields = [
    name,
    description,
    categoryId,
    initialFund,
    targetFund,
  ]

  const filledRequired = requiredFields.filter(
    (value) =>
      value !== '' &&
      value !== null &&
      value !== undefined
  ).length

  const formProgress = Math.round(
    (filledRequired / requiredFields.length) * 100
  )

  const hasImages =
    imageFiles.length === MAX_IMAGES ||
    (isEditMode &&
      imageFiles.length === 0 &&
      existingImages.length === MAX_IMAGES)

  const photoProgress = hasImages ? 100 : 0
  const documentProgress = documentFile || existingDocument ? 100 : 0

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
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-muted">
              {isEditMode ? 'Edit Pengajuan' : 'Produk Baru'}
            </p>

            <h1 className="mt-4 font-sans text-4xl font-bold tracking-tight text-ink md:text-5xl">
              {isEditMode ? 'Perbaiki Produk' : 'Ajukan Produk'}
            </h1>

            <p className="mt-3 max-w-2xl leading-relaxed text-muted">
              {isEditMode
                ? 'Perbarui informasi produk sesuai catatan reviewer. File lama tetap digunakan jika tidak diganti.'
                : 'Isi informasi produk, tambahkan empat gambar, dan unggah dokumen pendukung untuk pengajuan PIPB.'}
            </p>
          </div>

          {isEditMode && (
            <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              Setelah disimpan, pengajuan akan kembali ke status Pending
              Review. Pastikan perbaikan sudah sesuai dengan catatan reviewer.
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-12">
            <div className="grid gap-8 lg:grid-cols-[1fr_18rem]">
              <div className="space-y-6">
                {/* Informasi produk */}
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
                      <label
                        htmlFor="category"
                        className="block text-sm font-medium text-ink"
                      >
                        Kategori
                      </label>

                      <select
                        id="category"
                        value={categoryId}
                        onChange={(event) =>
                          setCategoryId(event.target.value)
                        }
                        required
                        disabled={loadingCategories}
                        className={inputClass}
                      >
                        <option value="">
                          {loadingCategories
                            ? 'Memuat kategori...'
                            : 'Pilih kategori'}
                        </option>

                        {categories.map((category) => (
                          <option
                            key={category.id}
                            value={category.id}
                          >
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label
                        htmlFor="product-name"
                        className="block text-sm font-medium text-ink"
                      >
                        Nama Produk
                      </label>

                      <input
                        id="product-name"
                        type="text"
                        placeholder="Masukkan nama produk"
                        value={name}
                        onChange={(event) =>
                          setName(event.target.value)
                        }
                        required
                        className={inputClass}
                      />
                    </div>

                    <div className="space-y-2">
                      <label
                        htmlFor="description"
                        className="block text-sm font-medium text-ink"
                      >
                        Deskripsi
                      </label>

                      <textarea
                        id="description"
                        placeholder="Jelaskan produk yang ingin dikembangkan"
                        value={description}
                        onChange={(event) =>
                          setDescription(event.target.value)
                        }
                        rows="6"
                        required
                        className={inputClass}
                      />
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="space-y-2">
                        <label
                          htmlFor="initial-fund"
                          className="block text-sm font-medium text-ink"
                        >
                          Dana Awal
                        </label>

                        <input
                          id="initial-fund"
                          type="number"
                          min="0"
                          value={initialFund}
                          onChange={(event) =>
                            setInitialFund(event.target.value)
                          }
                          required
                          className={inputClass}
                        />
                      </div>

                      <div className="space-y-2">
                        <label
                          htmlFor="target-fund"
                          className="block text-sm font-medium text-ink"
                        >
                          Target Dana
                        </label>

                        <input
                          id="target-fund"
                          type="number"
                          min="0"
                          value={targetFund}
                          onChange={(event) =>
                            setTargetFund(event.target.value)
                          }
                          required
                          className={inputClass}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label
                        htmlFor="launch-date"
                        className="block text-sm font-medium text-ink"
                      >
                        Rencana Launch
                      </label>

                      <input
                        id="launch-date"
                        type="date"
                        value={launchDate}
                        onChange={(event) =>
                          setLaunchDate(event.target.value)
                        }
                        className={inputClass}
                      />
                    </div>
                  </div>
                </section>

                {/* Gambar produk */}
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
                        JPG, PNG, atau WEBP · maksimal 1 MB per gambar.
                      </p>
                    </div>
                  </header>

                  <div className="p-6 md:p-8">
                    {isEditMode && loadingExisting && (
                      <p className="mb-4 text-sm text-muted">
                        Memuat gambar lama...
                      </p>
                    )}

                    {isEditMode &&
                      !loadingExisting &&
                      imageFiles.length === 0 &&
                      existingImages.length > 0 && (
                        <div className="mb-6">
                          <p className="text-sm font-medium text-ink">
                            Gambar saat ini
                          </p>

                          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
                            {existingImages.map((image) => (
                              <div
                                key={image.id}
                                className="relative aspect-square overflow-hidden rounded-xl border border-line bg-surface"
                              >
                                <img
                                  src={getImageUrl(image)}
                                  alt="Gambar produk lama"
                                  className="h-full w-full object-cover"
                                />

                                {image.is_primary && (
                                  <span className="absolute left-2 top-2 rounded-full bg-ink px-2 py-1 text-[10px] text-paper">
                                    Cover
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>

                          <p className="mt-3 text-xs text-muted">
                            Gambar lama akan dipertahankan jika kamu tidak
                            memilih gambar pengganti.
                          </p>
                        </div>
                      )}

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
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-surface text-xl text-muted transition-colors group-hover:bg-ink group-hover:text-paper">
                        ↑
                      </div>

                      <div>
                        <p className="text-sm font-medium text-ink">
                          {dragActive
                            ? 'Lepaskan foto di sini'
                            : 'Klik atau seret empat foto'}
                        </p>

                        <p className="mt-1 text-xs text-muted">
                          {imageFiles.length === MAX_IMAGES
                            ? 'Empat gambar pengganti siap diunggah'
                            : isEditMode
                              ? 'Opsional saat edit; pilih tepat empat gambar untuk mengganti semuanya'
                              : 'Pilih tepat empat gambar produk'}
                        </p>
                      </div>

                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        multiple
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </div>

                    {imageFiles.length > 0 && (
                      <>
                        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                          {imageFiles.map((file, index) => (
                            <div
                              key={`${file.name}-${index}`}
                              className="group relative aspect-square overflow-hidden rounded-xl border border-line bg-surface"
                            >
                              <img
                                src={previews[index]}
                                alt={file.name}
                                className="h-full w-full object-cover"
                              />

                              {coverIndex === index && (
                                <span className="absolute left-2 top-2 rounded-full bg-ink px-2 py-1 text-[10px] text-paper">
                                  Cover
                                </span>
                              )}

                              <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className="absolute right-2 top-2 rounded-full bg-ink/80 px-2 py-1 text-xs text-paper"
                              >
                                Hapus
                              </button>

                              <button
                                type="button"
                                onClick={() => setCoverIndex(index)}
                                className="absolute inset-x-0 bottom-0 bg-ink/80 px-2 py-2 text-xs text-paper"
                              >
                                {coverIndex === index
                                  ? 'Cover utama'
                                  : 'Jadikan cover'}
                              </button>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </section>

                {/* Dokumen pendukung */}
                <section className="rounded-2xl border border-line bg-paper">
                  <header className="flex items-center gap-3 border-b border-line px-6 py-5 md:px-8">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-ink text-xs font-medium text-paper">
                      3
                    </span>

                    <div>
                      <h2 className="font-sans text-lg font-bold tracking-tight text-ink">
                        Dokumen Pendukung
                      </h2>

                      <p className="text-xs text-muted">
                        PDF · maksimal 2 MB.
                      </p>
                    </div>
                  </header>

                  <div className="p-6 md:p-8">
                    {isEditMode && existingDocument && !documentFile && (
                      <div className="mb-4 rounded-xl border border-line bg-surface px-4 py-3">
                        <p className="text-sm font-medium text-ink">
                          Dokumen saat ini
                        </p>

                        <p className="mt-1 break-all text-xs text-muted">
                          {getDocumentName(existingDocument)}
                        </p>

                        <p className="mt-2 text-xs text-muted">
                          Dokumen lama akan dipertahankan jika tidak diganti.
                        </p>
                      </div>
                    )}

                    <label
                      htmlFor="product-document"
                      className="mb-2 block text-sm font-medium text-ink"
                    >
                      {isEditMode
                        ? 'Ganti dokumen PDF (opsional)'
                        : 'Pilih dokumen PDF'}
                    </label>

                    <input
                      ref={documentInputRef}
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
                      {isEditMode
                        ? 'Pilih PDF baru hanya jika ingin mengganti dokumen lama.'
                        : 'Wajib satu dokumen PDF dengan ukuran maksimal 2 MB.'}
                    </p>
                  </div>
                </section>

                {error && (
                  <div
                    role="alert"
                    className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                  >
                    {error}
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="submit"
                    disabled={
                      loading ||
                      loadingCategories ||
                      loadingExisting
                    }
                    className="rounded-full bg-ink px-6 py-3 text-sm font-medium text-paper transition-colors hover:bg-ink/85 disabled:opacity-50"
                  >
                    {loading
                      ? 'Menyimpan...'
                      : isEditMode
                        ? 'Simpan & Ajukan Ulang'
                        : 'Ajukan Produk'}
                  </button>

                  <button
                    type="button"
                    onClick={onBack}
                    disabled={loading}
                    className="rounded-full border border-ink px-6 py-3 text-sm font-medium text-ink transition-colors hover:bg-ink hover:text-paper disabled:opacity-50"
                  >
                    Batal
                  </button>
                </div>
              </div>

              {/* Sidebar */}
              <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
                <div className="rounded-2xl border border-line bg-paper p-5">
                  <p className="text-xs uppercase tracking-[0.2em] text-muted">
                    Kelengkapan
                  </p>

                  <div className="mt-4 space-y-4">
                    <ProgressRow
                      label="Detail produk"
                      value={formProgress}
                    />

                    <ProgressRow
                      label="Foto produk"
                      value={photoProgress}
                    />

                    <ProgressRow
                      label="Dokumen PDF"
                      value={documentProgress}
                    />
                  </div>
                </div>

                <div className="rounded-2xl border border-line bg-paper p-5">
                  <p className="text-xs uppercase tracking-[0.2em] text-muted">
                    Tips
                  </p>

                  <ul className="mt-4 space-y-3 text-sm text-muted">
                    <li>
                      Gunakan nama produk yang singkat dan jelas.
                    </li>
                    <li>
                      Pastikan deskripsi menjelaskan produk dengan lengkap.
                    </li>
                    <li>
                      Perbaiki informasi sesuai catatan reviewer.
                    </li>
                  </ul>
                </div>

                <div className="rounded-2xl border border-line bg-paper p-5">
                  <p className="text-xs font-medium text-ink">
                    Setelah disimpan
                  </p>

                  <p className="mt-1.5 text-xs text-muted">
                    {isEditMode
                      ? 'Pengajuan kembali ke Pending Review untuk diperiksa ulang.'
                      : 'Produk berstatus Pending Review sampai diperiksa Content Manager.'}
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