# How to Receive Feedback

Currently, feedback submitted on the landing page is saved to the user's browser's `localStorage`. We can't see it. This document outlines three approaches to actually receive feedback, ordered from simplest to most scalable.

---

## Approach 1: Formspree (Zero Backend, Zero Code)

Best for: solo founders, prototyping, low volume (< 50 submissions/month)

[Formspree](https://formspree.io) is a form-to-email service. You point your HTML form at their endpoint and they email you each submission.

### Setup

1. Sign up at formspree.io (free: 50 submissions/month)
2. Create a new form → get a form ID: `https://formspree.io/f/abc123`
3. Replace the `handleSubmit` function in `src/screens/LandingScreen/LandingScreen.tsx`:

```typescript
const handleSubmit = async () => {
  const data = {
    bonding: bonding || 'not_specified',
    enjoy: enjoy.length > 0 ? enjoy.join(', ') : 'not_specified',
    improvement,
    recommend: recommend || 'not_specified',
  }

  try {
    const res = await fetch('https://formspree.io/f/abc123', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (res.ok) {
      saveFeedback(data as FeedbackData)
      dispatch({ type: 'SUBMIT_FEEDBACK' })
      setSubmitted(true)
    }
  } catch {
    // Fall back to localStorage-only if network fails
    saveFeedback(data as FeedbackData)
    dispatch({ type: 'SUBMIT_FEEDBACK' })
    setSubmitted(true)
  }
}
```

### Pros
- No backend code, no hosting, no database
- Submissions arrive as email
- Free tier covers early usage

### Cons
- 50 submissions/month free limit
- No analytics dashboard (just emails)
- Vendor lock-in (but easy to migrate)

### Scaling
- **Paid tier** ($10/month): 1000 submissions/month, spam filtering
- At this point you're better off with Approach 2

---

## Approach 2: Single Serverless Function (Vercel / Netlify)

Best for: production apps, full control, up to millions of submissions

Add a single API endpoint that receives the POST and stores the data. No database required initially — use Google Sheets as storage (free, human-readable), or add SQLite/BetterSQLite3 for queryable storage.

### Option 2a: Google Sheets as storage (zero DB)

**How it works**: Deploy an API endpoint on Vercel/Netlify. The endpoint receives the feedback and appends a row to a Google Sheet via the Google Sheets API.

**Files to create**:

```
api/
  submit-feedback.js     # The serverless function
```

```javascript
// api/submit-feedback.js (Vercel example)
import { google } from 'googleapis'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { bonding, enjoy, improvement, recommend, submittedAt } = req.body

  // Authenticate via service account (set GOOGLE_SERVICE_ACCOUNT env var)
  const auth = new google.auth.GoogleAuth({
    credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT),
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  })

  const sheets = google.sheets({ version: 'v4', auth })
  const spreadsheetId = process.env.SHEET_ID

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: 'Sheet1!A:E',
    valueInputOption: 'RAW',
    requestBody: {
      values: [[submittedAt, bonding, enjoy.join(', '), improvement, recommend]],
    },
  })

  res.json({ ok: true })
}
```

**Frontend change** (in `LandingScreen.tsx`):
```typescript
const handleSubmit = async () => {
  const data = { bonding, enjoy, improvement, recommend, submittedAt: new Date().toISOString() }
  try {
    const res = await fetch('/api/submit-feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    // Still save locally regardless of server response
    saveFeedback(data as FeedbackData)
    dispatch({ type: 'SUBMIT_FEEDBACK' })
    setSubmitted(true)
  } catch {
    saveFeedback(data as FeedbackData)
    dispatch({ type: 'SUBMIT_FEEDBACK' })
    setSubmitted(true)
  }
}
```

### Option 2b: SQLite + Lightweight Backend

Best for: high volume, need to query/analuze feedback, privacy-first

**Architecture**:

```
┌─────────────┐     POST /api/feedback     ┌──────────────┐
│  React SPA  │ ──────────────────────────→ │   API Server │
│  (Vercel)   │                             │  (Fly.io /   │
│             │ ←──── { ok: true } ─────── │   Railway)   │
└─────────────┘                             └──────┬───────┘
                                                   │
                                           ┌───────┴───────┐
                                           │   SQLite DB    │
                                           │  (feedback.db) │
                                           └───────────────┘
```

**SQLite schema**:

```sql
CREATE TABLE feedback (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  submitted_at TEXT NOT NULL DEFAULT (datetime('now')),
  bonding TEXT NOT NULL,
  enjoy TEXT NOT NULL,          -- comma-separated options
  improvement TEXT NOT NULL DEFAULT '',
  recommend TEXT NOT NULL,
  is_read INTEGER NOT NULL DEFAULT 0
);
```

**API endpoint** (~30 lines with Express or Hono):

```javascript
// api/submit.js (using Hono framework — tiny, fast)
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { Database } from 'bun:sqlite'  // or better-sqlite3

const app = new Hono()
const db = new Database('feedback.db')

app.use('/api/*', cors())

app.post('/api/feedback', async (c) => {
  const body = await c.req.json()
  const stmt = db.prepare(
    'INSERT INTO feedback (bonding, enjoy, improvement, recommend) VALUES (?, ?, ?, ?)'
  )
  stmt.run(body.bonding, body.enjoy.join(', '), body.improvement, body.recommend)
  return c.json({ ok: true })
})

// Optional: admin endpoint to view feedback (protect with API key)
app.get('/api/feedback', async (c) => {
  const apiKey = c.req.header('X-Api-Key')
  if (apiKey !== process.env.ADMIN_KEY) return c.json({ error: 'unauthorized' }, 401)
  const rows = db.query('SELECT * FROM feedback ORDER BY submitted_at DESC').all()
  return c.json(rows)
})
```

**Deployment**: Push to Fly.io, Railway, or Render. They all support SQLite with persistent volumes.

### Pros (over Formspree)
- Full data ownership — nothing leaves your server
- No vendor lock-in
- Queryable — run `SELECT bonding, COUNT(*) FROM feedback GROUP BY bonding`
- Batch export to CSV for analysis
- Can add rate limiting, auth, spam detection

### Cons
- Requires a server (Fly.io free tier is sufficient for years)
- ~$0–$5/month hosting
- Slightly more setup

---

## Scaling Strategy

### Tier 1: Hundreds of users (Approach 1 — Formspree)
- Cost: $0/month
- Feedback lands in your email inbox
- Acceptable up to ~50 submissions/month on free tier

### Tier 2: Thousands of users (Approach 2a — Google Sheets)
- Cost: $0/month (Vercel free tier + Google Sheets free)
- Feedback lands in a spreadsheet
- Add a simple password-protected page at `/admin/feedback` that renders the sheet data
- Rate limit: max 60 writes/minute to Google Sheets (fine for this volume)

### Tier 3: Tens of thousands+ (Approach 2b — SQLite → Postgres)
- Cost: ~$5–$15/month (Fly.io or Railway)
- Migrate from SQLite to Postgres when you need concurrent writes
- Add an admin dashboard with charts (bonding score distribution, recommend rate, etc.)
- Add webhook notifications (Slack/email when new feedback arrives)

### Migration path (no vendor lock-in)
```
Formspree → Google Sheets API → SQLite → Postgres
```

The frontend always calls the same `/api/feedback` endpoint. Only the backend implementation changes. The frontend code barely changes between tiers.

---

## Current Code (for reference)

The feedback form is at `src/screens/LandingScreen/LandingScreen.tsx`. When the user submits:

1. `saveFeedback(data)` stores it in `localStorage('ws_feedback')`
2. `dispatch({ type: 'SUBMIT_FEEDBACK' })` marks it as submitted in React state
3. The UI shows a thank-you card

To add any of the approaches above, you only need to modify the `handleSubmit` function — the form UI, validation, and thank-you state stay exactly as-is.
