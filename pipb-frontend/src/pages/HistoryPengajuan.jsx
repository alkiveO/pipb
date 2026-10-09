import { useEffect, useState } from 'react'
import { getMyProducts } from '../services/api'
import Container from '../components/ui/Container'
import Navbar from '../components/layout/Navbar'

function HistoryPengajuan({ onBack, onNavigate, page }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchMyProducts = async () => {
    try {
      setError('')
      const response = await getMyProducts()
      setProducts(response.data || [])
    } catch (error) {
      console.error('Gagal mengambil history pengajuan:', error)
      setError(error.message || 'Gagal mengambil history pengajuan')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMyProducts()
  }, [])

  const getStatusLabel = (status) => {
    if (status === 'approved') return 'Disetujui'
    if (status === 'rejected') return 'Ditolak'
    return 'Menunggu Approval'
  }

  const getStatusClasses = (status) => {
    if (status === 'approved') {
      return 'bg-emerald-50 text-emerald-700 border-emerald-200'
    }
    if (status === 'rejected') {
      return 'bg-red-50 text-red-700 border-red-200'
    }
    return 'bg-amber-50 text-amber-700 border-amber-200'
  }

  const formatCurrency = (value) =>
    `Rp ${Number(value || 0).toLocaleString('id-ID')}`

  const formatDate = (value) => {
    if (!value) return '-'
    return new Date(value).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }

  return (
    <div className="min-h-screen bg-paper">
      <Navbar authenticated onNavigate={onNavigate} page={page || 'history'} />

      <main className="pb-24 pt-16">
        <Container>
          {/* Header */}
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-muted">
              Mahasiswa
            </p>

            <h1 className="mt-4 font-sans text-4xl font-bold tracking-tight text-ink md:text-5xl">
              History Pengajuan
            </h1>

            <p className="mt-3 max-w-2xl leading-relaxed text-muted">
              Lihat seluruh produk yang pernah kamu ajukan dan perkembangan
              pengajuanmu di PIPB.
            </p>
          </div>

          {/* Error */}
          {!loading && error && (
            <div className="mt-16 rounded-2xl border border-line bg-surface px-6 py-12 text-center">
              <p className="text-sm text-muted">{error}</p>
            </div>
          )}

          {/* Loading skeleton */}
          {loading && (
            <div className="mt-16 space-y-6">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-line bg-paper p-6"
                >
                  <div className="flex flex-col gap-6 md:flex-row">
                    <div className="aspect-[4/3] w-full animate-pulse rounded-xl bg-surface md:w-56" />
                    <div className="flex-1 space-y-3">
                      <div className="h-3 w-24 animate-pulse rounded bg-surface" />
                      <div className="h-5 w-1/3 animate-pulse rounded bg-surface" />
                      <div className="h-3 w-full animate-pulse rounded bg-surface" />
                      <div className="h-3 w-2/3 animate-pulse rounded bg-surface" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty */}
          {!loading && !error && products.length === 0 && (
            <div className="mt-16 rounded-2xl border border-line bg-surface px-6 py-16 text-center">
              <p className="text-xs uppercase tracking-[0.3em] text-muted">
                Kosong
              </p>
              <h2 className="mt-3 font-sans text-2xl font-bold tracking-tight text-ink">
                Kamu belum memiliki pengajuan produk
              </h2>
              <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted">
                Mulai ajukan produk pertamamu untuk melihat perkembangannya di sini.
              </p>

              <button
                type="button"
                onClick={() => onNavigate && onNavigate('products')}
                className="mt-8 rounded-full bg-ink px-6 py-3 text-sm font-medium text-paper transition-colors hover:bg-ink/85"
              >
                Ajukan Produk
              </button>
            </div>
          )}

          {/* List */}
          {!loading && !error && products.length > 0 && (
            <div className="mt-16 space-y-6">
              {products.map((product) => {
                const primaryImage =
                  product.images?.find((image) => image.is_primary) ||
                  product.images?.[0]

                const statusKey = product.approval_status

                return (
                  <article
                    key={product.id}
                    className="overflow-hidden rounded-2xl border border-line bg-paper transition-all hover:shadow-lg"
                  >
                    <div className="flex flex-col gap-6 p-6 md:flex-row md:p-8">
                      {/* Image */}
                      <div className="aspect-[4/3] w-full shrink-0 overflow-hidden rounded-xl bg-surface md:w-56">
                        {primaryImage?.image_url ? (
                          <img
                            src={primaryImage.image_url}
                            alt={product.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center">
                            <span className="text-xs uppercase tracking-wider text-muted">
                              Tidak ada gambar
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="min-w-0 flex-1">
                        {/* Header row: kategori + status */}
                        <div className="flex flex-wrap items-center gap-3">
                          <p className="text-xs uppercase tracking-[0.2em] text-muted">
                            {product.category?.name || 'Tanpa Kategori'}
                          </p>

                          <span
                            className={`rounded-full border px-3 py-0.5 text-[10px] font-medium uppercase tracking-wider ${getStatusClasses(
                              statusKey
                            )}`}
                          >
                            {getStatusLabel(statusKey)}
                          </span>
                        </div>

                        <h2 className="mt-2 font-sans text-xl font-bold tracking-tight text-ink md:text-2xl">
                          {product.name}
                        </h2>

                        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted">
                          {product.description}
                        </p>

                        {/* Alasan penolakan */}
                        {statusKey === 'rejected' && product.rejection_reason && (
                          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm">
                            <strong className="text-red-700">
                              Alasan Penolakan:
                            </strong>{' '}
                            <span className="text-red-700/80">
                              {product.rejection_reason}
                            </span>
                          </div>
                        )}

                        {/* Detail grid */}
                        <div className="mt-6 grid grid-cols-2 gap-x-6 gap-y-3 text-sm md:grid-cols-3">
                          <div>
                            <p className="text-xs uppercase tracking-wider text-muted">
                              Dana Awal
                            </p>
                            <p className="mt-1 font-medium text-ink">
                              {formatCurrency(product.initial_fund)}
                            </p>
                          </div>

                          <div>
                            <p className="text-xs uppercase tracking-wider text-muted">
                              Dana Terkumpul
                            </p>
                            <p className="mt-1 font-medium text-ink">
                              {formatCurrency(product.investment_amount)}
                            </p>
                          </div>

                          <div>
                            <p className="text-xs uppercase tracking-wider text-muted">
                              Target Dana
                            </p>
                            <p className="mt-1 font-medium text-ink">
                              {formatCurrency(product.target_fund)}
                            </p>
                          </div>

                          <div>
                            <p className="text-xs uppercase tracking-wider text-muted">
                              Tanggal Launch
                            </p>
                            <p className="mt-1 font-medium text-ink">
                              {formatDate(product.launch_date)}
                            </p>
                          </div>

                          <div>
                            <p className="text-xs uppercase tracking-wider text-muted">
                              Status Launch
                            </p>
                            <p className="mt-1 font-medium text-ink">
                              {product.launch_status === 'launch'
                                ? 'Sudah Launch'
                                : 'Belum Launch'}
                            </p>
                          </div>

                          <div>
                            <p className="text-xs uppercase tracking-wider text-muted">
                              Diajukan
                            </p>
                            <p className="mt-1 font-medium text-ink">
                              {formatDate(product.created_at)}
                            </p>
                          </div>

                          {statusKey === 'approved' && (
                            <div className="col-span-2 md:col-span-3">
                              <p className="text-xs uppercase tracking-wider text-muted">
                                Penilaian Content Manager
                              </p>
                              <p className="mt-1 font-medium text-ink">
                                {product.votes_avg_score !== null &&
                                product.votes_avg_score !== undefined
                                  ? Number(product.votes_avg_score).toFixed(2)
                                  : '-'}{' '}
                                / 100 ({product.votes_count || 0} penilaian)
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Aksi untuk rejected */}
                        {statusKey === 'rejected' && (
                          <div className="mt-6 flex flex-wrap gap-3 border-t border-line pt-6">
                            <button
                              type="button"
                              onClick={() => {
                                alert(
                                  'Fitur edit dan ajukan kembali akan kita sambungkan di step berikutnya.'
                                )
                              }}
                              className="rounded-full bg-ink px-5 py-2 text-sm font-medium text-paper transition-colors hover:bg-ink/85"
                            >
                              Edit & Ajukan Kembali
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                alert(
                                  'Fitur hapus pengajuan akan kita sambungkan di step berikutnya.'
                                )
                              }}
                              className="rounded-full border border-ink px-5 py-2 text-sm font-medium text-ink transition-colors hover:bg-ink hover:text-paper"
                            >
                              Hapus Pengajuan
                            </button>
                          </div>
                        )}
                      </div>
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

export default HistoryPengajuan