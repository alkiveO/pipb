import { useEffect, useState } from 'react'

const API_BASE = 'http://127.0.0.1:8000/api'

const defaultGuestLinks = [
  { id: 'home', href: '#home', label: 'Home', type: 'link' },
  { id: 'tentang', href: '#tentang', label: 'Tentang', type: 'link' },
  { id: 'produk', href: '#produk', label: 'Produk', type: 'link' },
  { id: 'berita', href: '#berita', label: 'Berita', type: 'link' },
]

const authLinks = [
  { page: 'dashboard', label: 'Dashboard' },
  { page: 'products', label: 'Produk' },
  { page: 'history', label: 'History Pengajuan' },
  { page: 'news', label: 'Berita' },
]

function Navbar({
  onLogin,
  onNavigate,
  page,
  authenticated = false,
}) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [guestLinks, setGuestLinks] = useState(defaultGuestLinks)

  const [navbarSettings, setNavbarSettings] = useState({
    brand_name: 'PIPB',
    logo_url: null,
  })

  useEffect(() => {
    let active = true

    const fetchNavbarItems = async () => {
      try {
        const response = await fetch(`${API_BASE}/navbar-items`, {
          headers: {
            Accept: 'application/json',
          },
        })

        if (!response.ok) {
          throw new Error('Gagal mengambil menu Navbar')
        }

        const result = await response.json()

        if (active && result.success && Array.isArray(result.data)) {
          setGuestLinks(
            result.data.map((item) => ({
              ...item,
              href: item.href || '#',
              type: item.type || 'link',
            }))
          )
        }
      } catch (error) {
        console.error('Gagal memuat menu Navbar:', error)
      }
    }

    const fetchNavbarSettings = async () => {
      try {
        const response = await fetch(`${API_BASE}/navbar-settings`, {
          headers: {
            Accept: 'application/json',
          },
        })

        if (!response.ok) {
          throw new Error('Gagal mengambil pengaturan Navbar')
        }

        const result = await response.json()

        if (active && result.success && result.data) {
          setNavbarSettings({
            brand_name: result.data.brand_name || 'PIPB',
            logo_url: result.data.logo_url || null,
          })
        }
      } catch (error) {
        console.error('Gagal memuat pengaturan Navbar:', error)
      }
    }

    fetchNavbarItems()
    fetchNavbarSettings()

    return () => {
      active = false
    }
  }, [])

  const handleLogout = async () => {
    const token = localStorage.getItem('token')

    try {
      await fetch(`${API_BASE}/logout`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      })
    } catch (error) {
      console.error('Logout gagal:', error)
    }

    localStorage.removeItem('token')
    localStorage.removeItem('user')
    window.location.href = '/login'
  }

  const handleBrandClick = () => {
    if (onNavigate) {
      onNavigate(authenticated ? 'dashboard' : 'home')
    }
  }

  const links = authenticated ? authLinks : guestLinks

  const renderBrand = () => (
    <div className="flex items-center gap-3">
      {navbarSettings.logo_url && (
        <img
          src={navbarSettings.logo_url}
          alt=""
          className="h-10 w-auto max-w-40 shrink-0 object-contain"
          onError={() => {
            setNavbarSettings((current) => ({
              ...current,
              logo_url: null,
            }))
          }}
        />
      )}

      <span className="whitespace-nowrap text-xl font-bold tracking-tight text-ink">
        {navbarSettings.brand_name || 'PIPB'}
      </span>
    </div>
  )

  const renderGuestLink = (link, mobile = false) => {
    const className =
      link.type === 'cta'
        ? 'rounded-full bg-ink px-5 py-2 text-sm font-medium text-paper transition-colors hover:bg-ink/85'
        : mobile
          ? 'text-left text-muted'
          : 'text-muted transition-colors hover:text-ink'

    return (
      <a
        key={link.id}
        href={link.href}
        onClick={() => setMenuOpen(false)}
        className={className}
      >
        {link.label}
      </a>
    )
  }

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <button
          type="button"
          onClick={handleBrandClick}
          className="shrink-0 text-left"
          aria-label={navbarSettings.brand_name || 'PIPB'}
        >
          {renderBrand()}
        </button>

        <nav className="hidden items-center gap-8 text-sm md:flex">
          {links
            .filter((link) => !(!authenticated && link.type === 'cta'))
            .map((link) =>
              authenticated ? (
                <button
                  key={link.page}
                  type="button"
                  onClick={() => onNavigate && onNavigate(link.page)}
                  className={`transition-colors ${
                    page === link.page
                      ? 'font-medium text-ink'
                      : 'text-muted hover:text-ink'
                  }`}
                >
                  {link.label}
                </button>
              ) : (
                renderGuestLink(link)
              )
            )}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {!authenticated ? (
            guestLinks
              .filter((link) => link.type === 'cta')
              .map((link) => renderGuestLink(link))
          ) : (
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-full border border-ink px-5 py-2 text-sm font-medium text-ink transition-colors hover:bg-ink hover:text-paper"
            >
              Logout
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          className="text-sm font-medium md:hidden"
          aria-expanded={menuOpen}
          aria-label={menuOpen ? 'Tutup menu navigasi' : 'Buka menu navigasi'}
        >
          {menuOpen ? 'Tutup' : 'Menu'}
        </button>
      </div>

      {menuOpen && (
        <div className="border-t border-line md:hidden">
          <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-6 text-sm">
            {links.map((link) =>
              authenticated ? (
                <button
                  key={link.page}
                  type="button"
                  onClick={() => {
                    onNavigate && onNavigate(link.page)
                    setMenuOpen(false)
                  }}
                  className={`text-left ${
                    page === link.page
                      ? 'font-medium text-ink'
                      : 'text-muted'
                  }`}
                >
                  {link.label}
                </button>
              ) : (
                renderGuestLink(link, true)
              )
            )}

            <div className="flex flex-wrap items-center gap-3 border-t border-line pt-4">
              {authenticated ? (
                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-full border border-ink px-5 py-2 text-sm font-medium text-ink"
                >
                  Logout
                </button>
              ) : (
                guestLinks
                  .filter((link) => link.type === 'cta')
                  .map((link) => renderGuestLink(link, true))
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

export default Navbar
