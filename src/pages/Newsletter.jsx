import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import './Newsletter.css'

export default function Newsletter() {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [newsletters, setNewsletters] = useState([])
  const [expanded, setExpanded] = useState(null)

  useEffect(() => {
    async function fetchNewsletters() {
      const { data } = await supabase
        .from('newsletters')
        .select('*')
        .eq('published', true)
        .order('published_at', { ascending: false })
      setNewsletters(data || [])
    }
    fetchNewsletters()
  }, [])

  async function handleSubscribe(e) {
    e.preventDefault()
    if (!email) return
    setSubmitting(true)
    const { error } = await supabase.from('subscribers').insert({ email, name: name || null })
    setSubmitting(false)
    if (!error) {
      setSubscribed(true)
      setEmail('')
      setName('')
    } else if (error.code === '23505') {
      setSubscribed(true)
    }
  }

  return (
    <div className="page">
      <h1 className="page-title">Newsletter</h1>
      <p className="page-subtitle">Monthly wisdom from The Crunchy Wife herself</p>

      <div className="newsletter-signup card">
        {subscribed ? (
          <div className="signup-success">
            <span className="success-icon">🎉</span>
            <h3>You're in!</h3>
            <p>Watch your inbox for the next issue.</p>
          </div>
        ) : (
          <form onSubmit={handleSubscribe}>
            <h3 className="signup-title">Join the Crunchy Crew</h3>
            <p className="signup-desc">Get health tips, product finds, and the best crunchy stories delivered monthly.</p>
            <div className="form-fields">
              <input
                type="text"
                placeholder="Your name (optional)"
                value={name}
                onChange={e => setName(e.target.value)}
              />
              <input
                type="email"
                placeholder="Your email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
              <button type="submit" className="btn btn-primary btn-full" disabled={submitting}>
                {submitting ? 'Subscribing...' : 'Subscribe 🌿'}
              </button>
            </div>
          </form>
        )}
      </div>

      {newsletters.length > 0 && (
        <section className="newsletter-archive">
          <h2 className="section-title">Past Issues</h2>
          <div className="archive-list">
            {newsletters.map(nl => (
              <div key={nl.id} className="archive-item card">
                <button
                  className="archive-header"
                  onClick={() => setExpanded(expanded === nl.id ? null : nl.id)}
                >
                  <div>
                    <span className="archive-issue">Issue #{nl.issue_number}</span>
                    <h3 className="archive-title">{nl.title}</h3>
                    <span className="archive-date">
                      {new Date(nl.published_at).toLocaleDateString('en-US', {
                        month: 'long',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                  <span className={`archive-toggle ${expanded === nl.id ? 'open' : ''}`}>
                    ▾
                  </span>
                </button>
                {expanded === nl.id && (
                  <div className="archive-body">
                    <div dangerouslySetInnerHTML={{ __html: nl.body.replace(/\n/g, '<br/>') }} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
