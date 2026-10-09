import { useEffect, useState } from 'react'
import { getProducts } from '../services/api'
import Container from '../components/ui/Container'
import Navbar from '../components/layout/Navbar'

function Products({
  onBack,
  onCreateProduct,
  onProductDetail,
  onNavigate,
  page,
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
      console.error('Gagal mengambil produk:', error)
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

  return (
    <div className="min-h-screen bg-paper">
      <Navbar authenticated onNavigate={onNavigate} page={page || 'products'} />

      <main className="pb-24 pt-16">
        <Container>
          {/* Header */}
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-muted">
                Produk
              </p>

              <h1 className="mt-4 font-sans text-4xl font-bold tracking-tight text-ink md:text-5xl">
                Produk Mahasiswa
              </h1>

              <p className="mt-3 max-w-xl leading-relaxed text-muted">
                Temukan berbagai produk dan inovasi yang dikembangkan oleh
                mahasiswa.
              </p>
            </div>

            <button
              type="button"
              onClick={onCreateProduct}
              className="self-start rounded-full bg-ink px-6 py-3 text-sm font-medium text-paper transition-colors hover:bg-ink/85 md:self-auto"
            >
              Ajukan Produk
            </button>
          </div>

          {/* Loading */}
          {loading && (
            <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <article
                  key={i}
                  className="overflow-hidden rounded-2xl border border-line bg-paper"
                >
                  <div className="aspect-[4/3] animate-pulse bg-surface" />
                  <div className="space-y-3 p-6">
                    <div className="h-3 w-20 animate-pulse rounded bg-surface" />
                    <div className="h-5 w-2/3 animate-pulse rounded bg-surface" />
                    <div className="h-3 w-full animate-pulse rounded bg-surface" />
                    <div className="h-3 w-5/6 animate-pulse rounded bg-surface" />
                  </div>
                </article>
              ))}
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="mt-16 rounded-2xl border border-line bg-surface px-6 py-12 text-center">
              <p className="text-sm text-muted">{error}</p>
            </div>
          )}

          {/* Empty */}
          {!loading && !error && products.length === 0 && (
            <div className="mt-16 rounded-2xl border border-line bg-surface px-6 py-16 text-center">
              <p className="text-xs uppercase tracking-[0.3em] text-muted">
                Kosong
              </p>
              <h2 className="mt-3 font-sans text-2xl font-bold tracking-tight text-ink">
                Belum ada produk yang tersedia
              </h2>
              <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted">
                Produk yang diajukan mahasiswa akan muncul di sini setelah
                disetujui tim reviewer PIPB.
              </p>

              <button
                type="button"
                onClick={onCreateProduct}
                className="mt-8 rounded-full bg-ink px-6 py-3 text-sm font-medium text-paper transition-colors hover:bg-ink/85"
              >
                Ajukan Produk Pertama
              </button>
            </div>
          )}

          {/* Grid */}
          {!loading && !error && products.length > 0 && (
            <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => {
                const imageUrl = getImageUrl(product)

                return (
                  <article
                    key={product.id}
                    className="group overflow-hidden rounded-2xl border border-line bg-paper transition-all hover:-translate-y-1 hover:shadow-xl"
                  >
                    <div className="aspect-[4/3] overflow-hidden bg-surface">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={product.name}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <span className="text-xs uppercase tracking-wider text-muted">
                            Tidak ada gambar
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="p-6">
                      <p className="text-xs uppercase tracking-[0.2em] text-muted">
                        {product.category?.name || 'Produk'}
                      </p>

                      <h2 className="mt-2 text-lg font-semibold leading-snug text-ink">
                        {product.name}
                      </h2>

                      <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted">
                        {product.description}
                      </p>

                      <button
                        type="button"
                        onClick={() => onProductDetail(product.id)}
                        className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-ink transition-colors hover:text-accent"
                      >
                        Lihat Detail
                        <span aria-hidden="true">→</span>
                      </button>
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

export default Products