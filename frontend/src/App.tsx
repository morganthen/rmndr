import { useEffect, useState } from "react";
import type { CreateTodoRequest, Todo } from "./types/todo";
import TodoList from "./components/todos/TodoList";
import TodoForm from "./components/todos/TodoForm";
import {
  createTodo,
  deleteTodo,
  fetchTodos,
  toggleDone,
} from "./services/todo-services";
import CategoryPanel from "./components/categories/CategoryPanel";
import type { Category, CreateCategoryRequest } from "./types/category";
import {
  createCategory,
  deleteCategory,
  getAllCategories,
} from "./services/category-services";
import CategoryForm from "./components/categories/CategoryForm";

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const result = await fetchTodos();
        setTodos(result);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Something went wrong fetching todos",
        );
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const handleToggleDone = async (id: number, isDone: boolean) => {
    try {
      setError(null);
      setIsLoading(true);
      const updated = await toggleDone(id, isDone);
      setTodos((prev) => prev.map((t) => (t.id === id ? updated : t)));
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong marking done",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateTodo = async (data: CreateTodoRequest) => {
    try {
      setError(null);
      setIsLoading(true);
      const todo = await createTodo(data);
      setTodos((prev) => [...prev, todo]);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong when creating todo",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteTodo = async (id: number) => {
    try {
      setError(null);
      setIsLoading(true);
      await deleteTodo(id);
      setTodos((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong when deleting todo",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateCategory = async (data: CreateCategoryRequest) => {
    try {
      setError(null);
      setIsLoading(true);
      const { id, name } = await createCategory(data);

      setCategories((prev) => [...prev, { id, name }]);
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

  // const handleFilterTodos = (category: string) => {
  //   const filtered = todos.filter((t) => t.category === category);
  //   console.log(filtered);
  //   setFilteredTodos(filtered);
  // };

  const visibleTodos =
    selectedFilter === null
      ? todos
      : todos.filter((t) => t.category === selectedFilter);

  const handleDeleteCategory = async (id: number) => {
    try {
      setError(null);
      setIsLoading(true);
      await deleteCategory(id);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong when deleting category",
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
    <div className="h-dvh flex flex-col items-center justify-center border-2 border-solid mx-2 my-2">
      <h1 className="text-4xl font-bold text-blue-600">RMNDR</h1>
      <CategoryPanel
        categories={categories}
        onDeleteCategory={handleDeleteCategory}
        onSelectFilter={setSelectedFilter}
      >
        <CategoryForm handleCreateCategory={handleCreateCategory} />
      </CategoryPanel>
      <TodoForm createTodo={handleCreateTodo} categories={categories} />
      {isLoading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      {todos.length === 0 && !isLoading && <p>No Todos to show yet</p>}
      {!isLoading && todos.length !== 0 && (
        <TodoList
          todos={visibleTodos}
          onToggleDone={handleToggleDone}
          onDelete={handleDeleteTodo}
        />
      )}
    </div>
  );
}

export default App;
