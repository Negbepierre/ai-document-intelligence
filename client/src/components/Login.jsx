import { useState } from 'react'

const DEMO_USERS = [
  { email: 'pierre@keating.co.uk', password: 'keating2026', name: 'Pierre Inegbenose', role: 'Senior Paralegal', id: 'EMP-001' },
  { email: 'admin@keating.co.uk', password: 'admin2026', name: 'Sarah Mitchell', role: 'Managing Partner', id: 'EMP-002' },
  { email: 'junior@keating.co.uk', password: 'junior2026', name: 'James Okafor', role: 'Junior Solicitor', id: 'EMP-003' },
]

function Login({ onLogin }) {
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    await new Promise(r => setTimeout(r, 800))

    const user = DEMO_USERS.find(u => u.email === email && u.password === password)

    if (user) {
      localStorage.setItem('keating_user', JSON.stringify(user))
      onLogin(user)
    } else {
      setError('Invalid email or password. Please try again.')
    }
    setLoading(false)
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    await new Promise(r => setTimeout(r, 800))

    if (!name || !email || !password) {
      setError('All fields are required.')
      setLoading(false)
      return
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      setLoading(false)
      return
    }

    const newUser = {
      email,
      name,
      role: 'Paralegal',
      id: 'EMP-' + Math.floor(Math.random() * 900 + 100)
    }

    localStorage.setItem('keating_user', JSON.stringify(newUser))
    onLogin(newUser)
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--navy)' }}>

      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-16"
        style={{ background: 'var(--navy-mid)', borderRight: '1px solid rgba(201,169,110,0.15)' }}>

        <div className="animate-fade-up">
          <div className="gold-line mb-6" />
          <h1 className="font-serif text-4xl font-700 leading-tight"
            style={{ color: 'var(--cream)' }}>
            Keating<br />Solicitors
          </h1>
          <p className="mt-2 text-sm tracking-widest uppercase"
            style={{ color: 'var(--gold)' }}>
            LLP — Est. 1987
          </p>
        </div>

        <div className="animate-fade-up delay-2">
          <div className="mb-10">
            <h2 className="font-serif text-2xl mb-4" style={{ color: 'var(--cream)' }}>
              AI Contract Checker
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              Upload any contract or legal document. Our AI paralegal reviews it
              against the firm knowledge base and flags risk areas, missing clauses,
              and compliance issues instantly.
            </p>
          </div>

          <div className="space-y-4">
            {[
              { label: 'Powered by', value: 'AWS Bedrock + Claude AI' },
              { label: 'Knowledge Base', value: 'UK Legal Standards' },
              { label: 'Access', value: 'Authorised Staff Only' },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between py-3"
                style={{ borderBottom: '1px solid rgba(201,169,110,0.1)' }}>
                <span className="text-xs uppercase tracking-widest"
                  style={{ color: 'var(--text-secondary)' }}>{item.label}</span>
                <span className="text-xs font-medium" style={{ color: 'var(--gold)' }}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="animate-fade-up delay-4">
          <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
            All document reviews are logged automatically for compliance and audit purposes.
            By using this system you confirm you are an authorised member of Keating Solicitors LLP.
          </p>
        </div>
      </div>

      {/* Right Panel — Auth Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md animate-fade-up">

          {/* Mobile header */}
          <div className="lg:hidden mb-10 text-center">
            <h1 className="font-serif text-3xl" style={{ color: 'var(--cream)' }}>
              Keating Solicitors
            </h1>
            <p className="text-xs tracking-widest uppercase mt-1" style={{ color: 'var(--gold)' }}>
              AI Contract Checker
            </p>
          </div>

          <div className="mb-8">
            <div className="gold-line mb-4" />
            <h2 className="font-serif text-2xl" style={{ color: 'var(--cream)' }}>
              {mode === 'login' ? 'Sign in to your account' : 'Create your account'}
            </h2>
            <p className="text-sm mt-2" style={{ color: 'var(--text-secondary)' }}>
              {mode === 'login'
                ? 'Enter your credentials to access the contract checker.'
                : 'Register to access the Keating AI Contract Checker.'}
            </p>
          </div>

          <form onSubmit={mode === 'login' ? handleLogin : handleRegister}
            className="space-y-4">

            {mode === 'register' && (
              <div>
                <label className="block text-xs uppercase tracking-widest mb-2"
                  style={{ color: 'var(--text-secondary)' }}>
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Your full name"
                  className="w-full px-4 py-3 text-sm rounded-lg transition-all"
                  style={{
                    background: 'var(--navy-mid)',
                    border: '1px solid rgba(201,169,110,0.2)',
                    color: 'var(--cream)',
                  }}
                />
              </div>
            )}

            <div>
              <label className="block text-xs uppercase tracking-widest mb-2"
                style={{ color: 'var(--text-secondary)' }}>
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@keating.co.uk"
                className="w-full px-4 py-3 text-sm rounded-lg transition-all"
                style={{
                  background: 'var(--navy-mid)',
                  border: '1px solid rgba(201,169,110,0.2)',
                  color: 'var(--cream)',
                }}
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-widest mb-2"
                style={{ color: 'var(--text-secondary)' }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 text-sm rounded-lg transition-all"
                style={{
                  background: 'var(--navy-mid)',
                  border: '1px solid rgba(201,169,110,0.2)',
                  color: 'var(--cream)',
                }}
              />
            </div>

            {error && (
              <div className="px-4 py-3 rounded-lg text-sm"
                style={{ background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.2)', color: '#f87171' }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg text-sm font-medium tracking-wide transition-all mt-2"
              style={{
                background: loading ? 'rgba(201,169,110,0.5)' : 'var(--gold)',
                color: 'var(--navy)',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading
                ? 'Please wait...'
                : mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError('') }}
              className="text-sm transition-colors"
              style={{ color: 'var(--text-secondary)' }}
            >
              {mode === 'login'
                ? 'New staff member? Create an account'
                : 'Already have an account? Sign in'}
            </button>
          </div>

          {mode === 'login' && (
            <div className="mt-8 p-4 rounded-lg"
              style={{ background: 'var(--navy-mid)', border: '1px solid rgba(201,169,110,0.1)' }}>
              <p className="text-xs uppercase tracking-widest mb-3" style={{ color: 'var(--gold)' }}>
                Demo Credentials
              </p>
              <div className="space-y-1">
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>pierre@keating.co.uk / keating2026</p>
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>admin@keating.co.uk / admin2026</p>
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>junior@keating.co.uk / junior2026</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Login