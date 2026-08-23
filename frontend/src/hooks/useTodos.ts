import { useCallback, useEffect, useState } from "react";
import {
  createTodo as createTodoRequest,
  fetchTodos,
  toggleDone as toggleDoneRequest,
  updateTodo as updateTodoRequest,
  archiveTodo as archiveTodoRequest,
  fetchArchivedTodos,
  deleteTodo as deleteTodoRequest,
} from "../services/todo-services";
import type {
  CreateTodoRequest,
  Todo,
  UpdateTodoRequest,
  UseTodosResult,
} from "../types/todo";

function useTodos(): UseTodosResult {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [archivedTodos, setArchivedTodos] = useState<Todo[]>([]);
  const [editingTodoId, setEditingTodoId] = useState<number | null>(null);
  const [showArchive, setShowArchive] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadTodos = useCallback(async () => {
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
  }, []);

  const toggleDone = async (id: number, isDone: boolean) => {
    try {
      setError(null);
      setIsLoading(true);
      const updated = await toggleDoneRequest(id, isDone);
      setTodos((prev) => prev.map((t) => (t.id === id ? updated : t)));
      setArchivedTodos((prev) => prev.map((t) => (t.id === id ? updated : t)));
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

  const toggleEdit = (id: number) => {
    setEditingTodoId((prev) => (prev === id ? null : id));
  };

  const createTodo = async (data: CreateTodoRequest) => {
    try {
      setError(null);
      setIsLoading(true);
      const todo = await createTodoRequest(data);
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

  const deleteTodo = async (id: number) => {
    try {
      setError(null);
      setIsLoading(true);
      await deleteTodoRequest(id);
      setArchivedTodos((prev) => prev.filter((t) => t.id !== id));
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

  const updateTodo = async (id: number, data: UpdateTodoRequest) => {
    try {
      setError(null);
      setIsLoading(true);
      const todo = await updateTodoRequest(id, data);
      setEditingTodoId(null);
      setTodos((prev) => prev.map((t) => (t.id === id ? todo : t)));
      setArchivedTodos((prev) => prev.map((t) => (t.id === id ? todo : t)));
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong when updating todo",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const archiveTodo = async (id: number) => {
    try {
      setError(null);
      setIsLoading(true);
      await archiveTodoRequest(id);
      setTodos((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong when archiving todo",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const toggleArchivedView = () => {
    setError(null);
    setShowArchive((prev) => !prev);
  };

  const loadArchivedTodos = useCallback(async () => {
    try {
      const result = await fetchArchivedTodos();
      setArchivedTodos(result);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong fetching archived todos",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  const closeArchiveView = () => setShowArchive(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- async fetch on mount, not synchronous cascading setState
    loadTodos();
  }, [loadTodos]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- async fetch on mount, not synchronous cascading setState
    loadArchivedTodos();
  }, [showArchive, loadArchivedTodos]);

  return {
    todos,
    archivedTodos,
    loadTodos,
    editingTodoId,
    showArchive,
    isLoading,
    error,
    toggleDone,
    toggleEdit,
    createTodo,
    deleteTodo,
    updateTodo,
    archiveTodo,
    toggleArchivedView,
    loadArchivedTodos,
    closeArchiveView,
  };
}

export default useTodos;
