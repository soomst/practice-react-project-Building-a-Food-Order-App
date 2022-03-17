import { useReducer } from "react"
import CartContext from "./car-context"

const defaultCartState = {
    items: [],
    totalAmount: 0    
}

const cartReducer = (state, action) => {
    if (action.type === 'ADD') {
        const existingCarItemIndex = state.items.findIndex(item => item.id === action.item.id)
        const updateTotalAmount = state.totalAmount + (action.item.price * action.item.amount)

        let updatedItems

        if (existingCarItemIndex > -1) {
            updatedItems = [ ...state.items]
            updatedItems[existingCarItemIndex].amount += action.item.amount
        } else {
            updatedItems = state.items.concat(action.item)
        }

        return {
            items: updatedItems,
            totalAmount: updateTotalAmount
        }

    } else if (action.type === 'REMOVE') {
        const existingCarItemIndex = state.items.findIndex(item => item.id === action.id)
        const existingCarItem = state.items[existingCarItemIndex]
        let minusTotalAmount = state.totalAmount - existingCarItem.price
        
        let updatedItems

        if (existingCarItem.amount === 1) {
            updatedItems = state.items.filter( item => item.id !== action.id)            
        } else {
            updatedItems = [...state.items]
            --updatedItems[existingCarItemIndex].amount
        }      

        if (minusTotalAmount < 0) minusTotalAmount = 0

        return {
            items: updatedItems,
            totalAmount: minusTotalAmount
        }
    }

    if (action.type === 'CLEAR') {
        return defaultCartState
    }

    return defaultCartState
}

const CartProvider = props => {

    const [cartState, dispatchCartAction] = useReducer(cartReducer, defaultCartState)

    const addItemToCartHandler = (item) => {
        dispatchCartAction({type: 'ADD', item: item})
    }

    const removeItemFromCartHandler = (id) => {
        dispatchCartAction({type: 'REMOVE', id: id})
    }

    const clearCartHandler = () => {
        dispatchCartAction({type: 'CLEAR'})
    }

    const cartContext = {
        items: cartState.items,
        totalAmount: cartState.totalAmount,
        addItem: addItemToCartHandler,
        removeItem: removeItemFromCartHandler,
        clearCart : clearCartHandler
    }

    return (
        <CartContext.Provider value={cartContext}>
            {props.children}
        </CartContext.Provider>
    )

}

export default CartProvider