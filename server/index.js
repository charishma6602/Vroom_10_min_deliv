import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
dotenv.config()
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import helmet from 'helmet'

import connectDB from './config/connectDB.js'
import userRouter from './route/user.route.js'
import categoryRouter from './route/category.route.js'
import uploadRoute from './route/upload.route.js'
import subcategoryRouter from './route/subcategory.route.js'
import productRouter from './route/product.route.js'
import cartRouter from './route/cart.route.js'
import addressRouter from './route/address.route.js'
import orderRouter from './route/order.route.js'

const app = express()

console.log("FRONTEND_URL from env:", process.env.FRONTEND_URL)

// ✅ connect DB (NO listen)
connectDB()

app.use(cors({
  credentials: true,
  origin: process.env.FRONTEND_URL
}))

app.use(express.json())
app.use(cookieParser())

// ✅ FIX morgan
app.use(morgan("combined"))

app.use(helmet({
  crossOriginResourcePolicy: false
}))

app.get("/", (req, res) => {
  res.json({
    message: "Server is up"
  })
})

app.use('/api/user', userRouter)
app.use('/api/category', categoryRouter)
app.use('/api/file', uploadRoute)
app.use('/api/product', productRouter)
app.use('/api/subcategory', subcategoryRouter)
app.use('/api/cart', cartRouter)
app.use('/api/order', orderRouter)
app.use('/api/address', addressRouter)

// ✅ THIS IS WHAT VERCEL NEEDS
export default app
