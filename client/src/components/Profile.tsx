import { useState } from "react"
import type { UserProfile } from "../App" 
 
const AVATARS = ["🦊", "🐼", "🦁", "🐸", "🦋", "🐬", "🦄", "🐙"]
const CURRENCIES = [
  { code: "INR", symbol: "₹", label: "Indian Rupee" },
  { code: "USD", symbol: "$", label: "US Dollar" },
  { code: "EUR", symbol: "€", label: "Euro" },
  { code: "GBP", symbol: "£", label: "British Pound" },
]
 
interface Props {
  profile: UserProfile
  onUpdate: (p: UserProfile) => void
  totalExpenses: number
  expenseCount: number
}
 
export default function Profile({ profile, onUpdate, totalExpenses, expenseCount }: Props) {
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState<UserProfile>({ ...profile })
  const [saved, setSaved] = useState(false)
 
  const curr = CURRENCIES.find(c => c.code === form.currency) || CURRENCIES[0]
  const savings = profile.monthlyIncome - totalExpenses
  const savingsPercent = profile.monthlyIncome > 0
    ? Math.max(0, Math.min(100, Math.round((savings / profile.monthlyIncome) * 100)))
    : 0
 
  const save = () => {
    onUpdate(form)
    setEditing(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }
 
  const resetOnboarding = () => {
    if (confirm("This will restart the onboarding. Continue?")) {
      localStorage.removeItem("ss_onboarded")
      localStorage.removeItem("ss_profile")
      window.location.reload()
    }
  }
 
  return (
    <div style={{ maxWidth: 640, margin: "0 auto" }}>
 
      {/* Header Card */}
      <div style={{
        background: "linear-gradient(135deg, rgba(139,92,246,0.3), rgba(99,102,241,0.2))",
        border: "1px solid rgba(139,92,246,0.3)",
        borderRadius: 20, padding: "32px 28px", marginBottom: 20,
        display: "flex", alignItems: "center", gap: 24
      }}>
        <div style={{ fontSize: 64, lineHeight: 1 }}>{profile.avatar}</div>
        <div style={{ flex: 1 }}>
          <h2 style={{ color: "white", fontSize: 26, fontWeight: 700, margin: "0 0 4px" }}>{profile.name}</h2>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 14, margin: "0 0 16px" }}>{profile.email}</p>
          <div style={{ display: "flex", gap: 16 }}>
            <div style={{ background: "rgba(255,255,255,0.1)", borderRadius: 10, padding: "8px 16px" }}>
              <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 11, margin: "0 0 2px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Total Spent</p>
              <p style={{ color: "white", fontWeight: 700, fontSize: 16, margin: 0 }}>{curr.symbol}{totalExpenses.toLocaleString()}</p>
            </div>
            <div style={{ background: "rgba(255,255,255,0.1)", borderRadius: 10, padding: "8px 16px" }}>
              <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 11, margin: "0 0 2px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Entries</p>
              <p style={{ color: "white", fontWeight: 700, fontSize: 16, margin: 0 }}>{expenseCount}</p>
            </div>
            {profile.monthlyIncome > 0 && (
              <div style={{ background: savings >= 0 ? "rgba(34,197,94,0.2)" : "rgba(239,68,68,0.2)", borderRadius: 10, padding: "8px 16px" }}>
                <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 11, margin: "0 0 2px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Savings</p>
                <p style={{ color: savings >= 0 ? "#22c55e" : "#ef4444", fontWeight: 700, fontSize: 16, margin: 0 }}>{curr.symbol}{Math.abs(savings).toLocaleString()}</p>
              </div>
            )}
          </div>
        </div>
      </div>
 
      {/* Savings progress */}
      {profile.monthlyIncome > 0 && (
        <div style={{
          background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)",
          borderRadius: 16, padding: 20, marginBottom: 20
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
            <span style={{ color: "white", fontSize: 14, fontWeight: 600 }}>Monthly Budget Used</span>
            <span style={{ color: savingsPercent > 80 ? "#ef4444" : "#22c55e", fontWeight: 700 }}>
              {Math.round((totalExpenses / profile.monthlyIncome) * 100)}%
            </span>
          </div>
          <div style={{ background: "rgba(255,255,255,0.1)", borderRadius: 8, height: 8, overflow: "hidden" }}>
            <div style={{
              height: "100%", borderRadius: 8,
              width: `${Math.min(100, Math.round((totalExpenses / profile.monthlyIncome) * 100))}%`,
              background: totalExpenses > profile.monthlyIncome ? "#ef4444" : "linear-gradient(90deg,#8b5cf6,#6366f1)",
              transition: "width 0.5s"
            }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
            <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 12 }}>{curr.symbol}0</span>
            <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 12 }}>{curr.symbol}{profile.monthlyIncome.toLocaleString()}</span>
          </div>
        </div>
      )}
 
      {/* Edit Form */}
      <div style={{
        background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)",
        borderRadius: 16, padding: 24, marginBottom: 20
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <h3 style={{ color: "white", fontSize: 16, fontWeight: 600, margin: 0 }}>Personal Details</h3>
          {!editing && (
            <button onClick={() => setEditing(true)} style={{
              padding: "7px 16px", background: "rgba(139,92,246,0.2)",
              border: "1px solid rgba(139,92,246,0.3)", borderRadius: 8,
              color: "#c4b5fd", fontSize: 13, cursor: "pointer"
            }}>Edit</button>
          )}
        </div>
 
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {/* Name */}
          <div>
            <label style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, fontWeight: 600, display: "block", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.5px" }}>Name</label>
            {editing ? (
              <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                style={{ width: "100%", padding: "10px 14px", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 10, color: "white", fontSize: 14, outline: "none", boxSizing: "border-box" }} />
            ) : (
              <p style={{ color: "white", fontSize: 15, margin: 0 }}>{profile.name}</p>
            )}
          </div>
 
          {/* Avatar */}
          {editing && (
            <div>
              <label style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, fontWeight: 600, display: "block", marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.5px" }}>Avatar</label>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                {AVATARS.map(a => (
                  <button key={a} onClick={() => setForm(f => ({ ...f, avatar: a }))} style={{
                    width: 48, height: 48, fontSize: 24, borderRadius: 12, border: "2px solid",
                    borderColor: form.avatar === a ? "#8b5cf6" : "rgba(255,255,255,0.1)",
                    background: form.avatar === a ? "rgba(139,92,246,0.2)" : "rgba(255,255,255,0.05)",
                    cursor: "pointer"
                  }}>{a}</button>
                ))}
              </div>
            </div>
          )}
 
          {/* Currency */}
          <div>
            <label style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, fontWeight: 600, display: "block", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.5px" }}>Currency</label>
            {editing ? (
              <select value={form.currency} onChange={e => setForm(f => ({ ...f, currency: e.target.value }))}
                style={{ width: "100%", padding: "10px 14px", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 10, color: "white", fontSize: 14, outline: "none" }}>
                {CURRENCIES.map(c => <option key={c.code} value={c.code} style={{ background: "#1e1b4b" }}>{c.symbol} {c.label}</option>)}
              </select>
            ) : (
              <p style={{ color: "white", fontSize: 15, margin: 0 }}>{curr.symbol} {curr.label}</p>
            )}
          </div>
 
          {/* Monthly Income */}
          <div>
            <label style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, fontWeight: 600, display: "block", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.5px" }}>Monthly Income</label>
            {editing ? (
              <input type="number" value={form.monthlyIncome || ""} onChange={e => setForm(f => ({ ...f, monthlyIncome: Number(e.target.value) }))}
                placeholder="0"
                style={{ width: "100%", padding: "10px 14px", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 10, color: "white", fontSize: 14, outline: "none", boxSizing: "border-box" }} />
            ) : (
              <p style={{ color: "white", fontSize: 15, margin: 0 }}>
                {profile.monthlyIncome > 0 ? `${curr.symbol}${profile.monthlyIncome.toLocaleString()}` : "Not set"}
              </p>
            )}
          </div>
        </div>
 
        {editing && (
          <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
            <button onClick={() => { setForm({ ...profile }); setEditing(false) }} style={{
              flex: 1, padding: "11px", background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10,
              color: "rgba(255,255,255,0.7)", fontSize: 14, cursor: "pointer"
            }}>Cancel</button>
            <button onClick={save} style={{
              flex: 1, padding: "11px",
              background: "linear-gradient(135deg,#8b5cf6,#6366f1)",
              border: "none", borderRadius: 10, color: "white",
              fontSize: 14, fontWeight: 600, cursor: "pointer"
            }}>Save changes</button>
          </div>
        )}
 
        {saved && (
          <p style={{ color: "#22c55e", fontSize: 13, textAlign: "center", marginTop: 12 }}>✓ Profile saved</p>
        )}
      </div>
 
      {/* Danger zone */}
      <div style={{
        background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.2)",
        borderRadius: 16, padding: 20
      }}>
        <h3 style={{ color: "#fca5a5", fontSize: 14, fontWeight: 600, margin: "0 0 12px" }}>Danger Zone</h3>
        <button onClick={resetOnboarding} style={{
          padding: "9px 18px", background: "rgba(239,68,68,0.15)",
          border: "1px solid rgba(239,68,68,0.3)", borderRadius: 8,
          color: "#fca5a5", fontSize: 13, cursor: "pointer"
        }}>Reset onboarding</button>
      </div>
    </div>
  )
}