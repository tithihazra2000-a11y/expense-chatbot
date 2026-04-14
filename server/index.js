const express = require('express')
const cors = require('cors')
const { createClient } = require('@supabase/supabase-js')

const app = express()

app.use(cors())
app.use(express.json())

// 🔑 Supabase
const supabase = createClient(
  'https://csokppzlfcdhzrvdnqvr.supabase.co',
  'sb_publishable_-hzP-OQaNrO-2IVdQ2ahCA_n1xPgM-J'
)

// ✅ TEST ROUTE
app.get('/', (req, res) => {
  res.send('API is running 🚀')
})

// 💬 CHAT ROUTE
app.post('/chat', async (req, res) => {
  try {
    const text = req.body.message?.toLowerCase() || ''

    console.log("Incoming:", text)

    const amount = text.match(/\d+/)?.[0]

    let category = 'Other'
    if (text.includes('food')) category = 'Food'
    if (text.includes('travel')) category = 'Travel'

    if (!amount) {
      return res.json({ reply: 'Try: Spent 200 on food' })
    }

    const { error } = await supabase.from('expenses').insert([
      { amount: Number(amount), category }
    ])

    if (error) {
      console.log("DB ERROR:", error)
      return res.json({ reply: 'Database error ❌' })
    }

    return res.json({
      reply: `Saved ₹${amount} for ${category} ✅`
    })

  } catch (err) {
    console.log("SERVER ERROR:", err)
    return res.json({ reply: 'Server crashed ❌' })
  }
})

// 📊 GET EXPENSES
app.get('/expenses', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('expenses')
      .select('*')

    if (error) {
      console.log(error)
      return res.json({ error: 'Error fetching data' })
    }

    return res.json(data)

  } catch (err) {
    console.log(err)
    return res.json({ error: 'Server error' })
  }
})

// 🚀 IMPORTANT FIX (Render port)
const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})