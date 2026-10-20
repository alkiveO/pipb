import { useEffect, useState } from 'react'
import { API_URL } from '../services/api'
import Container from './ui/Container'

const DEFAULT_STEPS = [
  { number: 1, title: 'Buat Produk', description: 'Mahasiswa mendaftar dan mengunggah produk dengan informasi lengkap: nama, deskripsi, kategori, funding, dan foto.' },
  { number: 2, title: 'Submit Review', description: 'Produk yang diajukan masuk antrean review tim PIPB. Status awal adalah "Pending".' },
  { number: 3, title: 'Review Tim', description: 'Tim reviewer memeriksa kelengkapan, kualitas, dan relevansi produk. Keputusan: Approve atau Reject dengan alasan.' },
  { number: 4, title: 'Publish & Funding', description: 'Produk yang disetujui tayang di katalog publik. Investor dapat mendanai produk untuk mendukung pengembangan.' },
]

function HowItWorks() {
  const [steps, setSteps] = useState(DEFAULT_STEPS)

  useEffect(() => {
    let active = true
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 3000)

    const fetchSteps = async () => {
      try {
        const response = await fetch(`${API_URL.replace(/\/+$/, '')}/how-it-works`, {
          headers: { Accept: 'application/json' },
          signal: controller.signal,
        })
        clearTimeout(timeoutId)
        if (!response.ok) return

        const result = await response.json()
        if (!Array.isArray(result?.data) || result.data.length === 0) return

        const formattedSteps = result.data
          .filter((step) => step.number != null && step.title && step.description)
          .sort((a, b) => Number(a.number) - Number(b.number))
          .map((step) => ({ number: Number(step.number), title: step.title, description: step.description }))

        if (active && formattedSteps.length > 0) {
          setSteps(formattedSteps)
        }
      } catch (error) {
        // Diamkan jika error
      }
    }

    fetchSteps()
    return () => {
      active = false
      clearTimeout(timeoutId)
      controller.abort()
    }
  }, [])

  return (
    <section id="cara-kerja" className="bg-surface py-12 md:py-16">
      <Container>
        <div className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-muted">How it works</p>
            <h2 className="mt-3 font-sans text-4xl font-bold tracking-tight text-ink md:text-6xl">
              Cara Kerja<br />PIPB
            </h2>
          </div>
          <p className="max-w-sm leading-relaxed text-muted">
            Dari ide hingga produk didanai — prosesnya sederhana dan transparan.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {steps.map((step) => (
            <article key={step.number} className="group flex h-full flex-col rounded-2xl border border-line bg-paper p-6 transition-all duration-300 hover:-translate-y-1 hover:border-ink/20 hover:shadow-lg md:p-7">
              <div className="mb-6 flex items-center justify-between">
                <span className="font-sans text-3xl font-bold tabular-nums tracking-tight text-muted/60">
                  {String(step.number).padStart(2, '0')}
                </span>
                <span className="h-px w-10 bg-line transition-all duration-300 group-hover:w-16 group-hover:bg-ink/50" />
              </div>
              <div className="flex flex-1 flex-col">
                <h3 className="text-lg font-bold leading-snug tracking-tight text-ink md:text-xl">{step.title}</h3>
                <p className="mt-2 text-sm leading-7 text-muted wrap-anywhere">{step.description}</p>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  )
}

export default HowItWorks