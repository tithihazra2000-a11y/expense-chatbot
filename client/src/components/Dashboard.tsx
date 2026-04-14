import { useEffect, useState } from 'react'

export default function Dashboard() {
  const [expenses, setExpenses] = useState<any[]>([])

  const fetchExpenses = async () => {
    try {
      const res = await fetch('https://expense-chatbot-api.onrender.com/expenses')
      const data = await res.json()
      setExpenses(data)
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    fetchExpenses()
  }, [])

  return (
    <div style={{ marginTop: 20 }}>
      <h2>📊 Expenses</h2>

      {expenses.length === 0 ? (
        <p>No expenses yet</p>
      ) : (
        expenses.map((e, i) => (
          <div
            key={i}
            style={{
              background: '#eee',
              padding: '10px',
              margin: '5px 0',
              borderRadius: '8px'
            }}
          >
            ₹{e.amount} - {e.category}
          </div>
        ))
      )}
    </div>
  )
}