import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { ProductState } from './types';
import { fetchProducts } from './cartThunk';

const initialState: ProductState = {
  products: [],
  status: 'idle',
  error: null,
};

export const cartSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch';
      });
  },
});

export default cartSlice.reducer;
