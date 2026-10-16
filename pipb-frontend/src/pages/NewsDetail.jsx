import { useEffect, useState } from 'react'
import { getNews, API_URL } from '../services/api'
import Container from '../components/ui/Container'
import Navbar from '../components/layout/Navbar'

function NewsDetail({ newsId, onBack, onNavigate, page }) {
  const [news, setNews] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false

    const fetchDetail = async () => {
      try {
        setLoading(true)
        setError('')

        const response = await getNews()
        const items = response.data || []

        const selected = items.find(
          (item) => String(item.id) === String(newsId)
        )

        if (!selected) {
          throw new Error('Berita tidak ditemukan.')
        }

        if (!cancelled) {
          setNews(selected)
        }
      } catch (err) {
        if (!cancelled) {
          console.error('Gagal mengambil detail berita:', err)
          setError(err.message || 'Gagal mengambil detail berita.')
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    if (newsId == null) {
      setError('ID berita belum diberikan.')
      setLoading(false)
    } else {
      fetchDetail()
    }

    return () => {
      cancelled = true
    }
  }, [newsId])

  const getImageUrl = (image) => {
    if (!image) return null

    if (/^https?:\/\//i.test(image)) {
      return image
    }

    const baseUrl = API_URL.replace(/\/api\/?$/, '')
    const imagePath = image.replace(/^\/+/, '')

    return `${baseUrl}/storage/${imagePath}`
  }

  const formatDate = (value) => {
    if (!value) return '-'

    const date = new Date(value)

    if (Number.isNaN(date.getTime())) return '-'

    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      timeZone: 'UTC',
    })
  }

  const formatTime = (value) => {
    if (!value) return '-'
    return value.substring(0, 5)
  }

  return (
    <div className="min-h-screen bg-paper">
      <Navbar
        authenticated
        onNavigate={onNavigate}
        page={page || 'news'}
      />

      <main className="pb-20 pt-16">
        <Container>
          {/* Tombol kembali */}
          <button
            type="button"
            onClick={onBack}
            className="mb-8 inline-flex items-center gap-2 rounded-xl border border-line px-4 py-2.5 text-sm font-medium text-ink transition hover:bg-surface"
          >
            
            Kembali ke berita
          </button>

          {/* Loading */}
          {loading && (
            <div className="mx-auto max-w-4xl animate-pulse">
              <div className="h-8 w-3/4 rounded-lg bg-surface" />
              <div className="mt-4 h-4 w-1/3 rounded bg-surface" />
              <div className="mt-8 h-72 rounded-2xl bg-surface" />

              <div className="mt-8 space-y-3">
                <div className="h-4 rounded bg-surface" />
                <div className="h-4 w-5/6 rounded bg-surface" />
                <div className="h-4 w-4/6 rounded bg-surface" />
              </div>
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="mx-auto max-w-2xl rounded-2xl border border-line bg-surface px-6 py-14 text-center">
              <h1 className="text-2xl font-bold text-ink">
                Berita tidak ditemukan
              </h1>

              <p className="mt-3 text-sm text-muted">
                {error}
              </p>

              <button
                type="button"
                onClick={onBack}
                className="mt-6 rounded-xl border border-line px-5 py-3 text-sm font-semibold text-ink transition hover:bg-paper"
              >
                Kembali ke daftar berita
              </button>
            </div>
          )}

          {/* Detail berita */}
          {!loading && !error && news && (
            <article className="mx-auto max-w-4xl">
              {/* Kategori dan tanggal publikasi */}
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-surface px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-muted">
                  {news.event_date ? 'Event' : 'Berita'}
                </span>

                <span className="text-sm text-muted">
                  Dipublikasikan {formatDate(news.created_at)}
                </span>
              </div>

              {/* Judul */}
              <h1 className="mt-5 break-words text-3xl font-bold leading-tight tracking-tight text-ink md:text-5xl">
                {news.title}
              </h1>

              {/* Penulis */}
              <p className="mt-4 text-sm text-muted">
                Oleh{' '}
                <span className="font-semibold text-ink">
                  {news.admin?.name || 'Content Manager'}
                </span>
              </p>

              {/* Poster fleksibel */}
              {news.image && (
                <div className="mt-8 flex max-h-[700px] min-h-[180px] items-center justify-center overflow-hidden rounded-2xl border border-line bg-surface p-3 md:mt-10 md:p-5">
                  <img
                    src={getImageUrl(news.image)}
                    alt={`Poster ${news.title}`}
                    loading="lazy"
                    className="block max-h-[660px] max-w-full rounded-xl object-contain"
                    onError={(event) => {
                      event.currentTarget.style.display = 'none'
                    }}
                  />
                </div>
              )}

              {/* Informasi acara */}
              {(news.event_date ||
                news.event_time ||
                news.location) && (
                <section className="mt-8 rounded-2xl border border-line bg-surface p-5 md:p-7">
                  <h2 className="text-lg font-bold text-ink">
                    Informasi Acara
                  </h2>

                  <div className="mt-5 grid gap-5 sm:grid-cols-2">
                    {news.event_date && (
                      <div>
                        <p className="text-xs font-medium uppercase tracking-wider text-muted">
                          Tanggal
                        </p>

                        <p className="mt-2 text-sm font-semibold text-ink">
                          {formatDate(news.event_date)}
                        </p>
                      </div>
                    )}

                    {news.event_time && (
                      <div>
                        <p className="text-xs font-medium uppercase tracking-wider text-muted">
                          Waktu
                        </p>

                        <p className="mt-2 text-sm font-semibold text-ink">
                          {formatTime(news.event_time)}
                        </p>
                      </div>
                    )}

                    {news.location && (
                      <div className="sm:col-span-2">
                        <p className="text-xs font-medium uppercase tracking-wider text-muted">
                          Lokasi
                        </p>

                        <p className="mt-2 break-words text-sm font-semibold text-ink">
                          {news.location}
                        </p>
                      </div>
                    )}
                  </div>
                </section>
              )}

              {/* Isi berita */}
              <section className="mt-8 md:mt-10">
                <h2 className="text-xl font-bold text-ink">
                  {news.event_date ? 'Tentang Acara' : 'Isi Berita'}
                </h2>

                <div className="mt-4 whitespace-pre-line break-words text-base leading-8 text-muted">
                  {news.content}
                </div>
              </section>

            </article>
          )}
        </Container>
      </main>
    </div>
  )
}

export default NewsDetail