import { useEffect, useState } from 'react'
import { getProductById } from '../services/api'
import Container from '../components/ui/Container'
import Navbar from '../components/layout/Navbar'

const API_BASE_URL = 'http://127.0.0.1:8000'

function ProductDetail({ productId, onBack, onNavigate, page }) {
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedImage, setSelectedImage] = useState(null)

  useEffect(() => {
    let active = true

    const fetchProduct = async () => {
      if (!productId) {
        setProduct(null)
        setLoading(false)
        setError('ID produk tidak tersedia.')
        return
      }

      try {
        setLoading(true)
        setError('')

        const response = await getProductById(productId)
        const productData = response.data

        if (!active) return

        setProduct(productData)

        const primaryImage =
          productData?.images?.find((image) => image.is_primary) ||
          productData?.images?.[0]

        setSelectedImage(primaryImage || null)
      } catch (error) {
        if (!active) return

        console.error('Gagal mengambil detail produk:', error)
        setError(
          error.response?.data?.message ||
            error.message ||
            'Gagal mengambil detail produk.'
        )
      } finally {
        if (active) setLoading(false)
      }
    }

    fetchProduct()

    return () => {
      active = false
    }
  }, [productId])

  const getImageUrl = (image) => {
    const imageUrl = image?.image_url || image?.image_path

    if (!imageUrl) return null
    if (imageUrl.startsWith('http')) return imageUrl

    const normalizedPath = imageUrl.startsWith('/')
      ? imageUrl
      : `/storage/${imageUrl}`

    return `${API_BASE_URL}${normalizedPath}`
  }

  const formatCurrency = (value) =>
    new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(Number(value) || 0)

  const formatDate = (value) => {
    if (!value) return '-'

    const date = new Date(value)

    if (Number.isNaN(date.getTime())) return '-'

    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }

  const getReviewerName = (vote) =>
    vote.content_manager?.name ||
    vote.contentManager?.name ||
    vote.reviewer?.name ||
    'Content Manager'

  const getCategoryScore = (vote, key) => {
    const value = vote[key]

    return value !== null && value !== undefined && value !== ''
      ? Number(value).toFixed(0)
      : '-'
  }

  const getOverallScore = (vote) => {
    if (
      vote.overall_score !== null &&
      vote.overall_score !== undefined
    ) {
      return Number(vote.overall_score).toFixed(2)
    }

    const scores = [
      vote.design_score,
      vote.usability_score,
      vote.creativity_score,
      vote.content_score,
    ]

    if (scores.some((score) => score === null || score === undefined)) {
      return vote.score !== null && vote.score !== undefined
        ? (Number(vote.score) / 10).toFixed(2)
        : '-'
    }

    const average =
      scores.reduce((total, score) => total + Number(score), 0) /
      scores.length

    return average.toFixed(2)
  }

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

          <button
            type="button"
            onClick={onBack}
            className="mt-6 rounded-full bg-ink px-5 py-2 text-sm font-medium text-paper"
          >
            Kembali
          </button>
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

  const votes = product.votes || []

  const averageOverall =
    votes.length > 0
      ? (
          votes.reduce(
            (total, vote) => total + Number(getOverallScore(vote) || 0),
            0
          ) / votes.length
        ).toFixed(2)
      : product.votes_avg_score !== null &&
          product.votes_avg_score !== undefined
        ? (Number(product.votes_avg_score) / 10).toFixed(2)
        : '-'

  return (
    <Shell>
      <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr]">
        {/* Galeri produk */}
        <div>
          <div className="aspect-[4/3] w-full overflow-hidden rounded-2xl bg-surface">
            {getImageUrl(selectedImage) ? (
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
                  {getImageUrl(image) ? (
                    <img
                      src={getImageUrl(image)}
                      alt={`${product.name} ${image.id}`}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-xs text-muted">Gambar</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Informasi produk */}
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

          {/* Ringkasan rating */}
          <div className="mt-8 rounded-2xl border border-line bg-surface p-6">
            <p className="text-xs uppercase tracking-wider text-muted">
              Penilaian Content Manager
            </p>

            <p className="mt-2 font-sans text-3xl font-bold text-ink">
              {averageOverall}
              {averageOverall !== '-' && (
                <span className="ml-2 text-sm font-normal text-muted">
                  / 10
                </span>
              )}
            </p>

            <p className="mt-1 text-xs text-muted">
              {votes.length || product.votes_count || 0} penilaian
            </p>
          </div>
        </div>
      </div>

      {/* Daftar reviewer */}
      <section className="mt-20">
        <div className="border-b border-line pb-6">
          <p className="text-xs uppercase tracking-[0.3em] text-muted">
            Evaluasi Produk
          </p>

          <h2 className="mt-3 font-sans text-2xl font-bold tracking-tight text-ink md:text-3xl">
            Rating & Review
          </h2>

          <p className="mt-2 text-sm leading-relaxed text-muted">
            Daftar Content Manager yang sudah memberikan penilaian terhadap
            produk ini.
          </p>
        </div>

        {votes.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-sm text-muted">
              Belum ada rating atau review untuk produk ini.
            </p>
          </div>
        ) : (
          <>
            {/* Tabel untuk layar besar */}
            <div className="mt-8 hidden overflow-x-auto rounded-xl border border-line md:block">
              <table className="w-full border-collapse text-left text-sm">
                <thead className="bg-surface">
                  <tr>
                    <th className="px-5 py-4 font-medium text-muted">
                      Reviewer
                    </th>
                    <th className="px-4 py-4 text-center font-medium text-muted">
                      Design
                    </th>
                    <th className="px-4 py-4 text-center font-medium text-muted">
                      Usability
                    </th>
                    <th className="px-4 py-4 text-center font-medium text-muted">
                      Creativity
                    </th>
                    <th className="px-4 py-4 text-center font-medium text-muted">
                      Content
                    </th>
                    <th className="bg-surface px-5 py-4 text-center font-semibold text-ink">
                      Overall
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-line">
                  {votes.map((vote) => (
                    <tr key={vote.id} className="hover:bg-surface/50">
                      <td className="px-5 py-5">
                        <p className="font-semibold text-ink">
                          {getReviewerName(vote)}
                        </p>
                        <p className="mt-1 text-xs text-muted">
                          {formatDate(vote.created_at)}
                        </p>
                      </td>

                      <td className="px-4 py-5 text-center text-ink">
                        {getCategoryScore(vote, 'design_score')}
                      </td>

                      <td className="px-4 py-5 text-center text-ink">
                        {getCategoryScore(vote, 'usability_score')}
                      </td>

                      <td className="px-4 py-5 text-center text-ink">
                        {getCategoryScore(vote, 'creativity_score')}
                      </td>

                      <td className="px-4 py-5 text-center text-ink">
                        {getCategoryScore(vote, 'content_score')}
                      </td>

                      <td className="bg-surface px-5 py-5 text-center font-bold text-ink">
                        {getOverallScore(vote)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Kartu untuk layar kecil */}
            <div className="mt-6 space-y-4 md:hidden">
              {votes.map((vote) => (
                <article
                  key={vote.id}
                  className="rounded-xl border border-line bg-paper p-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-semibold text-ink">
                        {getReviewerName(vote)}
                      </h3>
                      <p className="mt-1 text-xs text-muted">
                        {formatDate(vote.created_at)}
                      </p>
                    </div>

                    <div className="rounded-lg bg-surface px-3 py-2 text-center">
                      <p className="text-[10px] uppercase tracking-wider text-muted">
                        Overall
                      </p>
                      <p className="mt-1 font-bold text-ink">
                        {getOverallScore(vote)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-4">
                    {[
                      ['Design', 'design_score'],
                      ['Usability', 'usability_score'],
                      ['Creativity', 'creativity_score'],
                      ['Content', 'content_score'],
                    ].map(([label, key]) => (
                      <div key={key}>
                        <p className="text-xs text-muted">{label}</p>
                        <p className="mt-1 font-semibold text-ink">
                          {getCategoryScore(vote, key)}
                        </p>
                      </div>
                    ))}
                  </div>

                  {vote.feedback && (
                    <div className="mt-5 border-t border-line pt-4">
                      <p className="text-xs uppercase tracking-wider text-muted">
                        Review
                      </p>
                      <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-muted">
                        {vote.feedback}
                      </p>
                    </div>
                  )}
                </article>
              ))}
            </div>

            {/* Feedback pada tabel layar besar */}
            <div className="mt-8 space-y-4">
              {votes
                .filter((vote) => vote.feedback)
                .map((vote) => (
                  <article
                    key={`feedback-${vote.id}`}
                    className="rounded-xl border border-line bg-surface/50 p-5"
                  >
                    <p className="text-xs uppercase tracking-wider text-muted">
                      Review dari {getReviewerName(vote)}
                    </p>

                    <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-ink">
                      {vote.feedback}
                    </p>
                  </article>
                ))}
            </div>
          </>
        )}
      </section>
    </Shell>
  )
}

export default ProductDetail