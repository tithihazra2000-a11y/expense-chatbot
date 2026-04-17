import { useEffect, useState, useCallback } from "react"
import Chat from "./Chat"
import Profile from "./Profile"
import BudgetManager from "./BudgetManager"
import { useToasts, ToastContainer } from "./hooks/toast" 
import type { UserProfile } from "../App" 
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from "recharts"
    
 
const COLORS = ["#8b5cf6", "#6366f1", "#ec4899", "#f59e0b", "#10b981", "#3b82f6", "#ef4444", "#06b6d4"]
const CATEGORY_ICONS: Record<string, string> = {
  food: "🍔", shopping: "🛍️", transport: "🚗", entertainment: "🎬",
  health: "💊", education: "📚", bills: "📄", other: "📦"
}
function getIcon(cat: string) { return CATEGORY_ICONS[(cat || "other").toLowerCase()] || "📦" }
function capitalize(s: string) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : "" }
 
type Tab = "overview" | "expenses" | "chat" | "budget" | "profile"
type Period = "week" | "month" | "all"
 
const CURRENCIES: Record<string, string> = { INR: "₹", USD: "$", EUR: "€", GBP: "£" }
 
interface Props {
  profile: UserProfile
  onProfileUpdate: (p: UserProfile) => void
}
 
export default function Dashboard({ profile, onProfileUpdate }: Props) {
  const [expenses, setExpenses] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState<Tab>("overview")
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [period, setPeriod] = useState<Period>("month")
  const [search, setSearch] = useState("")
  const [filterCat, setFilterCat] = useState("all")
  const [sortField, setSortField] = useState<"date" | "amount">("date")
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc")
  const [loading, setLoading] = useState(false)
  const { toasts, addToast, addAlert } = useToasts()
 
  const sym = CURRENCIES[profile.currency] || "₹"
 
  const fetchExpenses = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch("https://expense-chatbot-api.onrender.com/expenses")
      const data = await res.json()
      setExpenses(data.reverse())
    } catch { addToast("Failed to fetch expenses", "error") }
    finally { setLoading(false) }
  }, [])
 
  useEffect(() => { fetchExpenses() }, [])
 
  // Filter by period
  const filterByPeriod = (list: any[]) => {
    const now = new Date()
    return list.filter(e => {
      const d = new Date(e.created_at)
      if (period === "week") {
        const weekAgo = new Date(); weekAgo.setDate(now.getDate() - 7)
        return d >= weekAgo
      }
      if (period === "month") {
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
      }
      return true
    })
  }
 
  const periodExpenses = filterByPeriod(expenses)
 
  // Search + filter for expenses tab
  const filteredExpenses = expenses
    .filter(e => {
      const matchSearch = search === "" ||
        (e.category || "").toLowerCase().includes(search.toLowerCase()) ||
        (e.note || "").toLowerCase().includes(search.toLowerCase())
      const matchCat = filterCat === "all" || (e.category || "other").toLowerCase() === filterCat
      return matchSearch && matchCat
    })
    .sort((a, b) => {
      if (sortField === "amount") return sortDir === "desc" ? b.amount - a.amount : a.amount - b.amount
      return sortDir === "desc"
        ? new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        : new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    })
 
  const total = periodExpenses.reduce((s, e) => s + Number(e.amount), 0)
  const allTotal = expenses.reduce((s, e) => s + Number(e.amount), 0)
 
  // Category breakdown
  const categoryMap: Record<string, number> = {}
  periodExpenses.forEach(e => {
    const cat = (e.category || "other").toLowerCase()
    categoryMap[cat] = (categoryMap[cat] || 0) + Number(e.amount)
  })
  const pieData = Object.entries(categoryMap)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
 
  const topCat = pieData[0]
 
  // Bar chart - last 7 days
  const last7: Record<string, number> = {}
  for (let i = 6; i >= 0; i--) {
    const d = new Date(); d.setDate(d.getDate() - i)
    last7[d.toLocaleDateString("en", { weekday: "short" })] = 0
  }
  expenses.forEach(e => {
    const d = new Date(e.created_at)
    const label = d.toLocaleDateString("en", { weekday: "short" })
    if (label in last7) last7[label] += Number(e.amount)
  })
  const barData = Object.entries(last7).map(([day, amount]) => ({ day, amount }))
 
  // Export CSV
  const exportCSV = () => {
    const rows = [["ID", "Amount", "Category", "Note", "Date"]]
    filteredExpenses.forEach(e => rows.push([
      e.id, e.amount, e.category || "other", e.note || "",
      new Date(e.created_at).toLocaleDateString()
    ]))
    const csv = rows.map(r => r.join(",")).join("\n")
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a"); a.href = url; a.download = "expenses.csv"; a.click()
    URL.revokeObjectURL(url)
    addToast("Expenses exported as CSV ✓", "success")
  }
 
  const uniqueCategories = [...new Set(expenses.map(e => (e.category || "other").toLowerCase()))]
 
  const NAV = [
    { id: "overview" as Tab, icon: "📊", label: "Overview" },
    { id: "expenses" as Tab, icon: "📋", label: "Expenses" },
    { id: "chat"     as Tab, icon: "💬", label: "Chat" },
    { id: "budget"   as Tab, icon: "🎯", label: "Budgets" },
    { id: "profile"  as Tab, icon: "👤", label: "Profile" },
  ]
 
  const toggleSort = (field: typeof sortField) => {
    if (sortField === field) setSortDir(d => d === "asc" ? "desc" : "asc")
    else { setSortField(field); setSortDir("desc") }
  }
 
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#0a0818", fontFamily: "'DM Sans', -apple-system, sans-serif" }}>
 
      {/* Background glow */}
      <div style={{ position: "fixed", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 0 }}>
        <div style={{ position: "absolute", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)", top: 0, left: "30%" }} />
      </div>
 
      {/* SIDEBAR */}
      <aside style={{
        width: sidebarOpen ? 220 : 64, flexShrink: 0,
        background: "rgba(255,255,255,0.03)",
        borderRight: "1px solid rgba(255,255,255,0.07)",
        display: "flex", flexDirection: "column",
        padding: "20px 0", transition: "width 0.3s ease",
        overflow: "hidden", position: "relative", zIndex: 1
      }}>
        {/* Logo */}
        <div style={{ padding: "0 16px 24px", display: "flex", alignItems: "center", gap: 10, whiteSpace: "nowrap" }}>
          <div onClick={() => setSidebarOpen(o => !o)} style={{
            width: 34, height: 34, borderRadius: 10, flexShrink: 0,
            background: "linear-gradient(135deg,#8b5cf6,#6366f1)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 16, cursor: "pointer", userSelect: "none"
          }}>{sym}</div>
          {sidebarOpen && <span style={{ color: "white", fontWeight: 700, fontSize: 15, letterSpacing: "-0.3px" }}>SpendSmart</span>}
        </div>
 
        {NAV.map(item => (
          <button key={item.id} onClick={() => setActiveTab(item.id)} style={{
            display: "flex", alignItems: "center", gap: 12,
            padding: sidebarOpen ? "11px 16px" : "11px 0",
            justifyContent: sidebarOpen ? "flex-start" : "center",
            border: "none", cursor: "pointer", transition: "all 0.15s",
            background: activeTab === item.id ? "rgba(139,92,246,0.18)" : "transparent",
            borderLeft: activeTab === item.id ? "3px solid #8b5cf6" : "3px solid transparent",
            color: activeTab === item.id ? "#c4b5fd" : "rgba(255,255,255,0.45)",
            fontSize: 14, fontWeight: activeTab === item.id ? 600 : 400, whiteSpace: "nowrap"
          }}>
            <span style={{ fontSize: 17, flexShrink: 0 }}>{item.icon}</span>
            {sidebarOpen && item.label}
          </button>
        ))}
 
        <div style={{ flex: 1 }} />
 
        {/* User chip */}
        <div style={{ margin: "0 10px" }}>
          <div onClick={() => setActiveTab("profile")} style={{
            padding: sidebarOpen ? "10px 12px" : "10px 0",
            background: "rgba(255,255,255,0.05)", borderRadius: 12,
            display: "flex", alignItems: "center", gap: 10,
            cursor: "pointer", justifyContent: sidebarOpen ? "flex-start" : "center"
          }}>
            <div style={{
              width: 30, height: 30, borderRadius: "50%", flexShrink: 0,
              background: "linear-gradient(135deg,#ec4899,#8b5cf6)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 16
            }}>{profile.avatar}</div>
            {sidebarOpen && (
              <div style={{ overflow: "hidden", minWidth: 0 }}>
                <p style={{ color: "white", fontSize: 13, fontWeight: 600, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{profile.name}</p>
                <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 11, margin: 0 }}>{profile.currency}</p>
              </div>
            )}
          </div>
        </div>
      </aside>
 
      {/* MAIN */}
      <main style={{ flex: 1, overflowY: "auto", padding: "28px 32px", position: "relative", zIndex: 1 }}>
 
        {/* Top bar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
          <div>
            <h1 style={{ color: "white", fontSize: 22, fontWeight: 700, margin: 0, letterSpacing: "-0.5px" }}>
              {NAV.find(n => n.id === activeTab)?.label}
            </h1>
            <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 13, margin: "3px 0 0" }}>
              {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}
            </p>
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            {(activeTab === "overview") && (
              <div style={{ display: "flex", background: "rgba(255,255,255,0.06)", borderRadius: 10, padding: 3 }}>
                {(["week", "month", "all"] as Period[]).map(p => (
                  <button key={p} onClick={() => setPeriod(p)} style={{
                    padding: "6px 14px", borderRadius: 8, border: "none", cursor: "pointer",
                    background: period === p ? "rgba(139,92,246,0.4)" : "transparent",
                    color: period === p ? "white" : "rgba(255,255,255,0.4)",
                    fontSize: 13, fontWeight: period === p ? 600 : 400, textTransform: "capitalize"
                  }}>{p === "all" ? "All time" : `This ${p}`}</button>
                ))}
              </div>
            )}
            <button onClick={fetchExpenses} disabled={loading} style={{
              padding: "8px 16px", background: "rgba(255,255,255,0.07)",
              border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10,
              color: "rgba(255,255,255,0.6)", fontSize: 13, cursor: "pointer"
            }}>{loading ? "..." : "⟳"}</button>
          </div>
        </div>
 
        {/* ─── OVERVIEW ─── */}
        {activeTab === "overview" && (
          <>
            {/* Stat Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(170px,1fr))", gap: 14, marginBottom: 22 }}>
              {[
                { label: "Total Spent", value: `${sym}${total.toLocaleString("en-IN")}`, icon: "💸", color: "#8b5cf6", sub: period === "all" ? "All time" : `This ${period}` },
                { label: "Transactions", value: periodExpenses.length, icon: "📑", color: "#6366f1", sub: "entries" },
                { label: "Top Category", value: topCat ? capitalize(topCat.name) : "—", icon: getIcon(topCat?.name || ""), color: "#ec4899", sub: topCat ? `${sym}${topCat.value.toLocaleString()}` : "" },
                { label: "Avg per Day", value: period !== "all" && periodExpenses.length ? `${sym}${Math.round(total / (period === "week" ? 7 : 30))}` : "—", icon: "📈", color: "#f59e0b", sub: "daily avg" },
              ].map(card => (
                <div key={card.label} style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 16, padding: "18px 18px"
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                    <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 11, margin: 0, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>{card.label}</p>
                    <span style={{ fontSize: 18, width: 32, height: 32, borderRadius: 8, background: `${card.color}22`, display: "flex", alignItems: "center", justifyContent: "center" }}>{card.icon}</span>
                  </div>
                  <p style={{ color: "white", fontSize: 22, fontWeight: 700, margin: "0 0 2px", letterSpacing: "-0.5px" }}>{card.value}</p>
                  <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 12, margin: 0 }}>{card.sub}</p>
                </div>
              ))}
            </div>
 
            {/* Charts */}
            <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 18, marginBottom: 20 }}>
              <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 20 }}>
                <h3 style={{ color: "white", fontSize: 14, fontWeight: 600, margin: "0 0 18px" }}>Spending last 7 days</h3>
                <ResponsiveContainer width="100%" height={190}>
                  <BarChart data={barData} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="day" tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 10 }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ background: "#1a1533", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, color: "white", fontSize: 13 }} formatter={(v: any) => [`${sym}${v}`, "Spent"]} />
                    <Bar dataKey="amount" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
 
              <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 20 }}>
                <h3 style={{ color: "white", fontSize: 14, fontWeight: 600, margin: "0 0 18px" }}>By category</h3>
                {pieData.length > 0 ? (
                  <>
                    <ResponsiveContainer width="100%" height={150}>
                      <PieChart>
                        <Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={68} paddingAngle={4} dataKey="value">
                          {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                        </Pie>
                        <Tooltip contentStyle={{ background: "#1a1533", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, color: "white", fontSize: 13 }} formatter={(v: any) => [`${sym}${v}`, ""]} />
                      </PieChart>
                    </ResponsiveContainer>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 8 }}>
                      {pieData.slice(0, 4).map((d, i) => (
                        <div key={d.name} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                          <div style={{ width: 7, height: 7, borderRadius: "50%", background: COLORS[i % COLORS.length] }} />
                          <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 11, textTransform: "capitalize" }}>{d.name}</span>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div style={{ height: 150, display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,0.2)", fontSize: 13 }}>No data yet</div>
                )}
              </div>
            </div>
 
            {/* Recent transactions */}
            <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <h3 style={{ color: "white", fontSize: 14, fontWeight: 600, margin: 0 }}>Recent transactions</h3>
                <button onClick={() => setActiveTab("expenses")} style={{ background: "none", border: "none", color: "#a78bfa", fontSize: 13, cursor: "pointer" }}>View all →</button>
              </div>
              {periodExpenses.slice(0, 6).map(e => (
                <div key={e.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(139,92,246,0.18)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, flexShrink: 0 }}>{getIcon(e.category)}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ color: "white", fontSize: 13, fontWeight: 500, margin: 0, textTransform: "capitalize" }}>{e.category || "Other"}</p>
                    <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 11, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{e.note || new Date(e.created_at).toLocaleDateString()}</p>
                  </div>
                  <span style={{ color: "#ef4444", fontWeight: 600, fontSize: 13, flexShrink: 0 }}>-{sym}{Number(e.amount).toLocaleString()}</span>
                </div>
              ))}
              {periodExpenses.length === 0 && (
                <p style={{ color: "rgba(255,255,255,0.25)", fontSize: 13, textAlign: "center", padding: "24px 0", margin: 0 }}>No expenses for this period. Chat to add one!</p>
              )}
            </div>
          </>
        )}
 
        {/* ─── EXPENSES ─── */}
        {activeTab === "expenses" && (
          <>
            {/* Search + Filter bar */}
            <div style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
              <div style={{ position: "relative", flex: "1 1 220px" }}>
                <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.35)", fontSize: 14 }}>🔍</span>
                <input
                  placeholder="Search by category or note..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  style={{ width: "100%", padding: "10px 12px 10px 36px", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, color: "white", fontSize: 14, outline: "none", boxSizing: "border-box" }}
                />
              </div>
              <select value={filterCat} onChange={e => setFilterCat(e.target.value)} style={{ padding: "10px 14px", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, color: "white", fontSize: 14, outline: "none", cursor: "pointer" }}>
                <option value="all" style={{ background: "#1a1533" }}>All categories</option>
                {uniqueCategories.map(c => <option key={c} value={c} style={{ background: "#1a1533", textTransform: "capitalize" }}>{capitalize(c)}</option>)}
              </select>
              <button onClick={exportCSV} style={{ padding: "10px 18px", background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.3)", borderRadius: 10, color: "#86efac", fontSize: 13, cursor: "pointer", fontWeight: 500, whiteSpace: "nowrap" }}>
                ⬇ Export CSV
              </button>
            </div>
 
            <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, overflow: "hidden" }}>
              <div style={{ padding: "12px 20px", borderBottom: "1px solid rgba(255,255,255,0.07)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 13 }}>{filteredExpenses.length} results</span>
                <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 13 }}>Total: {sym}{filteredExpenses.reduce((s, e) => s + Number(e.amount), 0).toLocaleString()}</span>
              </div>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ background: "rgba(255,255,255,0.03)" }}>
                      {["#", "Category", "Amount ↕", "Note", "Date ↕"].map((h, i) => (
                        <th key={h} onClick={() => {
                          if (h.includes("Amount")) toggleSort("amount")
                          if (h.includes("Date")) toggleSort("date")
                        }} style={{
                          padding: "11px 16px", color: "rgba(255,255,255,0.35)",
                          fontSize: 11, fontWeight: 600, letterSpacing: "0.5px",
                          textAlign: "left", textTransform: "uppercase",
                          cursor: (h.includes("Amount") || h.includes("Date")) ? "pointer" : "default"
                        }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredExpenses.map((e, i) => (
                      <tr key={e.id}
                        style={{ borderTop: "1px solid rgba(255,255,255,0.05)", transition: "background 0.1s" }}
                        onMouseEnter={ev => ev.currentTarget.style.background = "rgba(255,255,255,0.03)"}
                        onMouseLeave={ev => ev.currentTarget.style.background = "transparent"}
                      >
                        <td style={{ padding: "11px 16px", color: "rgba(255,255,255,0.25)", fontSize: 12 }}>{i + 1}</td>
                        <td style={{ padding: "11px 16px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <span style={{ fontSize: 15 }}>{getIcon(e.category)}</span>
                            <span style={{ color: "white", fontSize: 13, textTransform: "capitalize" }}>{e.category || "Other"}</span>
                          </div>
                        </td>
                        <td style={{ padding: "11px 16px", color: "#ef4444", fontWeight: 600, fontSize: 13 }}>-{sym}{Number(e.amount).toLocaleString()}</td>
                        <td style={{ padding: "11px 16px", color: "rgba(255,255,255,0.45)", fontSize: 12, maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{e.note || "—"}</td>
                        <td style={{ padding: "11px 16px", color: "rgba(255,255,255,0.3)", fontSize: 12 }}>
                          {new Date(e.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredExpenses.length === 0 && (
                  <p style={{ color: "rgba(255,255,255,0.25)", fontSize: 14, textAlign: "center", padding: "36px 0", margin: 0 }}>No results found</p>
                )}
              </div>
            </div>
          </>
        )}
 
        {/* ─── CHAT ─── */}
        {activeTab === "chat" && (
          <div style={{ height: "calc(100vh - 130px)" }}>
            <Chat onNewExpense={() => { fetchExpenses(); addToast("Expense added!", "success") }} currencySymbol={sym} />
          </div>
        )}
 
        {/* ─── BUDGET ─── */}
        {activeTab === "budget" && (
          <BudgetManager
            expenses={expenses}
            currency={profile.currency}
            currencySymbol={sym}
            onAlert={addAlert}
          />
        )}
 
        {/* ─── PROFILE ─── */}
        {activeTab === "profile" && (
          <Profile
            profile={profile}
            onUpdate={onProfileUpdate}
            totalExpenses={allTotal}
            expenseCount={expenses.length}
          />
        )}
      </main>
 
      <ToastContainer toasts={toasts} />
    </div>
  )
}
