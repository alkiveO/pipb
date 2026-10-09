import Container from './ui/Container'

const reviewers = [
  { id: 1, name: 'Dr. Ahmad Fauzi', role: 'Pembimbing PIPB' },
  { id: 2, name: 'Siti Nurhaliza', role: 'Content Manager' },
  { id: 3, name: 'Budi Santoso', role: 'Content Manager' },
  { id: 4, name: 'Rina Wijaya', role: 'Pembimbing PIPB' },
  { id: 5, name: 'Dian Pratama', role: 'Pembimbing PIPB' },
  { id: 6, name: 'Agus Setiawan', role: 'Content Manager' },
]

function Reviewers() {
  return (
    <section id="reviewer" className="border-b border-line py-24 md:py-32">
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
          {reviewers.map((person, i) => (
            <div
              key={person.id}
              className="group flex items-center gap-4 border-b border-line pb-6 transition-colors hover:border-ink"
            >
              <span className="font-sans text-3xl font-bold text-ink/15 transition-colors group-hover:text-accent">
                {String(i + 1).padStart(2, '0')}
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