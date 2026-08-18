import type { Todo } from "../../types/todo";
import TodoItem from "./TodoItem";

interface TodoListProps {
  todos: Todo[];
  onToggleDone: (id: number, isDone: boolean) => void;
  onDelete: (id: number) => void;
}

function TodoList({ todos, onToggleDone, onDelete }: TodoListProps) {
  return (
    <div>
      <ul className="space-y-2">
        {todos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggleDone={onToggleDone}
            onDelete={onDelete}
          />
        ))}
      </ul>
    </div>
  );
}

export default TodoList;
