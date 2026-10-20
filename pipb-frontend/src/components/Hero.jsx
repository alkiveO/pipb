import { useEffect, useState } from 'react'
import { API_URL } from '../services/api'
import Container from './ui/Container'

function Hero({ onProducts }) {
  const [featured, setFeatured] = useState(null)

  useEffect(() => {
    fetch(`${API_URL}/products`, { headers: { Accept: 'application/json' } })
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        const list = data?.data || data || []
        if (Array.isArray(list) && list.length > 0) {
          setFeatured(list[0])
        }
      })
      .catch(() => {})
  }, [])

  return (
    <section id="home" className="pb-20 pt-12 md:pb-28 md:pt-20">
      <Container>

        <div className="mt-10 grid gap-10 md:mt-14 lg:grid-cols-[1.4fr_1fr] lg:items-end lg:gap-12">
          <h1 className="font-sans text-5xl font-bold leading-[1.02] tracking-tight text-ink md:text-6xl lg:text-7xl">
            Ruang untuk{' '}
            <span className="text-accent">ide bertumbuh</span> jadi produk.
          </h1>

          <div className="flex flex-col gap-6">
            <p className="text-lg leading-relaxed text-muted">
              PIPB mendampingi mahasiswa mengubah gagasan menjadi produk
              dan inovasi yang siap dilihat, dinilai, dan didanai.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={onProducts}
                className="rounded-full bg-ink px-6 py-3 text-sm font-medium text-paper transition hover:bg-ink/85"
              >
                Jelajahi Produk
              </button>

              <a
                href="#tentang"
                className="rounded-full border border-ink px-6 py-3 text-sm font-medium text-ink transition hover:bg-ink hover:text-paper"
              >
                Tentang PIPB
              </a>
            </div>
          </div>
        </div>

        <div className="relative mt-16 overflow-hidden rounded-3xl bg-ink md:mt-20">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(250,247,241,0.12),transparent_55%)]" />

          <div className="relative flex min-h-72 flex-col justify-between p-6 text-paper md:min-h-88 md:p-10">
            <div className="flex items-start justify-between text-xs uppercase tracking-[0.25em] text-paper/50">
              <p>Innovation</p>
              <p>PIPB / 2026</p>
            </div>

            <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
              <p className="max-w-md font-sans text-3xl font-bold leading-tight tracking-tight md:text-5xl">
                Ideas in motion.
              </p>

              {featured ? (
                <a
                  href="#produk"
                  onClick={onProducts}
                  className="group flex items-center gap-4 rounded-2xl bg-paper p-3 pr-5 text-ink shadow-xl transition-transform hover:-translate-y-1"
                >
                  <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-surface">
                    {featured.images?.[0]?.url && (
                      <img
                        src={featured.images[0].url}
                        alt={featured.name}
                        className="h-full w-full object-cover"
                      />
                    )}
                  </div>

                  <div className="min-w-0">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-muted">
                      Produk terbaru
                    </p>
                    <p className="truncate text-sm font-semibold">
                      {featured.name}
                    </p>
                  </div>
                </a>
              ) : (
                <p className="text-xs uppercase tracking-[0.2em] text-paper/40">
                  Segera hadir
                </p>
              )}
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}

export default Hero