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

// Enhanced CORS configuration
app.use(cors({
    credentials: true,
    origin: function (origin, callback) {
        // Allow requests with no origin (mobile apps, curl, etc.)
        if (!origin) return callback(null, true);
        
        const allowedOrigins = [
            process.env.FRONTEND_URL,
            'https://vroom-10-min-deliv-app.vercel.app', // Hardcoded as fallback
            'http://localhost:3000', // For development
            'http://localhost:5173'  // For Vite dev server
        ];
        
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
    exposedHeaders: ['Set-Cookie']
}))

// Handle preflight requests
app.options(/.*/, cors())


app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: true, limit: '50mb' }))
app.use(cookieParser())
app.use(morgan('combined'))
app.use(helmet({
    crossOriginResourcePolicy: false,
    crossOriginEmbedderPolicy: false
}))

// Health check endpoint
app.get("/", (request, response) => {
    response.json({
        message: "Server is running",
        timestamp: new Date().toISOString(),
        //env: process.env.NODE_ENV
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

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err.message)
    res.status(500).json({ 
        message: 'Internal Server Error',
        error: process.env.VERCEL ? undefined : err.message

    })
})

// 404 handler
app.use(/.*/, (req, res) => {
    res.status(404).json({ message: 'Route not found' })
})


// Connect to DB and export handler for Vercel
let isConnected = false;

const connectToDatabase = async () => {
    if (isConnected) {
        return;
    }
    try {
        await connectDB();
        isConnected = true;
        console.log('Database connected successfully');
    } catch (error) {
        console.error('Database connection failed:', error);
        throw error;
    }
};

// For Vercel serverless
export default async function handler(req, res) {
    await connectToDatabase();
    return app(req, res);
}

// For local development
const PORT = process.env.PORT || 8080;

if (!process.env.VERCEL) {
    connectDB().then(() => {
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    }).catch(err => {
        console.error('Failed to start server:', err);
    });
}

