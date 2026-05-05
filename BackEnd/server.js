import express from "express";
import cors from "cors";
import 'dotenv/config';
import mongoose from "mongoose";
import cloudinaryConfig from "./config/cloudinary.js";
import userRoute from "./routes/userRoute.js";
import productRoute from "./routes/productRoute.js";
import cartRoute from "./routes/cartRoute.js";
import orderRoute from "./routes/orderRoute.js";
import authRoute from "./routes/auth.js";
import passport from "./config/passport.js";

const app = express();
const PORT = process.env.PORT || 5000;

//  Allow both Admin and Store
const allowedOrigins = [
    process.env.ADMIN_URL,
    process.env.CLIENT_URL
]

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    },
    credentials: true
}))

app.use(express.json());
app.use(passport.initialize());

cloudinaryConfig();

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('✅ Connected to MongoDB Atlas')

        app.get('/', (req, res) => res.send("API is working!"))
        app.use('/api/auth', authRoute)
        app.use('/api/users', userRoute)
        app.use('/api/products', productRoute)
        app.use('/api/cart', cartRoute)
        app.use('/api/orders', orderRoute)

        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`)
        })
    })
    .catch((err) => {
        console.error('❌ MongoDB connection error:', err.message)
        process.exit(1)
    })