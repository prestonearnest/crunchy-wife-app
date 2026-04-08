import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { Link } from 'react-router-dom'
import './Stories.css'

export default function Stories() {
  const [stories, setStories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStories() {
      const { data } = await supabase
        .from('stories')
        .select('*')
        .eq('approved', true)
        .order('featured', { ascending: false })
        .order('created_at', { ascending: false })
      setStories(data || [])
      setLoading(false)
    }
    fetchStories()
  }, [])

  return (
    <div className="page">
      <h1 className="page-title">Crunchy Stories</h1>
      <p className="page-subtitle">Real stories from real crunchy people</p>

      {loading ? (
        <div className="loading-state">
          <div className="loading-spinner" />
          <p>Loading stories...</p>
        </div>
      ) : stories.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">📖</span>
          <p>No stories yet! Be the first to share.</p>
          <Link to="/submit" className="btn btn-primary" style={{ marginTop: 16 }}>
            Submit Your Story
          </Link>
        </div>
      ) : (
        <div className="stories-list">
          {stories.map(story => (
            <article key={story.id} className="story-card card">
              {story.featured && (
                <span className="badge badge-green" style={{ marginBottom: 8 }}>Featured</span>
              )}
              <h3 className="story-title">{story.title}</h3>
              <p className="story-author">by {story.author_name}</p>
              <p className="story-body">{story.body}</p>
              <span className="story-date">
                {new Date(story.created_at).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
            </article>
          ))}

          <Link to="/submit" className="btn btn-secondary btn-full" style={{ marginTop: 8 }}>
            Got a story? Share yours!
          </Link>
        </div>
      )}
    </div>
  )
}
