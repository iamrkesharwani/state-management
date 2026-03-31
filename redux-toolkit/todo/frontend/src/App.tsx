import { useDispatch, useSelector } from 'react-redux';
import TodoFilters from './components/TodoFilters';
import TodoInput from './components/TodoInput';
import TodoList from './components/TodoList';
import type { AppDispatch, RootState } from './app/store';
import { useEffect } from 'react';
import { fetchTodos } from './misc/todoThunks';

const App = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { status, error } = useSelector((state: RootState) => state.todo);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchTodos());
    }
  }, [status, dispatch]);

  if (status === 'loading')
    return <div className="text-center mt-10">Loading tasks...</div>;
  if (status === 'failed')
    return <div className="text-center mt-10 text-red-500">Error: {error}</div>;

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-md mx-auto shadow-lg rounded-xl bg-white p-8 border border-gray-100">
        <h1 className="text-3xl font-bold mb-8 text-center text-gray-900 tracking-tight">
          Todo List
        </h1>
        <TodoInput />
        <TodoList />
        <TodoFilters />
      </div>
    </div>
  );
};

export default App;
