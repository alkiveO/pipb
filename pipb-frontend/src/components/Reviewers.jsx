import { useEffect, useState } from 'react'
import { API_URL } from '../services/api'
import Container from './ui/Container'

// DATA CADANGAN (LANGSUNG TAMPIL TANPA NUNGGU API)
const DEFAULT_REVIEWERS = [
  { id: 1, name: 'Dr. Ahmad Fauzi', role: 'Pembimbing PIPB' },
  { id: 2, name: 'Siti Nurhaliza', role: 'Content Manager' },
  { id: 3, name: 'Budi Santoso', role: 'Content Manager' },
  { id: 4, name: 'Rina Wijaya', role: 'Pembimbing PIPB' },
  { id: 5, name: 'Dian Pratama', role: 'Pembimbing PIPB' },
  { id: 6, name: 'Agus Setiawan', role: 'Content Manager' },
]

const STORAGE_URL = API_URL.replace(/\/api\/?$/, '/storage')

function getPhotoUrl(photo) {
  if (!photo) return null
  if (/^https?:\/\//i.test(photo)) return photo
  const cleanPath = photo.replace(/^\/+/, '')
  if (cleanPath.startsWith('storage/')) {
    return `${API_URL.replace(/\/api\/?$/, '')}/${cleanPath}`
  }
  return `${STORAGE_URL}/${cleanPath}`
}

function Reviewers() {
  // LANGSUNG ISI DENGAN DEFAULT_REVIEWERS
  const [reviewers, setReviewers] = useState(DEFAULT_REVIEWERS)

  useEffect(() => {
    let active = true

    // Nama fungsinya disamakan jadi fetchReviewers
    const fetchReviewers = async () => {
      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 3000) // Batalkan jika lebih dari 3 detik

        const response = await fetch(
          `${API_URL.replace(/\/+$/, '')}/reviewers`,
          { 
            headers: { Accept: 'application/json' },
            signal: controller.signal 
          }
        )
        clearTimeout(timeoutId)

        if (!response.ok) return

        const result = await response.json()
        if (!Array.isArray(result?.data) || result.data.length === 0) return

        const formatted = result.data
          .filter((p) => p.name && p.role)
          .sort((a, b) => Number(a.order ?? 0) - Number(b.order ?? 0))
          .map((p) => ({
            id: p.id, name: p.name, role: p.role, photo: getPhotoUrl(p.photo),
          }))

        if (active && formatted.length > 0) {
          setReviewers(formatted)
        }
      } catch (error) {
        // Jika timeout atau error, diamkan saja. Data dummy tetap tampil.
        console.log('Fetch reviewer gagal/ditolak, pakai data default.');
      }
    }

    fetchReviewers() // <--- INI YANG TADI SALAH KETIK
    return () => { active = false }
  }, [])

  return (
    <section id="reviewer" className="border-b border-line py-10 md:py-14">
      <Container>
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-muted">Reviewer</p>
            <h2 className="mt-3 font-sans text-4xl font-bold tracking-tight text-ink md:text-5xl">
              Tim Reviewer
            </h2>
          </div>
          <p className="max-w-sm leading-relaxed text-muted">
            Produk yang tampil di halaman ini telah melalui proses review oleh tim PIPB.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-x-10 gap-y-8 md:grid-cols-2 lg:grid-cols-3">
          {reviewers.map((person, index) => (
            <div
              key={person.id}
              className="group flex items-center gap-4 border-b border-line pb-6 transition-colors hover:border-ink"
            >
              {person.photo ? (
                <img
                  src={person.photo}
                  alt={person.name}
                  loading="lazy"
                  className="h-16 w-16 shrink-0 rounded-full border border-line object-cover"
                  onError={(e) => { e.currentTarget.style.display = 'none' }}
                />
              ) : (
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-line bg-surface">
                  <span className="font-sans text-xl font-bold text-ink/40">
                    {person.name.trim().charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              <span className="font-sans text-3xl font-bold text-ink/15 transition-colors group-hover:text-accent">
                {String(index + 1).padStart(2, '0')}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-base font-semibold text-ink">{person.name}</p>
                <p className="mt-1 truncate text-xs uppercase tracking-wider text-muted">
                  {person.role}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}

export default Reviewers