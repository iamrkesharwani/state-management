import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/axios';
import { isAxiosError } from 'axios';
import type { IProduct, ICreateProduct, IUpdateProduct } from './type';

export const fetchProducts = createAsyncThunk<
  IProduct[],
  void,
  { rejectValue: string }
>('products/fetchProducts', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get<IProduct[]>('/');
    return data;
  } catch (error) {
    if (isAxiosError(error)) {
      return rejectWithValue(
        error.response?.data?.message ||
          'An error occurred while fetching products'
      );
    }
    return rejectWithValue('An unexpected error occurred');
  }
});

export const addProductsToDb = createAsyncThunk<
  IProduct,
  ICreateProduct,
  { rejectValue: string }
>('products/addProductsToDb', async (newProduct, { rejectWithValue }) => {
  try {
    const { data } = await api.post<IProduct>('/add-product', newProduct);
    return data;
  } catch (error) {
    if (isAxiosError(error)) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to add product'
      );
    }
    return rejectWithValue('An unexpected error occurred');
  }
});

export const updateProductData = createAsyncThunk<
  IProduct,
  IUpdateProduct,
  { rejectValue: string }
>(
  'products/updateProductData',
  async ({ _id, ...fields }, { rejectWithValue }) => {
    try {
      const { data } = await api.put<IProduct>(`/${_id}`, fields);
      return data;
    } catch (error) {
      if (isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.message || 'Update failed'
        );
      }
      return rejectWithValue('An unexpected error occurred');
    }
  }
);

export const deleteProductFromDb = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>('products/deleteProductFromDb', async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/${id}`);
    return id;
  } catch (error) {
    if (isAxiosError(error)) {
      return rejectWithValue(error.response?.data?.message || 'Delete failed');
    }
    return rejectWithValue('An unexpected error occurred');
  }
});
