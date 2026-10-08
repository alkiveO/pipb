import { useState } from 'react'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Products from './pages/Products'
import './App.css'

function App() {
  const [page, setPage] = useState('home')

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
        onLogout={() => setPage('login')}
      />
    )
  }

  if (page === 'products') {
    return (
      <Products
        onBack={() => setPage('home')}
      />
    )
  }

  return (
    <div className="app">
      <nav className="navbar">
        <div className="logo">
          PIPB
        </div>

        <div className="nav-links">
          <a href="#home">
            Home
          </a>

          <button
            type="button"
            className="nav-link-button"
            onClick={() => setPage('products')}
          >
            Produk
          </button>

          <a href="#berita">
            Berita
          </a>

          <a href="#tentang">
            Tentang
          </a>

          <button
            type="button"
            className="nav-submit"
            onClick={() => setPage('login')}
          >
            Submit Product
          </button>
        </div>
      </nav>

      <main>
        <section
          className="hero"
          id="home"
        >
          <div className="hero-content">
            <p className="hero-label">
              PIPB
            </p>

            <h1>
              Menghubungkan Ide,
              <br />
              Inovasi, dan Peluang.
            </h1>

            <p className="hero-description">
              Platform yang mempertemukan mahasiswa dengan ide,
              inovasi, dan peluang pengembangan produk.
            </p>

            <button
              className="hero-button"
              onClick={() => setPage('products')}
            >
              Lihat Produk
            </button>
          </div>
        </section>

        <section
          className="about"
          id="tentang"
        >
          <div className="section-container">
            <p className="section-label">
              TENTANG PIPB
            </p>

            <h2>
              Mendorong ide menjadi
              <br />
              peluang nyata.
            </h2>

            <p className="about-text">
              PIPB merupakan platform untuk memperkenalkan berbagai
              produk dan inovasi mahasiswa serta memberikan ruang untuk
              berkembang dan dikenal lebih luas.
            </p>
          </div>
        </section>

        <section
          className="products"
          id="produk"
        >
          <div className="section-container">
            <p className="section-label">
              PRODUK
            </p>

            <h2>
              Produk Unggulan
            </h2>

            <button
              type="button"
              className="hero-button"
              onClick={() => setPage('products')}
            >
              Lihat Semua Produk
            </button>
          </div>
        </section>

        <section
          className="news"
          id="berita"
        >
          <div className="section-container">
            <p className="section-label">
              BERITA
            </p>

            <h2>
              Berita Terbaru
            </h2>

            <div className="news-list">
              <article className="news-card">
                <p className="news-date">
                  Informasi PIPB
                </p>

                <h3>
                  Berita dan informasi terbaru PIPB
                </h3>

                <p>
                  Informasi mengenai kegiatan serta perkembangan
                  produk mahasiswa akan ditampilkan di sini.
                </p>
              </article>

              <article className="news-card">
                <p className="news-date">
                  Produk Mahasiswa
                </p>

                <h3>
                  Perkembangan produk mahasiswa
                </h3>

                <p>
                  Lihat berbagai perkembangan produk dan inovasi
                  yang dikembangkan oleh mahasiswa.
                </p>
              </article>
            </div>
          </div>
        </section>
      </main>

      <footer>
        <div className="footer-content">
          <div>
            <h3>
              PIPB
            </h3>

            <p>
              Menghubungkan ide, inovasi, dan peluang.
            </p>
          </div>

          <p>
            © 2026 PIPB. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App  