import { useState, useRef, useEffect } from 'react'

const API_URL = 'https://keating-ai-paralegal.onrender.com'

function ChatPanel({ docId, filename, documentText, user }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      content: 'I have completed my review of your document. You can now ask me specific questions about any clause, term, or section. I will answer based on the document content and cross-reference it against our firm legal standards.'
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const sendMessage = async () => {
    if (!input.trim() || loading) return

    const userMessage = {
      id: messages.length + 1,
      role: 'user',
      content: input
    }

    setMessages(prev => [...prev, userMessage])
    const currentInput = input
    setInput('')
    setLoading(true)

    try {
      const response = await fetch(`${API_URL}/api/ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: currentInput,
          document_text: documentText,
          filename: filename
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get answer')
      }

      setMessages(prev => [...prev, {
        id: prev.length + 2,
        role: 'assistant',
        content: data.answer
      }])

    } catch (error) {
      setMessages(prev => [...prev, {
        id: prev.length + 2,
        role: 'assistant',
        content: 'Something went wrong. Please try your question again.'
      }])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const suggestions = [
    'What are the key risk flags in this document?',
    'Does the notice period comply with UK law?',
    'Are there any missing standard clauses?',
    'Is the non-compete clause enforceable?',
  ]

  return (
    <div className="flex flex-col rounded-2xl overflow-hidden animate-fade-up delay-1"
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
              Ask Questions
            </p>
            <h2 className="font-serif text-lg" style={{ color: 'var(--cream)' }}>
              Document Q&A
            </h2>
            <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
              {filename}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
              {user.name}
            </p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
              {user.id}
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">

        {messages.length === 1 && (
          <div className="mb-4">
            <p className="text-xs uppercase tracking-widest mb-3"
              style={{ color: 'var(--text-secondary)' }}>
              Suggested questions
            </p>
            <div className="space-y-2">
              {suggestions.map((s, i) => (
                <button
                  key={i}
                  onClick={() => setInput(s)}
                  className="w-full text-left px-4 py-2.5 rounded-lg text-xs transition-all"
                  style={{
                    background: 'rgba(201,169,110,0.05)',
                    border: '1px solid rgba(201,169,110,0.15)',
                    color: 'var(--text-secondary)'
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div className="w-7 h-7 rounded-full flex items-center justify-center
              flex-shrink-0 text-xs font-medium"
              style={{
                background: message.role === 'assistant'
                  ? 'rgba(201,169,110,0.15)'
                  : 'rgba(201,169,110,0.3)',
                color: 'var(--gold)',
                border: '1px solid rgba(201,169,110,0.2)'
              }}>
              {message.role === 'assistant' ? 'AI' : user.name.charAt(0)}
            </div>

            <div
              className="max-w-xs lg:max-w-sm rounded-2xl px-4 py-3"
              style={{
                background: message.role === 'assistant'
                  ? 'var(--navy-light)'
                  : 'rgba(201,169,110,0.12)',
                border: message.role === 'assistant'
                  ? '1px solid rgba(255,255,255,0.05)'
                  : '1px solid rgba(201,169,110,0.2)',
              }}
            >
              <p className="text-sm leading-relaxed whitespace-pre-wrap"
                style={{ color: 'var(--cream)' }}>
                {message.content}
              </p>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex gap-3">
            <div className="w-7 h-7 rounded-full flex items-center justify-center
              flex-shrink-0 text-xs font-medium"
              style={{
                background: 'rgba(201,169,110,0.15)',
                color: 'var(--gold)',
                border: '1px solid rgba(201,169,110,0.2)'
              }}>
              AI
            </div>
            <div className="rounded-2xl px-4 py-3"
              style={{
                background: 'var(--navy-light)',
                border: '1px solid rgba(255,255,255,0.05)'
              }}>
              <div className="flex gap-1.5 items-center">
                <div className="w-1.5 h-1.5 rounded-full animate-bounce"
                  style={{ background: 'var(--gold)', opacity: 0.6, animationDelay: '0ms' }} />
                <div className="w-1.5 h-1.5 rounded-full animate-bounce"
                  style={{ background: 'var(--gold)', opacity: 0.6, animationDelay: '150ms' }} />
                <div className="w-1.5 h-1.5 rounded-full animate-bounce"
                  style={{ background: 'var(--gold)', opacity: 0.6, animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-6 py-4 flex-shrink-0"
        style={{ borderTop: '1px solid rgba(201,169,110,0.1)' }}>
        <div className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about any clause or term..."
            className="flex-1 px-4 py-3 text-sm rounded-xl transition-all"
            style={{
              background: 'var(--navy-light)',
              border: '1px solid rgba(201,169,110,0.15)',
              color: 'var(--cream)',
            }}
          />
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            className="px-5 py-3 rounded-xl text-sm font-medium transition-all"
            style={{
              background: loading || !input.trim()
                ? 'rgba(201,169,110,0.2)'
                : 'var(--gold)',
              color: loading || !input.trim()
                ? 'var(--text-secondary)'
                : 'var(--navy)',
              cursor: loading || !input.trim() ? 'not-allowed' : 'pointer'
            }}
          >
            Send
          </button>
        </div>
        <p className="text-xs mt-2" style={{ color: 'var(--text-secondary)' }}>
          Answers reference both the document and the Keating knowledge base
        </p>
      </div>
    </div>
  )
}

export default ChatPanel