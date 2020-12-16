import express from 'express'
import dotenv from 'dotenv'
import colors from 'colors'
import connectDB from './config/db.js'
import products from './data/products.js'

// Allows us to setup and use an .env file
dotenv.config()

// Runs our function to connect to our MongoDB Database
connectDB();

const app = express();

// Home page
app.get('/', (req, res) => {
    res.send('API is running.')
})

// Route to all products - Returns all the products from the backend
app.get('/api/products', (req, res) => {
    res.json(products)
})

// Route to specific product
app.get('/api/products/:id', (req, res) => {
    const product = products.find(p => p._id === req.params.id)
    res.json(product)
})

const PORT = process.env.PORT || 5000

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold))