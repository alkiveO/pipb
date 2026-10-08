import { useEffect, useState } from 'react'
import { getMyProducts } from '../services/api'
import './Products.css'

function HistoryPengajuan({ onBack }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchMyProducts = async () => {
    try {
      setError('')

      const response = await getMyProducts()

      setProducts(response.data || [])
    } catch (error) {
      console.error(
        'Gagal mengambil history pengajuan:',
        error
      )

      setError(
        error.message ||
        'Gagal mengambil history pengajuan'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMyProducts()
  }, [])

  const getStatusLabel = (status) => {
    if (status === 'approved') {
      return 'Disetujui'
    }

    if (status === 'rejected') {
      return 'Ditolak'
    }

    return 'Menunggu Approval'
  }

  const getStatusClass = (status) => {
    if (status === 'approved') {
      return 'status-approved'
    }

    if (status === 'rejected') {
      return 'status-rejected'
    }

    return 'status-pending'
  }

  const formatCurrency = (value) => {
    return `Rp ${Number(value || 0).toLocaleString(
      'id-ID'
    )}`
  }

  const formatDate = (value) => {
    if (!value) {
      return '-'
    }

    return new Date(value).toLocaleDateString(
      'id-ID',
      {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }
    )
  }

  return (
    <div className="products-page">
      <nav className="products-navbar">
        <div className="products-logo">
          PIPB MAHASISWA
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
              MAHASISWA
            </p>

            <h1>
              History Pengajuan
            </h1>

            <p>
              Lihat seluruh produk yang pernah
              kamu ajukan dan perkembangan
              pengajuanmu di PIPB.
            </p>
          </div>
        </div>

        {error && (
          <p>
            {error}
          </p>
        )}

        {loading && (
          <p>
            Memuat history pengajuan...
          </p>
        )}

        {!loading &&
          !error &&
          products.length === 0 && (
            <p>
              Kamu belum memiliki pengajuan
              produk.
            </p>
          )}

        {!loading &&
          !error &&
          products.length > 0 && (
            <div className="products-grid">
              {products.map((product) => {
                const primaryImage =
                  product.images?.find(
                    (image) =>
                      image.is_primary
                  ) ||
                  product.images?.[0]

                return (
                  <article
                    className="product-item"
                    key={product.id}
                  >
                    {primaryImage?.image_url ? (
                      <img
                        src={
                          primaryImage.image_url
                        }
                        alt={product.name}
                        className="product-image"
                      />
                    ) : (
                      <div className="product-item-image">
                        Tidak ada gambar
                      </div>
                    )}

                    <div className="product-item-content">
                      <span>
                        {product.category?.name ||
                          'Tanpa Kategori'}
                      </span>

                      <h2>
                        {product.name}
                      </h2>

                      <p>
                        {product.description}
                      </p>

                      <p>
                        <strong>
                          Status Pengajuan:
                        </strong>{' '}
                        <span
                          className={getStatusClass(
                            product.approval_status
                          )}
                        >
                          {getStatusLabel(
                            product.approval_status
                          )}
                        </span>
                      </p>

                      {product.approval_status ===
                        'rejected' &&
                        product.rejection_reason && (
                          <p>
                            <strong>
                              Alasan Penolakan:
                            </strong>{' '}
                            {
                              product.rejection_reason
                            }
                          </p>
                        )}

                      <p>
                        <strong>
                          Dana Awal:
                        </strong>{' '}
                        {formatCurrency(
                          product.initial_fund
                        )}
                      </p>

                      <p>
                        <strong>
                          Dana Terkumpul:
                        </strong>{' '}
                        {formatCurrency(
                          product.investment_amount
                        )}
                      </p>

                      <p>
                        <strong>
                          Target Dana:
                        </strong>{' '}
                        {formatCurrency(
                          product.target_fund
                        )}
                      </p>

                      <p>
                        <strong>
                          Tanggal Launch:
                        </strong>{' '}
                        {formatDate(
                          product.launch_date
                        )}
                      </p>

                      <p>
                        <strong>
                          Status Launch:
                        </strong>{' '}
                        {product.launch_status ===
                        'launch'
                          ? 'Sudah Launch'
                          : 'Belum Launch'}
                      </p>

                      {product.approval_status ===
                        'approved' && (
                        <p>
                          <strong>
                            Penilaian Content Manager:
                          </strong>{' '}
                          {product.votes_avg_score !==
                            null &&
                          product.votes_avg_score !==
                            undefined
                            ? Number(
                                product.votes_avg_score
                              ).toFixed(2)
                            : '-'}{' '}
                          / 100 (
                          {product.votes_count ||
                            0}{' '}
                          penilaian)
                        </p>
                      )}

                      <p>
                        <strong>
                          Diajukan:
                        </strong>{' '}
                        {formatDate(
                          product.created_at
                        )}
                      </p>

                      {product.approval_status ===
                        'rejected' && (
                        <div
                          style={{
                            marginTop: '16px',
                            paddingTop: '16px',
                            borderTop:
                              '1px solid #e5e7eb',
                            display: 'flex',
                            gap: '10px',
                            flexWrap: 'wrap',
                          }}
                        >
                          <button
                            type="button"
                            onClick={() => {
                              alert(
                                'Fitur edit dan ajukan kembali akan kita sambungkan di step berikutnya.'
                              )
                            }}
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
                          >
                            Hapus Pengajuan
                          </button>
                        </div>
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

export default HistoryPengajuan