import jwt from 'jsonwebtoken'
import asyncHandler from 'express-async-handler'
import User from '../models/userModel.js'

const protect = asyncHandler(async (req, res, next) => {
    let token

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1] // Splits into an array where 'Bearer' is the 0 index and the token is the 1 index
            const decoded = jwt.verify(token, process.env.JWT_SECRET)

            // This will give us access to the users information in all of our protected routes
            req.user = await User.findById(decoded.id).select('-password') // Get everything but the password

            next()
        } catch (error) {
            console.error(error)
            res.status(401)
            throw new Error('Not authrozied, token failed')
        }
    }

    if (!token) {
        res.status(401)
        throw new Error('Not authorized, no token')
    }
})

export { protect }