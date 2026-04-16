import { useState, useRef, useEffect } from "react"
 
interface Message {
  text: string
  sender: "user" | "bot"
  time: string
}
 
interface Props {
  onNewExpense: () => void
  currencySymbol?: string
}
 
function now() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
}
 
export default function Chat({ onNewExpense, currencySymbol = "₹" }: Props) {
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<Message[]>([
    {
      text: `Hi! I'm your expense assistant 👋\n\nTry saying:\n• "Spent ${currencySymbol}200 on food"\n• "Show my expenses"\n• "What's my total?"\n• "Delete last expense"`,
      sender: "bot",
      time: now()
    }
  ])
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
 
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, loading])
 
  const sendMessage = async (text?: string) => {
    const msg = (text || input).trim()
    if (!msg || loading) return
    setInput("")
    setMessages(prev => [...prev, { text: msg, sender: "user", time: now() }])
    setLoading(true)
 
    try {
      const res = await fetch("https://expense-chatbot-api.onrender.com/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg })
      })
      const data = await res.json()
      setMessages(prev => [...prev, { text: data.reply, sender: "bot", time: now() }])
      onNewExpense()
    } catch {
      setMessages(prev => [...prev, { text: "Connection error. Please try again.", sender: "bot", time: now() }])
    } finally {
      setLoading(false)
    }
  }
 
  const suggestions = [
    `Spent ${currencySymbol}150 on food`,
    `Spent ${currencySymbol}500 on shopping`,
    "Show total",
    "Show expenses",
    "Delete last"
  ]
 
  return (
    <div style={{
      display: "flex", flexDirection: "column", height: "100%",
      background: "rgba(255,255,255,0.03)",
      border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: 18, overflow: "hidden"
    }}>
      {/* Header */}
      <div style={{ padding: "14px 18px", borderBottom: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 34, height: 34, borderRadius: "50%", background: "linear-gradient(135deg,#8b5cf6,#6366f1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🤖</div>
        <div>
          <p style={{ color: "white", fontSize: 14, fontWeight: 600, margin: 0 }}>Expense Bot</p>
          <p style={{ color: "#22c55e", fontSize: 11, margin: 0 }}>● Online</p>
        </div>
      </div>
 
      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: "16px 18px", display: "flex", flexDirection: "column", gap: 10, minHeight: 0 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display: "flex", justifyContent: m.sender === "user" ? "flex-end" : "flex-start" }}>
            <div style={{ maxWidth: "78%" }}>
              <div style={{
                padding: "10px 14px",
                borderRadius: m.sender === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                background: m.sender === "user" ? "linear-gradient(135deg,#8b5cf6,#6366f1)" : "rgba(255,255,255,0.08)",
                color: "white", fontSize: 14, lineHeight: 1.65, whiteSpace: "pre-wrap"
              }}>{m.text}</div>
              <p style={{ color: "rgba(255,255,255,0.25)", fontSize: 11, margin: "3px 4px 0", textAlign: m.sender === "user" ? "right" : "left" }}>{m.time}</p>
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: "flex", gap: 5, padding: "10px 14px", background: "rgba(255,255,255,0.08)", borderRadius: "16px 16px 16px 4px", width: "fit-content" }}>
            {[0, 1, 2].map(i => (
              <div key={i} style={{
                width: 6, height: 6, borderRadius: "50%",
                background: "rgba(255,255,255,0.4)",
                animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`
              }} />
            ))}
          </div>
        )}
        <div ref={bottomRef} />
      </div>
 
      {/* Quick suggestions */}
      <div style={{ padding: "6px 14px", display: "flex", gap: 7, flexWrap: "wrap", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        {suggestions.map(s => (
          <button key={s} onClick={() => sendMessage(s)} style={{
            padding: "4px 11px", background: "rgba(139,92,246,0.12)",
            border: "1px solid rgba(139,92,246,0.25)", borderRadius: 20,
            color: "#c4b5fd", fontSize: 12, cursor: "pointer"
          }}>{s}</button>
        ))}
      </div>
 
      {/* Input */}
      <div style={{ padding: "10px 14px", borderTop: "1px solid rgba(255,255,255,0.07)", display: "flex", gap: 9, alignItems: "center" }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && sendMessage()}
          placeholder={`e.g. "Spent ${currencySymbol}300 on food"`}
          style={{ flex: 1, padding: "10px 14px", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 10, color: "white", fontSize: 14, outline: "none" }}
        />
        <button onClick={() => sendMessage()} disabled={!input.trim() || loading} style={{
          width: 38, height: 38, borderRadius: 10,
          background: input.trim() && !loading ? "linear-gradient(135deg,#8b5cf6,#6366f1)" : "rgba(255,255,255,0.08)",
          border: "none", cursor: input.trim() && !loading ? "pointer" : "default",
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15
        }}>➤</button>
      </div>
 
      <style>{`
        @keyframes bounce {
          0%,80%,100% { transform: translateY(0); }
          40% { transform: translateY(-5px); }
        }
        input::placeholder { color: rgba(255,255,255,0.25); }
      `}</style>
    </div>
  )
}