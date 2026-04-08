import './ContentCard.css'

const typeConfig = {
  video: { emoji: '🎬', label: 'Video', badge: 'badge-green' },
  article: { emoji: '📖', label: 'Article', badge: 'badge-green' },
  meme: { emoji: '😂', label: 'Meme', badge: 'badge-wood' },
  health_tip: { emoji: '🌿', label: 'Health Tip', badge: 'badge-green' },
  funny: { emoji: '🤣', label: 'Funny', badge: 'badge-wood' },
}

export default function ContentCard({ item }) {
  const config = typeConfig[item.type] || typeConfig.article

  return (
    <article className="content-card card">
      {item.thumbnail_url && (
        <div className="content-card-media">
          <img src={item.thumbnail_url} alt={item.title} />
        </div>
      )}
      <div className="content-card-body">
        <span className={`badge ${config.badge}`}>
          {config.emoji} {config.label}
        </span>
        <h3 className="content-card-title">{item.title}</h3>
        {item.body && (
          <p className="content-card-text">
            {item.body.length > 150 ? item.body.slice(0, 150) + '...' : item.body}
          </p>
        )}
        {item.media_url && item.type === 'video' && (
          <a href={item.media_url} target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ marginTop: 12 }}>
            Watch Video
          </a>
        )}
      </div>
    </article>
  )
}
