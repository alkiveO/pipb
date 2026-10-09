import { useEffect, useState } from 'react'
import {
  getMyProducts,
  getNotifications,
  markNotificationAsRead,
} from '../services/api'
import Products from './Products'
import ProductDetail from './ProductDetail'
import CreateProduct from './CreateProduct'
import HistoryPengajuan from './HistoryPengajuan'
import News from './News'
import Container from '../components/ui/Container'
import Navbar from '../components/layout/Navbar'

function DashboardMahasiswa({ onLogout }) {
  const [loadingStats, setLoadingStats] = useState(true)
  const [loadingNotifications, setLoadingNotifications] = useState(true)

  const [page, setPage] = useState('dashboard')
  const [selectedProductId, setSelectedProductId] = useState(null)
  const [products, setProducts] = useState([])
  const [notifications, setNotifications] = useState([])

  const user = JSON.parse(localStorage.getItem('user') || 'null')

  const fetchDashboardData = async () => {
    try {
      setLoadingStats(true)
      const response = await getMyProducts()
      setProducts(response.data || [])
    } catch (error) {
      console.error('Gagal mengambil data dashboard:', error)
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
      console.error('Gagal mengambil notifikasi:', error)
      setNotifications([])
    } finally {
      setLoadingNotifications(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
    fetchNotifications()
  }, [])

  const handleNotificationClick = async (notification) => {
    try {
      if (!notification.read_at) {
        await markNotificationAsRead(notification.id)
        setNotifications((currentNotifications) =>
          currentNotifications.map((item) =>
            item.id === notification.id
              ? { ...item, read_at: new Date().toISOString() }
              : item
          )
        )
      }
    } catch (error) {
      console.error('Gagal menandai notifikasi:', error)
    }
  }

  const goTo = (key) => {
    setPage(key)
  }

  // Sub-pages — semua dikirimi onNavigate & page
  if (page === 'products') {
    return (
      <Products
        onBack={() => setPage('dashboard')}
        onCreateProduct={() => setPage('create-product')}
        onProductDetail={(productId) => {
          setSelectedProductId(productId)
          setPage('product-detail')
        }}
        onNavigate={goTo}
        page="products"
      />
    )
  }

  if (page === 'product-detail') {
    return (
      <ProductDetail
        productId={selectedProductId}
        onBack={() => setPage('products')}
        onNavigate={goTo}
        page="product-detail"
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
        onNavigate={goTo}
        page="create-product"
      />
    )
  }

  if (page === 'history') {
    return (
      <HistoryPengajuan
        onBack={() => setPage('dashboard')}
        onNavigate={goTo}
        page="history"
      />
    )
  }

  if (page === 'news') {
    return (
      <News
        onBack={() => setPage('dashboard')}
        onNavigate={goTo}
        page="news"
      />
    )
  }

  const totalProducts = products.length
  const pendingProducts = products.filter(
    (product) => product.approval_status === 'pending_review'
  ).length
  const unreadNotifications = notifications.filter(
    (notification) => !notification.read_at
  ).length

  return (
    <div className="min-h-screen bg-paper">
      <Navbar authenticated onNavigate={goTo} page="dashboard" />

      <main className="pb-24 pt-16">
        <Container>
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-muted">
              Dashboard Mahasiswa
            </p>

            <h1 className="mt-4 font-sans text-4xl font-bold tracking-tight text-ink md:text-5xl">
              Selamat Datang, {user?.name || 'Mahasiswa'}
            </h1>

            <p className="mt-3 max-w-2xl leading-relaxed text-muted">
              Kelola produk yang kamu ajukan dan lihat informasi terbaru
              melalui PIPB.
            </p>
          </div>

          {/* Stats */}
          <div className="mt-12 grid gap-px overflow-hidden rounded-2xl bg-line md:grid-cols-2 lg:grid-cols-4">
            <div className="flex flex-col justify-between bg-paper p-6">
              <p className="text-xs uppercase tracking-[0.2em] text-muted">
                Produk
              </p>
              <p className="mt-8 font-sans text-4xl font-bold text-ink">
                {loadingStats ? '—' : totalProducts}
              </p>
              <p className="mt-2 text-xs text-muted">Produk yang kamu miliki</p>
            </div>

            <div className="flex flex-col justify-between bg-paper p-6">
              <p className="text-xs uppercase tracking-[0.2em] text-muted">
                Pengajuan
              </p>
              <p className="mt-8 font-sans text-4xl font-bold text-ink">
                {loadingStats ? '—' : pendingProducts}
              </p>
              <p className="mt-2 text-xs text-muted">Produk sedang diproses</p>
            </div>

            <div className="flex flex-col justify-between bg-paper p-6">
              <p className="text-xs uppercase tracking-[0.2em] text-muted">
                Notifikasi
              </p>
              <p className="mt-8 font-sans text-4xl font-bold text-ink">
                {loadingNotifications ? '—' : unreadNotifications}
              </p>
              <p className="mt-2 text-xs text-muted">Belum dibaca</p>
            </div>

            <div className="flex flex-col justify-between bg-paper p-6">
              <p className="text-xs uppercase tracking-[0.2em] text-muted">
                Status
              </p>
              <p className="mt-8 font-sans text-4xl font-bold text-ink">
                Aktif
              </p>
              <p className="mt-2 text-xs text-muted">Status akun kamu</p>
            </div>
          </div>

          {/* Notifikasi */}
          <div className="mt-16">
            <div className="flex flex-col justify-between gap-3 border-b border-line pb-6 md:flex-row md:items-end">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-muted">
                  Notifikasi
                </p>
                <h2 className="mt-3 font-sans text-2xl font-bold tracking-tight text-ink md:text-3xl">
                  Informasi Terbaru
                </h2>
              </div>

              <span className="text-xs uppercase tracking-wider text-muted">
                {unreadNotifications} belum dibaca
              </span>
            </div>

            {loadingNotifications ? (
              <div className="py-16 text-center text-sm text-muted">
                Memuat notifikasi...
              </div>
            ) : notifications.length === 0 ? (
              <div className="py-16 text-center text-sm text-muted">
                Belum ada notifikasi.
              </div>
            ) : (
              <div className="divide-y divide-line">
                {notifications.map((notification) => {
                  const notificationData = notification.data || {}
                  const isUnread = !notification.read_at

                  return (
                    <button
                      type="button"
                      key={notification.id}
                      onClick={() => handleNotificationClick(notification)}
                      className={`grid w-full grid-cols-1 items-start gap-4 py-6 text-left transition-all hover:bg-surface/50 md:hover:pl-4 ${
                        isUnread ? '' : 'opacity-60'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-3">
                          <strong className="text-base font-semibold text-ink">
                            {notificationData.title || 'Notifikasi'}
                          </strong>

                          {isUnread && (
                            <span className="rounded-full bg-ink px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-paper">
                              Baru
                            </span>
                          )}
                        </div>

                        <p className="mt-2 text-sm leading-relaxed text-muted">
                          {notificationData.message ||
                            'Ada informasi baru untuk kamu.'}
                        </p>

                        {notificationData.feedback && (
                          <div className="mt-3 rounded-lg border border-line bg-surface/50 px-4 py-3 text-sm">
                            <strong className="text-ink">Feedback:</strong>{' '}
                            <span className="text-muted">
                              {notificationData.feedback}
                            </span>
                          </div>
                        )}
                      </div>
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        </Container>
      </main>
    </div>
  )
}

export default DashboardMahasiswa