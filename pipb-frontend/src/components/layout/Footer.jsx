import { useEffect, useState } from 'react'

const API_URL = 'http://127.0.0.1:8000/api'

const defaultSettings = {
  brand_name: 'PIPB',
  logo_url: null,
  description: 'Pusat Inkubasi dan Pengembangan Bisnis',
  institution_name: 'STT Terpadu Nurul Fikri',
  copyright_text: 'All rights reserved.',
  use_current_year: true,
  copyright_year: new Date().getFullYear(),
  back_to_top_label: 'Kembali ke atas ↑',
  back_to_top_href: '#home',
  show_back_to_top: true,
}

const defaultColumns = [
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
      { href: '/login', label: 'Login' },
      { href: '/register', label: 'Daftar' },
      { href: '/products/create', label: 'Ajukan Produk' },
    ],
  },
]

function Footer() {
  const [settings, setSettings] = useState(defaultSettings)
  const [columns, setColumns] = useState(defaultColumns)

  useEffect(() => {
    let active = true
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 3000) // Maksimal nunggu 3 detik

    const fetchFooterData = async () => {
      try {
        const [settingsResponse, linksResponse] = await Promise.all([
          fetch(`${API_URL}/footer-settings`, { signal: controller.signal }),
          fetch(`${API_URL}/footer-links`, { signal: controller.signal }),
        ])

        if (!settingsResponse.ok || !linksResponse.ok) return

        const settingsResult = await settingsResponse.json()
        const linksResult = await linksResponse.json()

        if (active && settingsResult.success && settingsResult.data) {
          setSettings((previous) => ({ ...previous, ...settingsResult.data }))
        }

        if (active && linksResult.success && Array.isArray(linksResult.data) && linksResult.data.length > 0) {
          setColumns(linksResult.data)
        }
      } catch (error) {
        // Diamkan saja jika error/timeout
      }
    }

    fetchFooterData()

    return () => {
      active = false
      clearTimeout(timeoutId)
      controller.abort()
    }
  }, [])

  const copyrightYear = settings.use_current_year ? new Date().getFullYear() : settings.copyright_year

  return (
    <footer className="border-t border-line bg-surface">
      <div className="mx-auto grid w-full max-w-6xl gap-12 px-6 py-16 md:grid-cols-[1.3fr_1fr_1fr] md:py-20">
        <div>
          {settings.logo_url ? (
            <img
              src={settings.logo_url}
              alt={`Logo ${settings.brand_name}`}
              className="mb-4 h-12 w-auto max-w-48 object-contain object-left"
            />
          ) : (
            <p className="font-sans text-2xl font-bold tracking-tight text-ink">
              {settings.brand_name}
            </p>
          )}

          {settings.description && (
            <p className="mt-3 max-w-xs whitespace-pre-line text-sm leading-relaxed text-muted">
              {settings.description}
            </p>
          )}

          {settings.institution_name && (
            <p className="mt-1 max-w-xs text-sm leading-relaxed text-muted">
              {settings.institution_name}
            </p>
          )}
        </div>

        {columns.map((column, index) => (
          <nav key={`${column.title}-${index}`}>
            <p className="text-xs uppercase tracking-[0.2em] text-muted">
              {column.title}
            </p>
            <ul className="mt-4 space-y-3 text-sm">
              {(column.links || []).map((link) => (
                <li key={link.id ?? `${link.label}-${link.href}`}>
                  <a href={link.href} className="text-muted transition-colors hover:text-ink">
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
          <p>
            © {copyrightYear} {settings.brand_name}
            {settings.institution_name ? ` — ${settings.institution_name}` : ''}
            {settings.copyright_text ? `. ${settings.copyright_text}` : ''}
          </p>

          {settings.show_back_to_top && (
            <a href={settings.back_to_top_href || '#home'} className="transition-colors hover:text-ink">
              {settings.back_to_top_label}
            </a>
          )}
        </div>
      </div>
    </footer>
  )
}

export default Footer