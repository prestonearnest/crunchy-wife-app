import './InstagramEmbed.css'

export default function InstagramEmbed() {
  const username = import.meta.env.VITE_INSTAGRAM_USERNAME || 'crunchywife'

  return (
    <div className="instagram-section">
      <a
        href={`https://www.instagram.com/${username}/`}
        target="_blank"
        rel="noopener noreferrer"
        className="instagram-link card"
      >
        <div className="instagram-icon">📸</div>
        <div className="instagram-info">
          <span className="instagram-handle">@{username}</span>
          <span className="instagram-cta">Follow for daily crunchy content</span>
        </div>
        <span className="instagram-arrow">→</span>
      </a>
      <p className="instagram-note">
        New videos and memes posted daily on Instagram!
      </p>
    </div>
  )
}
