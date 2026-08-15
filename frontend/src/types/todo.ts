export interface Todo {
  id: number;
  title: string;
  isDone: boolean;
  isArchived: boolean;
  category: string | null;
}
