import { createSlice, isPending, isRejected } from '@reduxjs/toolkit';
import type { CartState } from './type.js';
import {
  fetchCart,
  addToCart,
  decrementFromCart,
  removeCartItem,
  clearCart,
} from './cartThunk.js';

const initialState: CartState = {
  items: [],
  status: 'idle',
  error: null,
};

const cartThunks = [
  fetchCart,
  addToCart,
  decrementFromCart,
  removeCartItem,
  clearCart,
] as const;

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const index = state.items.findIndex(
          (item) => item.productId === action.payload.productId
        );
        if (index !== -1) {
          state.items[index] = action.payload;
        } else {
          state.items.push(action.payload);
        }
      })
      .addCase(decrementFromCart.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const item = state.items.find((i) => i.productId === action.payload);
        if (item) {
          if (item.quantity > 1) {
            item.quantity -= 1;
          } else {
            state.items = state.items.filter(
              (i) => i.productId !== action.payload
            );
          }
        }
      })
      .addCase(removeCartItem.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = state.items.filter((i) => i.productId !== action.payload);
      })
      .addCase(clearCart.fulfilled, (state) => {
        state.status = 'succeeded';
        state.items = [];
      })
      .addMatcher(isPending(...cartThunks), (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addMatcher(isRejected(...cartThunks), (state, action) => {
        state.status = 'failed';
        state.error = (action.payload as string) ?? action.error?.message;
      });
  },
});

export default cartSlice.reducer;
