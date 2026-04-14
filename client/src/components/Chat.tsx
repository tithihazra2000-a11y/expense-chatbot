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

      setMessages(prev => [
        ...prev,
        { text: data.reply, sender: 'bot' }
      ])

    } catch {
      setMessages(prev => [
        ...prev,
        { text: 'Server error ❌', sender: 'bot' }
      ])
    }

    setInput('')
  }

  return (
    <div style={{ marginTop: 20 }}>
      {messages.map((msg, i) => (
        <Message key={i} text={msg.text} sender={msg.sender} />
      ))}

      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
      />

      <button onClick={sendMessage}>Send</button>
    </div>
  )
}