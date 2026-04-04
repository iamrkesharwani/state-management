import { createSlice, isPending, isRejected } from '@reduxjs/toolkit';
import type { ProductState } from '../../app/type.js';
import {
  addProductsToDb,
  deleteProductFromDb,
  fetchProducts,
  updateProductData,
} from './productThunk.js';
import { addToCart, decrementFromCart } from '../cart/cartThunk.js';

const initialState: ProductState = {
  products: [],
  status: 'idle',
  error: null,
};

const productThunks = [
  fetchProducts,
  addProductsToDb,
  updateProductData,
  deleteProductFromDb,
] as const;

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
      .addCase(addToCart.fulfilled, (state, action) => {
        const product = state.products.find(
          (p) => p._id === action.payload.productId
        );
        if (product) {
          product.stock -= 1;
        }
      })
      .addCase(decrementFromCart.fulfilled, (state, action) => {
        const product = state.products.find((p) => p._id === action.payload);
        if (product) {
          product.stock += 1;
        }
      })
      .addMatcher(isPending(...productThunks), (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addMatcher(isRejected(...productThunks), (state, action) => {
        state.status = 'failed';
        state.error = (action.payload as string) ?? action.error?.message;
      });
  },
});

export default productSlice.reducer;
