import { useEffect, useState } from 'react'
import { getNews, API_URL } from '../services/api'
import Container from '../components/ui/Container'
import Navbar from '../components/layout/Navbar'

function News({ onBack, onNavigate, page, onOpenDetail }) {
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

  const getImageUrl = (image) => {
    if (!image) return null

    if (/^https?:\/\//i.test(image)) {
      return image
    }

    const baseUrl = API_URL.replace(/\/api\/?$/, '')

    return `${baseUrl}/storage/${image.replace(/^\/+/, '')}`
  }

  const formatDate = (value) => {
    if (!value) return null

    const date = new Date(value)

    if (Number.isNaN(date.getTime())) return null

    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      timeZone: 'UTC',
    })
  }

  const formatTime = (value) => {
    if (!value) return null
    return value.substring(0, 5)
  }

  const handleOpenDetail = (item) => {
    if (onOpenDetail) {
      onOpenDetail(item.id)
    } else {
      console.error(
        'Navigasi detail berita belum dihubungkan di DashboardMahasiswa.'
      )
    }
  }

  return (
    <div className="min-h-screen bg-paper">
      <Navbar
        authenticated
        onNavigate={onNavigate}
        page={page || 'news'}
      />

      <main className="pb-24 pt-16">
        <Container>
          {/* Header */}
          <section className="mb-10 md:mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted">
              Informasi PIPB
            </p>

            <h1 className="mt-4 font-sans text-3xl font-bold tracking-tight text-ink md:text-5xl">
              Berita & Pengumuman
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted md:text-base">
              Temukan informasi, kegiatan, dan pengumuman terbaru dari PIPB.
            </p>
          </section>

          {/* Loading */}
          {loading && (
            <div className="grid items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <article
                  key={item}
                  className="overflow-hidden rounded-2xl border border-line bg-paper"
                >
                  <div className="h-64 animate-pulse bg-surface" />

                  <div className="space-y-3 p-5">
                    <div className="h-3 w-20 animate-pulse rounded bg-surface" />
                    <div className="h-5 w-3/4 animate-pulse rounded bg-surface" />
                    <div className="h-3 w-full animate-pulse rounded bg-surface" />
                    <div className="h-3 w-2/3 animate-pulse rounded bg-surface" />
                  </div>
                </article>
              ))}
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="rounded-2xl border border-line bg-surface px-6 py-12 text-center">
              <h2 className="text-lg font-semibold text-ink">
                Berita gagal dimuat
              </h2>

              <p className="mt-2 text-sm text-muted">{error}</p>

              <button
                type="button"
                onClick={() => {
                  setLoading(true)
                  fetchNews()
                }}
                className="mt-5 rounded-xl border border-line px-5 py-2.5 text-sm font-medium text-ink transition hover:bg-paper"
              >
                Coba Lagi
              </button>
            </div>
          )}

          {/* Empty */}
          {!loading && !error && news.length === 0 && (
            <div className="rounded-2xl border border-line bg-surface px-6 py-16 text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-muted">
                Informasi PIPB
              </p>

              <h2 className="mt-3 text-2xl font-bold text-ink">
                Belum ada berita
              </h2>

              <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted">
                Berita dan pengumuman terbaru akan muncul di halaman ini.
              </p>
            </div>
          )}

          {/* News Cards */}
          {!loading && !error && news.length > 0 && (
            <div className="grid items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {news.map((item) => {
                const imageUrl = getImageUrl(item.image)

                return (
                  <article
                    key={item.id}
                    role="link"
                    tabIndex={0}
                    aria-label={`Buka detail berita ${item.title}`}
                    onClick={() => handleOpenDetail(item)}
                    onKeyDown={(event) => {
                      if (
                        event.key === 'Enter' ||
                        event.key === ' '
                      ) {
                        event.preventDefault()
                        handleOpenDetail(item)
                      }
                    }}
                    className="group flex h-full min-w-0 cursor-pointer flex-col overflow-hidden rounded-2xl border border-line bg-paper shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-ink focus:ring-offset-2"
                  >
                    {/* Image */}
                    <div className="flex h-64 w-full shrink-0 items-center justify-center overflow-hidden bg-surface p-3">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={`Poster ${item.title}`}
                          loading="lazy"
                          className="h-full w-full rounded-lg object-contain transition-transform duration-300 group-hover:scale-[1.02]"
                          onError={(event) => {
                            event.currentTarget.style.display = 'none'
                          }}
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center rounded-lg border border-dashed border-line text-sm text-muted">
                          Tidak ada poster
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex flex-1 flex-col p-5 md:p-6">
                      <div className="flex min-h-6 flex-wrap items-center gap-2">
                        <span className="rounded-full bg-surface px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-muted">
                          {item.event_date ? 'Event' : 'Berita'}
                        </span>

                        {item.event_date && (
                          <span className="text-xs text-muted">
                            {formatDate(item.event_date)}
                          </span>
                        )}
                      </div>

                      <h2 className="mt-3 min-h-[3.5rem] line-clamp-2 break-words text-xl font-bold leading-7 tracking-tight text-ink">
                        {item.title}
                      </h2>

                      {/* Event Information */}
                      <div className="mt-3 min-h-[4.5rem] space-y-2">
                        {item.event_date && (
                          <p className="line-clamp-1 text-xs text-muted">
                            <span className="font-semibold text-ink">
                              Tanggal:
                            </span>{' '}
                            {formatDate(item.event_date)}
                          </p>
                        )}

                        {item.event_time && (
                          <p className="line-clamp-1 text-xs text-muted">
                            <span className="font-semibold text-ink">
                              Waktu:
                            </span>{' '}
                            {formatTime(item.event_time)}
                          </p>
                        )}

                        {item.location && (
                          <p className="line-clamp-1 text-xs text-muted">
                            <span className="font-semibold text-ink">
                              Lokasi:
                            </span>{' '}
                            {item.location}
                          </p>
                        )}
                      </div>

                      <p className="mt-3 min-h-[6rem] line-clamp-4 whitespace-pre-line break-words text-sm leading-6 text-muted">
                        {item.content}
                      </p>

                      {/* Footer */}
                      <div className="mt-auto flex items-center justify-between gap-3 border-t border-line pt-4">
                        <div className="min-w-0">
                          <p className="text-[10px] uppercase tracking-wider text-muted">
                            Dipublikasikan oleh
                          </p>

                          <p className="mt-1 truncate text-xs font-semibold text-ink">
                            {item.admin?.name || 'Content Manager'}
                          </p>
                        </div>

                        <span className="shrink-0 text-xs font-semibold text-ink">
                          Lihat detail 
                        </span>
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

export default News