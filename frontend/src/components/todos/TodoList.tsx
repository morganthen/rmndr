import type { Todo, UseTodosResult } from "../../types/todo";
import TodoItem from "./TodoItem";

interface TodoListProps {
  todos: Todo[];
  todosDomain: UseTodosResult;
}

function TodoList({ todos, todosDomain }: TodoListProps) {
  const {
    archivedTodos,
    showArchive,
    editingTodoId,
    toggleDone,
    toggleEdit,
    deleteTodo,
    updateTodo,
    archiveTodo,
  } = todosDomain;
  const todosBasedOnArchive = showArchive ? archivedTodos : todos;

  return (
    <div className="w-full">
      <ul className="space-y-2">
        {todosBasedOnArchive.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggleDone={toggleDone}
            onArchive={archiveTodo}
            toggleArchived={showArchive}
            onDeleteTodo={deleteTodo}
            onUpdateTodo={updateTodo}
            onToggleEdit={toggleEdit}
            editingTodoId={editingTodoId}
          />
        ))}
      </ul>
    </div>
  );
}

export default TodoList;
