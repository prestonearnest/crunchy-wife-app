import { useState } from 'react'
import './ContentCard.css'

const HeartIcon = ({ size = 20, filled = false, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? color : 'none'} stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
)

const CommentIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
  </svg>
)

const ShareIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="18" cy="5" r="3" />
    <circle cx="6" cy="12" r="3" />
    <circle cx="18" cy="19" r="3" />
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
  </svg>
)

const LeafIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2C6.5 2 2 6.5 2 12c0 3 1.5 5.5 3.5 7.5C7 21 9.5 22 12 22c5.5 0 10-4.5 10-10" />
    <path d="M12 2c3 3 4.5 7 4.5 10" />
    <path d="M12 2v10" />
  </svg>
)

const MicIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="23 7 16 12 23 17 23 7" />
    <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
  </svg>
)

const BookIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
  </svg>
)

const SmileIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M8 14s1.5 2 4 2 4-2 4-2" />
    <line x1="9" y1="9" x2="9.01" y2="9" />
    <line x1="15" y1="9" x2="15.01" y2="9" />
  </svg>
)

const typeConfig = {
  video: { icon: <MicIcon />, label: 'Video' },
  article: { icon: <BookIcon />, label: 'Article' },
  meme: { icon: <SmileIcon />, label: 'Meme' },
  health_tip: { icon: <LeafIcon size={14} />, label: 'Health Tip' },
  funny: { icon: <SmileIcon />, label: 'Funny' },
}

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

export default function ContentCard({ item }) {
  const config = typeConfig[item.type] || typeConfig.article
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(Math.floor(Math.random() * 80) + 12)

  function handleLike() {
    setLiked(!liked)
    setLikeCount(prev => liked ? prev - 1 : prev + 1)
  }

  const commentCount = Math.floor(Math.random() * 20) + 1

  return (
    <article className="feed-card">
      {/* Card Header - user info */}
      <div className="feed-card-header">
        <div className="feed-card-avatar">
          <LeafIcon size={16} />
        </div>
        <div className="feed-card-meta">
          <span className="feed-card-username">Crunchy Wife Community</span>
          <span className="feed-card-time">
            {item.created_at ? timeAgo(item.created_at) : 'Just now'} &middot; {config.label}
          </span>
        </div>
      </div>

      {/* Card Image */}
      {item.thumbnail_url && (
        <div className="feed-card-image">
          <img src={item.thumbnail_url} alt={item.title} loading="lazy" />
        </div>
      )}

      {/* Engagement Row */}
      <div className="feed-card-actions">
        <div className="feed-card-actions-left">
          <button
            className={`feed-action-btn ${liked ? 'liked' : ''}`}
            onClick={handleLike}
          >
            <HeartIcon size={20} filled={liked} color={liked ? '#EF4444' : 'currentColor'} />
            <span>{likeCount}</span>
          </button>
          <button className="feed-action-btn">
            <CommentIcon size={20} />
            <span>{commentCount}</span>
          </button>
        </div>
        <button className="feed-action-btn">
          <ShareIcon size={18} />
        </button>
      </div>

      {/* Caption */}
      <div className="feed-card-caption">
        <h3 className="feed-card-title">{item.title}</h3>
        {item.body && (
          <p className="feed-card-text">
            {item.body.length > 150 ? item.body.slice(0, 150) + '...' : item.body}
          </p>
        )}
        {item.media_url && item.type === 'video' && (
          <a href={item.media_url} target="_blank" rel="noopener noreferrer" className="feed-card-link">
            Watch Video
          </a>
        )}
      </div>
    </article>
  )
}
