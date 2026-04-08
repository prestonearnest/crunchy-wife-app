import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import './Shop.css'

export default function Shop() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState('all')

  useEffect(() => {
    async function fetchProducts() {
      const { data } = await supabase
        .from('products')
        .select('*')
        .eq('active', true)
        .order('featured', { ascending: false })
        .order('created_at', { ascending: false })
      setProducts(data || [])
      setLoading(false)
    }
    fetchProducts()
  }, [])

  const categories = ['all', ...new Set(products.map(p => p.category).filter(Boolean))]
  const filtered = category === 'all' ? products : products.filter(p => p.category === category)

  return (
    <div className="page">
      <h1 className="page-title">Crunchy Shop</h1>
      <p className="page-subtitle">Products we actually use and love</p>

      {categories.length > 1 && (
        <div className="shop-filters">
          {categories.map(cat => (
            <button
              key={cat}
              className={`filter-chip ${category === cat ? 'active' : ''}`}
              onClick={() => setCategory(cat)}
            >
              {cat === 'all' ? 'All' : cat}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <div className="loading-state">
          <div className="loading-spinner" />
          <p>Loading products...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">🛒</span>
          <p>Products coming soon! We're curating the best crunchy finds.</p>
        </div>
      ) : (
        <div className="product-grid">
          {filtered.map(product => (
            <a
              key={product.id}
              href={product.affiliate_url}
              target="_blank"
              rel="noopener noreferrer"
              className="product-card card"
            >
              {product.featured && <span className="product-featured">Fave</span>}
              {product.image_url ? (
                <div className="product-image">
                  <img src={product.image_url} alt={product.name} />
                </div>
              ) : (
                <div className="product-image product-placeholder">🌿</div>
              )}
              <div className="product-info">
                <h3 className="product-name">{product.name}</h3>
                {product.description && (
                  <p className="product-desc">{product.description}</p>
                )}
                {product.price_note && (
                  <span className="product-price">{product.price_note}</span>
                )}
                <span className="btn btn-wood btn-full" style={{ marginTop: 12 }}>
                  Shop Now
                </span>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  )
}
