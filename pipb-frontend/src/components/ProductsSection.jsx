import { useEffect, useState } from 'react'
import { API_URL, getProducts } from '../services/api'
import Container from './ui/Container'

const STORAGE_URL = API_URL.replace(/\/api\/?$/, '/storage')

function getImageUrl(image) {
  if (!image) return null
  if (typeof image === 'string' && /^https?:\/\//i.test(image)) return image
  if (typeof image === 'object') return getImageUrl(image.url || image.image || image.path || image.image_path)
  const path = String(image).replace(/^\/+/, '').replace(/^(storage|public)\//, '')
  return `${STORAGE_URL}/${path}`
}

function ProductsSection({ onProducts }) {
  const [products, setProducts] = useState([])

  useEffect(() => {
    let active = true
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 3000)

    const fetchProducts = async () => {
      try {
        const response = await getProducts({ signal: controller.signal })
        clearTimeout(timeoutId)
        const list = response?.data ?? response
        if (active && Array.isArray(list)) {
          setProducts(list.slice(0, 3))
        }
      } catch (error) {
        // Diamkan jika error
      }
    }

    fetchProducts()
    return () => {
      active = false
      clearTimeout(timeoutId)
      controller.abort()
    }
  }, [])

  const handleViewAllProducts = () => {
    if (typeof onProducts === 'function') onProducts()
  }

  return (
    <section id="produk" className="border-b border-line py-10 md:py-14">
      <Container>
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-muted">Produk</p>
            <h2 className="mt-3 font-sans text-5xl font-bold tracking-tight text-ink md:text-6xl">Produk Unggulan</h2>
          </div>
          <button type="button" onClick={handleViewAllProducts} className="self-start rounded-full border border-ink px-6 py-3 text-sm font-medium text-ink transition hover:bg-ink hover:text-paper md:self-auto">
            Lihat Semua Produk
          </button>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {products.length === 0 &&
            [1, 2, 3].map((i) => (
              <article key={i} className="overflow-hidden rounded-2xl border border-line bg-paper">
                <div className="aspect-4/3 bg-surface" />
                <div className="p-6">
                  <p className="text-xs uppercase tracking-[0.2em] text-muted">Segera hadir</p>
                  <h3 className="mt-2 text-lg font-semibold text-muted/60">Produk belum tersedia</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted/60">Produk yang diajukan mahasiswa akan muncul di sini setelah disetujui tim reviewer.</p>
                </div>
              </article>
            ))}

          {products.map((product) => {
            const firstImage = product.images?.[0]
            const imageUrl = getImageUrl(firstImage?.url || firstImage?.image || firstImage?.path || firstImage?.image_path || product.image || product.image_url || product.thumbnail)

            return (
              <article key={product.id} className="overflow-hidden rounded-2xl border border-line bg-paper transition hover:shadow-lg">
                <div className="aspect-4/3 bg-surface">
                  {imageUrl && (
                    <img src={imageUrl} alt={product.name || 'Gambar produk'} loading="lazy" className="h-full w-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none' }} />
                  )}
                </div>
                <div className="p-6">
                  <p className="text-xs uppercase tracking-[0.2em] text-muted">{product.category?.name || 'Produk'}</p>
                  <h3 className="mt-2 text-lg font-semibold text-ink">{product.name}</h3>
                  <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted">{product.description}</p>
                </div>
              </article>
            )
          })}
        </div>
      </Container>
    </section>
  )
}

export default ProductsSection