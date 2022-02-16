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

        let minusTotalAmount = state.totalAmount
        let deletedItems = [...state.items]

        if (existingCarItemIndex > -1) {
            const deletedItem = deletedItems[existingCarItemIndex]

            if (deletedItem.amount > 1) {
                --deletedItems[existingCarItemIndex].amount
            } else {
                deletedItems.splice(existingCarItemIndex, 1)
            }
            minusTotalAmount = minusTotalAmount - deletedItem.price
        }

        if (minusTotalAmount < 0) minusTotalAmount = 0

        return {
            items: deletedItems,
            totalAmount: minusTotalAmount
        }
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

    const cartContext = {
        items: cartState.items,
        totalAmount: cartState.totalAmount,
        addItem: addItemToCartHandler,
        removeItem: removeItemFromCartHandler 
    }

    return (
        <CartContext.Provider value={cartContext}>
            {props.children}
        </CartContext.Provider>
    )

}

export default CartProvider