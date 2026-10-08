import { useEffect, useState } from 'react'
import {
  logout,
  getMyProducts,
  getNotifications,
  markNotificationAsRead,
} from '../services/api'
import Products from './Products'
import ProductDetail from './ProductDetail'
import CreateProduct from './CreateProduct'
import HistoryPengajuan from './HistoryPengajuan'
import News from './News'
import './Dashboard.css'

function DashboardMahasiswa({ onLogout }) {
  const [loading, setLoading] = useState(false)
  const [loadingStats, setLoadingStats] = useState(true)
  const [loadingNotifications, setLoadingNotifications] =
    useState(true)

  const [page, setPage] = useState('dashboard')

  const [selectedProductId, setSelectedProductId] =
    useState(null)

  const [products, setProducts] = useState([])
  const [notifications, setNotifications] = useState([])

  const user = JSON.parse(
    localStorage.getItem('user') || 'null'
  )

  const fetchDashboardData = async () => {
    try {
      setLoadingStats(true)

      const response = await getMyProducts()

      setProducts(response.data || [])
    } catch (error) {
      console.error(
        'Gagal mengambil data dashboard:',
        error
      )

      setProducts([])
    } finally {
      setLoadingStats(false)
    }
  }

  const fetchNotifications = async () => {
    try {
      setLoadingNotifications(true)

      const response = await getNotifications()

      setNotifications(response.data || [])
    } catch (error) {
      console.error(
        'Gagal mengambil notifikasi:',
        error
      )

      setNotifications([])
    } finally {
      setLoadingNotifications(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
    fetchNotifications()
  }, [])

  const handleNotificationClick = async (
    notification
  ) => {
    try {
      if (!notification.read_at) {
        await markNotificationAsRead(
          notification.id
        )

        setNotifications((currentNotifications) =>
          currentNotifications.map(
            (item) =>
              item.id === notification.id
                ? {
                    ...item,
                    read_at: new Date().toISOString(),
                  }
                : item
          )
        )
      }
    } catch (error) {
      console.error(
        'Gagal menandai notifikasi:',
        error
      )
    }
  }

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
      <Products
        onBack={() => {
          setPage('dashboard')
          fetchDashboardData()
          fetchNotifications()
        }}
        onCreateProduct={() =>
          setPage('create-product')
        }
        onProductDetail={(productId) => {
          setSelectedProductId(productId)
          setPage('product-detail')
        }}
      />
    )
  }

  if (page === 'product-detail') {
    return (
      <ProductDetail
        productId={selectedProductId}
        onBack={() => setPage('products')}
      />
    )
  }

  if (page === 'create-product') {
    return (
      <CreateProduct
        onBack={() => setPage('products')}
        onSuccess={() => {
          setPage('products')
          fetchDashboardData()
        }}
      />
    )
  }

  if (page === 'history') {
    return (
      <HistoryPengajuan
        onBack={() => setPage('dashboard')}
      />
    )
  }

  if (page === 'news') {
    return (
      <News
        onBack={() => setPage('dashboard')}
      />
    )
  }

  const totalProducts = products.length

  const pendingProducts = products.filter(
    (product) =>
      product.approval_status === 'pending_review'
  ).length

  const unreadNotifications =
    notifications.filter(
      (notification) =>
        !notification.read_at
    ).length

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
            onClick={() => setPage('history')}
          >
            History Pengajuan
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
            DASHBOARD MAHASISWA
          </p>

          <h1>
            Selamat Datang,{' '}
            {user?.name || 'Mahasiswa'}
          </h1>

          <p>
            Kelola produk yang kamu ajukan dan lihat
            informasi terbaru melalui PIPB.
          </p>
        </div>

        <div className="dashboard-grid">
          <div className="dashboard-card">
            <span>
              PRODUK
            </span>

            <h2>
              {loadingStats
                ? '...'
                : totalProducts}
            </h2>

            <p>
              Produk yang kamu miliki
            </p>
          </div>

          <div className="dashboard-card">
            <span>
              PENGAJUAN
            </span>

            <h2>
              {loadingStats
                ? '...'
                : pendingProducts}
            </h2>

            <p>
              Produk yang sedang diproses
            </p>
          </div>

          <div className="dashboard-card">
            <span>
              NOTIFIKASI
            </span>

            <h2>
              {loadingNotifications
                ? '...'
                : unreadNotifications}
            </h2>

            <p>
              Notifikasi belum dibaca
            </p>
          </div>

          <div className="dashboard-card">
            <span>
              STATUS
            </span>

            <h2>
              Aktif
            </h2>

            <p>
              Status akun kamu
            </p>
          </div>
        </div>

        <div className="dashboard-notifications">
          <div className="dashboard-section-header">
            <div>
              <p className="dashboard-label">
                NOTIFIKASI
              </p>

              <h2>
                Informasi Terbaru
              </h2>
            </div>

            <span>
              {unreadNotifications} belum dibaca
            </span>
          </div>

          {loadingNotifications ? (
            <div className="dashboard-notification-empty">
              Memuat notifikasi...
            </div>
          ) : notifications.length === 0 ? (
            <div className="dashboard-notification-empty">
              Belum ada notifikasi.
            </div>
          ) : (
            <div className="dashboard-notification-list">
              {notifications.map(
                (notification) => {
                  const notificationData =
                    notification.data || {}

                  return (
                    <button
                      type="button"
                      key={notification.id}
                      className={`dashboard-notification ${
                        notification.read_at
                          ? 'is-read'
                          : 'is-unread'
                      }`}
                      onClick={() =>
                        handleNotificationClick(
                          notification
                        )
                      }
                    >
                      <div className="dashboard-notification-header">
                        <strong>
                          {notificationData.title ||
                            'Notifikasi'}
                        </strong>

                        {!notification.read_at && (
                          <span>
                            Baru
                          </span>
                        )}
                      </div>

                      <p>
                        {notificationData.message ||
                          'Ada informasi baru untuk kamu.'}
                      </p>

                      {notificationData.feedback && (
                        <div>
                          <strong>
                            Feedback:
                          </strong>{' '}
                          {notificationData.feedback}
                        </div>
                      )}
                    </button>
                  )
                }
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default DashboardMahasiswa