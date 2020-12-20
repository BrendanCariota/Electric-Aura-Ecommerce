import React from 'react'
import { Spinner } from 'react-bootstrap'

const Loader = () => {
    return (
        <Spinner animation='border' role='status' style={{ 
            width: '100px', 
            height: '100px', 
            marign: 'auto', 
            display: 'block'
        }}
        >
            <span className='sr-only'>Loading...</span>
        </Spinner>
    )
}

export default Loader
