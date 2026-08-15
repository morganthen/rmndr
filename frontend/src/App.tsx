import { useEffect, useState } from "react";
import type { Todo } from "./types/todo";
import TodoList from "./components/TodoList";
import TodoForm from "./components/TodoForm";
import { fetchTodos, toggleDone } from "./services/todo-services";

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
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
      const updated = await toggleDone(id, isDone);
      setTodos((prev) => prev.map((t) => (t.id === id ? updated : t)));
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong marking done",
      );
    }
  };

  const handleCreateTodo = async (title: string) => {
    try {
      const res = await fetch("http://localhost:8080/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      });
      if (!res.ok) throw new Error("Create todo failed");
      const newTodo: Todo = await res.json();
      setTodos((prev) => [...prev, newTodo]);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong when creating todo",
      );
    }
  };

  const handleDeleteTodo = async (id: number) => {
    try {
      const res = await fetch(`http://localhost:8080/todos/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Deleting todo failed");
      setTodos((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong when deleting todo",
      );
    }
  };

  return (
    <div>
      <h1 className="text-4xl font-bold text-blue-600">To Dos</h1>
      <TodoForm createTodo={handleCreateTodo} />
      <TodoList
        todos={todos}
        onToggleDone={handleToggleDone}
        onDelete={handleDeleteTodo}
      />
    </div>
  );
}

export default App;
