import { useState, useEffect } from 'react'

import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import Dashboard from './pages/Dashboard'
import Products from './pages/Products'

import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import Hero from './components/Hero'
import About from './components/About'
import ProductsSection from './components/ProductsSection'
import HowItWorks from './components/HowItWorks'
import Reviewers from './components/Reviewers'
import News from './components/News'
import NewsDetail from './pages/NewsDetail'

function getPageFromPath() {
  const path = window.location.pathname
  const hasToken = localStorage.getItem('token')

  if (path === '/login') {
    return { page: 'login', newsId: null }
  }

  if (path === '/register') {
    return { page: 'register', newsId: null }
  }

  if (path === '/news') {
    return { page: 'news', newsId: null }
  }

  if (path.startsWith('/news/')) {
    const newsId = path.split('/')[2]

    if (newsId) {
      return { page: 'news-detail', newsId }
    }

    return { page: 'news', newsId: null }
  }

  if (path === '/products') {
    return { page: 'products', newsId: null }
  }

  if (path === '/dashboard' || hasToken) {
    return { page: 'dashboard', newsId: null }
  }

  return { page: 'home', newsId: null }
}

function App() {
  const [initialRoute] = useState(() => getPageFromPath())

  const [page, setPage] = useState(initialRoute.page)
  const [selectedNewsId, setSelectedNewsId] = useState(
    initialRoute.newsId
  )

  // Sinkronkan halaman dengan tombol Back dan Forward browser.
  useEffect(() => {
    const handlePopState = () => {
      const route = getPageFromPath()

      setPage(route.page)
      setSelectedNewsId(route.newsId)
    }

    window.addEventListener('popstate', handlePopState)

    return () => {
      window.removeEventListener('popstate', handlePopState)
    }
  }, [])

  // Sinkronkan URL dengan halaman yang sedang dibuka.
  useEffect(() => {
    const pathMap = {
      home: '/',
      login: '/login',
      register: '/register',
      dashboard: '/dashboard',
      products: '/products',
      news: '/news',
      'news-detail': selectedNewsId
        ? `/news/${selectedNewsId}`
        : '/news',
    }

    const targetPath = pathMap[page]

    if (
      targetPath &&
      window.location.pathname !== targetPath
    ) {
      window.history.pushState({}, '', targetPath)
    }
  }, [page, selectedNewsId])

  // Buka detail berita jika diperlukan.
  const handleOpenNewsDetail = (newsId) => {
    if (newsId === null || newsId === undefined) {
      console.error('ID berita tidak ditemukan.')
      return
    }

    setSelectedNewsId(String(newsId))
    setPage('news-detail')
  }

  const handleBackFromNewsDetail = () => {
    setSelectedNewsId(null)
    setPage('news')
  }

  // Arahkan tombol yang membutuhkan login ke halaman login.
  const handleRequireLogin = () => {
    setSelectedNewsId(null)
    setPage('login')
  }

  // Logout dari dashboard.
  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')

    setSelectedNewsId(null)
    setPage('login')
  }

  if (page === 'login') {
    return (
      <Login
        onLogin={() => setPage('dashboard')}
        onRegister={() => setPage('register')}
      />
    )
  }

  if (page === 'register') {
    return (
      <Register
        onRegister={() => setPage('login')}
      />
    )
  }

  if (page === 'dashboard') {
    return (
      <Dashboard
        onLogout={handleLogout}
      />
    )
  }

  if (page === 'products') {
    return (
      <Products
        onBack={() => setPage('home')}
        onNavigate={setPage}
        page="products"
        onCreateProduct={handleRequireLogin}
        onProductDetail={handleRequireLogin}
      />
    )
  }

  if (page === 'news') {
    return (
      <News
        onNavigate={setPage}
        page="news"
        onOpenDetail={handleRequireLogin}
      />
    )
  }

  if (page === 'news-detail' && selectedNewsId !== null) {
    return (
      <NewsDetail
        newsId={selectedNewsId}
        onBack={handleBackFromNewsDetail}
        onNavigate={setPage}
        page="news-detail"
      />
    )
  }

  return (
    <>
      <Navbar
        onLogin={() => setPage('login')}
        onNavigate={setPage}
        page="home"
      />

      <main>
        <Hero
          onProducts={handleRequireLogin}
        />

        <About />

        <ProductsSection
          onProducts={handleRequireLogin}
        />

        <HowItWorks />

        <Reviewers />

        <News
          onNavigate={setPage}
          page="home"
          onOpenDetail={handleRequireLogin}
        />
      </main>

      <Footer />
    </>
  )
}

export default App