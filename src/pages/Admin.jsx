import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import './Admin.css'

const TABS = ['content', 'products', 'stories', 'affiliates', 'subscribers']

export default function Admin() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('content')
  const navigate = useNavigate()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate('/admin/login')
      } else {
        setUser(session.user)
        setLoading(false)
      }
    })
  }, [navigate])

  async function handleLogout() {
    await supabase.auth.signOut()
    navigate('/admin/login')
  }

  if (loading) return <div className="admin-loading">Loading...</div>

  return (
    <div className="admin-page">
      <header className="admin-header">
        <div className="admin-header-inner">
          <h1>Crunchy Wife Community Admin</h1>
          <div className="admin-user">
            <span>{user.email}</span>
            <button onClick={handleLogout} className="btn btn-secondary">Logout</button>
          </div>
        </div>
      </header>

      <div className="admin-tabs">
        {TABS.map(t => (
          <button
            key={t}
            className={`admin-tab ${tab === t ? 'active' : ''}`}
            onClick={() => setTab(t)}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="admin-content">
        {tab === 'content' && <ContentManager />}
        {tab === 'products' && <ProductManager />}
        {tab === 'stories' && <StoryManager />}
        {tab === 'affiliates' && <AffiliateManager />}
        {tab === 'subscribers' && <SubscriberList />}
      </div>
    </div>
  )
}

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

function ContentManager() {
  const [items, setItems] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ title: '', excerpt: '', content: '', tag: 'musings', cover_image_url: '', status: 'draft', is_featured: false })

  useEffect(() => { fetchItems() }, [])

  async function fetchItems() {
    const { data } = await supabase.from('blog_posts').select('*').order('created_at', { ascending: false })
    setItems(data || [])
  }

  async function handleSubmit(e) {
    e.preventDefault()
    await supabase.from('blog_posts').insert({ ...form, slug: slugify(form.title) })
    setForm({ title: '', excerpt: '', content: '', tag: 'musings', cover_image_url: '', status: 'draft', is_featured: false })
    setShowForm(false)
    fetchItems()
  }

  async function togglePublish(item) {
    await supabase.from('blog_posts').update({ status: item.status === 'published' ? 'draft' : 'published' }).eq('id', item.id)
    fetchItems()
  }

  async function deleteItem(id) {
    await supabase.from('blog_posts').delete().eq('id', id)
    fetchItems()
  }

  return (
    <div>
      <div className="admin-section-header">
        <h2>Blog Posts</h2>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ Add Post'}
        </button>
      </div>

      {showForm && (
        <form className="admin-form card" onSubmit={handleSubmit}>
          <select value={form.tag} onChange={e => setForm({ ...form, tag: e.target.value })}>
            <option value="persona">Persona</option>
            <option value="protocol">Protocol</option>
            <option value="kitchen">Kitchen</option>
            <option value="musings">Musings</option>
            <option value="marriage">Marriage</option>
            <option value="food">Food</option>
          </select>
          <input placeholder="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
          <input placeholder="Excerpt (short summary)" value={form.excerpt} onChange={e => setForm({ ...form, excerpt: e.target.value })} />
          <textarea placeholder="Content" value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} rows={8} />
          <input placeholder="Cover image URL" value={form.cover_image_url} onChange={e => setForm({ ...form, cover_image_url: e.target.value })} />
          <div style={{ display: 'flex', gap: '1rem' }}>
            <label className="admin-checkbox">
              <input type="checkbox" checked={form.is_featured} onChange={e => setForm({ ...form, is_featured: e.target.checked })} />
              Featured post
            </label>
            <label className="admin-checkbox">
              <input type="checkbox" checked={form.status === 'published'} onChange={e => setForm({ ...form, status: e.target.checked ? 'published' : 'draft' })} />
              Publish immediately
            </label>
          </div>
          <button type="submit" className="btn btn-primary">Save Post</button>
        </form>
      )}

      <div className="admin-list">
        {items.map(item => (
          <div key={item.id} className="admin-item card">
            <div className="admin-item-info">
              <span className={`badge ${item.status === 'published' ? 'badge-green' : 'badge-wood'}`}>
                {item.status}
              </span>
              <span className="badge badge-wood">{item.tag}</span>
              {item.is_featured && <span className="badge badge-green">Featured</span>}
              <h3>{item.title}</h3>
              <p>{item.excerpt || item.content?.slice(0, 100)}</p>
            </div>
            <div className="admin-item-actions">
              <button onClick={() => togglePublish(item)} className="btn btn-secondary">
                {item.status === 'published' ? 'Unpublish' : 'Publish'}
              </button>
              <button onClick={() => deleteItem(item.id)} className="btn btn-danger">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function ProductManager() {
  const [items, setItems] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', description: '', image_url: '', buy_url: '', price_display: '', price_cents: '', category: '', in_stock: true })

  useEffect(() => { fetchItems() }, [])

  async function fetchItems() {
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false })
    setItems(data || [])
  }

  async function handleSubmit(e) {
    e.preventDefault()
    await supabase.from('products').insert({ ...form, price_cents: form.price_cents ? parseInt(form.price_cents) : 0 })
    setForm({ name: '', description: '', image_url: '', buy_url: '', price_display: '', price_cents: '', category: '', in_stock: true })
    setShowForm(false)
    fetchItems()
  }

  async function toggleActive(item) {
    await supabase.from('products').update({ status: item.status === 'active' ? 'archived' : 'active' }).eq('id', item.id)
    fetchItems()
  }

  async function deleteItem(id) {
    await supabase.from('products').delete().eq('id', id)
    fetchItems()
  }

  return (
    <div>
      <div className="admin-section-header">
        <h2>Products</h2>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ Add Product'}
        </button>
      </div>

      {showForm && (
        <form className="admin-form card" onSubmit={handleSubmit}>
          <input placeholder="Product name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
          <textarea placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
          <input placeholder="Image URL" value={form.image_url} onChange={e => setForm({ ...form, image_url: e.target.value })} />
          <input placeholder="Buy link / URL" value={form.buy_url} onChange={e => setForm({ ...form, buy_url: e.target.value })} />
          <input placeholder="Price display (e.g. $24.99)" value={form.price_display} onChange={e => setForm({ ...form, price_display: e.target.value })} required />
          <input placeholder="Price in cents (e.g. 2499)" type="number" value={form.price_cents} onChange={e => setForm({ ...form, price_cents: e.target.value })} />
          <input placeholder="Category (e.g. Kitchen, Wellness)" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} />
          <label className="admin-checkbox">
            <input type="checkbox" checked={form.in_stock} onChange={e => setForm({ ...form, in_stock: e.target.checked })} />
            In stock
          </label>
          <button type="submit" className="btn btn-primary">Save Product</button>
        </form>
      )}

      <div className="admin-list">
        {items.map(item => (
          <div key={item.id} className="admin-item card">
            <div className="admin-item-info">
              <span className={`badge ${item.status === 'active' ? 'badge-green' : 'badge-wood'}`}>
                {item.status}
              </span>
              <h3>{item.name}</h3>
              <p>{item.price_display}{item.category ? ` · ${item.category}` : ''}</p>
              <p>{item.description?.slice(0, 80)}</p>
            </div>
            <div className="admin-item-actions">
              <button onClick={() => toggleActive(item)} className="btn btn-secondary">
                {item.status === 'active' ? 'Archive' : 'Activate'}
              </button>
              <button onClick={() => deleteItem(item.id)} className="btn btn-danger">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function StoryManager() {
  const [stories, setStories] = useState([])

  useEffect(() => { fetchStories() }, [])

  async function fetchStories() {
    const { data } = await supabase.from('community_stories').select('*').order('created_at', { ascending: false })
    setStories(data || [])
  }

  async function approve(id) {
    await supabase.from('community_stories').update({ status: 'approved' }).eq('id', id)
    fetchStories()
  }

  async function toggleFeature(story) {
    const newStatus = story.status === 'featured' ? 'approved' : 'featured'
    await supabase.from('community_stories').update({ status: newStatus }).eq('id', story.id)
    fetchStories()
  }

  async function reject(id) {
    await supabase.from('community_stories').update({ status: 'rejected' }).eq('id', id)
    fetchStories()
  }

  return (
    <div>
      <div className="admin-section-header">
        <h2>Story Submissions</h2>
      </div>

      <div className="admin-list">
        {stories.map(story => (
          <div key={story.id} className="admin-item card">
            <div className="admin-item-info">
              <span className={`badge ${story.status === 'pending' ? 'badge-wood' : story.status === 'rejected' ? 'badge-danger' : 'badge-green'}`}>
                {story.status}
              </span>
              <h3>{story.title}</h3>
              <p className="admin-meta">by {story.author_display || 'Anonymous'}</p>
              <p>{story.body?.slice(0, 150)}</p>
            </div>
            <div className="admin-item-actions">
              {story.status === 'pending' && (
                <button onClick={() => approve(story.id)} className="btn btn-primary">Approve</button>
              )}
              {(story.status === 'approved' || story.status === 'featured') && (
                <button onClick={() => toggleFeature(story)} className="btn btn-secondary">
                  {story.status === 'featured' ? 'Unfeature' : 'Feature'}
                </button>
              )}
              {story.status !== 'rejected' && (
                <button onClick={() => reject(story.id)} className="btn btn-danger">Reject</button>
              )}
            </div>
          </div>
        ))}
        {stories.length === 0 && (
          <div className="empty-state"><p>No stories submitted yet.</p></div>
        )}
      </div>
    </div>
  )
}

function AffiliateManager() {
  const [items, setItems] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ title: '', blurb: '', image_url: '', outbound_url: '', category: '', label: '', status: 'active' })

  useEffect(() => { fetchItems() }, [])

  async function fetchItems() {
    const { data } = await supabase.from('affiliate_products').select('*').order('sort_order', { ascending: true })
    setItems(data || [])
  }

  async function handleSubmit(e) {
    e.preventDefault()
    await supabase.from('affiliate_products').insert(form)
    setForm({ title: '', blurb: '', image_url: '', outbound_url: '', category: '', label: '', status: 'active' })
    setShowForm(false)
    fetchItems()
  }

  async function toggleActive(item) {
    await supabase.from('affiliate_products').update({ status: item.status === 'active' ? 'archived' : 'active' }).eq('id', item.id)
    fetchItems()
  }

  async function deleteItem(id) {
    await supabase.from('affiliate_products').delete().eq('id', id)
    fetchItems()
  }

  return (
    <div>
      <div className="admin-section-header">
        <h2>Affiliate Products</h2>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ Add Affiliate'}
        </button>
      </div>

      {showForm && (
        <form className="admin-form card" onSubmit={handleSubmit}>
          <input placeholder="Product title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
          <textarea placeholder="Short description / blurb" value={form.blurb} onChange={e => setForm({ ...form, blurb: e.target.value })} />
          <input placeholder="Image URL" value={form.image_url} onChange={e => setForm({ ...form, image_url: e.target.value })} />
          <input placeholder="Affiliate link (outbound URL)" value={form.outbound_url} onChange={e => setForm({ ...form, outbound_url: e.target.value })} required />
          <input placeholder="Category (e.g. Kitchen, Wellness)" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} />
          <input placeholder="Label (e.g. Meg's Pick, New)" value={form.label} onChange={e => setForm({ ...form, label: e.target.value })} />
          <button type="submit" className="btn btn-primary">Save Affiliate Product</button>
        </form>
      )}

      <div className="admin-list">
        {items.map(item => (
          <div key={item.id} className="admin-item card">
            <div className="admin-item-info">
              <span className={`badge ${item.status === 'active' ? 'badge-green' : 'badge-wood'}`}>
                {item.status}
              </span>
              {item.label && <span className="badge badge-wood">{item.label}</span>}
              <h3>{item.title}</h3>
              {item.category && <p>{item.category}</p>}
              <p>{item.blurb?.slice(0, 80)}</p>
            </div>
            <div className="admin-item-actions">
              <button onClick={() => toggleActive(item)} className="btn btn-secondary">
                {item.status === 'active' ? 'Archive' : 'Activate'}
              </button>
              <button onClick={() => deleteItem(item.id)} className="btn btn-danger">Delete</button>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <div className="empty-state"><p>No affiliate products yet.</p></div>
        )}
      </div>
    </div>
  )
}

function SubscriberList() {
  const [subs, setSubs] = useState([])

  useEffect(() => {
    async function fetch() {
      const { data } = await supabase.from('newsletter_subscribers').select('*').order('subscribed_at', { ascending: false })
      setSubs(data || [])
    }
    fetch()
  }, [])

  return (
    <div>
      <div className="admin-section-header">
        <h2>Subscribers ({subs.length})</h2>
      </div>
      <div className="admin-list">
        {subs.map(sub => (
          <div key={sub.id} className="admin-item card">
            <div className="admin-item-info">
              <span className={`badge ${sub.confirmed ? 'badge-green' : 'badge-wood'}`}>
                {sub.confirmed ? 'Confirmed' : 'Pending'}
              </span>
              {!sub.active && <span className="badge badge-wood">Unsubscribed</span>}
              <h3>{sub.email}</h3>
              {sub.name && <p>{sub.name}</p>}
              <span className="admin-meta">
                Joined {new Date(sub.subscribed_at).toLocaleDateString()}
              </span>
            </div>
          </div>
        ))}
        {subs.length === 0 && (
          <div className="empty-state"><p>No subscribers yet.</p></div>
        )}
      </div>
    </div>
  )
}
