import type { Todo } from "../types/todo";

const BASE_URL = "http://localhost:8080/todos";

export const fetchTodos = async (): Promise<Todo[]> => {
  const res = await fetch(`${BASE_URL}`);
  if (!res.ok) throw new Error("Response not okay");
  return res.json();
};

export const toggleDone = async (id: number, isDone: boolean) => {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ isDone }),
  });
  if (!res.ok) throw new Error("Toggle failed");
  return res.json();
};
