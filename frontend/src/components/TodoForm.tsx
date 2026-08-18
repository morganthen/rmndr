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
    <div>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="new task"
          onChange={(e) => setTodo(e.target.value)}
          value={todo}
        ></input>
        {error && <p>{error}</p>}
        {selectedCategory !== "__new__" && (
          <select
            name="category"
            id="category"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
            <option value="__new__">+ New Category</option>
          </select>
        )}
        <button type="submit" disabled={selectedCategory === "__new__"}>
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
