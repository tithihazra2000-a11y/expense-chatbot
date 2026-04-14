import { useState } from 'react'
import Chat from './components/Chat'
import Dashboard from './components/Dashboard'

export default function App() {
  const [user, setUser] = useState('')
  const [name, setName] = useState('')

  // LOGIN SCREEN
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
          />
          <button onClick={() => setUser(name)}>Enter</button>
        </div>
      </div>
    )
  }

  // MAIN UI
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg,#a18cd1,#fbc2eb)',
      padding: 20,
      textAlign: 'center'
    }}>
      <h1>💰 Expense Tracker</h1>
      <Chat />
      <Dashboard />
    </div>
  )
}