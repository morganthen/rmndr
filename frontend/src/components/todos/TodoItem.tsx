import type { Todo } from "../../types/todo";

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
      className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-sm"
    >
      <input
        type="checkbox"
        checked={todo.isDone}
        onChange={() => onToggleDone(todo.id, !todo.isDone)}
        className="h-4 w-4 cursor-pointer accent-blue-600"
      ></input>
      <h3
        className={`flex-1 text-sm font-medium ${
          todo.isDone ? "text-gray-400 line-through" : "text-gray-800"
        }`}
      >
        {todo.title}
      </h3>
      {todo.category && (
        <p className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
          {todo.category}
        </p>
      )}
      <button
        onClick={() =>
          toggleArchived ? onDeleteTodo(todo.id) : onArchive(todo.id)
        }
        className="rounded-md px-2 py-1 text-xs font-medium text-red-600 transition hover:bg-red-50"
      >
        {toggleArchived ? "Delete" : "Archive"}
      </button>
    </li>
  );
}

export default TodoItem;
