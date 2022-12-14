const express = require('express')
const methodOverride = require('method-override')

const app = express()
const PORT = 3000

app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.get('/', (req, res) => {
  res.json({
    status: 'success',
    msg: 'hi'
  })
})
app.listen(PORT, () => {
  console.log(`App is running on http://localhost:${PORT}`)
})