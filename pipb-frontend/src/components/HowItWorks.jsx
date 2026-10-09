import Container from './ui/Container'

const STEPS = [
  {
    number: '01',
    title: 'Buat Produk',
    description:
      'Mahasiswa mendaftar dan mengunggah produk dengan informasi lengkap: nama, deskripsi, kategori, funding, dan foto.',
  },
  {
    number: '02',
    title: 'Submit Review',
    description:
      'Produk yang diajukan masuk antrean review tim PIPB. Status awal adalah "Pending".',
  },
  {
    number: '03',
    title: 'Review Tim',
    description:
      'Tim reviewer memeriksa kelengkapan, kualitas, dan relevansi produk. Keputusan: Approve atau Reject dengan alasan.',
  },
  {
    number: '04',
    title: 'Publish & Funding',
    description:
      'Produk yang disetujui tayang di katalog publik. Investor dapat mendanai produk untuk mendukung pengembangan.',
  },
]

function HowItWorks() {
  return (
    <section id="cara-kerja" className="bg-surface py-24 md:py-32">
      <Container>
        <div className="mb-16 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-muted">
              How it works
            </p>
            <h2 className="mt-4 font-sans text-5xl font-bold tracking-tight text-ink md:text-6xl">
              Cara Kerja
              <br />
              PIPB
            </h2>
          </div>

          <p className="max-w-sm leading-relaxed text-muted">
            Dari ide hingga produk didanai — prosesnya sederhana dan
            transparan.
          </p>
        </div>

        <div className="grid gap-px overflow-hidden rounded-2xl bg-line md:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step) => (
            <div
              key={step.number}
              className="flex min-h-[13rem] flex-col justify-between bg-paper p-6 transition-colors hover:bg-surface md:p-7"
            >
              <p className="font-sans text-3xl font-bold text-muted/50">
                {step.number}
                </p>

              <div>
                <h3 className="font-sans text-lg font-bold tracking-tight text-ink">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}

export default HowItWorks