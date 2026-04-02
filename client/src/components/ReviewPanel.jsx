function ReviewPanel({ filename, initialReview, user }) {
    const formatReview = (text) => {
      if (!text) return []
      return text.split('\n').map((line, index) => {
        if (line.match(/^(1\.|2\.|3\.|4\.|5\.)\s/)) {
          return { type: 'section', content: line.replace(/^\d\.\s*/, ''), key: index }
        }
        if (line.startsWith('**') && line.endsWith('**')) {
          return { type: 'bold', content: line.replace(/\*\*/g, ''), key: index }
        }
        if (line.startsWith('- ') || line.startsWith('• ')) {
          return { type: 'bullet', content: line.replace(/^[-•]\s*/, ''), key: index }
        }
        if (line.toUpperCase() === line && line.trim().length > 3 && !line.includes('.')) {
          return { type: 'heading', content: line, key: index }
        }
        if (line.trim() === '') {
          return { type: 'spacer', content: '', key: index }
        }
        return { type: 'text', content: line, key: index }
      })
    }
  
    const lines = formatReview(initialReview)
    const riskCount = lines.filter(l =>
      l.content && (
        l.content.toUpperCase().includes('RISK') ||
        l.content.toUpperCase().includes('FLAG') ||
        l.content.toUpperCase().includes('UNLAWFUL') ||
        l.content.toUpperCase().includes('UNENFORCEABLE') ||
        l.content.toUpperCase().includes('MISSING')
      )
    ).length
  
    return (
      <div className="flex flex-col rounded-2xl overflow-hidden animate-fade-up"
        style={{
          background: 'var(--navy-mid)',
          border: '1px solid rgba(201,169,110,0.15)',
          height: '780px'
        }}>
  
        {/* Header */}
        <div className="px-6 py-5 flex-shrink-0"
          style={{ borderBottom: '1px solid rgba(201,169,110,0.1)' }}>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs uppercase tracking-widest mb-1"
                style={{ color: 'var(--gold)' }}>
                Document Review
              </p>
              <h2 className="font-serif text-lg" style={{ color: 'var(--cream)' }}>
                {filename}
              </h2>
              <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                Reviewed by {user.name} · {user.id}
              </p>
            </div>
            {riskCount > 0 && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg flex-shrink-0"
                style={{
                  background: 'rgba(220,38,38,0.1)',
                  border: '1px solid rgba(220,38,38,0.2)'
                }}>
                <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
                <span className="text-xs font-medium text-red-400">
                  {riskCount} risk{riskCount !== 1 ? 's' : ''} flagged
                </span>
              </div>
            )}
          </div>
        </div>
  
        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {lines.map((line) => {
            if (line.type === 'spacer') {
              return <div key={line.key} className="h-2" />
            }
            if (line.type === 'section') {
              return (
                <div key={line.key} className="mt-6 mb-3 first:mt-0">
                  <div className="flex items-center gap-3">
                    <div className="gold-line" style={{ width: '16px' }} />
                    <h3 className="font-serif text-base font-semibold"
                      style={{ color: 'var(--cream)' }}>
                      {line.content}
                    </h3>
                  </div>
                </div>
              )
            }
            if (line.type === 'heading') {
              return (
                <p key={line.key} className="text-xs uppercase tracking-widest mt-4 mb-2"
                  style={{ color: 'var(--gold)' }}>
                  {line.content}
                </p>
              )
            }
            if (line.type === 'bold') {
              return (
                <p key={line.key} className="text-sm font-semibold mt-3 mb-1"
                  style={{ color: 'var(--cream)' }}>
                  {line.content}
                </p>
              )
            }
            if (line.type === 'bullet') {
              const isRisk = line.content.toUpperCase().includes('RISK') ||
                line.content.toUpperCase().includes('UNLAWFUL') ||
                line.content.toUpperCase().includes('UNENFORCEABLE') ||
                line.content.toUpperCase().includes('MISSING') ||
                line.content.toUpperCase().includes('FLAG')
  
              return (
                <div key={line.key} className="flex gap-3 mb-2">
                  <span className="flex-shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full"
                    style={{ background: isRisk ? '#f87171' : 'var(--gold)', opacity: 0.7 }} />
                  <p className="text-sm leading-relaxed"
                    style={{ color: isRisk ? '#fca5a5' : 'var(--text-secondary)' }}>
                    {line.content}
                  </p>
                </div>
              )
            }
            return (
              <p key={line.key} className="text-sm leading-relaxed mb-1"
                style={{ color: 'var(--text-secondary)' }}>
                {line.content}
              </p>
            )
          })}
        </div>
  
        {/* Footer */}
        <div className="px-6 py-4 flex-shrink-0"
          style={{ borderTop: '1px solid rgba(201,169,110,0.1)' }}>
          <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
            This review was generated using the Keating Solicitors knowledge base.
            It does not constitute legal advice. Always consult a qualified solicitor
            before executing any agreement.
          </p>
        </div>
      </div>
    )
  }
  
  export default ReviewPanel