import express, { response } from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
dotenv.config()
import cookieParser from 'cookie-parser'
import morgan from 'morgan'  //In logger, when any api is called, it'll be displayed
import helmet from 'helmet'
import connectDB  from './config/connectDB.js'
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

const allowedOrigins = [
  process.env.FRONTEND_URL,
  "https://vroom-10-min-deliv.vercel.app"
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow server-to-server, Vercel probes, Postman
    if (!origin) return callback(null, true);

    // Allow all Vercel preview deployments
    if (origin.endsWith(".vercel.app")) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    // IMPORTANT: do NOT throw error
    return callback(null, false);
  },
  credentials: true
}));



app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())
app.use(morgan())
app.use(helmet({
    crossOriginResourcePolicy:false  //if backend is in a different domain than the frontend, it shows error while loading resources to frontend
}))

const PORT = process.env.PORT || 8080

app.get("/",(request,response)=>{
    //server to client
    response.json({
        message:"Server is up " + PORT

    })
})

app.use('/api/user', userRouter) //accessing predefined string of /api/user path, which will be called along with 'userRouter'
app.use('/api/category',categoryRouter)
app.use('/api/file',uploadRoute)
app.use('/api/product',productRouter)
app.use('/api/subcategory',subcategoryRouter)
app.use('/api/cart',cartRouter)
app.use('/api/order',orderRouter)
app.use('/api/address',addressRouter)

connectDB()
app.listen(PORT,()=>{
    console.log("Server is running",PORT)
})