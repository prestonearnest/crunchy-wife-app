import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { Link } from 'react-router-dom'
import './Stories.css'

const HeartIcon = ({ size = 18, filled = false, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? color : 'none'} stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
)

const CommentIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
  </svg>
)

const ShareIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="18" cy="5" r="3" />
    <circle cx="6" cy="12" r="3" />
    <circle cx="18" cy="19" r="3" />
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
  </svg>
)

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d ago`
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

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
      <h1 className="page-title">Community Stories</h1>
      <p className="page-subtitle">Real stories from real crunchy people</p>

      {loading ? (
        <div className="loading-state">
          <div className="loading-spinner" />
          <p>Loading stories...</p>
        </div>
      ) : stories.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon"><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#C8F560" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></svg></span>
          <p>No stories yet! Be the first to share.</p>
          <Link to="/submit" className="btn btn-primary" style={{ marginTop: 16 }}>
            Submit Your Story
          </Link>
        </div>
      ) : (
        <div className="stories-feed">
          {stories.map(story => (
            <StoryCard key={story.id} story={story} />
          ))}

          <Link to="/submit" className="stories-cta">
            <span>Got a story? Share yours!</span>
          </Link>
        </div>
      )}
    </div>
  )
}

function StoryCard({ story }) {
  const [liked, setLiked] = useState(false)
  const initials = story.author_name ? story.author_name.charAt(0).toUpperCase() : '?'

  return (
    <article className="story-card">
      <div className="story-card-header">
        <div className="story-card-avatar">
          <span>{initials}</span>
        </div>
        <div className="story-card-meta">
          <span className="story-card-name">{story.author_name}</span>
          <span className="story-card-time">
            {story.created_at ? timeAgo(story.created_at) : 'Just now'}
            {story.featured && <span className="story-featured-badge">Featured</span>}
          </span>
        </div>
      </div>

      <div className="story-card-body">
        <h3 className="story-card-title">{story.title}</h3>
        <p className="story-card-text">{story.body}</p>
      </div>

      <div className="story-card-actions">
        <button
          className={`feed-action-btn ${liked ? 'liked' : ''}`}
          onClick={() => setLiked(!liked)}
        >
          <HeartIcon size={18} filled={liked} color={liked ? '#EF4444' : 'currentColor'} />
          <span>Like</span>
        </button>
        <button className="feed-action-btn">
          <CommentIcon size={18} />
          <span>Comment</span>
        </button>
        <button className="feed-action-btn">
          <ShareIcon size={16} />
          <span>Share</span>
        </button>
      </div>
    </article>
  )
}
