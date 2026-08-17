import { useEffect, useState } from "react";
import type { Category } from "../types/category";
import { getAllCategories } from "../services/category-services";
import type { CreateTodoRequest } from "../types/todo";

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
        </select>
        <button type="submit">Add task</button>
      </form>
    </div>
  );
}

export default TodoForm;
