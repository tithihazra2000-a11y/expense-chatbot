import { useState, useEffect } from "react"
 
const DEFAULT_CATEGORIES = ["food", "shopping", "transport", "entertainment", "health", "education", "bills", "other"]
const CATEGORY_ICONS: Record<string, string> = {
  food: "🍔", shopping: "🛍️", transport: "🚗", entertainment: "🎬",
  health: "💊", education: "📚", bills: "📄", other: "📦"
}
 
interface Budget { category: string; limit: number }
 
interface Props {
  expenses: any[]
  currency: string
  currencySymbol: string
  onAlert: (msg: string) => void
}
 
export default function BudgetManager({ expenses, currency, currencySymbol, onAlert }: Props) {
  const [budgets, setBudgets] = useState<Budget[]>([])
  const [editCat, setEditCat] = useState<string | null>(null)
  const [editVal, setEditVal] = useState("")
  const [saved, setSaved] = useState(false)
 
  useEffect(() => {
    const stored = localStorage.getItem("ss_budgets")
    if (stored) setBudgets(JSON.parse(stored))
  }, [])
 
  useEffect(() => {
    // Check for alerts whenever expenses change
    budgets.forEach(b => {
      const spent = getCategorySpend(b.category)
      if (spent >= b.limit * 0.9) {
        onAlert(`⚠️ ${capitalize(b.category)}: ${currencySymbol}${spent.toLocaleString()} of ${currencySymbol}${b.limit.toLocaleString()} budget used`)
      }
    })
  }, [expenses])
 
  const saveBudgets = (updated: Budget[]) => {
    setBudgets(updated)
    localStorage.setItem("ss_budgets", JSON.stringify(updated))
    setSaved(true)
    setTimeout(() => setSaved(false), 1500)
  }
 
  const setCategoryBudget = (cat: string, limit: number) => {
    const existing = budgets.find(b => b.category === cat)
    if (existing) {
      saveBudgets(budgets.map(b => b.category === cat ? { ...b, limit } : b))
    } else {
      saveBudgets([...budgets, { category: cat, limit }])
    }
    setEditCat(null)
    setEditVal("")
  }
 
  const removeBudget = (cat: string) => {
    saveBudgets(budgets.filter(b => b.category !== cat))
  }
 
  const getCategorySpend = (cat: string) => {
    return expenses
      .filter(e => (e.category || "other").toLowerCase() === cat)
      .reduce((s, e) => s + Number(e.amount), 0)
  }
 
  const getBudget = (cat: string) => budgets.find(b => b.category === cat)
 
  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)
 
  // All categories that have either a budget or expenses
  const activeCategories = [...new Set([
    ...DEFAULT_CATEGORIES,
    ...expenses.map(e => (e.category || "other").toLowerCase())
  ])]
 
  return (
    <div style={{ maxWidth: 680, margin: "0 auto" }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ color: "white", fontSize: 20, fontWeight: 700, margin: "0 0 6px" }}>Budget Limits</h2>
        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 14, margin: 0 }}>
          Set monthly spending limits per category. You'll be alerted at 90%.
        </p>
      </div>
 
      {saved && (
        <div style={{
          background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.3)",
          borderRadius: 12, padding: "10px 16px", marginBottom: 16,
          color: "#86efac", fontSize: 14
        }}>✓ Budget saved</div>
      )}
 
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {activeCategories.map(cat => {
          const budget = getBudget(cat)
          const spent = getCategorySpend(cat)
          const percent = budget ? Math.min(100, Math.round((spent / budget.limit) * 100)) : 0
          const isEditing = editCat === cat
          const isOver = budget && spent > budget.limit
          const isWarning = budget && !isOver && percent >= 90
 
          return (
            <div key={cat} style={{
              background: isOver ? "rgba(239,68,68,0.08)" : isWarning ? "rgba(245,158,11,0.08)" : "rgba(255,255,255,0.05)",
              border: `1px solid ${isOver ? "rgba(239,68,68,0.25)" : isWarning ? "rgba(245,158,11,0.2)" : "rgba(255,255,255,0.09)"}`,
              borderRadius: 14, padding: "16px 20px"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                  background: isOver ? "rgba(239,68,68,0.2)" : "rgba(255,255,255,0.08)",
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20
                }}>{CATEGORY_ICONS[cat] || "📦"}</div>
 
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: budget ? 8 : 0 }}>
                    <span style={{ color: "white", fontSize: 14, fontWeight: 600, textTransform: "capitalize" }}>{cat}</span>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ color: isOver ? "#ef4444" : "rgba(255,255,255,0.5)", fontSize: 13, fontWeight: isOver ? 600 : 400 }}>
                        {currencySymbol}{spent.toLocaleString()}
                        {budget && ` / ${currencySymbol}${budget.limit.toLocaleString()}`}
                      </span>
                      {isOver && <span style={{ background: "rgba(239,68,68,0.2)", color: "#fca5a5", fontSize: 11, padding: "2px 8px", borderRadius: 6, fontWeight: 600 }}>OVER</span>}
                      {isWarning && <span style={{ background: "rgba(245,158,11,0.2)", color: "#fcd34d", fontSize: 11, padding: "2px 8px", borderRadius: 6, fontWeight: 600 }}>90%</span>}
                    </div>
                  </div>
 
                  {budget && !isEditing && (
                    <div style={{ background: "rgba(255,255,255,0.08)", borderRadius: 6, height: 6, overflow: "hidden" }}>
                      <div style={{
                        height: "100%", borderRadius: 6,
                        width: `${percent}%`,
                        background: isOver ? "#ef4444" : isWarning ? "#f59e0b" : "linear-gradient(90deg,#8b5cf6,#6366f1)",
                        transition: "width 0.5s"
                      }} />
                    </div>
                  )}
 
                  {isEditing && (
                    <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                      <input
                        autoFocus
                        type="number"
                        placeholder={`Budget amount`}
                        value={editVal}
                        onChange={e => setEditVal(e.target.value)}
                        onKeyDown={e => e.key === "Enter" && editVal && setCategoryBudget(cat, Number(editVal))}
                        style={{
                          flex: 1, padding: "8px 12px",
                          background: "rgba(255,255,255,0.1)",
                          border: "1px solid rgba(255,255,255,0.2)",
                          borderRadius: 8, color: "white", fontSize: 14, outline: "none"
                        }}
                      />
                      <button onClick={() => editVal && setCategoryBudget(cat, Number(editVal))} style={{
                        padding: "8px 14px", background: "#8b5cf6",
                        border: "none", borderRadius: 8, color: "white", fontSize: 13, cursor: "pointer"
                      }}>Set</button>
                      <button onClick={() => { setEditCat(null); setEditVal("") }} style={{
                        padding: "8px 12px", background: "rgba(255,255,255,0.08)",
                        border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "rgba(255,255,255,0.6)", fontSize: 13, cursor: "pointer"
                      }}>✕</button>
                    </div>
                  )}
                </div>
 
                {!isEditing && (
                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={() => { setEditCat(cat); setEditVal(budget?.limit?.toString() || "") }} style={{
                      padding: "6px 12px", background: "rgba(139,92,246,0.15)",
                      border: "1px solid rgba(139,92,246,0.3)", borderRadius: 8,
                      color: "#c4b5fd", fontSize: 12, cursor: "pointer"
                    }}>{budget ? "Edit" : "Set"}</button>
                    {budget && (
                      <button onClick={() => removeBudget(cat)} style={{
                        padding: "6px 10px", background: "rgba(239,68,68,0.1)",
                        border: "1px solid rgba(239,68,68,0.2)", borderRadius: 8,
                        color: "#fca5a5", fontSize: 12, cursor: "pointer"
                      }}>✕</button>
                    )}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}