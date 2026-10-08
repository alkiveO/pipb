import { useEffect, useState } from 'react'
import { getNews } from '../services/api'
import './Products.css'

function News({ onBack }) {
  const [news, setNews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchNews = async () => {
    try {
      setError('')

      const response = await getNews()

      setNews(response.data || [])
    } catch (error) {
      console.error(
        'Gagal mengambil berita:',
        error
      )

      setError(
        error.message ||
        'Gagal mengambil berita'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNews()
  }, [])

  return (
    <div className="products-page">
      <nav className="products-navbar">
        <div className="products-logo">
          PIPB
        </div>

        <button
          type="button"
          className="products-back-button"
          onClick={onBack}
        >
          Kembali
        </button>
      </nav>

      <main className="products-main">
        <div className="products-header">
          <div>
            <p className="products-label">
              INFORMASI PIPB
            </p>

            <h1>
              Berita & Pengumuman
            </h1>

            <p>
              Lihat berita dan informasi terbaru
              dari PIPB.
            </p>
          </div>
        </div>

        {loading && (
          <p>
            Memuat berita...
          </p>
        )}

        {error && (
          <p>
            {error}
          </p>
        )}

        {!loading &&
          !error &&
          news.length === 0 && (
            <p>
              Belum ada berita.
            </p>
          )}

        {!loading &&
          !error &&
          news.length > 0 && (
            <div className="products-grid">
              {news.map((item) => (
                <article
                  className="product-item"
                  key={item.id}
                >
                  <div className="product-item-content">
                    <span>
                      BERITA
                    </span>

                    <h2>
                      {item.title}
                    </h2>

                    <p>
                      {item.content}
                    </p>

                    <p>
                      Dibuat oleh:{' '}
                      {item.admin?.name ||
                        'Content Manager'}
                    </p>

                    <p>
                      {item.created_at
                        ? new Date(
                            item.created_at
                          ).toLocaleDateString(
                            'id-ID',
                            {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                            }
                          )
                        : '-'}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          )}
      </main>
    </div>
  )
}

export default News
