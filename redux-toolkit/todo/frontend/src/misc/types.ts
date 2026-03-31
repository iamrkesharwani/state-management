export interface Todo {
  _id: string;
  title: string;
  completed: boolean;
  createdAt: string;
}

export type FilterStatus = 'all' | 'active' | 'completed';

export interface TodoState {
  items: Todo[];
  filter: FilterStatus;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}
