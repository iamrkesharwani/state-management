import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as api from '../services/api.js';

export const useTasks = (status?: string) => {
  const queryClient = useQueryClient();
  const queryKey = ['tasks', status];

  const query = useQuery({
    queryKey,
    queryFn: () => api.fetchTasks(status),
  });

  const createMutation = useMutation({
    mutationFn: api.createTasks,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  const toggleMutation = useMutation({
    mutationFn: api.toggleTask,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey });
      const previousTasks = queryClient.getQueryData(queryKey);

      queryClient.setQueryData(queryKey, (old: any) =>
        old?.map((t: any) =>
          t.id === id
            ? { ...t, status: t.status === 'PENDING' ? 'COMPLETED' : 'PENDING' }
            : t
        )
      );

      return { previousTasks };
    },
    onError: (_err, _id, context) => {
      queryClient.setQueryData(queryKey, context?.previousTasks);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      api.updateTask(id, data),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey });
      const previousTasks = queryClient.getQueryData(queryKey);

      queryClient.setQueryData(queryKey, (old: any) =>
        old.map((t: any) => (t.id === id ? { ...t, ...data } : t))
      );
      return { previousTasks };
    },
    onError: (_err, _vars, context) => {
      queryClient.setQueryData(queryKey, context?.previousTasks);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey }),
  });

  const deleteMutation = useMutation({
    mutationFn: api.deleteTask,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey });
      const previousTasks = queryClient.getQueryData(queryKey);
      queryClient.setQueryData(queryKey, (old: any) =>
        old?.filter((t: any) => t.id !== id)
      );
      return { previousTasks };
    },
    onError: (_err, _id, context) =>
      queryClient.setQueryData(queryKey, context?.previousTasks),
    onSettled: () => queryClient.invalidateQueries({ queryKey }),
  });

  return {
    tasks: query.data,
    isLoading: query.isLoading,
    createTask: createMutation.mutate,
    updateTask: updateMutation.mutate,
    toggleTask: toggleMutation.mutate,
    deleteTask: deleteMutation.mutate,
  };
};
