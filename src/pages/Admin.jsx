import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import './Admin.css'

const TABS = ['content', 'products', 'stories', 'newsletters', 'subscribers']

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
          <h1>🌿 Crunchy Admin</h1>
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
        {tab === 'newsletters' && <NewsletterManager />}
        {tab === 'subscribers' && <SubscriberList />}
      </div>
    </div>
  )
}

function ContentManager() {
  const [items, setItems] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ title: '', body: '', type: 'health_tip', media_url: '', thumbnail_url: '', published: true })

  useEffect(() => { fetchItems() }, [])

  async function fetchItems() {
    const { data } = await supabase.from('content').select('*').order('created_at', { ascending: false })
    setItems(data || [])
  }

  async function handleSubmit(e) {
    e.preventDefault()
    await supabase.from('content').insert(form)
    setForm({ title: '', body: '', type: 'health_tip', media_url: '', thumbnail_url: '', published: true })
    setShowForm(false)
    fetchItems()
  }

  async function togglePublish(item) {
    await supabase.from('content').update({ published: !item.published }).eq('id', item.id)
    fetchItems()
  }

  async function deleteItem(id) {
    await supabase.from('content').delete().eq('id', id)
    fetchItems()
  }

  return (
    <div>
      <div className="admin-section-header">
        <h2>Content</h2>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ Add Content'}
        </button>
      </div>

      {showForm && (
        <form className="admin-form card" onSubmit={handleSubmit}>
          <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
            <option value="health_tip">Health Tip</option>
            <option value="video">Video</option>
            <option value="article">Article</option>
            <option value="meme">Meme</option>
            <option value="funny">Funny</option>
          </select>
          <input placeholder="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
          <textarea placeholder="Body text" value={form.body} onChange={e => setForm({ ...form, body: e.target.value })} />
          <input placeholder="Media URL (video link, image link)" value={form.media_url} onChange={e => setForm({ ...form, media_url: e.target.value })} />
          <input placeholder="Thumbnail URL" value={form.thumbnail_url} onChange={e => setForm({ ...form, thumbnail_url: e.target.value })} />
          <label className="admin-checkbox">
            <input type="checkbox" checked={form.published} onChange={e => setForm({ ...form, published: e.target.checked })} />
            Publish immediately
          </label>
          <button type="submit" className="btn btn-primary">Save Content</button>
        </form>
      )}

      <div className="admin-list">
        {items.map(item => (
          <div key={item.id} className="admin-item card">
            <div className="admin-item-info">
              <span className={`badge ${item.published ? 'badge-green' : 'badge-wood'}`}>
                {item.published ? 'Published' : 'Draft'}
              </span>
              <span className="badge badge-wood">{item.type}</span>
              <h3>{item.title}</h3>
              <p>{item.body?.slice(0, 100)}</p>
            </div>
            <div className="admin-item-actions">
              <button onClick={() => togglePublish(item)} className="btn btn-secondary">
                {item.published ? 'Unpublish' : 'Publish'}
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
  const [form, setForm] = useState({ name: '', description: '', image_url: '', affiliate_url: '', price_note: '', category: '', featured: false })

  useEffect(() => { fetchItems() }, [])

  async function fetchItems() {
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false })
    setItems(data || [])
  }

  async function handleSubmit(e) {
    e.preventDefault()
    await supabase.from('products').insert(form)
    setForm({ name: '', description: '', image_url: '', affiliate_url: '', price_note: '', category: '', featured: false })
    setShowForm(false)
    fetchItems()
  }

  async function toggleActive(item) {
    await supabase.from('products').update({ active: !item.active }).eq('id', item.id)
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
          <input placeholder="Affiliate link" value={form.affiliate_url} onChange={e => setForm({ ...form, affiliate_url: e.target.value })} required />
          <input placeholder="Price note (e.g. ~$25)" value={form.price_note} onChange={e => setForm({ ...form, price_note: e.target.value })} />
          <input placeholder="Category (e.g. Kitchen, Wellness)" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} />
          <label className="admin-checkbox">
            <input type="checkbox" checked={form.featured} onChange={e => setForm({ ...form, featured: e.target.checked })} />
            Featured product
          </label>
          <button type="submit" className="btn btn-primary">Save Product</button>
        </form>
      )}

      <div className="admin-list">
        {items.map(item => (
          <div key={item.id} className="admin-item card">
            <div className="admin-item-info">
              <span className={`badge ${item.active ? 'badge-green' : 'badge-wood'}`}>
                {item.active ? 'Active' : 'Hidden'}
              </span>
              {item.featured && <span className="badge badge-wood">Featured</span>}
              <h3>{item.name}</h3>
              <p>{item.description?.slice(0, 80)}</p>
            </div>
            <div className="admin-item-actions">
              <button onClick={() => toggleActive(item)} className="btn btn-secondary">
                {item.active ? 'Hide' : 'Show'}
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
    const { data } = await supabase.from('stories').select('*').order('created_at', { ascending: false })
    setStories(data || [])
  }

  async function approve(id) {
    await supabase.from('stories').update({ approved: true }).eq('id', id)
    fetchStories()
  }

  async function feature(id, featured) {
    await supabase.from('stories').update({ featured: !featured }).eq('id', id)
    fetchStories()
  }

  async function deleteStory(id) {
    await supabase.from('stories').delete().eq('id', id)
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
              <span className={`badge ${story.approved ? 'badge-green' : 'badge-wood'}`}>
                {story.approved ? 'Approved' : 'Pending'}
              </span>
              {story.featured && <span className="badge badge-green">Featured</span>}
              <h3>{story.title}</h3>
              <p className="admin-meta">by {story.author_name} {story.email && `(${story.email})`}</p>
              <p>{story.body}</p>
            </div>
            <div className="admin-item-actions">
              {!story.approved && (
                <button onClick={() => approve(story.id)} className="btn btn-primary">Approve</button>
              )}
              <button onClick={() => feature(story.id, story.featured)} className="btn btn-secondary">
                {story.featured ? 'Unfeature' : 'Feature'}
              </button>
              <button onClick={() => deleteStory(story.id)} className="btn btn-danger">Delete</button>
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

function NewsletterManager() {
  const [items, setItems] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ title: '', body: '', issue_number: '', published: false })

  useEffect(() => { fetchItems() }, [])

  async function fetchItems() {
    const { data } = await supabase.from('newsletters').select('*').order('created_at', { ascending: false })
    setItems(data || [])
  }

  async function handleSubmit(e) {
    e.preventDefault()
    await supabase.from('newsletters').insert({
      ...form,
      issue_number: form.issue_number ? parseInt(form.issue_number) : null,
      published_at: form.published ? new Date().toISOString() : null,
    })
    setForm({ title: '', body: '', issue_number: '', published: false })
    setShowForm(false)
    fetchItems()
  }

  async function togglePublish(item) {
    await supabase.from('newsletters').update({
      published: !item.published,
      published_at: !item.published ? new Date().toISOString() : item.published_at,
    }).eq('id', item.id)
    fetchItems()
  }

  async function deleteItem(id) {
    await supabase.from('newsletters').delete().eq('id', id)
    fetchItems()
  }

  return (
    <div>
      <div className="admin-section-header">
        <h2>Newsletters</h2>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ New Issue'}
        </button>
      </div>

      {showForm && (
        <form className="admin-form card" onSubmit={handleSubmit}>
          <input placeholder="Issue number" type="number" value={form.issue_number} onChange={e => setForm({ ...form, issue_number: e.target.value })} />
          <input placeholder="Newsletter title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
          <textarea placeholder="Newsletter content" value={form.body} onChange={e => setForm({ ...form, body: e.target.value })} required rows={10} />
          <label className="admin-checkbox">
            <input type="checkbox" checked={form.published} onChange={e => setForm({ ...form, published: e.target.checked })} />
            Publish immediately
          </label>
          <button type="submit" className="btn btn-primary">Save Newsletter</button>
        </form>
      )}

      <div className="admin-list">
        {items.map(item => (
          <div key={item.id} className="admin-item card">
            <div className="admin-item-info">
              <span className={`badge ${item.published ? 'badge-green' : 'badge-wood'}`}>
                {item.published ? 'Published' : 'Draft'}
              </span>
              <h3>#{item.issue_number} - {item.title}</h3>
              <p>{item.body?.slice(0, 120)}</p>
            </div>
            <div className="admin-item-actions">
              <button onClick={() => togglePublish(item)} className="btn btn-secondary">
                {item.published ? 'Unpublish' : 'Publish'}
              </button>
              <button onClick={() => deleteItem(item.id)} className="btn btn-danger">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function SubscriberList() {
  const [subs, setSubs] = useState([])

  useEffect(() => {
    async function fetch() {
      const { data } = await supabase.from('subscribers').select('*').order('created_at', { ascending: false })
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
              <h3>{sub.email}</h3>
              {sub.name && <p>{sub.name}</p>}
              <span className="admin-meta">
                Joined {new Date(sub.created_at).toLocaleDateString()}
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
