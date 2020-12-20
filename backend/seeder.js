import mongoose from 'mongoose'
import dotenv from 'dotenv'
import colors from 'colors'
import users from './data/users.js'
import products from './data/products.js'
import User from './models/userModel.js'
import Product from './models/productModel.js'
import Order from './models/orderModel.js'
import connectDB from './config/db.js'

dotenv.config();

connectDB();

const importData = async () => {
    try {
        // Clears database so we don't import anything with stuff already existing in db
        // Returns Promise so much use await
        // deleteMany with nothing in () will delete everything
        await Order.deleteMany()
        await Product.deleteMany()
        await User.deleteMany()

        // Create an array of created users
        const createdUsers = await User.insertMany(users)

        const adminUser = createdUsers[0]._id

        const sampleProducts = products.map(product => {
            return { ...product, user: adminUser } //Just adds the admin user to the user field in products
        })

        await Product.insertMany(sampleProducts)

        console.log('Data Imported!'.green.inverse)
        process.exit()
    } catch (error) {
        console.error(`${error}`.red.inverse)
        process.exit(1)
    }
}

const destroyData = async () => {
    try {
        // Clears database so we don't import anything with stuff already existing in db
        // Returns Promise so much use await
        // deleteMany with nothing in () will delete everything
        await Order.deleteMany()
        await Product.deleteMany()
        await User.deleteMany()

        console.log('Data Destroyed!'.red.inverse)
        process.exit()
    } catch (error) {
        console.error(`${error}`.red.inverse)
        process.exit(1)
    }
}

// This will allow us to add -d onto our (node backend/seeder) command log to delete the data or without it import the data
// We can call either data:destroy or data:import because we set it up in our package.json
if(process.argv[2] === '-d') {
    destroyData()
} else {
    importData()
}