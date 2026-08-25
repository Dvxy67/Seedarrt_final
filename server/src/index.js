const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const contactRouter = require('./routes/contact')
const authRouter = require('./routes/auth')
const worksRouter = require('./routes/works')
const newsletterRouter = require('./routes/newsletter')
const { notFoundHandler, errorHandler } = require('./middleware/errorHandler')

const app = express()
const PORT = process.env.PORT || 3001

app.use(helmet())
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
}))
app.use(express.json())

app.use('/api/contact', contactRouter)
app.use('/api/auth', authRouter)
app.use('/api/works', worksRouter)
app.use('/api/newsletter', newsletterRouter)

app.use(notFoundHandler)
app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
