import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';
import { isAxiosError } from 'axios';
import type { ICartItem, AddToCartInput } from '../../app/type';

export const fetchCart = createAsyncThunk<
  ICartItem[],
  void,
  { rejectValue: string }
>('cart/fetchCart', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get<ICartItem[]>('/cart');
    return data;
  } catch (error) {
    if (isAxiosError(error)) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch cart'
      );
    }
    return rejectWithValue('An unexpected error occurred');
  }
});

export const addToCart = createAsyncThunk<
  ICartItem,
  AddToCartInput,
  { rejectValue: string }
>('cart/addToCart', async (newItem, { rejectWithValue }) => {
  try {
    const { data } = await api.post<ICartItem>('/cart', newItem);
    return data;
  } catch (error) {
    if (isAxiosError(error)) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to add to cart'
      );
    }
    return rejectWithValue('An unexpected error occurred');
  }
});

export const decrementFromCart = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>('cart/decrementFromCart', async (productId, { rejectWithValue }) => {
  try {
    await api.patch(`/cart/${productId}/decrement`);
    return productId;
  } catch (error) {
    if (isAxiosError(error)) {
      return rejectWithValue(
        error.response?.data?.message || 'Decrement failed'
      );
    }
    return rejectWithValue('An unexpected error occurred');
  }
});

export const removeCartItem = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>('cart/removeCartItem', async (productId, { rejectWithValue }) => {
  try {
    await api.delete(`/cart/${productId}`);
    return productId;
  } catch (error) {
    if (isAxiosError(error)) {
      return rejectWithValue(error.response?.data?.message || 'Remove failed');
    }
    return rejectWithValue('An unexpected error occurred');
  }
});

export const clearCart = createAsyncThunk<void, void, { rejectValue: string }>(
  'cart/clearCart',
  async (_, { rejectWithValue }) => {
    try {
      await api.delete('/cart/clear');
    } catch (error) {
      if (isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || 'Clear failed');
      }
      return rejectWithValue('An unexpected error occurred');
    }
  }
);
