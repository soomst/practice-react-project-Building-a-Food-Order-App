import Modal from "../UI/Modal";
import classes from "./Cart.module.css";
import CartContext from "../../store/car-context";
import React, { useContext, useState } from "react";
import CartItem from "./CartItem";
import Checkout from "./Checkout";
import useHttp from "../../hooks/use-http";

const Cart = (props) => {
  const [isCheckout, setIsCheckout] = useState(false);
  const cartCtx = useContext(CartContext);
  const {
    data: orderData,
    isLoading,
    error,
    sendRequest,
  } = useHttp();

  const totalAmount = `$${cartCtx.totalAmount.toFixed(2)}`;
  const hasItem = cartCtx.items.length > 0;

  const cartItemAddHandler = (item) => {
    const addItem = { ...item, amount: 1 };

    cartCtx.addItem(addItem);
  };

  const cartItemRemoveHandler = (id) => {
    cartCtx.removeItem(id);
  };

  const orderHandler = (e) => {
    setIsCheckout(true);
  };

  const orderCancleHandler = (e) => {
    setIsCheckout(false);
  };

  const submitOrderHandler = async (userData) => {
    const options = {
      method: "POST",
      body: JSON.stringify({ user: userData, orderedItem: cartCtx.items }),
    };
    await sendRequest("order", options);
    cartCtx.clearCart()
  };

  const cartItems = (
    <ul className={classes["cart-items"]}>
      {cartCtx.items.map((item) => (
        <CartItem
          key={item.id}
          id={item.id}
          name={item.name}
          description={item.description}
          price={item.price}
          amount={item.amount}
          onAdd={cartItemAddHandler.bind(null, item)}
          onRemove={cartItemRemoveHandler.bind(null, item.id)}
        />
      ))}
    </ul>
  );

  const modalActions = (
    <div className={classes.actions}>
      <button className={classes["button--alt"]} onClick={props.onClose}>
        Close
      </button>
      {hasItem && (
        <button className={classes.button} onClick={orderHandler}>
          Order
        </button>
      )}
    </div>
  );

  const cartModalContent = (
    <React.Fragment>
      {cartItems}
      <div className={classes.total}>
        <span>Total Amount</span>
        <span>{totalAmount}</span>
      </div>
      {isCheckout ? (
        <Checkout
          onCancel={orderCancleHandler}
          onConfirm={submitOrderHandler}
        />
      ) : (modalActions)}
    </React.Fragment>
  );

  const isSubmittingModalContent = <p>Sending order data...</p>
  const didSubmitModalContent = <React.Fragment>
    <p>Successfully sent the order!</p>
    <div className={classes.actions}>
      <button className={classes.button} onClick={props.onClose}>
        Close
      </button>
    </div>
  </React.Fragment>

  return (
    <Modal onClose={props.onClose}>
      {!isLoading && !orderData && cartModalContent}
      {isLoading && isSubmittingModalContent}
      {!isLoading && orderData && didSubmitModalContent}
    </Modal>
  );
};

export default Cart;
