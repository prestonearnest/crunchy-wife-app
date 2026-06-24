import { useState } from 'react'
import { supabase } from '../lib/supabase'
import './SubmitStory.css'

export default function SubmitStory() {
  const [form, setForm] = useState({ author_name: '', email: '', title: '', body: '' })
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  function update(field) {
    return (e) => setForm(prev => ({ ...prev, [field]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.author_name || !form.title || !form.body) return
    setSubmitting(true)
    const { error } = await supabase.from('stories').insert({
      author_name: form.author_name,
      email: form.email || null,
      title: form.title,
      body: form.body,
    })
    setSubmitting(false)
    if (!error) {
      setSubmitted(true)
    }
  }

  if (submitted) {
    return (
      <div className="page">
        <div className="submit-success">
          <div className="success-circle"><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#C8F560" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="9 12 12 15 16 9" /></svg></div>
          <h2>Story Submitted!</h2>
          <p>Thanks for sharing! We'll review it and post the best ones.</p>
          <button className="btn btn-primary" onClick={() => { setSubmitted(false); setForm({ author_name: '', email: '', title: '', body: '' }) }}>
            Submit Another
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="page">
      <h1 className="page-title">Submit Your Story</h1>
      <p className="page-subtitle">Got a funny crunchy moment? We want to hear it!</p>

      <div className="submit-examples">
        <h3>What we're looking for:</h3>
        <ul>
          <li>Your funniest "crunchy wife" moment</li>
          <li>Times your partner looked at you like you're crazy</li>
          <li>Natural remedy wins (or fails)</li>
          <li>That time you threw out all the Tupperware</li>
        </ul>
      </div>

      <form className="submit-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Your Name *</label>
          <input
            type="text"
            placeholder="First name or nickname"
            value={form.author_name}
            onChange={update('author_name')}
            required
          />
        </div>

        <div className="form-group">
          <label>Email (optional)</label>
          <input
            type="email"
            placeholder="In case we want to feature you"
            value={form.email}
            onChange={update('email')}
          />
        </div>

        <div className="form-group">
          <label>Story Title *</label>
          <input
            type="text"
            placeholder="Give it a catchy title"
            value={form.title}
            onChange={update('title')}
            required
          />
        </div>

        <div className="form-group">
          <label>Your Story *</label>
          <textarea
            placeholder="Tell us everything..."
            value={form.body}
            onChange={update('body')}
            required
            rows={6}
          />
        </div>

        <button type="submit" className="btn btn-primary btn-full" disabled={submitting}>
          {submitting ? 'Submitting...' : 'Submit Story'}
        </button>
      </form>
    </div>
  )
}
