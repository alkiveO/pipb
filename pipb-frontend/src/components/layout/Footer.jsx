const columns = [
  {
    title: 'Navigasi',
    links: [
      { href: '#produk', label: 'Produk' },
      { href: '#cara-kerja', label: 'Cara Kerja' },
      { href: '#tentang', label: 'Tentang' },
      { href: '#berita', label: 'Berita' },
    ],
  },
  {
    title: 'Akun',
    links: [
      { href: '#', label: 'Login' },
      { href: '#', label: 'Daftar' },
      { href: '#', label: 'Ajukan Produk' },
    ],
  },
]

function Footer() {
  return (
    <footer className="border-t border-line bg-surface">
      <div className="mx-auto grid w-full max-w-6xl gap-12 px-6 py-16 md:grid-cols-[1.3fr_1fr_1fr] md:py-20">
        <div>
          <p className="font-sans text-2xl font-bold tracking-tight text-ink">
            PIPB
          </p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted">
            Pusat Inkubasi dan Pengembangan Bisnis
            <br />
            STT Terpadu Nurul Fikri
          </p>
        </div>

        {columns.map((column) => (
          <nav key={column.title}>
            <p className="text-xs uppercase tracking-[0.2em] text-muted">
              {column.title}
            </p>
            <ul className="mt-4 space-y-3 text-sm">
              {column.links.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-muted transition-colors hover:text-ink"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <div className="border-t border-line">
        <div className="mx-auto flex w-full max-w-6xl flex-col justify-between gap-4 px-6 py-6 text-xs text-muted md:flex-row md:items-center">
          <p>© 2026 PIPB — STT Terpadu Nurul Fikri. All rights reserved.</p>
          <a href="#home" className="transition-colors hover:text-ink">
            Kembali ke atas ↑
          </a>
        </div>
      </div>
    </footer>
  )
}

export default Footer