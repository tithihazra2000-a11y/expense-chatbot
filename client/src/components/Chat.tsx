import { useState } from 'react'
import Message from './Message'

export default function Chat() {
  const [messages, setMessages] = useState<any[]>([])
  const [input, setInput] = useState('')

  const sendMessage = async () => {
    if (!input) return

    const userMsg = { text: input, sender: 'user' }
    setMessages(prev => [...prev, userMsg])

    try {
      const res = await fetch('https://expense-chatbot-api.onrender.com/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input })
      })

      const data = await res.json()

      console.log("API RESPONSE:", data)

      const botReply = data?.reply || "No reply from server ❌"

      setMessages(prev => [
        ...prev,
        { text: botReply, sender: 'bot' }
      ])

    } catch (err) {
      setMessages(prev => [
        ...prev,
        { text: 'Server error ❌', sender: 'bot' }
      ])
    }

    setInput('')
  }

  return (
    <div style={{
      width: '400px',
      background: 'white',
      padding: '15px',
      borderRadius: '15px',
      boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
    }}>
      <div style={{ height: '300px', overflowY: 'auto', marginBottom: '10px' }}>
        {messages.map((msg, i) => (
          <Message key={i} text={msg.text} sender={msg.sender} />
        ))}
      </div>

      <div style={{ display: 'flex', gap: '5px' }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              sendMessage()
            }
          }}
          placeholder="Type expense..."
          style={{ flex: 1, padding: '8px', borderRadius: '8px' }}
        />

        <button
          onClick={sendMessage}
          style={{
            background: 'purple',
            color: 'white',
            border: 'none',
            padding: '8px 12px',
            borderRadius: '8px'
          }}
        >
          Send
        </button>
      </div>
    </div>
  )
}