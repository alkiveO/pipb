import { useEffect, useState } from 'react'
import { API_URL } from '../services/api'
import Container from './ui/Container'

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

  if (/^https?:\/\//i.test(photo)) {
    return photo
  }

  const cleanPath = photo.replace(/^\/+/, '')

  if (cleanPath.startsWith('storage/')) {
    return `${API_URL.replace(/\/api\/?$/, '')}/${cleanPath}`
  }

  return `${STORAGE_URL}/${cleanPath}`
}

function Reviewers() {
  const [reviewers, setReviewers] = useState(DEFAULT_REVIEWERS)

  useEffect(() => {
    let active = true

    const fetchReviewers = async () => {
      try {
        const response = await fetch(
          `${API_URL.replace(/\/+$/, '')}/reviewers`,
          {
            headers: {
              Accept: 'application/json',
            },
          }
        )

        if (!response.ok) {
          throw new Error(
            `Gagal mengambil data reviewer: ${response.status}`
          )
        }

        const result = await response.json()

        if (!Array.isArray(result?.data)) {
          throw new Error('Format data reviewer tidak valid.')
        }

        const formattedReviewers = result.data
          .filter((person) => person.name && person.role)
          .sort(
            (a, b) =>
              Number(a.order ?? 0) - Number(b.order ?? 0)
          )
          .map((person) => ({
            id: person.id,
            name: person.name,
            role: person.role,
            photo: getPhotoUrl(person.photo),
          }))

        if (active && formattedReviewers.length > 0) {
          setReviewers(formattedReviewers)
        } else if (active) {
          setReviewers([])
        }
      } catch (error) {
        console.error('Gagal memuat reviewer:', error)
      }
    }

    fetchReviewers()

    return () => {
      active = false
    }
  }, [])

  return (
    <section
      id="reviewer"
      className="border-b border-line py-24 md:py-32"
    >
      <Container>
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-muted">
              Reviewer
            </p>

            <h2 className="mt-4 font-sans text-4xl font-bold tracking-tight text-ink md:text-5xl">
              Tim Reviewer
            </h2>
          </div>

          <p className="max-w-sm leading-relaxed text-muted">
            Produk yang tampil di halaman ini telah melalui proses review
            oleh tim PIPB.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-x-10 gap-y-8 md:grid-cols-2 lg:grid-cols-3">
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
                  onError={(event) => {
                    event.currentTarget.style.display = 'none'
                  }}
                />
              ) : (
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-line bg-surface">
                  <span className="font-sans text-xl font-bold text-ink/40">
                    {person.name
                      .trim()
                      .charAt(0)
                      .toUpperCase()}
                  </span>
                </div>
              )}

              <span className="font-sans text-3xl font-bold text-ink/15 transition-colors group-hover:text-accent">
                {String(index + 1).padStart(2, '0')}
              </span>

              <div className="min-w-0 flex-1">
                <p className="truncate text-base font-semibold text-ink">
                  {person.name}
                </p>

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