import mongoose from 'mongoose'

// Always returns a promise when using mongoose so we must use async
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
            useCreateIndex: true
        })

        console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline)

    } catch (error) {
        console.error(`Error: ${error.message}`.red.underline.bold)
        // This means we will exit with failure if it did not connect
        process.exit(1)
    }
}

export default connectDB