import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:4000/api',
});

export const fetchTasks = async (status?: string) => {
  const { data } = await api.get('/tasks', {
    params: { status },
  });
  return data;
};

export const createTasks = async (task: {
  title: string;
  description?: string;
}) => {
  const { data } = await api.post('/tasks', task);
  return data;
};

export const updateTask = async (
  id: string,
  task: { title: string; description?: string }
) => {
  const { data } = await api.patch(`/tasks/${id}`, task);
  return data;
};

export const toggleTask = async (id: string) => {
  const { data } = await api.patch(`/tasks/${id}/toggle`);
  return data;
};

export const deleteTask = async (id: string) => {
  await api.delete(`/tasks/${id}`);
};
