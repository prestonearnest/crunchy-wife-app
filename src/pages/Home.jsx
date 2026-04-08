import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import ContentCard from '../components/ContentCard'
import InstagramEmbed from '../components/InstagramEmbed'
import './Home.css'

export default function Home() {
  const [content, setContent] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchContent() {
      const { data } = await supabase
        .from('content')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false })
        .limit(20)
      setContent(data || [])
      setLoading(false)
    }
    fetchContent()
  }, [])

  return (
    <div className="page">
      <div className="home-hero">
        <h1 className="home-hero-title">Welcome to the Crunchy Side</h1>
        <p className="home-hero-sub">
          Come for the laughs. Stay for the health knowledge. 🌿
        </p>
      </div>

      <section className="home-section">
        <h2 className="section-title">Latest from Instagram</h2>
        <InstagramEmbed />
      </section>

      <section className="home-section">
        <h2 className="section-title">Fresh Content</h2>
        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner" />
            <p>Loading the good stuff...</p>
          </div>
        ) : content.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">🌱</span>
            <p>Content is sprouting! Check back soon.</p>
          </div>
        ) : (
          <div className="content-feed">
            {content.map(item => (
              <ContentCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
