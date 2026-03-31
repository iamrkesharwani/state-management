import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/axios';
import type { Todo } from './types';

export const fetchTodos = createAsyncThunk('todo/fetchTodos', async () => {
  const { data } = await api.get('/todos');
  return data as Todo[];
});

export const addTodoAsync = createAsyncThunk(
  'todo/addTodoAsync',
  async (title: string) => {
    const { data } = await api.post('/todos', { title });
    return data as Todo;
  }
);

export const toggleTodoAsync = createAsyncThunk(
  'todo/toggleTodoAsync',
  async (todo: { _id: string; completed: boolean }) => {
    await api.put(`/todos/${todo._id}`, { completed: !todo.completed });
    return { _id: todo._id, completed: !todo.completed };
  }
);

export const editTodoAsync = createAsyncThunk(
  'todo/editTodoAsync',
  async (payload: { _id: string; title: string }) => {
    await api.patch(`/todos/${payload._id}`, { title: payload.title });
    return payload;
  }
);

export const deleteTodoAsync = createAsyncThunk(
  'todo/deleteTodoAsync',
  async (_id: string) => {
    await api.delete(`/todos/${_id}`);
    return _id;
  }
);

export const clearCompletedAsync = createAsyncThunk(
  'todo/clearCompletedAsync',
  async () => {
    await api.delete('/todos/completed');
    return;
  }
);
