import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/axios';
import type {
  Product,
  UpdateProductInput,
  CreateProductInput,
  DeleteProductInput,
} from './types';

export const fetchProducts = createAsyncThunk<Product[]>(
  'product/fetchProducts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<Product[]>('/products');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Fetch failed');
    }
  }
);

export const addProducts = createAsyncThunk<Product, CreateProductInput>(
  'product/addProducts',
  async (product, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/products', { product });
      return data as Product;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Add failed');
    }
  }
);

export const editProduct = createAsyncThunk<Product, UpdateProductInput>(
  'product/editProduct',
  async (product) => {
    const { data } = await api.put(`/products/${product.id}`, product);
    return data;
  }
);

export const deleteProduct = createAsyncThunk<Product, DeleteProductInput>(
  'product/deleteProduct',
  async ({ id }, { rejectWithValue }) => {
    try {
      await api.delete(`/products/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Delete failed');
    }
  }
);
