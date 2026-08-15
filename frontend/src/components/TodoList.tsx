import type { Todo } from "../types/todo";

interface TodoListProps {
  todos: Todo[];
  onToggleDone: (id: number, isDone: boolean) => void;
  onDelete: (id: number) => void;
}

function TodoList({ todos, onToggleDone, onDelete }: TodoListProps) {
  return (
    <div>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            <h3 className={todo.isDone ? "line-through" : ""}>{todo.title}</h3>
            <input
              type="checkbox"
              checked={todo.isDone}
              onChange={() => onToggleDone(todo.id, !todo.isDone)}
            ></input>
            <p>{todo.category}</p>
            <button onClick={() => onDelete(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TodoList;
