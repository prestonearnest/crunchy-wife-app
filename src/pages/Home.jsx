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
    <div className="page home-page">
      {/* Stories Row */}
      <InstagramEmbed />

      {/* Feed */}
      <section className="home-feed">
        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner" />
            <p>Loading the good stuff...</p>
          </div>
        ) : content.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon"><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#C8F560" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 20h10" /><path d="M12 20v-8" /><path d="M12 12c-3.5 0-6-2.5-6-6 3.5 0 6 2.5 6 6z" /><path d="M12 12c3.5 0 6-2.5 6-6-3.5 0-6 2.5-6 6z" /></svg></span>
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
