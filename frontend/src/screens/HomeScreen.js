import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col } from 'react-bootstrap'
import Product from '../components/Product'
import Message from '../components/Message'
import Loader from '../components/Loader'
import Paginate from '../components/Paginate'
import ProductCarousel from '../components/ProductCarousel'
import Meta from '../components/Meta'
import { listProducts } from '../actions/productActions'

const HomeScreen = ({ match }) => {
    // Check for the keyword in the SearchBox component
    const keyword = match.params.keyword

    // We will get our pageNumber from URL parameters like our keyword for searching
    const pageNumber = match.params.pageNumber || 1

    const dispatch = useDispatch()

    // This var should match what you called it in (store.js)
    const productList = useSelector(state => state.productList)
    // We destructure and pull these from that productList state
    const { loading, error, products, page, pages} = productList

    // This useEffect fires off on application load and uses our action to fetch products
    useEffect(() => {
        dispatch(listProducts(keyword, pageNumber)) // We pass keyword in to our action so we can use this action to make this specific keyword
    }, [dispatch, keyword, pageNumber])

    return (
        <>
            <Meta />
            {!keyword ? <ProductCarousel /> : <Link to='/' className='btn btn-light'>Go Back</Link>}
            <h1>Latest Products</h1>
            {loading ? <Loader /> : error ? <Message variant='danger'>{error}</Message>
            : (
                <>
                <Row>
                    {products.map(product => (
                        <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                            <Product product={product} />
                        </Col>
                    ))}
                </Row>
                <Paginate pages={pages} page={page} keyword={keyword ? keyword : ''} />
                </>
            )}
            
        </>
    )
}

export default HomeScreen
