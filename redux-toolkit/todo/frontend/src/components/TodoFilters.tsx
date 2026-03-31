import { useSelector, useDispatch } from 'react-redux';
import type { AppDispatch, RootState } from '../app/store';
import { setFilter } from '../misc/todoSlice';
import { clearCompletedAsync } from '../misc/todoThunks';

const TodoFilters = () => {
  const currentFilter = useSelector((state: RootState) => state.todo.filter);
  const dispatch = useDispatch<AppDispatch>();

  const filterOptions = ['all', 'active', 'completed'] as const;

  return (
    <div className="flex items-center justify-between mt-6 p-3 border-t bg-gray-50 rounded text-sm text-gray-600">
      <div className="flex gap-3">
        {filterOptions.map((f) => (
          <button
            onClick={() => dispatch(setFilter(f))}
            className={`capitalize hover:text-blue-600 transition-colors ${currentFilter === f ? 'font-bold text-blue-600' : ''}`}
          >
            {f}
          </button>
        ))}
      </div>
      <button
        onClick={() => dispatch(clearCompletedAsync())}
        className="hover:text-red-600 transition-colors"
      >
        Clear Completed
      </button>
    </div>
  );
};

export default TodoFilters;
