import { useEffect, useState } from 'react'
import { getNews } from '../services/api'
import Container from './ui/Container'

// Fallback kalau backend kosong
const placeholderNews = [
  { id: 1, date: '24 September 2026', title: 'Pengumuman terbaru PIPB' },
  { id: 2, date: '20 September 2026', title: 'Informasi kegiatan PIPB' },
  { id: 3, date: '15 September 2026', title: 'Program dan kegiatan mahasiswa' },
]

function News() {
  const [news, setNews] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getNews()
      .then((data) => {
        const list = data?.data || data || []
        setNews(Array.isArray(list) ? list.slice(0, 5) : [])
      })
      .catch((error) => console.error('Gagal memuat berita:', error))
      .finally(() => setLoading(false))
  }, [])

  const items = !loading && news.length > 0
    ? news.map((item) => ({
        id: item.id,
        date: item.created_at
          ? new Date(item.created_at).toLocaleDateString('id-ID', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })
          : 'Tanpa tanggal',
        title: item.title,
      }))
    : placeholderNews

  return (
    <section id="berita" className="bg-ink py-24 text-paper md:py-32">
      <Container>
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-paper/50">
              Latest
            </p>

            <h2 className="mt-4 font-sans text-5xl font-bold tracking-tight md:text-6xl">
              Berita Terbaru
            </h2>
          </div>

          <p className="max-w-sm leading-relaxed text-paper/60">
            Informasi terbaru seputar kegiatan dan perkembangan PIPB.
          </p>
        </div>

        <div className="mt-16 border-t border-paper/15">
          {items.map((item, index) => (
            <article
              key={item.id}
              className="group grid items-center gap-2 border-b border-paper/15 py-8 transition-all md:grid-cols-[5rem_12rem_1fr_auto] md:gap-8 md:hover:pl-4"
            >
              <p className="hidden text-sm text-paper/40 md:block">
                {String(index + 1).padStart(2, '0')}
              </p>

              <p className="text-sm text-paper/50">{item.date}</p>

              <h3 className="text-xl font-medium tracking-tight md:text-2xl">
                {item.title}
              </h3>

              <div className="hidden h-12 w-12 items-center justify-center rounded-full border border-paper/25 text-xl transition-colors group-hover:bg-paper group-hover:text-ink md:flex">
                ↗
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  )
}

export default News