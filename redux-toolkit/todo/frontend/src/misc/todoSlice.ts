import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { TodoState, FilterStatus } from './types.js';
import {
  fetchTodos,
  addTodoAsync,
  toggleTodoAsync,
  editTodoAsync,
  deleteTodoAsync,
  clearCompletedAsync,
} from './todoThunks.js';

const initialState: TodoState = {
  items: [],
  filter: 'all',
  status: 'idle',
  error: null,
};

export const todoSlice = createSlice({
  name: 'todo',
  initialState,
  reducers: {
    setFilter: (state, action: PayloadAction<FilterStatus>) => {
      state.filter = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodos.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTodos.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchTodos.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch';
      })
      .addCase(addTodoAsync.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(toggleTodoAsync.fulfilled, (state, action) => {
        const todo = state.items.find((t) => t._id === action.payload._id);
        if (todo) {
          todo.completed = action.payload.completed;
        }
      })
      .addCase(editTodoAsync.fulfilled, (state, action) => {
        const todo = state.items.find((t) => t._id === action.payload._id);
        if (todo) {
          todo.title = action.payload.title;
        }
      })
      .addCase(deleteTodoAsync.fulfilled, (state, action) => {
        state.items = state.items.filter((t) => t._id !== action.payload);
      })
      .addCase(clearCompletedAsync.fulfilled, (state) => {
        state.items = state.items.filter((t) => !t.completed);
      });
  },
});

export const { setFilter } = todoSlice.actions;
export default todoSlice.reducer;
