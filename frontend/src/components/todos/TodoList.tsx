import type { Todo } from "../../types/todo";
import TodoItem from "./TodoItem";

interface TodoListProps {
  todos: Todo[];
  onToggleDone: (id: number, isDone: boolean) => void;
  onArchive: (id: number) => void;
  archivedTodos: Todo[];
  onDeleteTodo: (id: number) => void;
  toggleArchived: boolean;
}

function TodoList({
  todos,
  onToggleDone,
  onArchive,
  archivedTodos,
  onDeleteTodo,
  toggleArchived,
}: TodoListProps) {
  const todosBasedOnArchive = toggleArchived ? archivedTodos : todos;

  return (
    <div className="w-full">
      <ul className="space-y-2">
        {todosBasedOnArchive.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggleDone={onToggleDone}
            onArchive={onArchive}
            toggleArchived={toggleArchived}
            onDeleteTodo={onDeleteTodo}
          />
        ))}
      </ul>
    </div>
  );
}

export default TodoList;
