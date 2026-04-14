const express = require('express')
const cors = require('cors')
const { createClient } = require('@supabase/supabase-js')

const app = express()

app.use(cors())
app.use(express.json())

const supabase = createClient(
  'https://csokppzlfcdhzrvdnqvr.supabase.co',
  'sb_publishable_-hzP-OQaNrO-2IVdQ2ahCA_n1xPgM-J'
)

app.get('/', (req, res) => {
  res.send('API running 🚀')
})

app.post('/chat', async (req, res) => {
  try {
    const text = req.body.message?.toLowerCase() || ''

    // SHOW
    if (text.includes('show')) {
      const { data } = await supabase.from('expenses').select('*')

      if (!data.length) {
        return res.json({ reply: 'No expenses yet' })
      }

      return res.json({
        reply: data.map(e => `${e.category} - ₹${e.amount}`).join('\n')
      })
    }

    // TOTAL
    if (text.includes('total')) {
      const { data } = await supabase.from('expenses').select('amount')
      const total = data.reduce((sum, e) => sum + e.amount, 0)

      return res.json({ reply: `Total: ₹${total}` })
    }

    // DELETE
    if (text.includes('delete')) {
      const { data } = await supabase
        .from('expenses')
        .select('*')
        .order('id', { ascending: false })
        .limit(1)

      if (!data.length) {
        return res.json({ reply: 'Nothing to delete' })
      }

      await supabase.from('expenses').delete().eq('id', data[0].id)

      return res.json({ reply: 'Deleted last expense' })
    }

    // ADD
    const amount = text.match(/\d+/)?.[0]

    let category = 'Other'
    if (text.includes('food') || text.includes('pizza')) category = 'Food'
    if (text.includes('travel') || text.includes('uber')) category = 'Travel'

    if (!amount) {
      return res.json({ reply: 'Try: Spent 200 on food' })
    }

    await supabase.from('expenses').insert([
      { amount: Number(amount), category }
    ])

    return res.json({
      reply: `Saved ₹${amount} for ${category}`
    })

  } catch (err) {
    return res.json({ reply: 'Server error' })
  }
})

const PORT = process.env.PORT || 5000
app.listen(PORT)