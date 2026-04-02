import { useState, useEffect } from 'react'
import Login from './components/Login'
import UploadZone from './components/UploadZone'
import ReviewPanel from './components/ReviewPanel'
import ChatPanel from './components/ChatPanel'

function App() {
  const [user, setUser] = useState(null)
  const [docId, setDocId] = useState(null)
  const [filename, setFilename] = useState('')
  const [initialReview, setInitialReview] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('keating_user')
    if (saved) {
      setUser(JSON.parse(saved))
    }
  }, [])

  const handleLogin = (userData) => {
    setUser(userData)
  }

  const handleLogout = () => {
    localStorage.removeItem('keating_user')
    setUser(null)
    setDocId(null)
    setFilename('')
    setInitialReview('')
  }

  const handleUploadSuccess = (data) => {
    setDocId(data.doc_id)
    setFilename(data.filename)
    setInitialReview(data.initial_review)
    setLoading(false)
  }

  const handleNewDocument = () => {
    setDocId(null)
    setFilename('')
    setInitialReview('')
  }

  if (!user) {
    return <Login onLogin={handleLogin} />
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--navy)' }}>

      {/* Header */}
      <header style={{
        background: 'var(--navy-mid)',
        borderBottom: '1px solid rgba(201,169,110,0.15)'
      }}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div>
              <div className="flex items-center gap-3">
                <div className="gold-line" style={{ width: '20px' }} />
                <h1 className="font-serif text-lg font-semibold"
                  style={{ color: 'var(--cream)' }}>
                  Keating Solicitors
                </h1>
                <span style={{
                  color: 'var(--gold)',
                  fontSize: '10px',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  padding: '2px 8px',
                  border: '1px solid rgba(201,169,110,0.3)',
                  borderRadius: '4px'
                }}>
                  Contract Checker
                </span>
              </div>
              <p className="text-xs mt-0.5 ml-8" style={{ color: 'var(--text-secondary)' }}>
                Powered by AWS Bedrock
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            {docId && (
              <button
                onClick={handleNewDocument}
                className="text-xs uppercase tracking-widest transition-colors"
                style={{ color: 'var(--gold)' }}
              >
                New Document
              </button>
            )}
            <div className="flex items-center gap-3"
              style={{ borderLeft: '1px solid rgba(201,169,110,0.15)', paddingLeft: '24px' }}>
              <div className="text-right">
                <p className="text-xs font-medium" style={{ color: 'var(--cream)' }}>
                  {user.name}
                </p>
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                  {user.role} · {user.id}
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="text-xs px-3 py-1.5 rounded transition-all"
                style={{
                  border: '1px solid rgba(201,169,110,0.2)',
                  color: 'var(--text-secondary)'
                }}
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {!docId ? (
          <UploadZone
            onUploadSuccess={handleUploadSuccess}
            loading={loading}
            setLoading={setLoading}
            user={user}
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ReviewPanel
              filename={filename}
              initialReview={initialReview}
              user={user}
            />
            <ChatPanel
              docId={docId}
              filename={filename}
              user={user}
            />
          </div>
        )}
      </main>
    </div>
  )
}

export default App