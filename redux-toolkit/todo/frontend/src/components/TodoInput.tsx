import { useDispatch } from 'react-redux';
import { addTodoAsync } from '../misc/todoThunks';
import React, { useState } from 'react';
import type { AppDispatch } from '../app/store';

const TodoInput = () => {
  const [text, setText] = useState<string>('');
  const dispatch = useDispatch<AppDispatch>();

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (text.trim()) {
      dispatch(addTodoAsync(text));
      setText('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
      <input
        type="text"
        value={text}
        placeholder="What's happening?"
        onChange={(e) => setText(e.target.value)}
        className="border p-2 flex-grow rounded border-gray-300 focus:outline-none focus:border-blue-500"
      />
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded font-medium hover:bg-blue-700 transition-colors"
      >
        Add
      </button>
    </form>
  );
};

export default TodoInput;
