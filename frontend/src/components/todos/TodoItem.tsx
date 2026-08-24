import { MdOutlineEdit } from "react-icons/md";
import type { Todo, UpdateTodoRequest } from "../../types/todo";
import { HiOutlineArchive, HiOutlineTrash } from "react-icons/hi";
import { useRef, useState } from "react";

export interface TodoItemProps {
  todo: Todo;
  onToggleDone: (id: number, isDone: boolean) => void;
  onArchive: (id: number) => void;
  onDeleteTodo: (id: number) => void;
  toggleArchived: boolean;
  onUpdateTodo: (id: number, data: UpdateTodoRequest) => void;
  onToggleEdit: (id: number) => void;
  editingTodoId: number | null;
}

function TodoItem({
  todo,
  onToggleDone,
  onArchive,
  onDeleteTodo,
  toggleArchived,
  onUpdateTodo,
  onToggleEdit,
  editingTodoId,
}: TodoItemProps) {
  const [updatedTodoTitle, setUpdatedTodoTitle] = useState<string>("");

  const cancelledRef = useRef(false);

  const handleBlur = () => {
    if (cancelledRef.current) {
      cancelledRef.current = false;
      return;
    }
    if (updatedTodoTitle.trim() === "" || updatedTodoTitle === todo.title) {
      onToggleEdit(todo.id);
      return;
    }
    onUpdateTodo(todo.id, { title: updatedTodoTitle });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (updatedTodoTitle.trim() === "" || updatedTodoTitle === todo.title) {
        onToggleEdit(todo.id);
        return;
      }
      e.currentTarget.blur(); // blur is the ONLY commit trigger
    } else if (e.key === "Escape") {
      cancelledRef.current = true;
      if (updatedTodoTitle.trim() === "" || updatedTodoTitle === todo.title)
        cancelledRef.current = true;
      onToggleEdit(todo.id); // exit edit mode without saving
    }
  };

  return (
    <li
      key={todo.id}
      className="group flex items-center gap-3 rounded-lg border border-clay/40 bg-bone px-4 py-3 shadow-sm"
    >
      <input
        type="checkbox"
        checked={todo.isDone}
        onChange={() => onToggleDone(todo.id, !todo.isDone)}
        className="h-4 w-4 cursor-pointer accent-sage"
      ></input>
      {editingTodoId !== todo.id ? (
        <h3
          className={`flex-1 text-sm font-medium ${
            todo.isDone ? "text-clay line-through" : "text-ink"
          }`}
        >
          {todo.title}
        </h3>
      ) : (
        <input
          role="textbox"
          className="flex-1"
          placeholder={todo.title}
          value={updatedTodoTitle}
          onChange={(e) => setUpdatedTodoTitle(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          autoFocus
        ></input>
      )}

      {todo.category && (
        <p className="rounded-full bg-tan px-1 py-0.5 text-xs font-medium text-ink">
          {todo.category}
        </p>
      )}
      <button
        aria-label="Edit todo"
        className="rounded-md px-1 py-1 text-clay transition hover:bg-tan hover:text-ink"
        onClick={() => {
          setUpdatedTodoTitle(todo.title);
          onToggleEdit(todo.id);
          cancelledRef.current = false;
        }}
      >
        <MdOutlineEdit className="h-4 w-4" />
      </button>
      <button
        aria-label={toggleArchived ? "Delete todo" : "Archive todo"}
        title={toggleArchived ? "Delete todo" : "Archive todo"}
        onClick={() =>
          toggleArchived ? onDeleteTodo(todo.id) : onArchive(todo.id)
        }
        className="rounded-md px-1 py-1 text-xs font-medium text-red-700 transition hover:bg-tan"
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
