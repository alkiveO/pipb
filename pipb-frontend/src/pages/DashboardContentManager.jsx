import { useState } from 'react'
import { logout } from '../services/api'
import AdminProducts from './AdminProducts'
import AdminNews from './AdminNews'
import './Dashboard.css'

function DashboardContentManager({ onLogout }) {
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState('dashboard')

  const user = JSON.parse(
    localStorage.getItem('user') || 'null'
  )

  const handleLogout = async () => {
    setLoading(true)

    try {
      await logout()
    } catch (error) {
      console.error(
        'Logout API gagal:',
        error
      )
    } finally {
      localStorage.removeItem('token')
      localStorage.removeItem('user')

      setLoading(false)
      onLogout()
    }
  }

  if (page === 'products') {
    return (
      <AdminProducts
        onBack={() => setPage('dashboard')}
      />
    )
  }

  if (page === 'news') {
    return (
      <AdminNews
        onBack={() => setPage('dashboard')}
      />
    )
  }

  return (
    <div className="dashboard-page">
      <nav className="dashboard-navbar">
        <div className="dashboard-logo">
          PIPB
        </div>

        <div className="dashboard-nav">
          <span>
            Dashboard
          </span>

          <button
            type="button"
            onClick={() => setPage('products')}
          >
            Produk
          </button>

          <button
            type="button"
            onClick={() => setPage('news')}
          >
            Berita
          </button>

          <button
            type="button"
            onClick={handleLogout}
            disabled={loading}
          >
            {loading
              ? 'Keluar...'
              : 'Logout'}
          </button>
        </div>
      </nav>

      <main className="dashboard-main">
        <div className="dashboard-header">
          <p className="dashboard-label">
            CONTENT MANAGER DASHBOARD
          </p>

          <h1>
            Selamat Datang,{' '}
            {user?.name || 'Content Manager'}
          </h1>

          <p>
            Kelola pengajuan produk, persetujuan,
            berita, dana, dan penilaian produk
            melalui dashboard Content Manager PIPB.
          </p>
        </div>

        <div className="dashboard-grid">
          <div className="dashboard-card">
            <span>
              PRODUK
            </span>

            <h2>
              -
            </h2>

            <p>
              Produk yang perlu dikelola
            </p>
          </div>

          <div className="dashboard-card">
            <span>
              PENGAJUAN
            </span>

            <h2>
              -
            </h2>

            <p>
              Produk yang menunggu approval
            </p>
          </div>

          <div className="dashboard-card">
            <span>
              BERITA
            </span>

            <h2>
              -
            </h2>

            <p>
              Berita dan pengumuman
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}

export default DashboardContentManager