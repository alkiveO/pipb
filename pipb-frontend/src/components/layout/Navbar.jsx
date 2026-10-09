import { useEffect, useState } from 'react'

const API_BASE = 'http://127.0.0.1:8000/api'

const guestLinks = [
  { href: '#home', label: 'Home' },
  { href: '#tentang', label: 'Tentang' },
  { href: '#produk', label: 'Produk' },
  { href: '#berita', label: 'Berita' },
]

const authLinks = [
  { page: 'dashboard', label: 'Dashboard' },
  { page: 'products', label: 'Produk' },
  { page: 'history', label: 'History Pengajuan' },
  { page: 'news', label: 'Berita' },
]

function Navbar({ onLogin, onNavigate, page, authenticated = false }) {
  const [menuOpen, setMenuOpen] = useState(false)

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

    // ✅ Setelah logout, langsung ke halaman login
    window.location.href = '/login'
  }

  const links = authenticated ? authLinks : guestLinks

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <button
          type="button"
          onClick={() =>
            onNavigate && onNavigate(authenticated ? 'dashboard' : 'home')
          }
          className="text-xl font-bold tracking-tight text-ink"
        >
          PIPB
        </button>

        <nav className="hidden items-center gap-8 text-sm md:flex">
          {links.map((link) =>
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
              <a
                key={link.href}
                href={link.href}
                className="text-muted transition-colors hover:text-ink"
              >
                {link.label}
              </a>
            )
          )}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {!authenticated ? (
            <button
              type="button"
              onClick={onLogin}
              className="rounded-full bg-ink px-5 py-2 text-sm font-medium text-paper transition-colors hover:bg-ink/85"
            >
              Submit Product
            </button>
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
                    page === link.page ? 'font-medium text-ink' : 'text-muted'
                  }`}
                >
                  {link.label}
                </button>
              ) : (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="text-muted"
                >
                  {link.label}
                </a>
              )
            )}

            <div className="flex flex-wrap items-center gap-3 border-t border-line pt-4">
              {!authenticated ? (
                <button
                  type="button"
                  onClick={onLogin}
                  className="rounded-full bg-ink px-5 py-2 text-sm font-medium text-paper"
                >
                  Submit Product
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-full border border-ink px-5 py-2 text-sm font-medium text-ink"
                >
                  Logout
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

export default Navbar