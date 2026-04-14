import { useState } from 'react'

export default function Chat() {
  const [messages, setMessages] = useState<any[]>([])
  const [input, setInput] = useState('')

  const sendMessage = async () => {
    if (!input) return

    setMessages(prev => [...prev, { text: input, sender: 'user' }])

    try {
      const res = await fetch('https://expense-chatbot-api.onrender.com/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input })
      })

      const data = await res.json()

      setMessages(prev => [...prev, { text: data.reply, sender: 'bot' }])
    } catch {
      setMessages(prev => [...prev, { text: 'Error ❌', sender: 'bot' }])
    }

    setInput('')
  }

  return (
    <div style={{
      width: 400,
      margin: '20px auto',
      background: 'white',
      padding: 15,
      borderRadius: 10
    }}>
      <div style={{ height: 250, overflowY: 'auto' }}>
        {messages.map((m, i) => (
          <div key={i} style={{
            textAlign: m.sender === 'user' ? 'right' : 'left'
          }}>
            <span style={{
              background: m.sender === 'user' ? '#6c5ce7' : '#dfe6e9',
              color: m.sender === 'user' ? 'white' : 'black',
              padding: '5px 10px',
              borderRadius: 10,
              display: 'inline-block',
              margin: 5
            }}>
              {m.text}
            </span>
          </div>
        ))}
      </div>

      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        placeholder="Type expense..."
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  )
}