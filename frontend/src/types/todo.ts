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

export interface UpdateTodoRequest {
  title?: string;
  isDone?: boolean;
  isArchived?: boolean;
  categoryId?: number | null;
}

export interface UseTodosResult {
  todos: Todo[];
  archivedTodos: Todo[];
  loadTodos: () => Promise<void>;
  editingTodoId: number | null;
  showArchive: boolean;
  isLoading: boolean;
  error: string | null;
  toggleDone: (id: number, isDone: boolean) => Promise<void>;
  toggleEdit: (id: number) => void;
  createTodo: (data: CreateTodoRequest) => Promise<void>;
  deleteTodo: (id: number) => Promise<void>;
  updateTodo: (id: number, data: UpdateTodoRequest) => Promise<void>;
  archiveTodo: (id: number) => Promise<void>;
  toggleArchivedView: () => void;
  loadArchivedTodos: () => Promise<void>;
  closeArchiveView: () => void;
}
