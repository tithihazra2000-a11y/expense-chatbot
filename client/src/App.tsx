import { useState } from 'react'
import Chat from './components/Chat'
import Dashboard from './components/Dashboard'

export default function App() {
  const [user, setUser] = useState('')
  const [input, setInput] = useState('')

  // 🔐 LOGIN SCREEN
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
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button onClick={() => setUser(input)}>Enter</button>
        </div>
      </div>
    )
  }

  // 🏠 MAIN APP
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