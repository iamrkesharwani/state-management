import { createSlice, isPending, isRejected } from '@reduxjs/toolkit';
import type { ProductState } from './type.js';
import {
  addProductsToDb,
  deleteProductFromDb,
  fetchProducts,
  updateProductData,
} from './productThunk.js';

const initialState: ProductState = {
  products: [],
  status: 'idle',
  error: null,
};

export const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.products = action.payload;
      })
      .addCase(addProductsToDb.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.products.push(action.payload);
      })
      .addCase(updateProductData.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const index = state.products.findIndex(
          (p) => p._id === action.payload._id
        );
        if (index !== -1) state.products[index] = action.payload;
      })
      .addCase(deleteProductFromDb.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.products = state.products.filter((p) => p._id !== action.payload);
      })
      .addMatcher(isPending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addMatcher(isRejected, (state, action) => {
        state.status = 'failed';
        state.error = (action.payload as string) ?? action.error?.message;
      });
  },
});

export default productSlice.reducer;
