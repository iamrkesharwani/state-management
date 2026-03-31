import { useSelector, useDispatch } from 'react-redux';
import type { AppDispatch, RootState } from '../app/store';
import {
  deleteTodoAsync,
  toggleTodoAsync,
  editTodoAsync,
} from '../misc/todoThunks';

const TodoList = () => {
  const { items, filter } = useSelector((state: RootState) => state.todo);
  const dispatch = useDispatch<AppDispatch>();

  const filteredItems = items.filter((item) => {
    if (filter === 'active') return !item.completed;
    if (filter === 'completed') return item.completed;
    return true;
  });

  return (
    <ul className="space-y-3">
      {filteredItems.map((todo) => (
        <li
          key={todo._id}
          className="flex items-center justify-between border-b pb-2 group"
        >
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() =>
                dispatch(
                  toggleTodoAsync({ _id: todo._id, completed: todo.completed })
                )
              }
              className="w-5 h-5 rounded cursor-pointer"
            />
            <span
              className={`text-gray-800 ${todo.completed ? 'line-through text-gray-400' : ''}`}
            >
              {todo.title}
            </span>
          </div>
          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => {
                const newTitle = prompt('Edit:', todo.title);
                if (newTitle)
                  dispatch(editTodoAsync({ _id: todo._id, title: newTitle }));
              }}
              className="text-xs text-gray-500 border border-gray-300 px-2 py-1 rounded hover:bg-gray-100"
            >
              Edit
            </button>
            <button
              onClick={() => dispatch(deleteTodoAsync(todo._id))}
              className="text-xs text-red-500 border border-red-300 px-2 py-1 rounded hover:bg-red-50"
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default TodoList;
