import { useState, useCallback, useEffect } from "react"
 
export interface Toast {
  id: number
  message: string
  type: "success" | "warning" | "error" | "info"
}
 
let toastId = 0
 
export function useToasts() {
  const [toasts, setToasts] = useState<Toast[]>([])
  const shownAlerts = useState<Set<string>>(new Set())[0]
 
  const addToast = useCallback((message: string, type: Toast["type"] = "info") => {
    const id = ++toastId
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000)
  }, [])
 
  const addAlert = useCallback((message: string) => {
    if (shownAlerts.has(message)) return
    shownAlerts.add(message)
    addToast(message, "warning")
    // clear from shown after 30s so it can re-trigger
    setTimeout(() => shownAlerts.delete(message), 30000)
  }, [addToast])
 
  return { toasts, addToast, addAlert }
}
 
export function ToastContainer({ toasts }: { toasts: Toast[] }) {
  const colors: Record<Toast["type"], { bg: string; border: string; text: string }> = {
    success: { bg: "rgba(34,197,94,0.15)", border: "rgba(34,197,94,0.3)", text: "#86efac" },
    warning: { bg: "rgba(245,158,11,0.15)", border: "rgba(245,158,11,0.3)", text: "#fcd34d" },
    error:   { bg: "rgba(239,68,68,0.15)",  border: "rgba(239,68,68,0.3)",  text: "#fca5a5" },
    info:    { bg: "rgba(99,102,241,0.15)",  border: "rgba(99,102,241,0.3)", text: "#a5b4fc" },
  }
 
  return (
    <div style={{
      position: "fixed", bottom: 24, right: 24,
      display: "flex", flexDirection: "column", gap: 10,
      zIndex: 9999, pointerEvents: "none"
    }}>
      {toasts.map(t => {
        const c = colors[t.type]
        return (
          <div key={t.id} style={{
            background: c.bg, border: `1px solid ${c.border}`,
            borderRadius: 12, padding: "12px 18px",
            color: c.text, fontSize: 14, maxWidth: 340,
            animation: "slideIn 0.25s ease",
            backdropFilter: "blur(10px)"
          }}>
            {t.message}
          </div>
        )
      })}
      <style>{`
        @keyframes slideIn {
          from { transform: translateX(120%); opacity: 0; }
          to   { transform: translateX(0);    opacity: 1; }
        }
      `}</style>
    </div>
  )
}