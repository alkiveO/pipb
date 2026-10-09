import { useEffect, useState } from 'react'
import {
  getAdminProducts,
  approveAdminProduct,
  rejectAdminProduct,
  updateAdminInvestment,
  deleteRejectedProduct,
  voteProduct,
} from '../services/api'
import Container from '../components/ui/Container'
import Navbar from '../components/layout/Navbar'

function AdminProducts({ onBack, onNavigate, page }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [processing, setProcessing] = useState(null)
  const [voteScores, setVoteScores] = useState({})

  const fetchProducts = async () => {
    try {
      setError('')
      const data = await getAdminProducts()
      setProducts(data.data || [])
    } catch (error) {
      console.error('Gagal mengambil produk content manager:', error)
      setError(error.message || 'Gagal mengambil produk')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const getImageUrl = (product) => {
    if (!product.images || product.images.length === 0) return null
    const primaryImage =
      product.images.find((image) => image.is_primary) || product.images[0]
    const imagePath = primaryImage.image_url
    if (!imagePath) return null
    if (imagePath.startsWith('http')) return imagePath
    return `http://127.0.0.1:8000${imagePath}`
  }

  const handleApprove = async (productId) => {
    try {
      setProcessing(productId)
      setError('')
      await approveAdminProduct(productId)
      await fetchProducts()
    } catch (error) {
      console.error('Gagal approve produk:', error)
      setError(error.message || 'Gagal menyetujui produk')
    } finally {
      setProcessing(null)
    }
  }

  const handleReject = async (productId) => {
    const reason = window.prompt('Masukkan alasan penolakan produk:')
    if (!reason || !reason.trim()) return

    try {
      setProcessing(productId)
      setError('')
      await rejectAdminProduct(productId, reason.trim())
      await fetchProducts()
    } catch (error) {
      console.error('Gagal menolak produk:', error)
      setError(error.message || 'Gagal menolak produk')
    } finally {
      setProcessing(null)
    }
  }

  const handleInvestment = async (productId) => {
    const amount = window.prompt('Masukkan total dana terkumpul:')
    if (amount === null || amount.trim() === '') return

    const numericAmount = Number(amount)
    if (Number.isNaN(numericAmount) || numericAmount < 0) {
      setError('Jumlah dana harus berupa angka dan tidak boleh negatif.')
      return
    }

    try {
      setProcessing(productId)
      setError('')
      await updateAdminInvestment(productId, numericAmount)
      await fetchProducts()
    } catch (error) {
      console.error('Gagal memperbarui dana:', error)
      setError(error.message || 'Gagal memperbarui dana')
    } finally {
      setProcessing(null)
    }
  }

  const handleVote = async (productId) => {
    const score = Number(voteScores[productId])
    if (Number.isNaN(score) || score < 10 || score > 100) {
      setError('Nilai harus berupa angka dari 10 sampai 100.')
      return
    }

    try {
      setProcessing(productId)
      setError('')
      await voteProduct(productId, score)
      setVoteScores((current) => ({ ...current, [productId]: '' }))
      await fetchProducts()
    } catch (error) {
      console.error('Gagal memberikan penilaian:', error)
      setError(error.message || 'Gagal memberikan penilaian')
    } finally {
      setProcessing(null)
    }
  }

  const handleDelete = async (productId) => {
    const confirmed = window.confirm(
      'Yakin ingin menghapus pengajuan produk yang ditolak ini? Data produk dan gambar akan dihapus permanen.'
    )
    if (!confirmed) return

    try {
      setProcessing(productId)
      setError('')
      await deleteRejectedProduct(productId)
      await fetchProducts()
    } catch (error) {
      console.error('Gagal menghapus pengajuan produk:', error)
      setError(error.message || 'Gagal menghapus pengajuan produk')
    } finally {
      setProcessing(null)
    }
  }

  const statusBadge = (status) => {
    if (status === 'approved')
      return 'bg-emerald-50 text-emerald-700 border-emerald-200'
    if (status === 'rejected')
      return 'bg-red-50 text-red-700 border-red-200'
    return 'bg-amber-50 text-amber-700 border-amber-200'
  }

  return (
    <div className="min-h-screen bg-paper">
      <Navbar authenticated onNavigate={onNavigate} page={page || 'admin-products'} />

      <main className="pb-24 pt-16">
        <Container>
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-muted">
              Content Manager
            </p>
            <h1 className="mt-4 font-sans text-4xl font-bold tracking-tight text-ink md:text-5xl">
              Kelola Produk
            </h1>
            <p className="mt-3 max-w-2xl leading-relaxed text-muted">
              Kelola pengajuan produk mahasiswa, approval, dana terkumpul,
              dan penilaian produk.
            </p>
          </div>

          {error && (
            <div className="mt-8 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {loading && (
            <div className="mt-16 space-y-6">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-line bg-paper p-6"
                >
                  <div className="h-5 w-1/3 animate-pulse rounded bg-surface" />
                  <div className="mt-3 h-3 w-full animate-pulse rounded bg-surface" />
                </div>
              ))}
            </div>
          )}

          {!loading && products.length === 0 && (
            <div className="mt-16 rounded-2xl border border-line bg-surface px-6 py-16 text-center">
              <h2 className="font-sans text-2xl font-bold tracking-tight text-ink">
                Belum ada produk yang diajukan
              </h2>
            </div>
          )}

          {!loading && products.length > 0 && (
            <div className="mt-16 space-y-6">
              {products.map((product) => {
                const imageUrl = getImageUrl(product)
                const isProcessing = processing === product.id
                const averageScore =
                  product.votes_avg_score !== null &&
                  product.votes_avg_score !== undefined
                    ? Number(product.votes_avg_score).toFixed(2)
                    : 'Belum ada'
                const totalVotes = Number(product.votes_count || 0)

                return (
                  <article
                    key={product.id}
                    className="overflow-hidden rounded-2xl border border-line bg-paper"
                  >
                    <div className="flex flex-col gap-6 p-6 md:flex-row md:p-8">
                      <div className="aspect-[4/3] w-full shrink-0 overflow-hidden rounded-xl bg-surface md:w-56">
                        {imageUrl ? (
                          <img
                            src={imageUrl}
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

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-3">
                          <p className="text-xs uppercase tracking-[0.2em] text-muted">
                            {product.category?.name || 'Produk'}
                          </p>
                          <span
                            className={`rounded-full border px-3 py-0.5 text-[10px] font-medium uppercase tracking-wider ${statusBadge(
                              product.approval_status
                            )}`}
                          >
                            {product.approval_status}
                          </span>
                        </div>

                        <h2 className="mt-2 font-sans text-xl font-bold tracking-tight text-ink md:text-2xl">
                          {product.name}
                        </h2>

                        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted">
                          {product.description}
                        </p>

                        <div className="mt-6 grid grid-cols-2 gap-x-6 gap-y-3 text-sm md:grid-cols-3">
                          <div>
                            <p className="text-xs uppercase tracking-wider text-muted">
                              Pemilik
                            </p>
                            <p className="mt-1 font-medium text-ink">
                              {product.user?.name || 'Tidak diketahui'}
                            </p>
                          </div>

                          <div>
                            <p className="text-xs uppercase tracking-wider text-muted">
                              Status Launch
                            </p>
                            <p className="mt-1 font-medium text-ink">
                              {product.launch_status}
                            </p>
                          </div>

                          <div>
                            <p className="text-xs uppercase tracking-wider text-muted">
                              Dana Awal
                            </p>
                            <p className="mt-1 font-medium text-ink">
                              Rp{' '}
                              {Number(product.initial_fund || 0).toLocaleString(
                                'id-ID'
                              )}
                            </p>
                          </div>

                          <div>
                            <p className="text-xs uppercase tracking-wider text-muted">
                              Target Dana
                            </p>
                            <p className="mt-1 font-medium text-ink">
                              Rp{' '}
                              {Number(product.target_fund || 0).toLocaleString(
                                'id-ID'
                              )}
                            </p>
                          </div>

                          <div>
                            <p className="text-xs uppercase tracking-wider text-muted">
                              Dana Terkumpul
                            </p>
                            <p className="mt-1 font-medium text-ink">
                              Rp{' '}
                              {Number(
                                product.investment_amount || 0
                              ).toLocaleString('id-ID')}
                            </p>
                          </div>
                        </div>

                        {product.rejection_reason && (
                          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                            <strong>Alasan Penolakan:</strong>{' '}
                            {product.rejection_reason}
                          </div>
                        )}

                        {/* Actions */}
                        <div className="mt-6 border-t border-line pt-6">
                          {product.approval_status === 'pending' && (
                            <div className="flex flex-wrap gap-3">
                              <button
                                type="button"
                                onClick={() => handleApprove(product.id)}
                                disabled={isProcessing}
                                className="rounded-full bg-ink px-5 py-2 text-sm font-medium text-paper transition-colors hover:bg-ink/85 disabled:opacity-50"
                              >
                                {isProcessing ? 'Memproses...' : 'Approve'}
                              </button>

                              <button
                                type="button"
                                onClick={() => handleReject(product.id)}
                                disabled={isProcessing}
                                className="rounded-full border border-red-200 bg-red-50 px-5 py-2 text-sm font-medium text-red-700 transition-colors hover:bg-red-100 disabled:opacity-50"
                              >
                                Tolak
                              </button>
                            </div>
                          )}

                          {product.approval_status === 'approved' && (
                            <div className="space-y-4">
                              <p className="text-sm text-muted">
                                <strong className="text-ink">
                                  Rata-rata Nilai:
                                </strong>{' '}
                                {averageScore} · <strong className="text-ink">
                                  {totalVotes} penilai
                                </strong>
                              </p>

                              <div className="flex flex-wrap gap-3">
                                <button
                                  type="button"
                                  onClick={() => handleInvestment(product.id)}
                                  disabled={isProcessing}
                                  className="rounded-full bg-ink px-5 py-2 text-sm font-medium text-paper transition-colors hover:bg-ink/85 disabled:opacity-50"
                                >
                                  {isProcessing ? 'Memproses...' : 'Input Dana'}
                                </button>

                                <div className="flex items-center gap-2">
                                  <input
                                    type="number"
                                    min="10"
                                    max="100"
                                    placeholder="Nilai 10-100"
                                    value={voteScores[product.id] ?? ''}
                                    onChange={(event) =>
                                      setVoteScores((current) => ({
                                        ...current,
                                        [product.id]: event.target.value,
                                      }))
                                    }
                                    disabled={isProcessing}
                                    className="w-32 rounded-lg border border-line bg-paper px-3 py-2 text-sm text-ink outline-none transition focus:border-ink focus:ring-2 focus:ring-ink/10"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => handleVote(product.id)}
                                    disabled={isProcessing}
                                    className="rounded-full border border-ink px-5 py-2 text-sm font-medium text-ink transition-colors hover:bg-ink hover:text-paper disabled:opacity-50"
                                  >
                                    {isProcessing ? 'Memproses...' : 'Beri Nilai'}
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}

                          {product.approval_status === 'rejected' && (
                            <button
                              type="button"
                              onClick={() => handleDelete(product.id)}
                              disabled={isProcessing}
                              className="rounded-full border border-red-200 bg-red-50 px-5 py-2 text-sm font-medium text-red-700 transition-colors hover:bg-red-100 disabled:opacity-50"
                            >
                              {isProcessing ? 'Menghapus...' : 'Hapus Pengajuan'}
                            </button>
                          )}
                        </div>
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

export default AdminProducts