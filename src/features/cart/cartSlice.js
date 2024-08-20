import { createSlice } from '@reduxjs/toolkit';
import productsData from '../../data/products.json'; // Ensure correct path

// Extract the products array from productsData
const products = productsData.products;

const initialState = {
  items: [], // Cart items will be stored here
  subtotal: 0,
  discount: 0,
  total: 0,
  discountCode: '', // Store applied discount code
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const product = products.find(item => item.id === action.payload.id);
      if (!product) {
        throw new Error('Product not found in data.');
      }
      const cartItem = state.items.find(item => item.id === product.id);
      if (cartItem) {
        if (cartItem.quantity < product.stock) {
          cartItem.quantity += 1;
          state.subtotal += cartItem.price;
        } else {
          alert(`Cannot add more than available stock for ${product.title}.`);
        }
      } else {
        state.items.push({ ...product, quantity: 1 });
        state.subtotal += product.price;
      }
      // Recalculate totals
      state.total = state.subtotal - state.discount;
    },
    removeFromCart: (state, action) => {
      const cartItem = state.items.find(item => item.id === action.payload);
      if (cartItem) {
        state.subtotal -= cartItem.price * cartItem.quantity;
        state.items = state.items.filter(item => item.id !== action.payload);
        // Recalculate totals
        state.total = state.subtotal - state.discount;
      }
    },
    increaseQuantity: (state, action) => {
      const cartItem = state.items.find(item => item.id === action.payload);
      if (cartItem) {
        const product = products.find(item => item.id === cartItem.id);
        if (cartItem.quantity < product.stock) {
          cartItem.quantity += 1;
          state.subtotal += cartItem.price;
        } else {
          alert(`Cannot add more than available stock for ${product.title}.`);
        }
        // Recalculate totals
        state.total = state.subtotal - state.discount;
      }
    },
    decreaseQuantity: (state, action) => {
      const cartItem = state.items.find(item => item.id === action.payload);
      if (cartItem && cartItem.quantity > 1) {
        cartItem.quantity -= 1;
        state.subtotal -= cartItem.price;
        // Recalculate totals
        state.total = state.subtotal - state.discount;
      }
    },
    applyCoupon: (state, action) => {
      state.discountCode = action.payload;
      if (action.payload === 'DISCOUNT10') {
        state.discount = state.subtotal * 0.1;
      } else {
        state.discount = 0;
      }
      // Recalculate totals
      state.total = state.subtotal - state.discount;
    },
    calculateDiscount: (state) => {
      state.subtotal = state.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
      state.total = state.subtotal - state.discount;
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
  applyCoupon,
  calculateDiscount,
} = cartSlice.actions;

export default cartSlice.reducer;
