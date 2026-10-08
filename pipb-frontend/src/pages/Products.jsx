import { useEffect, useState } from 'react'
import { getProducts } from '../services/api'
import './Products.css'

function Products({
  onBack,
  onCreateProduct,
  onProductDetail,
}) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchProducts = async () => {
    try {
      setError('')

      const data = await getProducts()

      setProducts(data.data || [])
    } catch (error) {
      console.error(
        'Gagal mengambil produk:',
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

  return (
    <div className="products-page">
      <nav className="products-navbar">
        <div className="products-logo">
          PIPB
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
              PRODUK
            </p>

            <h1>
              Produk Mahasiswa
            </h1>

            <p>
              Temukan berbagai produk dan inovasi yang
              dikembangkan oleh mahasiswa.
            </p>
          </div>

          <button
            type="button"
            className="products-create-button"
            onClick={onCreateProduct}
          >
            Ajukan Produk
          </button>
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
              Belum ada produk yang tersedia.
            </p>
          )}

        {!loading &&
          !error &&
          products.length > 0 && (
            <div className="products-grid">
              {products.map((product) => {
                const imageUrl =
                  getImageUrl(product)

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

                      <button
                        type="button"
                        onClick={() =>
                          onProductDetail(
                            product.id
                          )
                        }
                      >
                        Lihat Detail
                      </button>
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

export default Products