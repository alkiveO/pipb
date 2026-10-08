import { useState } from 'react'
import {
  logout,
} from '../services/api'
import AdminUsers from './AdminUsers'
import AdminCategories from './AdminCategories'
import './Dashboard.css'

function DashboardAdmin({ onLogout }) {
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

  if (page === 'users') {
    return (
      <AdminUsers
        onBack={() => setPage('dashboard')}
      />
    )
  }

  if (page === 'categories') {
    return (
      <AdminCategories
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
            onClick={() => setPage('categories')}
          >
            Kategori
          </button>

          <button
            type="button"
            onClick={() => setPage('users')}
          >
            User
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
            ADMIN DASHBOARD
          </p>

          <h1>
            Selamat Datang,{' '}
            {user?.name || 'Admin'}
          </h1>

          <p>
            Kelola pengguna dan kategori
            melalui dashboard admin PIPB.
          </p>
        </div>

        <div className="dashboard-grid">
          <div className="dashboard-card">
            <span>
              USER
            </span>

            <h2>
              -
            </h2>

            <p>
              Kelola akun pengguna PIPB
            </p>
          </div>

          <div className="dashboard-card">
            <span>
              KATEGORI
            </span>

            <h2>
              -
            </h2>

            <p>
              Kelola kategori produk
            </p>
          </div>

          <div className="dashboard-card">
            <span>
              ROLE
            </span>

            <h2>
              3
            </h2>

            <p>
              Admin, Content Manager,
              dan Mahasiswa
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}

export default DashboardAdmin