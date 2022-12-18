require('dotenv').config()
const express = require('express')
const methodOverride = require('method-override')
const routes = require('./routes/index.js')
require('express-async-errors');
const { apiErrorHandler } = require('./middleware/error-handler')

const app = express()
const PORT = process.env.PORT || 3000


app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(methodOverride('_method'))
app.use(routes)
app.use(apiErrorHandler)

app.listen(PORT, () => {
  console.log(`App is running on http://localhost:${PORT}`)
})