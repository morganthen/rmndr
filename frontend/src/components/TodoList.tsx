import type { Todo } from "../types/todo";
import TodoItem from "./todos/TodoItem";

interface TodoListProps {
  todos: Todo[];
  onToggleDone: (id: number, isDone: boolean) => void;
  onArchive: (id: number) => void;
}

function TodoList({ todos, onToggleDone, onArchive }: TodoListProps) {
  return (
    <div>
      <ul className="space-y-2">
        {todos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggleDone={onToggleDone}
            onArchive={onArchive}
          />
        ))}
      </ul>
    </div>
  );
}

export default TodoList;
