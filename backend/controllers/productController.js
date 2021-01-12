import asyncHandler from 'express-async-handler'
import Product from '../models/productModel.js'

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
    // Add pagination functionality
    const pageSize = 10 // How many items show before a new page is create
    const page = Number(req.query.pageNumber) || 1 // This looks for the page number you're on in the URL

    // This is how you get queries in the URL (?=)
    const keyword = req.query.keyword ? {
        name: {
            $regex: req.query.keyword, // This will allow searches even if the word isn't spelled exactly (iph = iphone)
            $options: 'i'
        }
    } : {}
    
    const count = await Product.countDocuments({ ...keyword }) // Counts the number of products in our database for pagination purposes
    const products = await Product.find({ ...keyword }).limit(pageSize).skip(pageSize * (page - 1)) //Empty object will return everything, .limit() only lets us get the number of Products we pass into it, skip and the math will let us skip the products in the database when we go to the second page

    res.json({ products, page, pages: Math.ceil(count / pageSize) }) // This will send us the products as well as the page we are on and the number of pages we should have based on the number of products we have
})

// @desc    Fetch a single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id)

    if(product) {
        res.json(product)
    } else {
        res.status(404)
        throw new Error('Product not found')
    }
})

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id)

    if(product) {
        await product.remove()
        res.json({ message: 'Product removed' })
    } else {
        res.status(404)
        throw new Error('Product not found')
    }
})

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
    const product = new Product ({
        name: 'Sample name',
        price: 0,
        user: req.user._id,
        image: '/images/sample.jpg',
        brand: 'Sample Brand',
        category: 'Sample category',
        countInStock: 0,
        description: 'Sample description'
    })

    const createdProduct = await product.save()
    res.status(201).json(createdProduct)
})

// @desc    Edit a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
    const {
        name, 
        price, 
        description, 
        image, 
        brand, 
        category, 
        countInStock, 
    } = req.body

    const product = await Product.findById(req.params.id)

    if(product) {
        product.name = name
        product.price = price
        product.description = description
        product.image = image
        product.brand = brand
        product.category = category
        product.countInStock = countInStock

        const updatedProduct = await product.save()
        res.json(updatedProduct)
    } else {
        res.status(404)
        throw new Error('Product not found')
    }
})

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = asyncHandler(async (req, res) => {
    const {
        rating, 
        comment
    } = req.body

    const product = await Product.findById(req.params.id)

    if(product) {
        // This will be true if the logged in user already has a review on the product
        const alreadyReviewed = product.reviews.find((r) => r.user.toString() === req.user._id.toString())

        if(alreadyReviewed) {
            res.status(404)
            throw new Error('Product already reviewed')
        }

        // Create a new review
        const review = {
            name: req.user.name,
            rating: Number(rating),
            comment,
            user: req.user._id
        }

        // Add the new review to our existing array of reviews
        product.reviews.push(review)

        product.numReviews = product.reviews.length

        // Gets the average rating of the product based off all the reviews
        product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length

        // Saves the review
        await product.save()
        res.status(201).json({ message: 'Review added' })

    } else {
        res.status(404)
        throw new Error('Product not found')
    }
})

// @desc    Get Top Rated Products
// @route   GET /api/products/top
// @access  Public
const getTopProducts = asyncHandler(async (req, res) => {
    const products = await Product.find({}).sort({ rating: -1 }).limit(3) // Sort will sort by rating in acsending order, limit will get only the first three

    res.json(products)
})

export {
    getProducts,
    getProductById,
    deleteProduct,
    createProduct,
    updateProduct,
    createProductReview,
    getTopProducts,
}