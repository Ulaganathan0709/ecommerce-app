
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchProducts = createAsyncThunk('products/fetchProducts', async () => {
  const response = await fetch('/products.json'); // Correct path
  const data = await response.json();
  return data.products;
});

const productSlice = createSlice({
  name: 'products',
  initialState: {
    products: [],
    status: null,
  },
  reducers: {
    updateProductStock: (state, action) => {
      const { id, quantity } = action.payload;
      const product = state.products.find((item) => item.id === id);
      if (product) {
        product.stock -= quantity;
        if (product.stock < 0) product.stock = 0; // Prevent negative stock
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.products = action.payload;
        state.status = 'success';
      })
      .addCase(fetchProducts.rejected, (state) => {
        state.status = 'failed';
      });
  },
});

export const { updateProductStock } = productSlice.actions;
export default productSlice.reducer;