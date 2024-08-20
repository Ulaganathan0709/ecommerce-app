import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Thunk to fetch products
export const fetchProducts = createAsyncThunk('products/fetchProducts', async () => {
  const response = await fetch('/products.json'); // Correct path for fetching from the public directory
  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }
  const data = await response.json();
  return data.products;
});

const initialState = {
  items: [], // Cart items will be stored here
  products: [], // Available products
  subtotal: 0,
  discount: 0,
  total: 0,
  discountCode: '', // Store applied discount code
  status: 'idle', // Status of product fetching
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      if (state.products.length === 0) {
        throw new Error('Products have not been loaded yet.');
      }

      const product = state.products.find(item => item.id === action.payload.id);
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
        const product = state.products.find(item => item.id === cartItem.id);
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
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.products = action.payload;
        state.status = 'succeeded';
      })
      .addCase(fetchProducts.rejected, (state) => {
        state.status = 'failed';
      });
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
