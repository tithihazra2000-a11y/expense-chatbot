import { useState } from "react"
import type { UserProfile } from "../App"
 
const AVATARS = ["🦊", "🐼", "🦁", "🐸", "🦋", "🐬", "🦄", "🐙"]
const CURRENCIES = [
  { code: "INR", symbol: "₹", label: "Indian Rupee" },
  { code: "USD", symbol: "$", label: "US Dollar" },
  { code: "EUR", symbol: "€", label: "Euro" },
  { code: "GBP", symbol: "£", label: "British Pound" },
]
 
export default function Onboarding({ email, onComplete }: { email: string; onComplete: (p: UserProfile) => void }) {
  const [step, setStep] = useState(0)
  const [name, setName] = useState("")
  const [avatar, setAvatar] = useState("🦊")
  const [currency, setCurrency] = useState("INR")
  const [income, setIncome] = useState("")
 
  const steps = [
    { title: "What should we call you?", subtitle: "Personalise your experience" },
    { title: "Pick your avatar", subtitle: "Express yourself" },
    { title: "Financial setup", subtitle: "We'll use this to track your savings" },
    { title: "You're all set!", subtitle: "Let's start tracking your expenses" },
  ]
 
  const curr = CURRENCIES.find(c => c.code === currency)!
 
  const finish = () => {
    onComplete({
      name: name || "User",
      email,
      currency,
      monthlyIncome: Number(income) || 0,
      monthlyBudget: Number(income) || 0,
      avatar
    })
  }
 
  return (
    <div style={{
      minHeight: "100vh", background: "#0a0818",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "'DM Sans', sans-serif"
    }}>
      <div style={{ position: "fixed", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
        <div style={{ position: "absolute", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)", top: "10%", left: "20%" }} />
        <div style={{ position: "absolute", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)", bottom: "10%", right: "15%" }} />
      </div>
 
      <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 520, padding: "0 24px" }}>
 
        <div style={{ display: "flex", gap: 8, marginBottom: 40, justifyContent: "center" }}>
          {steps.map((_, i) => (
            <div key={i} style={{
              height: 4, borderRadius: 4,
              width: i === step ? 32 : 16,
              background: i <= step ? "#8b5cf6" : "rgba(255,255,255,0.12)",
              transition: "all 0.3s"
            }} />
          ))}
        </div>
 
        <div style={{
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 24, padding: "40px 36px"
        }}>
          <div style={{ textAlign: "center", marginBottom: 36 }}>
            <h2 style={{ color: "white", fontSize: 26, fontWeight: 700, margin: "0 0 8px", letterSpacing: "-0.5px" }}>
              {steps[step].title}
            </h2>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 15, margin: 0 }}>{steps[step].subtitle}</p>
          </div>
 
          {step === 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <input
                autoFocus
                placeholder="Your name"
                value={name}
                onChange={e => setName(e.target.value)}
                onKeyDown={e => e.key === "Enter" && name && setStep(1)}
                style={{
                  padding: "14px 18px", background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.12)", borderRadius: 12,
                  color: "white", fontSize: 16, outline: "none", textAlign: "center"
                }}
              />
              <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 13, textAlign: "center", margin: 0 }}>
                Signing in as {email}
              </p>
            </div>
          )}
 
          {step === 1 && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
              {AVATARS.map(a => (
                <button key={a} onClick={() => setAvatar(a)} style={{
                  height: 72, fontSize: 32, borderRadius: 16, border: "2px solid",
                  borderColor: avatar === a ? "#8b5cf6" : "rgba(255,255,255,0.1)",
                  background: avatar === a ? "rgba(139,92,246,0.2)" : "rgba(255,255,255,0.05)",
                  cursor: "pointer", transition: "all 0.15s",
                  transform: avatar === a ? "scale(1.08)" : "scale(1)"
                }}>{a}</button>
              ))}
            </div>
          )}
 
          {step === 2 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div>
                <label style={{ color: "rgba(255,255,255,0.5)", fontSize: 12, fontWeight: 600, display: "block", marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.5px" }}>Currency</label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  {CURRENCIES.map(c => (
                    <button key={c.code} onClick={() => setCurrency(c.code)} style={{
                      padding: "12px 16px", borderRadius: 12, border: "1.5px solid",
                      borderColor: currency === c.code ? "#8b5cf6" : "rgba(255,255,255,0.1)",
                      background: currency === c.code ? "rgba(139,92,246,0.2)" : "rgba(255,255,255,0.05)",
                      color: "white", fontSize: 14, cursor: "pointer", textAlign: "left",
                      display: "flex", alignItems: "center", gap: 10
                    }}>
                      <span style={{ fontSize: 18 }}>{c.symbol}</span>
                      <span>{c.label}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label style={{ color: "rgba(255,255,255,0.5)", fontSize: 12, fontWeight: 600, display: "block", marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.5px" }}>Monthly Income (optional)</label>
                <div style={{ position: "relative" }}>
                  <span style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.4)", fontSize: 16 }}>{curr.symbol}</span>
                  <input
                    type="number"
                    placeholder="0"
                    value={income}
                    onChange={e => setIncome(e.target.value)}
                    style={{
                      width: "100%", padding: "13px 16px 13px 40px",
                      background: "rgba(255,255,255,0.08)",
                      border: "1px solid rgba(255,255,255,0.12)",
                      borderRadius: 12, color: "white", fontSize: 15,
                      outline: "none", boxSizing: "border-box"
                    }}
                  />
                </div>
              </div>
            </div>
          )}
 
          {step === 3 && (
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 72, marginBottom: 20 }}>{avatar}</div>
              <p style={{ color: "white", fontSize: 20, fontWeight: 600, margin: "0 0 8px" }}>
                Hey {name || "there"}! 👋
              </p>
              <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 15, lineHeight: 1.7, margin: "0 0 8px" }}>
                Your account is ready. Start by typing an expense in the chat like:
              </p>
              <div style={{
                background: "rgba(139,92,246,0.15)", border: "1px solid rgba(139,92,246,0.3)",
                borderRadius: 12, padding: "12px 20px", marginTop: 16
              }}>
                <p style={{ color: "#c4b5fd", fontSize: 14, margin: 0, fontStyle: "italic" }}>
                  "Spent {curr.symbol}200 on food"
                </p>
              </div>
            </div>
          )}
 
          <div style={{ display: "flex", gap: 12, marginTop: 32 }}>
            {step > 0 && step < 3 && (
              <button onClick={() => setStep(s => s - 1)} style={{
                flex: 1, padding: "13px",
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 12, color: "rgba(255,255,255,0.7)",
                fontSize: 15, cursor: "pointer"
              }}>Back</button>
            )}
            <button
              onClick={() => step < 3 ? setStep(s => s + 1) : finish()}
              disabled={step === 0 && !name.trim()}
              style={{
                flex: 1, padding: "13px",
                background: step === 0 && !name.trim()
                  ? "rgba(139,92,246,0.3)"
                  : "linear-gradient(135deg,#8b5cf6,#6366f1)",
                border: "none", borderRadius: 12,
                color: "white", fontSize: 15, fontWeight: 600,
                cursor: step === 0 && !name.trim() ? "not-allowed" : "pointer"
              }}
            >
              {step === 3 ? "Go to Dashboard →" : step === 2 ? "Almost done →" : "Continue →"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}