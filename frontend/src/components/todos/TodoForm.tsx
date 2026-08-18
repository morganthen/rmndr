import { useState } from "react";
import type { Category } from "../../types/category";
import type { CreateTodoRequest } from "../../types/todo";

interface TodoFormProps {
  createTodo: (data: CreateTodoRequest) => void;
  categories: Category[];
}

function TodoForm({ createTodo, categories }: TodoFormProps) {
  const [todo, setTodo] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    if (todo.length === 0) {
      setError("Please create a todo");
      return;
    }
    const newTodo: CreateTodoRequest = {
      title: todo,
      categoryId: selectedCategory === "" ? null : Number(selectedCategory),
    };
    createTodo(newTodo);
    setTodo("");
  };

  return (
    <div className="border-slate-300 border-2 w-full my-4 rounded-lg">
      <form onSubmit={handleSubmit} className="flex gap-2 p-3">
        <input
          placeholder="Create a new task..."
          onChange={(e) => setTodo(e.target.value)}
          value={todo}
          className="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        ></input>
        {error && <p className="w-full text-sm text-red-600">{error}</p>}
        <select
          name="category"
          id="category"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Add task
        </button>
      </form>
    </div>
  );
}

export default TodoForm;
