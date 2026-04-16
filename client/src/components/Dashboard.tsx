import { useEffect, useState } from "react"
import Chat from "./Chat"
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend
} from "recharts"
 
const COLORS = ["#8b5cf6", "#6366f1", "#ec4899", "#f59e0b", "#10b981", "#3b82f6", "#ef4444"]
 
const CATEGORY_ICONS: Record<string, string> = {
  food: "🍔", shopping: "🛍️", transport: "🚗", entertainment: "🎬",
  health: "💊", education: "📚", bills: "📄", other: "📦"
}
 
function getIcon(cat: string) {
  return CATEGORY_ICONS[cat?.toLowerCase()] || "📦"
}
 
type Tab = "overview" | "expenses" | "chat"
 
export default function Dashboard() {
  const [expenses, setExpenses] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState<Tab>("overview")
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [deleteId, setDeleteId] = useState<number | null>(null)
 
  const fetchExpenses = async () => {
    try {
      const res = await fetch("https://expense-chatbot-api.onrender.com/expenses")
      const data = await res.json()
      setExpenses(data.reverse())
    } catch (e) {
      console.error(e)
    }
  }
 
  useEffect(() => { fetchExpenses() }, [])
 
  const total = expenses.reduce((s, e) => s + Number(e.amount), 0)
 
  // Category breakdown
  const categoryMap: Record<string, number> = {}
  expenses.forEach(e => {
    const cat = (e.category || "Other").toLowerCase()
    categoryMap[cat] = (categoryMap[cat] || 0) + Number(e.amount)
  })
  const pieData = Object.entries(categoryMap).map(([name, value]) => ({ name, value }))
 
  // Last 7 days bar
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
 
  // Top category
  const topCat = pieData.sort((a, b) => b.value - a.value)[0]
 
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#0f0c29", fontFamily: "inherit" }}>
 
      {/* SIDEBAR */}
      <aside style={{
        width: sidebarOpen ? 240 : 72,
        background: "rgba(255,255,255,0.04)",
        borderRight: "1px solid rgba(255,255,255,0.08)",
        display: "flex", flexDirection: "column",
        padding: "24px 0", transition: "width 0.3s ease",
        flexShrink: 0, overflow: "hidden"
      }}>
        {/* Logo */}
        <div style={{ padding: "0 20px 28px", display: "flex", alignItems: "center", gap: 12, whiteSpace: "nowrap" }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10, flexShrink: 0,
            background: "linear-gradient(135deg,#8b5cf6,#6366f1)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 18, cursor: "pointer"
          }} onClick={() => setSidebarOpen(o => !o)}>₹</div>
          {sidebarOpen && <span style={{ color: "white", fontWeight: 700, fontSize: 16, letterSpacing: "-0.5px" }}>SpendSmart</span>}
        </div>
 
        {/* Nav */}
        {([
          { id: "overview", icon: "📊", label: "Overview" },
          { id: "expenses", icon: "📋", label: "Expenses" },
          { id: "chat", icon: "💬", label: "Chat" },
        ] as { id: Tab; icon: string; label: string }[]).map(item => (
          <button key={item.id} onClick={() => setActiveTab(item.id)} style={{
            display: "flex", alignItems: "center", gap: 14,
            padding: "12px 20px", border: "none", cursor: "pointer",
            background: activeTab === item.id ? "rgba(139,92,246,0.2)" : "transparent",
            borderLeft: activeTab === item.id ? "3px solid #8b5cf6" : "3px solid transparent",
            color: activeTab === item.id ? "#c4b5fd" : "rgba(255,255,255,0.5)",
            fontSize: 14, fontWeight: activeTab === item.id ? 600 : 400,
            whiteSpace: "nowrap", textAlign: "left", transition: "all 0.15s"
          }}>
            <span style={{ fontSize: 18, flexShrink: 0 }}>{item.icon}</span>
            {sidebarOpen && item.label}
          </button>
        ))}
 
        <div style={{ flex: 1 }} />
 
        {/* User */}
        <div style={{
          margin: "0 12px", padding: "12px",
          background: "rgba(255,255,255,0.06)",
          borderRadius: 12, display: "flex", alignItems: "center", gap: 10
        }}>
          <div style={{
            width: 32, height: 32, borderRadius: "50%",
            background: "linear-gradient(135deg,#ec4899,#8b5cf6)",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "white", fontSize: 13, fontWeight: 700, flexShrink: 0
          }}>U</div>
          {sidebarOpen && (
            <div style={{ overflow: "hidden" }}>
              <p style={{ color: "white", fontSize: 13, fontWeight: 600, margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>User</p>
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 11, margin: 0 }}>Free plan</p>
            </div>
          )}
        </div>
      </aside>
 
      {/* MAIN */}
      <main style={{ flex: 1, overflowY: "auto", padding: 28 }}>
 
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
          <div>
            <h1 style={{ color: "white", fontSize: 24, fontWeight: 700, margin: 0 }}>
              {activeTab === "overview" ? "Overview" : activeTab === "expenses" ? "All Expenses" : "Chat"}
            </h1>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 14, margin: "4px 0 0" }}>
              {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
            </p>
          </div>
          <button onClick={fetchExpenses} style={{
            padding: "9px 18px",
            background: "rgba(139,92,246,0.15)",
            border: "1px solid rgba(139,92,246,0.3)",
            borderRadius: 10, color: "#c4b5fd",
            fontSize: 13, cursor: "pointer", fontWeight: 500
          }}>⟳ Refresh</button>
        </div>
 
        {/* ── OVERVIEW TAB ── */}
        {activeTab === "overview" && (
          <>
            {/* Stat Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px,1fr))", gap: 16, marginBottom: 24 }}>
              {[
                { label: "Total Spent", value: `₹${total.toLocaleString("en-IN")}`, icon: "💸", color: "#8b5cf6" },
                { label: "Transactions", value: expenses.length, icon: "📑", color: "#6366f1" },
                { label: "Top Category", value: topCat ? topCat.name : "—", icon: getIcon(topCat?.name || ""), color: "#ec4899" },
                { label: "Avg per Entry", value: expenses.length ? `₹${Math.round(total / expenses.length)}` : "₹0", icon: "📈", color: "#f59e0b" },
              ].map(card => (
                <div key={card.label} style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.09)",
                  borderRadius: 16, padding: "20px 20px",
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 12, margin: 0, fontWeight: 500, letterSpacing: "0.5px", textTransform: "uppercase" }}>{card.label}</p>
                    <span style={{
                      fontSize: 20, width: 36, height: 36, borderRadius: 10,
                      background: `${card.color}22`,
                      display: "flex", alignItems: "center", justifyContent: "center"
                    }}>{card.icon}</span>
                  </div>
                  <p style={{ color: "white", fontSize: 24, fontWeight: 700, margin: "12px 0 0", letterSpacing: "-0.5px" }}>
                    {card.value}
                  </p>
                </div>
              ))}
            </div>
 
            {/* Charts Row */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 }}>
 
              {/* Bar Chart */}
              <div style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.09)",
                borderRadius: 16, padding: 20
              }}>
                <h3 style={{ color: "white", fontSize: 15, fontWeight: 600, margin: "0 0 20px" }}>Spending last 7 days</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={barData} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                    <XAxis dataKey="day" tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 12 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }} axisLine={false} tickLine={false} />
                    <Tooltip
                      contentStyle={{ background: "#1e1b4b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, color: "white" }}
                      formatter={(v: any) => [`₹${v}`, "Spent"]}
                    />
                    <Bar dataKey="amount" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
 
              {/* Pie Chart */}
              <div style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.09)",
                borderRadius: 16, padding: 20
              }}>
                <h3 style={{ color: "white", fontSize: 15, fontWeight: 600, margin: "0 0 20px" }}>Category breakdown</h3>
                {pieData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={85}
                        paddingAngle={4} dataKey="value">
                        {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                      </Pie>
                      <Tooltip
                        contentStyle={{ background: "#1e1b4b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, color: "white" }}
                        formatter={(v: any) => [`₹${v}`, ""]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div style={{ height: 200, display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,0.3)", fontSize: 14 }}>
                    No data yet
                  </div>
                )}
                {/* Legend */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 8 }}>
                  {pieData.slice(0, 4).map((d, i) => (
                    <div key={d.name} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <div style={{ width: 8, height: 8, borderRadius: "50%", background: COLORS[i % COLORS.length] }} />
                      <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 12, textTransform: "capitalize" }}>{d.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
 
            {/* Recent Transactions */}
            <div style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.09)",
              borderRadius: 16, padding: 20
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <h3 style={{ color: "white", fontSize: 15, fontWeight: 600, margin: 0 }}>Recent transactions</h3>
                <button onClick={() => setActiveTab("expenses")} style={{
                  background: "none", border: "none", color: "#a78bfa", fontSize: 13, cursor: "pointer"
                }}>View all →</button>
              </div>
              {expenses.slice(0, 5).map(e => (
                <div key={e.id} style={{
                  display: "flex", alignItems: "center", gap: 14,
                  padding: "10px 0",
                  borderBottom: "1px solid rgba(255,255,255,0.06)"
                }}>
                  <div style={{
                    width: 38, height: 38, borderRadius: 10,
                    background: "rgba(139,92,246,0.2)",
                    display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0
                  }}>{getIcon(e.category)}</div>
                  <div style={{ flex: 1 }}>
                    <p style={{ color: "white", fontSize: 14, fontWeight: 500, margin: 0, textTransform: "capitalize" }}>{e.category || "Other"}</p>
                    <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 12, margin: 0 }}>{e.note || "—"}</p>
                  </div>
                  <span style={{ color: "#ef4444", fontWeight: 600, fontSize: 14 }}>-₹{Number(e.amount).toLocaleString("en-IN")}</span>
                </div>
              ))}
              {expenses.length === 0 && (
                <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 14, textAlign: "center", padding: "20px 0" }}>
                  No expenses yet. Start chatting!
                </p>
              )}
            </div>
          </>
        )}
 
        {/* ── EXPENSES TAB ── */}
        {activeTab === "expenses" && (
          <div style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.09)",
            borderRadius: 16, overflow: "hidden"
          }}>
            <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
              <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, margin: 0 }}>{expenses.length} total entries · ₹{total.toLocaleString("en-IN")} spent</p>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "rgba(255,255,255,0.04)" }}>
                    {["#", "Category", "Amount", "Note", "Date"].map(h => (
                      <th key={h} style={{
                        padding: "12px 16px", color: "rgba(255,255,255,0.4)",
                        fontSize: 12, fontWeight: 600, letterSpacing: "0.5px",
                        textAlign: "left", textTransform: "uppercase"
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {expenses.map((e, i) => (
                    <tr key={e.id} style={{
                      borderTop: "1px solid rgba(255,255,255,0.06)",
                      transition: "background 0.15s",
                      cursor: "default"
                    }}
                      onMouseEnter={ev => (ev.currentTarget.style.background = "rgba(255,255,255,0.04)")}
                      onMouseLeave={ev => (ev.currentTarget.style.background = "transparent")}
                    >
                      <td style={{ padding: "12px 16px", color: "rgba(255,255,255,0.3)", fontSize: 13 }}>{i + 1}</td>
                      <td style={{ padding: "12px 16px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span style={{ fontSize: 16 }}>{getIcon(e.category)}</span>
                          <span style={{ color: "white", fontSize: 14, textTransform: "capitalize" }}>{e.category || "Other"}</span>
                        </div>
                      </td>
                      <td style={{ padding: "12px 16px", color: "#ef4444", fontWeight: 600, fontSize: 14 }}>
                        -₹{Number(e.amount).toLocaleString("en-IN")}
                      </td>
                      <td style={{ padding: "12px 16px", color: "rgba(255,255,255,0.5)", fontSize: 13 }}>{e.note || "—"}</td>
                      <td style={{ padding: "12px 16px", color: "rgba(255,255,255,0.35)", fontSize: 12 }}>
                        {new Date(e.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {expenses.length === 0 && (
                <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 14, textAlign: "center", padding: "40px 0" }}>
                  No expenses yet!
                </p>
              )}
            </div>
          </div>
        )}
 
        {/* ── CHAT TAB ── */}
        {activeTab === "chat" && (
          <div style={{ height: "calc(100vh - 140px)" }}>
            <Chat onNewExpense={fetchExpenses} />
          </div>
        )}
      </main>
    </div>
  )
}