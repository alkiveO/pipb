import { useEffect, useState } from 'react'
import { getNews } from '../services/api'
import Container from '../components/ui/Container'
import Navbar from '../components/layout/Navbar'

function News({ onBack, onNavigate, page }) {
  const [news, setNews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchNews = async () => {
    try {
      setError('')
      const response = await getNews()
      setNews(response.data || [])
    } catch (error) {
      console.error('Gagal mengambil berita:', error)
      setError(error.message || 'Gagal mengambil berita')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNews()
  }, [])

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
      <Navbar authenticated onNavigate={onNavigate} page={page || 'news'} />

      <main className="pb-24 pt-16">
        <Container>
          {/* Header */}
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-muted">
              Informasi PIPB
            </p>

            <h1 className="mt-4 font-sans text-4xl font-bold tracking-tight text-ink md:text-5xl">
              Berita & Pengumuman
            </h1>

            <p className="mt-3 max-w-2xl leading-relaxed text-muted">
              Lihat berita dan informasi terbaru dari PIPB.
            </p>
          </div>

          {/* Loading skeleton */}
          {loading && (
            <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <article
                  key={i}
                  className="rounded-2xl border border-line bg-paper p-6"
                >
                  <div className="h-3 w-20 animate-pulse rounded bg-surface" />
                  <div className="mt-4 h-5 w-3/4 animate-pulse rounded bg-surface" />
                  <div className="mt-3 h-3 w-full animate-pulse rounded bg-surface" />
                  <div className="mt-2 h-3 w-2/3 animate-pulse rounded bg-surface" />
                  <div className="mt-6 h-3 w-1/2 animate-pulse rounded bg-surface" />
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
          {!loading && !error && news.length === 0 && (
            <div className="mt-16 rounded-2xl border border-line bg-surface px-6 py-16 text-center">
              <p className="text-xs uppercase tracking-[0.3em] text-muted">
                Kosong
              </p>
              <h2 className="mt-3 font-sans text-2xl font-bold tracking-tight text-ink">
                Belum ada berita
              </h2>
              <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted">
                Berita dan pengumuman terbaru dari PIPB akan muncul di sini.
              </p>
            </div>
          )}

          {/* Grid */}
          {!loading && !error && news.length > 0 && (
            <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {news.map((item) => (
                <article
                  key={item.id}
                  className="group flex flex-col rounded-2xl border border-line bg-paper p-6 transition-all hover:-translate-y-1 hover:shadow-lg"
                >
                  <p className="text-xs uppercase tracking-[0.2em] text-muted">
                    Berita
                  </p>

                  <h2 className="mt-3 font-sans text-lg font-semibold leading-snug text-ink md:text-xl">
                    {item.title}
                  </h2>

                  <p className="mt-3 line-clamp-4 flex-1 text-sm leading-relaxed text-muted">
                    {item.content}
                  </p>

                  <div className="mt-6 flex items-center justify-between border-t border-line pt-4">
                    <p className="text-xs text-muted">
                      {item.admin?.name || 'Content Manager'}
                    </p>

                    <p className="text-xs text-muted">
                      {formatDate(item.created_at)}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          )}
        </Container>
      </main>
    </div>
  )
}

export default News