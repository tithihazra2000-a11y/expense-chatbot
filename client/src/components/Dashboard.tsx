import { useEffect, useState } from 'react'

export default function Dashboard() {
  const [data, setData] = useState<any[]>([])

  useEffect(() => {
    fetch('https://expense-chatbot-api.onrender.com/expenses')
      .then(res => res.json())
      .then(res => {
        setData(res || [])
      })
      .catch(() => {
        setData([])
      })
  }, [])

  return (
    <div style={{ marginTop: 20 }}>
      <h2>📊 Expenses</h2>

      {data.length === 0 ? (
        <p>No expenses yet</p>
      ) : (
        data.map((item, i) => (
          <div key={i} style={{
            background: '#eee',
            padding: '8px',
            margin: '5px',
            borderRadius: '6px'
          }}>
            ₹{item.amount} - {item.category}
          </div>
        ))
      )}
    </div>
  )
}