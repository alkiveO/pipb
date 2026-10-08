import { useEffect, useState } from 'react'
import {
  getAdminProducts,
  approveAdminProduct,
  rejectAdminProduct,
  updateAdminInvestment,
  deleteRejectedProduct,
  voteProduct,
} from '../services/api'
import './Products.css'

function AdminProducts({ onBack }) {
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
      console.error(
        'Gagal mengambil produk content manager:',
        error
      )

      setError(
        error.message ||
        'Gagal mengambil produk'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const getImageUrl = (product) => {
    if (
      !product.images ||
      product.images.length === 0
    ) {
      return null
    }

    const primaryImage =
      product.images.find(
        (image) => image.is_primary
      ) || product.images[0]

    const imagePath =
      primaryImage.image_url

    if (!imagePath) {
      return null
    }

    if (imagePath.startsWith('http')) {
      return imagePath
    }

    return `http://127.0.0.1:8000${imagePath}`
  }

  const handleApprove = async (productId) => {
    try {
      setProcessing(productId)
      setError('')

      await approveAdminProduct(productId)

      await fetchProducts()
    } catch (error) {
      console.error(
        'Gagal approve produk:',
        error
      )

      setError(
        error.message ||
        'Gagal menyetujui produk'
      )
    } finally {
      setProcessing(null)
    }
  }

  const handleReject = async (productId) => {
    const reason = window.prompt(
      'Masukkan alasan penolakan produk:'
    )

    if (!reason || !reason.trim()) {
      return
    }

    try {
      setProcessing(productId)
      setError('')

      await rejectAdminProduct(
        productId,
        reason.trim()
      )

      await fetchProducts()
    } catch (error) {
      console.error(
        'Gagal menolak produk:',
        error
      )

      setError(
        error.message ||
        'Gagal menolak produk'
      )
    } finally {
      setProcessing(null)
    }
  }

  const handleInvestment = async (productId) => {
    const amount = window.prompt(
      'Masukkan total dana terkumpul:'
    )

    if (
      amount === null ||
      amount.trim() === ''
    ) {
      return
    }

    const numericAmount = Number(amount)

    if (
      Number.isNaN(numericAmount) ||
      numericAmount < 0
    ) {
      setError(
        'Jumlah dana harus berupa angka dan tidak boleh negatif.'
      )

      return
    }

    try {
      setProcessing(productId)
      setError('')

      await updateAdminInvestment(
        productId,
        numericAmount
      )

      await fetchProducts()
    } catch (error) {
      console.error(
        'Gagal memperbarui dana:',
        error
      )

      setError(
        error.message ||
        'Gagal memperbarui dana'
      )
    } finally {
      setProcessing(null)
    }
  }

  const handleVote = async (productId) => {
    const score = Number(
      voteScores[productId]
    )

    if (
      Number.isNaN(score) ||
      score < 10 ||
      score > 100
    ) {
      setError(
        'Nilai harus berupa angka dari 10 sampai 100.'
      )

      return
    }

    try {
      setProcessing(productId)
      setError('')

      await voteProduct(
        productId,
        score
      )

      setVoteScores((current) => ({
        ...current,
        [productId]: '',
      }))

      await fetchProducts()
    } catch (error) {
      console.error(
        'Gagal memberikan penilaian:',
        error
      )

      setError(
        error.message ||
        'Gagal memberikan penilaian'
      )
    } finally {
      setProcessing(null)
    }
  }

  const handleDelete = async (productId) => {
    const confirmed = window.confirm(
      'Yakin ingin menghapus pengajuan produk yang ditolak ini? Data produk dan gambar akan dihapus permanen.'
    )

    if (!confirmed) {
      return
    }

    try {
      setProcessing(productId)
      setError('')

      await deleteRejectedProduct(productId)

      await fetchProducts()
    } catch (error) {
      console.error(
        'Gagal menghapus pengajuan produk:',
        error
      )

      setError(
        error.message ||
        'Gagal menghapus pengajuan produk'
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
              Kelola Produk
            </h1>

            <p>
              Kelola pengajuan produk mahasiswa,
              approval, dana terkumpul, dan
              penilaian produk.
            </p>
          </div>
        </div>

        {loading && (
          <p>
            Memuat produk...
          </p>
        )}

        {error && (
          <p>
            {error}
          </p>
        )}

        {!loading &&
          !error &&
          products.length === 0 && (
            <p>
              Belum ada produk yang diajukan.
            </p>
          )}

        {!loading &&
          !error &&
          products.length > 0 && (
            <div className="products-grid">
              {products.map((product) => {
                const imageUrl =
                  getImageUrl(product)

                const isProcessing =
                  processing === product.id

                const averageScore =
                  product.votes_avg_score !== null &&
                  product.votes_avg_score !== undefined
                    ? Number(
                        product.votes_avg_score
                      ).toFixed(2)
                    : 'Belum ada'

                const totalVotes =
                  Number(
                    product.votes_count || 0
                  )

                return (
                  <article
                    className="product-item"
                    key={product.id}
                  >
                    <div className="product-item-image">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={product.name}
                        />
                      ) : (
                        <span>
                          Tidak ada gambar
                        </span>
                      )}
                    </div>

                    <div className="product-item-content">
                      <span>
                        {product.category?.name ||
                          'PRODUK'}
                      </span>

                      <h2>
                        {product.name}
                      </h2>

                      <p>
                        {product.description}
                      </p>

                      <p>
                        <strong>
                          Pemilik:
                        </strong>{' '}
                        {product.user?.name ||
                          'Tidak diketahui'}
                      </p>

                      <p>
                        <strong>
                          Status Approval:
                        </strong>{' '}
                        {product.approval_status}
                      </p>

                      <p>
                        <strong>
                          Status Launch:
                        </strong>{' '}
                        {product.launch_status}
                      </p>

                      <p>
                        <strong>
                          Dana Awal:
                        </strong>{' '}
                        Rp{' '}
                        {Number(
                          product.initial_fund || 0
                        ).toLocaleString('id-ID')}
                      </p>

                      <p>
                        <strong>
                          Target Dana:
                        </strong>{' '}
                        Rp{' '}
                        {Number(
                          product.target_fund || 0
                        ).toLocaleString('id-ID')}
                      </p>

                      <p>
                        <strong>
                          Dana Terkumpul:
                        </strong>{' '}
                        Rp{' '}
                        {Number(
                          product.investment_amount || 0
                        ).toLocaleString('id-ID')}
                      </p>

                      {product.rejection_reason && (
                        <p>
                          <strong>
                            Alasan Penolakan:
                          </strong>{' '}
                          {product.rejection_reason}
                        </p>
                      )}

                      {product.approval_status ===
                        'pending' && (
                        <div>
                          <button
                            type="button"
                            onClick={() =>
                              handleApprove(
                                product.id
                              )
                            }
                            disabled={isProcessing}
                          >
                            {isProcessing
                              ? 'Memproses...'
                              : 'Approve'}
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleReject(
                                product.id
                              )
                            }
                            disabled={isProcessing}
                          >
                            Tolak
                          </button>
                        </div>
                      )}

                      {product.approval_status ===
                        'approved' && (
                        <>
                          <p>
                            <strong>
                              Rata-rata Nilai:
                            </strong>{' '}
                            {averageScore}
                          </p>

                          <p>
                            <strong>
                              Jumlah Penilai:
                            </strong>{' '}
                            {totalVotes}
                          </p>

                          <button
                            type="button"
                            onClick={() =>
                              handleInvestment(
                                product.id
                              )
                            }
                            disabled={isProcessing}
                          >
                            {isProcessing
                              ? 'Memproses...'
                              : 'Input Dana'}
                          </button>

                          <div>
                            <input
                              type="number"
                              min="10"
                              max="100"
                              placeholder="Nilai 10-100"
                              value={
                                voteScores[
                                  product.id
                                ] ?? ''
                              }
                              onChange={(event) =>
                                setVoteScores(
                                  (current) => ({
                                    ...current,
                                    [product.id]:
                                      event.target.value,
                                  })
                                )
                              }
                              disabled={isProcessing}
                            />

                            <button
                              type="button"
                              onClick={() =>
                                handleVote(
                                  product.id
                                )
                              }
                              disabled={isProcessing}
                            >
                              {isProcessing
                                ? 'Memproses...'
                                : 'Beri Nilai'}
                            </button>
                          </div>
                        </>
                      )}

                      {product.approval_status ===
                        'rejected' && (
                        <button
                          type="button"
                          onClick={() =>
                            handleDelete(
                              product.id
                            )
                          }
                          disabled={isProcessing}
                        >
                          {isProcessing
                            ? 'Menghapus...'
                            : 'Hapus Pengajuan'}
                        </button>
                      )}
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

export default AdminProducts