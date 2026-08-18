import { useEffect, useState } from "react";
import type { Category, CreateCategoryRequest } from "../types/category";
import {
  createCategory,
  getAllCategories,
} from "../services/category-services";
import type { CreateTodoRequest } from "../types/todo";
import CategoryForm from "./CategoryForm";

interface TodoFormProps {
  createTodo: (data: CreateTodoRequest) => void;
}

function TodoForm({ createTodo }: TodoFormProps) {
  const [todo, setTodo] = useState<string>("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
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

  const handleCreateCategory = async (data: CreateCategoryRequest) => {
    try {
      setError(null);
      setIsLoading(true);
      const { id, name } = await createCategory(data);

      setCategories((prev) => [...prev, { id, name }]);
      setSelectedCategory(String(id));
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong when creating category",
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const handleGetCategories = async () => {
      try {
        setError(null);
        const res = await getAllCategories();
        setCategories(res);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Some problem occured");
      } finally {
        setIsLoading(false);
      }
    };

    handleGetCategories();
  }, []);

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
        {selectedCategory !== "__new__" && (
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
            <option value="__new__">+ New Category</option>
          </select>
        )}
        <button
          type="submit"
          disabled={selectedCategory === "__new__"}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Add task
        </button>
      </form>
      {selectedCategory === "__new__" && (
        <CategoryForm
          setSelectedCategory={setSelectedCategory}
          handleCreateCategory={handleCreateCategory}
        />
      )}
    </div>
  );
}

export default TodoForm;
