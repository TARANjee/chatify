import express from 'express'
import authRoutes from './routes/auth.route.js'
import messageRoutes from './routes/message.route.js'
import { connectDB } from './lib/db.js'
import { ENV } from './lib/env.js'
import cookieParser from 'cookie-parser'
import cors from 'cors'

const app = express()

const PORT = ENV.PORT || 3000

// increase payload size
app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ limit: "10mb", extended: true }))

app.use(cookieParser())
app.use(cors({ origin: ENV.CLIENT_URL, credentials: true }))

app.use("/api/auth", authRoutes)
app.use("/api/messages", messageRoutes)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
  connectDB()
})