import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Form, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import FormContainer from '../components/FormContainer'
import { getUserDetails, updateUser } from '../actions/userActions'
import { USER_UPDATE_RESET } from '../constants/userContants'

const UserEditScreen = ({ match, history }) => {
    const userId = match.params.id // Get user Id from URL

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [isAdmin, setIsAdmin] = useState(false)

    const dispatch = useDispatch()

    const userDetails = useSelector(state => state.userDetails) // Get information from our state
    const { loading, error, user } = userDetails // Pulling the specific info we need

    const userUpdate = useSelector(state => state.userUpdate) // Get information from our state
    const { loading: loadingUpdate, error: errorUpdate, success: successUpdate } = userUpdate // Pulling the specific info we need

    useEffect(() => {
        if(successUpdate) { // If successUpdate then we want to RESET the User update State and redirect to UserListScreen
            dispatch({ type: USER_UPDATE_RESET})
            history.push('/admin/userlist')
        } else {
            if(!user.name || user._id !== userId) {
                dispatch(getUserDetails(userId))
            } else {
                setName(user.name)
                setEmail(user.email)
                setIsAdmin(user.isAdmin)
            }
        }
    }, [user, dispatch, userId, history, successUpdate])

    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(updateUser({ _id: userId, name, email, isAdmin })) // Update our user with this information passed in
        console.log(isAdmin)
    }

    console.log(name)

    return (
        <>
            <Link to='/admin/userlist' className='btn-light my-3'>Go Back</Link>
            <FormContainer>
            <h1>Edit User</h1>
            {loadingUpdate && <Loader />}
            {errorUpdate && <Message variant='danger'>{errorUpdate}</Message>}
            {loading ? <Loader/> : error ? <Message variant='danger'>{error}</Message> : (
                <Form onSubmit={submitHandler}>
                    <Form.Group controlId='name'>
                        <Form.Label>Name</Form.Label>
                        <Form.Control 
                            type='name' 
                            placeholder='Enter name' 
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        ></Form.Control>
                    </Form.Group>

                    <Form.Group controlId='email'>
                        <Form.Label>Email Address</Form.Label>
                        <Form.Control 
                            type='email' 
                            placeholder='Enter email' 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        ></Form.Control>
                    </Form.Group>

                    <Form.Group controlId='isAdmin'>
                        <Form.Check 
                            type='checkbox' 
                            label='Is Admin'
                            checked={isAdmin}
                            onChange={(e) => setIsAdmin(e.target.checked)}
                        ></Form.Check>
                    </Form.Group>

                    <Button type='submit' variant='primary'>Update</Button>
                </Form>
            )}
            
            </FormContainer>
        </>
        
    )
}

export default UserEditScreen