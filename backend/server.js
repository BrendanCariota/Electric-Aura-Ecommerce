import express from 'express'
import dotenv from 'dotenv'
import colors from 'colors'
import connectDB from './config/db.js'
import { notFound, errorHandler } from './middleware/errorMiddleware.js'

import productRoutes from './routes/productRoutes.js'
import userRoutes from './routes/userRoutes.js'
import orderRoutes from './routes/orderRoutes.js'

// Allows us to setup and use an .env file
dotenv.config()

// Runs our function to connect to our MongoDB Database
connectDB();

const app = express();

// Allows us to accepted JSON data in the body
app.use(express.json())

// Home page
app.get('/', (req, res) => {
    res.send('API is running.')
})

// SETTING UP ROUTES
app.use('/api/products', productRoutes) //Products
app.use('/api/users', userRoutes) //Users
app.use('/api/orders', orderRoutes) //Orders
app.get('/api/config/paypal', (req, res) => res.send(process.env.PAYPAL_CLIENT_ID)) //Paypal


// Calling our MIDDLEWARE
app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 5000

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold))