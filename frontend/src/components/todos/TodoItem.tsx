import type { Todo } from "../../types/todo";
import { HiOutlineArchive, HiOutlineTrash } from "react-icons/hi";

interface TodoItemProps {
  todo: Todo;
  onToggleDone: (id: number, isDone: boolean) => void;
  onArchive: (id: number) => void;
  onDeleteTodo: (id: number) => void;
  toggleArchived: boolean;
}

function TodoItem({
  todo,
  onToggleDone,
  onArchive,
  onDeleteTodo,
  toggleArchived,
}: TodoItemProps) {
  return (
    <li
      key={todo.id}
      className="flex items-center gap-3 rounded-lg border border-clay/40 bg-bone px-4 py-3 shadow-sm"
    >
      <input
        type="checkbox"
        checked={todo.isDone}
        onChange={() => onToggleDone(todo.id, !todo.isDone)}
        className="h-4 w-4 cursor-pointer accent-sage"
      ></input>
      <h3
        className={`flex-1 text-sm font-medium ${
          todo.isDone ? "text-clay line-through" : "text-ink"
        }`}
      >
        {todo.title}
      </h3>
      {todo.category && (
        <p className="rounded-full bg-tan px-2 py-0.5 text-xs font-medium text-ink">
          {todo.category}
        </p>
      )}
      <button
        aria-label={toggleArchived ? "Delete todo" : "Archive todo"}
        title={toggleArchived ? "Delete todo" : "Archive todo"}
        onClick={() =>
          toggleArchived ? onDeleteTodo(todo.id) : onArchive(todo.id)
        }
        className="rounded-md px-2 py-1 text-xs font-medium text-red-700 transition hover:bg-tan"
      >
        {toggleArchived ? (
          <HiOutlineTrash className="h-4 w-4" />
        ) : (
          <HiOutlineArchive className="h-4 w-4" />
        )}
      </button>
    </li>
  );
}

export default TodoItem;
