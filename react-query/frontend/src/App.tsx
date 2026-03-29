import { useState } from 'react';
import { useTasks } from './hooks/useTasks';

const App = () => {
  const [filter, setFilter] = useState<string | undefined>(undefined);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const { tasks, isLoading, createTask, updateTask, deleteTask, toggleTask } =
    useTasks(filter);

  const startEditing = (id: string, currentTitle: string) => {
    setEditingId(id);
    setEditValue(currentTitle);
  };

  const handleUpdate = (id: string) => {
    if (editValue.trim()) {
      updateTask({ id, data: { title: editValue } });
    }
    setEditingId(null);
  };

  const handleCreate = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    createTask({ title: newTaskTitle });
    setNewTaskTitle('');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <p className="text-stone-400 font-serif text-lg">Loading tasks…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 font-serif py-12 px-4">
      <div className="max-w-lg mx-auto">
        <h1 className="text-3xl font-bold text-stone-800 tracking-tight mb-8">
          Task Manager
        </h1>

        {/* Add task */}
        <div className="bg-white rounded-xl shadow-sm border border-stone-100 p-4 mb-4">
          <form onSubmit={handleCreate} className="flex gap-2">
            <input
              type="text"
              placeholder="What needs to be done?"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              className="flex-1 px-3 py-2 rounded-lg border border-stone-200 bg-stone-50 text-stone-800 text-sm placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-300"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-stone-800 text-white rounded-lg text-sm font-semibold hover:bg-stone-700 transition-colors whitespace-nowrap"
            >
              + Add
            </button>
          </form>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs text-stone-400">Show:</span>
          <select
            value={filter || ''}
            onChange={(e) => setFilter(e.target.value || undefined)}
            className="px-2 py-1 text-xs border border-stone-200 rounded-md bg-stone-50 text-stone-700 focus:outline-none cursor-pointer"
          >
            <option value="">All Tasks</option>
            <option value="PENDING">Pending</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>

        {/* Task list */}
        <div className="bg-white rounded-xl shadow-sm border border-stone-100 p-4">
          {!tasks?.length ? (
            <p className="text-center text-stone-300 text-sm py-4">
              No tasks yet — add one above.
            </p>
          ) : (
            <ul className="flex flex-col gap-1">
              {tasks.map((task: any) => (
                <li
                  key={task.id}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-stone-50 border border-stone-100 group"
                >
                  <input
                    type="checkbox"
                    checked={task.status === 'COMPLETED'}
                    onChange={() => toggleTask(task.id)}
                    className="w-4 h-4 cursor-pointer accent-stone-700 shrink-0"
                  />

                  {editingId === task.id ? (
                    <input
                      type="text"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onBlur={() => handleUpdate(task.id)}
                      onKeyDown={(e) =>
                        e.key === 'Enter' && handleUpdate(task.id)
                      }
                      className="flex-1 px-2 py-0.5 text-sm border border-stone-300 rounded-md bg-white text-stone-800 focus:outline-none focus:ring-2 focus:ring-stone-300"
                      autoFocus
                    />
                  ) : (
                    <span
                      onDoubleClick={() => startEditing(task.id, task.title)}
                      title="Double-click to edit"
                      className={`flex-1 text-sm select-none cursor-text ${
                        task.status === 'COMPLETED'
                          ? 'line-through text-stone-300'
                          : 'text-stone-700'
                      }`}
                    >
                      {task.title}
                    </span>
                  )}

                  <button
                    onClick={() => deleteTask(task.id)}
                    className="text-xs px-2 py-1 rounded-md border border-stone-200 text-stone-300 opacity-0 group-hover:opacity-100 hover:text-red-400 hover:border-red-300 transition-all"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
