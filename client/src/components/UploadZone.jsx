import { useState } from 'react'

const API_URL = 'https://keating-ai-paralegal.onrender.com'

function UploadZone({ onUploadSuccess, loading, setLoading, user }) {
  const [dragOver, setDragOver] = useState(false)
  const [error, setError] = useState(null)

  const handleFile = async (file) => {
    if (!file.name.endsWith('.pdf')) {
      setError('Only PDF files are supported')
      return
    }

    setError(null)
    setLoading(true)

    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch(`${API_URL}/api/upload`, {
        method: 'POST',
        body: formData
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Upload failed')
      }

      onUploadSuccess(data)

    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  const handleInputChange = (e) => {
    const file = e.target.files[0]
    if (file) handleFile(file)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96 animate-fade-in">
        <div className="text-center">
          <div className="relative mx-auto mb-8" style={{ width: '64px', height: '64px' }}>
            <div className="absolute inset-0 rounded-full"
              style={{ border: '1px solid rgba(201,169,110,0.2)' }} />
            <div className="absolute inset-0 rounded-full animate-spin"
              style={{ border: '2px solid transparent', borderTopColor: 'var(--gold)' }} />
          </div>
          <h2 className="font-serif text-2xl mb-3" style={{ color: 'var(--cream)' }}>
            Reviewing Document
          </h2>
          <p className="text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>
            Claude is analysing your document against the firm knowledge base
          </p>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            This takes approximately 20 to 30 seconds
          </p>
          <div className="mt-6 flex items-center justify-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full animate-bounce"
              style={{ background: 'var(--gold)', animationDelay: '0ms' }} />
            <div className="w-1.5 h-1.5 rounded-full animate-bounce"
              style={{ background: 'var(--gold)', animationDelay: '150ms' }} />
            <div className="w-1.5 h-1.5 rounded-full animate-bounce"
              style={{ background: 'var(--gold)', animationDelay: '300ms' }} />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto animate-fade-up">

      {/* Welcome bar */}
      <div className="mb-10 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest mb-1"
            style={{ color: 'var(--gold)' }}>
            Welcome back
          </p>
          <h2 className="font-serif text-3xl" style={{ color: 'var(--cream)' }}>
            {user.name}
          </h2>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
            {user.role} · Employee {user.id}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs uppercase tracking-widest mb-1"
            style={{ color: 'var(--text-secondary)' }}>
            System
          </p>
          <p className="text-sm font-medium" style={{ color: 'var(--cream)' }}>
            AI Contract Checker
          </p>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
            UK Legal Standards v1.0
          </p>
        </div>
      </div>

      {/* Upload zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className="relative rounded-2xl p-16 text-center transition-all duration-300"
        style={{
          background: dragOver
            ? 'rgba(201,169,110,0.05)'
            : 'var(--navy-mid)',
          border: dragOver
            ? '1px solid rgba(201,169,110,0.6)'
            : '1px solid rgba(201,169,110,0.15)',
        }}
      >
        {/* Corner accents */}
        <div className="absolute top-4 left-4 w-6 h-6"
          style={{ borderTop: '1px solid var(--gold)', borderLeft: '1px solid var(--gold)', opacity: 0.5 }} />
        <div className="absolute top-4 right-4 w-6 h-6"
          style={{ borderTop: '1px solid var(--gold)', borderRight: '1px solid var(--gold)', opacity: 0.5 }} />
        <div className="absolute bottom-4 left-4 w-6 h-6"
          style={{ borderBottom: '1px solid var(--gold)', borderLeft: '1px solid var(--gold)', opacity: 0.5 }} />
        <div className="absolute bottom-4 right-4 w-6 h-6"
          style={{ borderBottom: '1px solid var(--gold)', borderRight: '1px solid var(--gold)', opacity: 0.5 }} />

        <div className="mb-6">
          <svg className="mx-auto mb-4" width="48" height="48" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" strokeWidth="1"
            style={{ color: 'var(--gold)', opacity: 0.7 }}>
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="font-serif text-2xl mb-2" style={{ color: 'var(--cream)' }}>
            Upload a Contract
          </h3>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Drag and drop your PDF document here
          </p>
        </div>

        <label className="inline-block cursor-pointer px-8 py-3 rounded-lg text-sm font-medium
          tracking-wide transition-all"
          style={{
            background: 'var(--gold)',
            color: 'var(--navy)',
          }}>
          Browse Files
          <input
            type="file"
            accept=".pdf"
            onChange={handleInputChange}
            className="hidden"
          />
        </label>

        <p className="text-xs mt-4" style={{ color: 'var(--text-secondary)' }}>
          PDF format only · All reviews are logged to your employee record
        </p>
      </div>

      {error && (
        <div className="mt-4 px-5 py-4 rounded-xl text-sm"
          style={{
            background: 'rgba(220,38,38,0.08)',
            border: '1px solid rgba(220,38,38,0.2)',
            color: '#f87171'
          }}>
          {error}
        </div>
      )}

      {/* Info cards */}
      <div className="mt-8 grid grid-cols-3 gap-4">
        {[
          {
            title: 'Risk Detection',
            desc: 'Flags clauses that fall below UK legal standards'
          },
          {
            title: 'Knowledge Base',
            desc: 'Cross-references firm standards on employment, NDA, leases and GDPR'
          },
          {
            title: 'Full Audit Trail',
            desc: 'Every review is logged to your employee ID automatically'
          },
        ].map((card, i) => (
          <div key={i} className="p-5 rounded-xl"
            style={{
              background: 'var(--navy-mid)',
              border: '1px solid rgba(201,169,110,0.1)'
            }}>
            <div className="gold-line mb-3" style={{ width: '24px' }} />
            <p className="text-sm font-medium mb-1" style={{ color: 'var(--cream)' }}>
              {card.title}
            </p>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              {card.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default UploadZone