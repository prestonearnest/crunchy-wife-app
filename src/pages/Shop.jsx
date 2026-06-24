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
      <h1 className="page-title">Shop</h1>
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
          <span className="empty-icon"><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#C8F560" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" /></svg></span>
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
              className="product-card"
            >
              {product.featured && <span className="product-featured">Fave</span>}
              {product.image_url ? (
                <div className="product-image">
                  <img src={product.image_url} alt={product.name} />
                </div>
              ) : (
                <div className="product-image product-placeholder"><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#C8F560" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2C6.5 2 2 6.5 2 12c0 3 1.5 5.5 3.5 7.5C7 21 9.5 22 12 22c5.5 0 10-4.5 10-10" /><path d="M12 2c3 3 4.5 7 4.5 10" /><path d="M12 2v10" /></svg></div>
              )}
              <div className="product-info">
                <h3 className="product-name">{product.name}</h3>
                {product.description && (
                  <p className="product-desc">{product.description}</p>
                )}
                {product.price_note && (
                  <span className="product-price">{product.price_note}</span>
                )}
                <span className="product-btn">Shop Now</span>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  )
}
