export interface Todo {
  id: number;
  title: string;
  isDone: boolean;
  isArchived: boolean;
  category: string | null;
}

export interface CreateTodoRequest {
  title: string;
  categoryId: number | null;
}
