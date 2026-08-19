import type { CreateTodoRequest, Todo } from "../types/todo";

const BASE_URL = "http://localhost:8080/todos";

export const fetchTodos = async (): Promise<Todo[]> => {
  const res = await fetch(BASE_URL);
  if (!res.ok) throw new Error("Failed fetching todos");
  return res.json();
};

export const fetchArchivedTodos = async (): Promise<Todo[]> => {
  const res = await fetch(`${BASE_URL}/archived`);
  if (!res.ok) throw new Error("Failed fetching archived todos");
  return res.json();
};

export const toggleDone = async (
  id: number,
  isDone: boolean,
): Promise<Todo> => {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ isDone }),
  });
  if (!res.ok) throw new Error("Toggle failed");
  return res.json();
};

export const createTodo = async (newTodo: CreateTodoRequest): Promise<Todo> => {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newTodo),
  });
  if (!res.ok) throw new Error("Create todo failed");
  const todo: Todo = await res.json();
  return todo;
};

export const deleteTodo = async (id: number): Promise<void> => {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Deleting todo failed");
};

export const archiveTodo = async (id: number): Promise<void> => {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ isArchived: true }),
  });
  if (!res.ok) throw new Error("Archiving todo failed");
};
