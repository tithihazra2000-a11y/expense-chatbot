app.post('/chat', async (req, res) => {
  try {
    const text = req.body.message?.toLowerCase().trim() || ''

    // 🔍 SHOW
    if (text.includes('show')) {
      const { data, error } = await supabase.from('expenses').select('*')

      if (error) return res.json({ reply: 'Error fetching data ❌' })

      if (!data.length) {
        return res.json({ reply: 'No expenses yet' })
      }

      return res.json({
        reply: data
          .map(e => `${e.category} - ₹${e.amount} (${e.note})`)
          .join('\n')
      })
    }

    // 💰 TOTAL
    if (text.includes('total')) {
      const { data, error } = await supabase.from('expenses').select('amount')

      if (error) return res.json({ reply: 'Error calculating total ❌' })

      const total = data.reduce((sum, e) => sum + e.amount, 0)

      return res.json({ reply: `Total: ₹${total}` })
    }

    // 🗑 DELETE
    if (text.includes('delete')) {
      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .order('id', { ascending: false })
        .limit(1)

      if (error) return res.json({ reply: 'Delete failed ❌' })

      if (!data.length) {
        return res.json({ reply: 'Nothing to delete' })
      }

      await supabase.from('expenses').delete().eq('id', data[0].id)

      return res.json({ reply: 'Deleted last expense 🗑' })
    }

    // ➕ ADD EXPENSE
    const amount = text.match(/\d+/)?.[0]

    if (!amount) {
      return res.json({ reply: 'Try: spent 200 on food' })
    }

    // 🔥 SMART CATEGORY
    let category = 'Other'
    const match = text.match(/(?:on|for)\s+([a-zA-Z ]+)/)

    if (match) {
      const extracted = match[1].trim()

      if (extracted.length > 2) {
        category =
          extracted.charAt(0).toUpperCase() +
          extracted.slice(1)
      }
    }

    // 🧠 STORE FULL TEXT AS NOTE
    const note = text

    const { error } = await supabase.from('expenses').insert([
      {
        amount: Number(amount),
        category,
        note
      }
    ])

    if (error) {
      console.log(error)
      return res.json({ reply: 'Database error ❌' })
    }

    return res.json({
      reply: `Saved ₹${amount} for ${category} ✅`
    })

  } catch (err) {
    console.log(err)
    return res.json({ reply: 'Server error ❌' })
  }
})