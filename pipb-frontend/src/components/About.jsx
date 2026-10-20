import { useEffect, useState } from 'react'
import Container from './ui/Container'

const API_URL = 'http://127.0.0.1:8000/api'
const STORAGE_URL = 'http://127.0.0.1:8000/storage/'

// DATA DEFAULT (LANGSUNG TAMPIL)
const DEFAULT_ABOUT = {
  title: 'Mendorong ide menjadi peluang nyata.',
  description:
    'PIPB merupakan platform untuk memperkenalkan berbagai produk dan inovasi mahasiswa serta memberikan ruang untuk berkembang dan dikenal lebih luas — dari gagasan awal sampai produk siap didanai.',
  image: null,
}

function About() {
  // LANGSUNG ISI DENGAN DATA DEFAULT
  const [about, setAbout] = useState(DEFAULT_ABOUT)
  const [imageError, setImageError] = useState(false)

  useEffect(() => {
    let active = true
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 3000)

    const fetchAbout = async () => {
      try {
        const response = await fetch(`${API_URL}/about`, {
          headers: { Accept: 'application/json' },
          signal: controller.signal,
        })

        if (!response.ok) return

        const result = await response.json()

        if (active && result.success && result.data) {
          setAbout(result.data)
        }
      } catch (error) {
        // Diamkan jika error/timeout, data default tetap tampil
      }
    }

    fetchAbout()
    return () => {
      active = false
      clearTimeout(timeoutId)
      controller.abort()
    }
  }, [])

  const imageUrl = about?.image
    ? /^https?:\/\//i.test(about.image)
      ? about.image
      : `${STORAGE_URL}${about.image.replace(/^\/+/, '').replace(/^storage\//, '')}`
    : null

  const showImage = imageUrl && !imageError

  return (
    <section
      id="tentang"
      className="relative overflow-hidden border-b border-line bg-paper py-16 md:py-24"
    >
      <Container>
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <span className="h-px w-10 bg-accent" />
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted">
              Mengenal PIPB
            </p>
          </div>
          <span className="text-xs uppercase tracking-[0.2em] text-muted/70">
            Ide · Inovasi · Peluang
          </span>
        </div>

        <div className="mt-12 grid gap-10 md:mt-16 lg:grid-cols-[1.15fr_0.85fr] lg:items-start lg:gap-20">
          <div>
            <h2 className="max-w-3xl font-sans text-4xl font-bold leading-[1.08] tracking-tight text-ink sm:text-5xl md:text-6xl lg:text-7xl">
              {about?.title || DEFAULT_ABOUT.title}
            </h2>

            <div className="mt-8 flex items-start gap-4">
              <span className="mt-1 h-12 w-1 shrink-0 rounded-full bg-accent" />
              <p className="max-w-2xl text-base leading-8 text-muted md:text-lg md:leading-9">
                {about?.description || DEFAULT_ABOUT.description}
              </p>
            </div>

            <div className="mt-10 flex flex-wrap gap-3">
              {['Kreativitas Mahasiswa', 'Inovasi', 'Pengembangan Produk'].map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-line px-4 py-2 text-xs font-medium tracking-wide text-ink transition-colors duration-300 hover:border-ink/40"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="relative min-w-0 lg:pt-6">
            <div className="pointer-events-none absolute -right-3 -top-3 z-10 h-24 w-24 rounded-tr-3xl border-r border-t border-accent/50 md:-right-5 md:-top-1 md:h-32 md:w-32" />

            <div className="relative overflow-hidden rounded-2xl border border-line bg-surface shadow-sm">
              {showImage ? (
                <div className="flex w-full items-center justify-center p-2 sm:p-4">
                  <img
                    src={imageUrl}
                    alt={about?.title || 'Tentang PIPB'}
                    loading="lazy"
                    onLoad={() => setImageError(false)}
                    onError={() => setImageError(true)}
                    className="block h-auto w-full max-w-full rounded-xl object-contain object-center"
                  />
                </div>
              ) : (
                <div className="flex min-h-70 flex-col justify-between bg-surface p-7 sm:min-h-85 md:p-10">
                  <span className="text-xs font-semibold uppercase tracking-[0.25em] text-muted">
                    PIPB
                  </span>
                  <div>
                    <div className="mb-5 h-1 w-14 rounded-full bg-accent" />
                    <p className="max-w-xs font-sans text-3xl font-bold leading-tight tracking-tight text-ink md:text-4xl">
                      Dari ide, tumbuh menjadi inovasi.
                    </p>
                  </div>
                  <span className="self-end text-sm tracking-[0.2em] text-muted">
                    01 — PIPB
                  </span>
                </div>
              )}
            </div>

            <div className="mt-5 flex items-center justify-between gap-4 border-b border-line pb-4">
              <p className="text-xs uppercase tracking-[0.2em] text-muted">
                Pusat Inovasi Produk
              </p>
              <span className="h-2 w-2 shrink-0 rounded-full bg-accent" />
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}

export default About