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

function App() {
  // ✅ Init page berdasarkan URL + token
  const [page, setPage] = useState(() => {
    const path = window.location.pathname
    const hasToken = localStorage.getItem('token')

    if (path === '/login') return 'login'
    if (path === '/register') return 'register'
    if (path === '/dashboard' || hasToken) return 'dashboard'
    if (path === '/products') return 'products'
    return 'home'
  })

  // ✅ Sync saat tombol back/forward browser ditekan
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname
      const hasToken = localStorage.getItem('token')

      if (path === '/login') setPage('login')
      else if (path === '/register') setPage('register')
      else if (path === '/dashboard') setPage('dashboard')
      else if (path === '/products') setPage('products')
      else if (hasToken) setPage('dashboard')
      else setPage('home')
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  // ✅ Sync URL saat page berubah
  useEffect(() => {
    const pathMap = {
      login: '/login',
      register: '/register',
      dashboard: '/dashboard',
      products: '/products',
      home: '/',
    }

    const targetPath = pathMap[page]

    if (targetPath && window.location.pathname !== targetPath) {
      window.history.pushState({}, '', targetPath)
    }
  }, [page])

  if (page === 'login') {
    return (
      <Login
        onLogin={() => setPage('dashboard')}
        onRegister={() => setPage('register')}
      />
    )
  }

  if (page === 'register') {
    return <Register onRegister={() => setPage('login')} />
  }

  if (page === 'dashboard') {
    return <Dashboard onLogout={() => setPage('login')} />
  }

  if (page === 'products') {
    return (
      <Products
        onBack={() => setPage('home')}
        onNavigate={setPage}
        page="products"
        onCreateProduct={() => setPage('login')}
        onProductDetail={() => setPage('login')}
      />
    )
  }

  return (
    <>
      <Navbar onLogin={() => setPage('login')} onNavigate={setPage} page="home" />

      <main>
        <Hero onProducts={() => setPage('products')} />
        <About />
        <ProductsSection onProducts={() => setPage('products')} />
        <HowItWorks />
        <Reviewers />
        <News />
      </main>

      <Footer />
    </>
  )
}

export default App