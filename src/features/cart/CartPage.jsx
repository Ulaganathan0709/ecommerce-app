import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { increaseQuantity, decreaseQuantity, removeFromCart, applyCoupon } from './cartSlice';
import { updateProductStock } from '../products/productSlice'; // Ensure this action is defined
import './CartPage.css';

const CartPage = () => {
  const cartItems = useSelector((state) => state.cart.items);
  const subtotal = useSelector((state) => state.cart.subtotal);
  const discount = useSelector((state) => state.cart.discount);
  const total = useSelector((state) => state.cart.total);
  const discountCode = useSelector((state) => state.cart.discountCode);
  const [couponCode, setCouponCode] = useState('');
  const dispatch = useDispatch();

  const handleApplyCoupon = () => {
    dispatch(applyCoupon(couponCode));
  };

  const handleBuyNow = () => {
    let purchaseSuccessful = true;

    cartItems.forEach((item) => {
      if (item.quantity > item.stock) {
        alert(`Not enough stock for ${item.title}. Available stock: ${item.stock}`);
        purchaseSuccessful = false;
      }
    });

    if (purchaseSuccessful) {
      cartItems.forEach((item) => {
        dispatch(updateProductStock({ id: item.id, quantity: item.quantity }));
        dispatch(removeFromCart(item.id));
      });
      alert('Purchase successful! Thank you for your order.');
    }
  };

  return (
    <div className="cart-page">
      <div className="cart-items">
        <h1>Your Cart</h1>
        {cartItems.length > 0 ? (
          cartItems.map((item) => (
            <div key={item.id} className="cart-item">
              <img src={item.thumbnail} alt={item.title} />
              <div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <p>Price per item: ${item.price}</p>
                <p>Total Price: ${(item.price * item.quantity).toFixed(2)}</p>
                <p>Quantity: {item.quantity}</p>
                <p>Available Stock: {item.stock}</p>
                <button
                  onClick={() => dispatch(increaseQuantity(item.id))}
                  disabled={item.quantity >= item.stock}
                >
                  +
                </button>
                <button onClick={() => dispatch(decreaseQuantity(item.id))}>-</button>
                <button onClick={() => dispatch(removeFromCart(item.id))}>Remove</button>
              </div>
            </div>
          ))
        ) : (
          <p>Your cart is empty</p>
        )}
      </div>

      <div className="cart-summary">
        <h2>Order Summary</h2>
        <p>Subtotal: ${subtotal.toFixed(2)}</p>
        <p>Discount: -${discount.toFixed(2)} {discountCode && `(Code: ${discountCode})`}</p>
        <h3>Total: ${total.toFixed(2)}</h3>

        <input
          type="text"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value)}
          placeholder="Enter coupon code"
        />
        <button onClick={handleApplyCoupon}>Apply Coupon</button>
        <br />
        <button onClick={handleBuyNow} className="buy-now-btn">Buy Now</button>
      </div>
    </div>
  );
};

export default CartPage;
