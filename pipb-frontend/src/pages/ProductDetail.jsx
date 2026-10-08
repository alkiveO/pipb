import { useEffect, useState } from 'react'
import { getProductById } from '../services/api'
import './ProductDetail.css'

function ProductDetail({
  productId,
  onBack,
}) {
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedImage, setSelectedImage] = useState(null)

  const fetchProduct = async () => {
    try {
      setLoading(true)
      setError('')

      const response =
        await getProductById(productId)

      const productData = response.data

      setProduct(productData)

      const primaryImage =
        productData?.images?.find(
          (image) => image.is_primary
        ) ||
        productData?.images?.[0]

      setSelectedImage(
        primaryImage || null
      )
    } catch (error) {
      console.error(
        'Gagal mengambil detail produk:',
        error
      )

      setError(
        error.message ||
        'Gagal mengambil detail produk'
      )
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
    if (!image?.image_url) {
      return null
    }

    if (
      image.image_url.startsWith('http')
    ) {
      return image.image_url
    }

    return `http://127.0.0.1:8000${image.image_url}`
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat(
      'id-ID',
      {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
      }
    ).format(Number(value) || 0)
  }

  const formatDate = (value) => {
    if (!value) {
      return '-'
    }

    return new Date(
      value
    ).toLocaleDateString(
      'id-ID',
      {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }
    )
  }

  if (loading) {
    return (
      <div className="product-detail-page">
        <nav className="product-detail-navbar">
          <div className="product-detail-logo">
            PIPB
          </div>

          <button
            type="button"
            className="product-detail-back-button"
            onClick={onBack}
          >
            Kembali
          </button>
        </nav>

        <main className="product-detail-main">
          <p>Memuat detail produk...</p>
        </main>
      </div>
    )
  }

  if (error) {
    return (
      <div className="product-detail-page">
        <nav className="product-detail-navbar">
          <div className="product-detail-logo">
            PIPB
          </div>

          <button
            type="button"
            className="product-detail-back-button"
            onClick={onBack}
          >
            Kembali
          </button>
        </nav>

        <main className="product-detail-main">
          <p className="product-detail-error">
            {error}
          </p>
        </main>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="product-detail-page">
        <nav className="product-detail-navbar">
          <div className="product-detail-logo">
            PIPB
          </div>

          <button
            type="button"
            className="product-detail-back-button"
            onClick={onBack}
          >
            Kembali
          </button>
        </nav>

        <main className="product-detail-main">
          <p>
            Produk tidak ditemukan.
          </p>
        </main>
      </div>
    )
  }

  const images = product.images || []

  const primaryImage =
    images.find(
      (image) => image.is_primary
    ) || images[0]

  const additionalImages =
    images.filter(
      (image) =>
        image.id !== primaryImage?.id
    )

  return (
    <div className="product-detail-page">
      <nav className="product-detail-navbar">
        <div className="product-detail-logo">
          PIPB
        </div>

        <button
          type="button"
          className="product-detail-back-button"
          onClick={onBack}
        >
          Kembali
        </button>
      </nav>

      <main className="product-detail-main">
        <div className="product-detail-gallery">
          <div className="product-detail-main-image">
            {selectedImage ? (
              <img
                src={getImageUrl(
                  selectedImage
                )}
                alt={product.name}
              />
            ) : (
              <span>
                Tidak ada gambar
              </span>
            )}
          </div>

          {additionalImages.length > 0 && (
            <div className="product-detail-thumbnails">
              {additionalImages.map(
                (image) => (
                  <button
                    type="button"
                    key={image.id}
                    className={
                      selectedImage?.id ===
                      image.id
                        ? 'product-detail-thumbnail active'
                        : 'product-detail-thumbnail'
                    }
                    onClick={() =>
                      setSelectedImage(
                        image
                      )
                    }
                  >
                    <img
                      src={getImageUrl(
                        image
                      )}
                      alt={`${product.name} ${
                        image.id
                      }`}
                    />
                  </button>
                )
              )}
            </div>
          )}
        </div>

        <section className="product-detail-info">
          <span className="product-detail-category">
            {product.category?.name ||
              'PRODUK'}
          </span>

          <h1>
            {product.name}
          </h1>

          <p className="product-detail-owner">
            Dibuat oleh:{' '}
            {product.user?.name ||
              'Mahasiswa'}
          </p>

          <div className="product-detail-description">
            <h2>
              Deskripsi
            </h2>

            <p>
              {product.description}
            </p>
          </div>

          <div className="product-detail-funds">
            <div>
              <span>
                Dana Awal
              </span>

              <strong>
                {formatCurrency(
                  product.initial_fund
                )}
              </strong>
            </div>

            <div>
              <span>
                Dana Terkumpul
              </span>

              <strong>
                {formatCurrency(
                  product.investment_amount
                )}
              </strong>
            </div>

            <div>
              <span>
                Target Dana
              </span>

              <strong>
                {formatCurrency(
                  product.target_fund
                )}
              </strong>
            </div>
          </div>

          <div className="product-detail-status">
            <div>
              <span>
                Tanggal Launch
              </span>

              <strong>
                {formatDate(
                  product.launch_date
                )}
              </strong>
            </div>

            <div>
              <span>
                Status
              </span>

              <strong>
                {product.launch_status ===
                'launch'
                  ? 'Launch'
                  : 'Belum Launch'}
              </strong>
            </div>
          </div>

          <div className="product-detail-rating">
            <span>
              Penilaian Content Manager
            </span>

            <strong>
              {product.votes_avg_score !==
              null &&
              product.votes_avg_score !==
                undefined
                ? Number(
                    product.votes_avg_score
                  ).toFixed(2)
                : '-'}
            </strong>

            <p>
              {product.votes_count || 0}{' '}
              penilaian
            </p>
          </div>
        </section>
      </main>
    </div>
  )
}

export default ProductDetail