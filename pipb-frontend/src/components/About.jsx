import Container from './ui/Container'

function About() {
  return (
    <section id="tentang" className="border-b border-line py-24 md:py-32">
      <Container>
        <p className="text-xs uppercase tracking-[0.3em] text-muted">
          Tentang PIPB
        </p>

        <div className="mt-8 grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-end lg:gap-16">
          <h2 className="font-sans text-4xl font-bold leading-[1.05] tracking-tight text-ink md:text-6xl">
            Mendorong ide menjadi peluang nyata.
          </h2>

          <p className="leading-relaxed text-muted">
            PIPB merupakan platform untuk memperkenalkan berbagai produk
            dan inovasi mahasiswa serta memberikan ruang untuk berkembang
            dan dikenal lebih luas — dari gagasan awal sampai produk siap
            didanai.
          </p>
        </div>
      </Container>
    </section>
  )
}

export default About