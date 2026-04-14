import { useState } from 'react'
import Chat from './components/Chat'
import Dashboard from './components/Dashboard'

export default function App() {
  const [user, setUser] = useState('')
  const [name, setName] = useState('')

  // LOGIN
  if (!user) {
    return (
      <div style={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(135deg,#a18cd1,#fbc2eb)'
      }}>
        <div style={{ background: 'white', padding: 30, borderRadius: 10 }}>
          <h2>Login</h2>

          <input
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && name.trim()) {
                setUser(name)
              }
            }}
            style={{ padding: 8, marginRight: 8 }}
          />

          <button onClick={() => name.trim() && setUser(name)}>
            Enter
          </button>
        </div>
      </div>
    )
  }

  // MAIN UI
  return (
    <div style={{ padding: 20 }}>
      <h1>💰 Expense Tracker</h1>

      <Chat />

      <div style={{ marginTop: 20 }}>
        <Dashboard />
      </div>
    </div>
  )
}