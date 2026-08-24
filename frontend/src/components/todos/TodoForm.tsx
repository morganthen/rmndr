import { useState } from "react";
import type { CreateTodoRequest } from "../../types/todo";
import type { Category } from "../../types/category";

export interface TodoFormProps {
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
    <div className="my-4 w-full rounded-lg border border-clay/50 bg-bone/60">
      <form
        aria-label="form"
        onSubmit={handleSubmit}
        className="flex flex-wrap gap-2 p-3"
      >
        <input
          placeholder="Create a new task..."
          onChange={(e) => setTodo(e.target.value)}
          value={todo}
          className="min-w-[200px] flex-1 rounded-lg border border-clay/60 bg-bone px-3 py-2 text-sm placeholder:text-clay focus:outline-none focus:ring-2 focus:ring-sage/60"
        ></input>
        <select
          name="category"
          id="category"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="rounded-lg border border-clay/60 bg-bone px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sage/60"
        >
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="rounded-lg bg-sage px-4 py-2 text-sm font-medium text-bone transition hover:bg-ink disabled:cursor-not-allowed disabled:opacity-50"
        >
          Add task
        </button>
        <p className="h-5 w-full text-sm text-red-700">{error}</p>
      </form>
    </div>
  );
}

export default TodoForm;
