import type { CreateTodoRequest, Todo, UpdateTodoRequest } from "../types/todo";
import { throwFromResponse } from "./api-error";

const BASE_URL = "http://localhost:8080/todos";

export const fetchTodos = async (): Promise<Todo[]> => {
  const res = await fetch(BASE_URL);
  if (!res.ok) await throwFromResponse(res, "Failed fetching todos");
  return res.json();
};

export const fetchArchivedTodos = async (): Promise<Todo[]> => {
  const res = await fetch(`${BASE_URL}/archived`);
  if (!res.ok) await throwFromResponse(res, "Failed fetching archived todos");
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
  if (!res.ok) await throwFromResponse(res, "Failed toggling done");
  return res.json();
};

export const createTodo = async (newTodo: CreateTodoRequest): Promise<Todo> => {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newTodo),
  });
  if (!res.ok) await throwFromResponse(res, "Failed to create todo");
  const todo: Todo = await res.json();
  return todo;
};

export const deleteTodo = async (id: number): Promise<void> => {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) await throwFromResponse(res, "Failed deleting todo");
};

export const archiveTodo = async (id: number): Promise<void> => {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ isArchived: true }),
  });
  if (!res.ok) await throwFromResponse(res, "Failed archiving todo");
};

export const updateTodo = async (
  id: number,
  data: UpdateTodoRequest,
): Promise<Todo> => {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) await throwFromResponse(res, "Failed to update todo");
  const todo: Todo = await res.json();
  return todo;
};
