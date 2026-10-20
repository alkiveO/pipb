import { useEffect, useState } from 'react'
import { getNews } from '../services/api'
import Container from './ui/Container'

const API_URL = 'http://127.0.0.1:8000/api'
const STORAGE_URL = API_URL.replace(/\/api\/?$/, '/storage')

const placeholderNews = [
  { id: 1, date: '24 September 2026', title: 'Pengumuman terbaru PIPB' },
  { id: 2, date: '20 September 2026', title: 'Informasi kegiatan PIPB' },
  { id: 3, date: '15 September 2026', title: 'Program dan kegiatan mahasiswa' },
]

function getImageUrl(image) {
  if (!image) return null
  if (/^https?:\/\//i.test(image)) return image
  const path = image.replace(/^\/+/, '').replace(/^(storage|public)\//, '')
  return `${STORAGE_URL}/${path}`
}

function News({ onNavigate, page = 'home' }) {
  const [news, setNews] = useState(
    placeholderNews.map((item) => ({ ...item, imageUrl: null, isPlaceholder: true }))
  )

  useEffect(() => {
    let active = true
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 3000)

    const fetchNews = async () => {
      try {
        const response = await getNews({ signal: controller.signal })
        clearTimeout(timeoutId)
        const list = response?.data ?? response
        if (active && Array.isArray(list) && list.length > 0) {
          setNews(list.slice(0, 5))
        }
      } catch (error) {
        // Diamkan jika error
      }
    }

    fetchNews()
    return () => {
      active = false
      clearTimeout(timeoutId)
      controller.abort()
    }
  }, [])

  const formatDate = (date) => {
    if (!date) return 'Tanpa tanggal'
    const parsedDate = new Date(date)
    if (Number.isNaN(parsedDate.getTime())) return 'Tanpa tanggal'
    return parsedDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
  }

  const items = news.map((item) => ({
    ...item,
    date: item.isPlaceholder ? item.date : formatDate(item.published_at || item.created_at),
    imageUrl: item.isPlaceholder ? null : getImageUrl(item.image || item.poster || item.thumbnail),
  }))

  const handleOpenDetail = () => {
    if (typeof onNavigate === 'function') return onNavigate('login')
    window.history.pushState({}, '', '/login')
    window.dispatchEvent(new PopStateEvent('popstate'))
  }

  return (
    <section id="berita" className={`bg-ink py-12 text-paper md:py-16 ${page === 'news' ? 'min-h-screen' : ''}`}>
      <Container>
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-paper/50">Latest</p>
            <h2 className="mt-3 font-sans text-5xl font-bold tracking-tight md:text-6xl">Berita Terbaru</h2>
          </div>
          <p className="max-w-sm leading-relaxed text-paper/60">
            Informasi terbaru seputar kegiatan dan perkembangan PIPB.
          </p>
        </div>

        <div className="mt-10 border-t border-paper/15">
          {items.length === 0 ? (
            <p className="py-10 text-paper/60">Belum ada berita yang tersedia.</p>
          ) : (
            items.map((item, index) => (
              <article key={item.id} className="group border-b border-paper/15 transition-all md:hover:pl-4">
                <button type="button" onClick={handleOpenDetail} className="grid w-full cursor-pointer items-center gap-4 py-6 text-left md:grid-cols-[5rem_12rem_1fr_auto] md:gap-8">
                  <p className="hidden text-sm text-paper/40 md:block">{String(index + 1).padStart(2, '0')}</p>
                  <div className="text-sm text-paper/50">{item.date}</div>
                  <div className="flex min-w-0 items-center gap-5">
                    {item.imageUrl && (
                      <img src={item.imageUrl} alt="" className="h-20 w-28 shrink-0 rounded-lg border border-paper/15 object-cover" onError={(e) => { e.currentTarget.style.display = 'none' }} />
                    )}
                    <h3 className="text-xl font-medium tracking-tight md:text-2xl">{item.title}</h3>
                  </div>
                  <div className="hidden h-12 w-12 items-center justify-center rounded-full border border-paper/25 text-xl transition-colors group-hover:bg-paper group-hover:text-ink md:flex">↗</div>
                </button>
              </article>
            ))
          )}
        </div>
      </Container>
    </section>
  )
}

export default News