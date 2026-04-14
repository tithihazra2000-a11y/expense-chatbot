import { useEffect, useState } from 'react'
import { PieChart, Pie, Cell, Tooltip } from 'recharts'

export default function Dashboard() {
  const [data, setData] = useState<any[]>([])

  useEffect(() => {
    fetch('https://expense-chatbot-api.onrender.com/expenses')
      .then(res => res.json())
      .then(d => {
        const grouped: any = {}

        d.forEach((item: any) => {
          grouped[item.category] = (grouped[item.category] || 0) + item.amount
        })

        const chartData = Object.keys(grouped).map(key => ({
          name: key,
          value: grouped[key]
        }))

        setData(chartData)
      })
  }, [])

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658']

  return (
    <div style={{ marginTop: 30 }}>
      <h2>📊 Expense Chart</h2>

      <PieChart width={300} height={300}>
        <Pie data={data} dataKey="value">
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </div>
  )
}