import { useEffect, useState } from 'react'
import { getProductById } from '../services/api'
import Container from '../components/ui/Container'
import Navbar from '../components/layout/Navbar'

function ProductDetail({ productId, onBack, onNavigate, page }) {
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedImage, setSelectedImage] = useState(null)

  const fetchProduct = async () => {
    try {
      setLoading(true)
      setError('')
      const response = await getProductById(productId)
      const productData = response.data
      setProduct(productData)

      const primaryImage =
        productData?.images?.find((image) => image.is_primary) ||
        productData?.images?.[0]

      setSelectedImage(primaryImage || null)
    } catch (error) {
      console.error('Gagal mengambil detail produk:', error)
      setError(error.message || 'Gagal mengambil detail produk')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (productId) {
      fetchProduct()
    }
  }, [productId])

  const getImageUrl = (image) => {
    if (!image?.image_url) return null
    if (image.image_url.startsWith('http')) return image.image_url
    return `http://127.0.0.1:8000${image.image_url}`
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(Number(value) || 0)
  }

  const formatDate = (value) => {
    if (!value) return '-'
    return new Date(value).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }

  // Wrapper dengan Navbar untuk semua state
  const Shell = ({ children }) => (
    <div className="min-h-screen bg-paper">
      <Navbar
        authenticated
        onNavigate={onNavigate}
        page={page || 'product-detail'}
      />
      <main className="pb-24 pt-16">
        <Container>{children}</Container>
      </main>
    </div>
  )

  if (loading) {
    return (
      <Shell>
        <div className="py-16 text-center text-sm text-muted">
          Memuat detail produk...
        </div>
      </Shell>
    )
  }

  if (error) {
    return (
      <Shell>
        <div className="rounded-2xl border border-line bg-surface px-6 py-12 text-center">
          <p className="text-sm text-muted">{error}</p>
        </div>
      </Shell>
    )
  }

  if (!product) {
    return (
      <Shell>
        <div className="rounded-2xl border border-line bg-surface px-6 py-12 text-center">
          <p className="text-sm text-muted">Produk tidak ditemukan.</p>
        </div>
      </Shell>
    )
  }

  const images = product.images || []
  const primaryImage =
    images.find((image) => image.is_primary) || images[0]
  const additionalImages = images.filter(
    (image) => image.id !== primaryImage?.id
  )

  return (
    <Shell>
      <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr]">
        {/* Gallery */}
        <div>
          <div className="aspect-[4/3] w-full overflow-hidden rounded-2xl bg-surface">
            {selectedImage ? (
              <img
                src={getImageUrl(selectedImage)}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-xs uppercase tracking-wider text-muted">
                Tidak ada gambar
              </div>
            )}
          </div>

          {additionalImages.length > 0 && (
            <div className="mt-4 grid grid-cols-3 gap-3">
              {additionalImages.map((image) => (
                <button
                  key={image.id}
                  type="button"
                  onClick={() => setSelectedImage(image)}
                  className={`aspect-square overflow-hidden rounded-lg border-2 transition-all ${
                    selectedImage?.id === image.id
                      ? 'border-ink'
                      : 'border-transparent hover:border-line'
                  }`}
                >
                  <img
                    src={getImageUrl(image)}
                    alt={`${product.name} ${image.id}`}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-muted">
            {product.category?.name || 'Produk'}
          </p>

          <h1 className="mt-3 font-sans text-3xl font-bold tracking-tight text-ink md:text-4xl">
            {product.name}
          </h1>

          <p className="mt-2 text-sm text-muted">
            Dibuat oleh: {product.user?.name || 'Mahasiswa'}
          </p>

          <div className="mt-8">
            <p className="text-xs uppercase tracking-[0.2em] text-muted">
              Deskripsi
            </p>
            <p className="mt-3 leading-relaxed text-muted">
              {product.description}
            </p>
          </div>

          <div className="mt-8 grid grid-cols-3 gap-4 border-y border-line py-6">
            <div>
              <p className="text-xs uppercase tracking-wider text-muted">
                Dana Awal
              </p>
              <p className="mt-1 text-sm font-semibold text-ink">
                {formatCurrency(product.initial_fund)}
              </p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wider text-muted">
                Terkumpul
              </p>
              <p className="mt-1 text-sm font-semibold text-ink">
                {formatCurrency(product.investment_amount)}
              </p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wider text-muted">
                Target
              </p>
              <p className="mt-1 text-sm font-semibold text-ink">
                {formatCurrency(product.target_fund)}
              </p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs uppercase tracking-wider text-muted">
                Tanggal Launch
              </p>
              <p className="mt-1 text-sm font-semibold text-ink">
                {formatDate(product.launch_date)}
              </p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wider text-muted">
                Status
              </p>
              <p className="mt-1 text-sm font-semibold text-ink">
                {product.launch_status === 'launch'
                  ? 'Launch'
                  : 'Belum Launch'}
              </p>
            </div>
          </div>

          <div className="mt-8 rounded-2xl border border-line bg-surface p-6">
            <p className="text-xs uppercase tracking-wider text-muted">
              Penilaian Content Manager
            </p>
            <p className="mt-2 font-sans text-3xl font-bold text-ink">
              {product.votes_avg_score !== null &&
              product.votes_avg_score !== undefined
                ? Number(product.votes_avg_score).toFixed(2)
                : '-'}
            </p>
            <p className="mt-1 text-xs text-muted">
              {product.votes_count || 0} penilaian
            </p>
          </div>
        </div>
      </div>
    </Shell>
  )
}

export default ProductDetail