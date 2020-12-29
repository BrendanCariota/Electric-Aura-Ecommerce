import { CART_ADD_ITEM, CART_REMOVE_ITEM, CART_SAVE_PAYMENT_METHOD, CART_SAVE_SHIPPING_ADDRESS } from '../constants/cartConstants'

export const cartReducer = (state = { cartItems: [], shippingAddress: {} }, action) => {
    switch(action.type) {
        case CART_ADD_ITEM:
            const item = action.payload

            // If the state.cartItems product is equal to our payloads product it exists
            const existItem = state.cartItems.find(x => x.product === item.product)

            // If that item already exists in our cart return state and map through cartItems
            if(existItem) {
                return {
                    ...state,
                    // Maps through current cartItems in state if one matchs just return it because it already 
                    // in the cart if it doesn't return the payload(item)
                    cartItems: state.cartItems.map(x => x.product === existItem.product ? item : x)
                }
            } else {
                // Item (payload) does not exist in state return state items and the payload
                return {
                    ...state,
                    cartItems: [...state.cartItems, item]
                }
            }
        case CART_REMOVE_ITEM:
            return {
                ...state,
                cartItems: state.cartItems.filter(x => x.product !== action.payload)
            }
        case CART_SAVE_SHIPPING_ADDRESS:
            return {
                ...state,
                shippingAddress: action.payload
            }
            case CART_SAVE_PAYMENT_METHOD:
            return {
                ...state,
                paymentMethod: action.payload
            }
        default:
            return state
    }
}