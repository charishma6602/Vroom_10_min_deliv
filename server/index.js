import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import helmet from 'helmet'
import connectDB from './config/connectDB.js'
import userRouter from './route/user.route.js'
import categoryRouter from './route/category.route.js'
import uploadRoute from './route/upload.route.js'
import subCategoryRouter from './route/subcategory.route.js'
import productRouter from './route/product.route.js'
import cartRouter from './route/cart.route.js'
import addressRouter from './route/address.route.js'
import orderRouter from './route/order.route.js'

dotenv.config()

const app = express()

// 1. Explicit CORS configuration
app.use(cors({
    origin: "https://vroom-10-min-deliv-app.vercel.app",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"]
}))

app.use(express.json())
app.use(cookieParser())
app.use(morgan('combined'))
app.use(helmet({
    crossOriginResourcePolicy: false
}))

// 2. The "Pre-flight" fix for Vercel
app.options("*", cors())

// 3. Optimized Database Connection for Serverless
// This prevents the "500" crash by ensuring DB is ready before routes fire
let isConnected = false;
const connectDatabaseMiddleware = async (req, res, next) => {
    if (isConnected) {
        return next();
    }
    try {
        await connectDB();
        isConnected = true;
        next();
    } catch (error) {
        console.error("MongoDB Connection Error:", error);
        return res.status(500).json({ message: "Database connection failed" });
    }
};

app.use(connectDatabaseMiddleware);

// 4. Routes
app.get("/", (req, res) => {
    res.json({
        message: "Server is running",
        dbStatus: isConnected ? "Connected" : "Connecting..."
    })
})

app.use('/api/user', userRouter)
app.use("/api/category", categoryRouter)
app.use("/api/file", uploadRoute)
app.use("/api/subcategory", subCategoryRouter)
app.use("/api/product", productRouter)
app.use("/api/cart", cartRouter)
app.use("/api/address", addressRouter)
app.use('/api/order', orderRouter)

// 5. Vercel Export (No app.listen needed)
export default app