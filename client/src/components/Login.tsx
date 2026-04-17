

import { useState } from "react"
 
export default function Login({ onLogin }: any) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
 
  const handleLogin = () => {
    if (!email || !password) return
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      onLogin(email)
    }, 800)
  }
 
  return (
    <div className="min-h-screen flex" style={{ background: "#0f0c29" }}>
 
      {/* LEFT PANEL */}
      <div className="flex-1 relative flex flex-col justify-center items-center px-12 overflow-hidden">
        {/* Decorative blobs */}
        <div style={{
          position: "absolute", width: 400, height: 400,
          background: "radial-gradient(circle, rgba(139,92,246,0.25) 0%, transparent 70%)",
          top: -80, left: -80, borderRadius: "50%"
        }} />
        <div style={{
          position: "absolute", width: 300, height: 300,
          background: "radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 70%)",
          bottom: -60, right: -40, borderRadius: "50%"
        }} />
 
        <div className="relative z-10 max-w-sm text-white">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-12">
            <div style={{
              width: 44, height: 44, borderRadius: 12,
              background: "linear-gradient(135deg,#8b5cf6,#6366f1)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 22
            }}>₹</div>
            <span style={{ fontSize: 22, fontWeight: 600, letterSpacing: "-0.5px" }}>SpendSmart</span>
          </div>
 
          <h1 style={{ fontSize: 42, fontWeight: 700, lineHeight: 1.15, marginBottom: 16, letterSpacing: "-1px" }}>
            Track every<br />rupee you spend
          </h1>
          <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 16, lineHeight: 1.7, marginBottom: 40 }}>
            Chat naturally to log expenses. See beautiful charts. Stay on budget effortlessly.
          </p>
 
          {/* Feature pills */}
          {["Chat-based expense input", "Real-time dashboard", "Category breakdown charts"].map(f => (
            <div key={f} className="flex items-center gap-3 mb-4">
              <div style={{
                width: 20, height: 20, borderRadius: "50%",
                background: "rgba(139,92,246,0.3)",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0
              }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#a78bfa" }} />
              </div>
              <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 14 }}>{f}</span>
            </div>
          ))}
        </div>
      </div>
 
      {/* RIGHT PANEL */}
      <div className="flex items-center justify-center px-8" style={{ width: 480, background: "rgba(255,255,255,0.03)" }}>
        <div style={{
          width: "100%", maxWidth: 380,
          background: "rgba(255,255,255,0.06)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 24, padding: "40px 36px"
        }}>
          <h2 style={{ color: "white", fontSize: 26, fontWeight: 600, marginBottom: 8 }}>Welcome back</h2>
          <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 14, marginBottom: 32 }}>Sign in to your account</p>
 
          <div className="flex flex-col gap-4">
            <div>
              <label style={{ color: "rgba(255,255,255,0.6)", fontSize: 12, fontWeight: 500, display: "block", marginBottom: 8, letterSpacing: "0.5px", textTransform: "uppercase" }}>Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleLogin()}
                style={{
                  width: "100%", padding: "12px 16px",
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: 10, color: "white", fontSize: 14,
                  outline: "none", boxSizing: "border-box"
                }}
              />
            </div>
 
            <div>
              <label style={{ color: "rgba(255,255,255,0.6)", fontSize: 12, fontWeight: 500, display: "block", marginBottom: 8, letterSpacing: "0.5px", textTransform: "uppercase" }}>Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleLogin()}
                style={{
                  width: "100%", padding: "12px 16px",
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: 10, color: "white", fontSize: 14,
                  outline: "none", boxSizing: "border-box"
                }}
              />
            </div>
 
            <div className="flex justify-end">
              <span style={{ color: "#a78bfa", fontSize: 13, cursor: "pointer" }}>Forgot password?</span>
            </div>
 
            <button
              onClick={handleLogin}
              disabled={!email || !password || loading}
              style={{
                width: "100%", padding: "13px",
                background: loading || !email || !password
                  ? "rgba(139,92,246,0.4)"
                  : "linear-gradient(135deg,#8b5cf6,#6366f1)",
                border: "none", borderRadius: 10, color: "white",
                fontSize: 15, fontWeight: 600, cursor: "pointer",
                transition: "opacity 0.2s", marginTop: 4
              }}
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </div>
 
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, textAlign: "center", marginTop: 24 }}>
            Don't have an account?{" "}
            <span style={{ color: "#a78bfa", cursor: "pointer" }}>Create one</span>
          </p>
        </div>
      </div>
    </div>
  )
}