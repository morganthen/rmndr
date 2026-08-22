import { useEffect, useState } from "react";
import type { CreateTodoRequest, Todo, UpdateTodoRequest } from "./types/todo";
import TodoList from "./components/todos/TodoList";
import TodoForm from "./components/todos/TodoForm";
import {
  archiveTodo,
  createTodo,
  deleteTodo,
  fetchArchivedTodos,
  fetchTodos,
  toggleDone,
  updateTodo,
} from "./services/todo-services";
import CategoryPanel from "./components/categories/CategoryPanel";

import CategoryForm from "./components/categories/CategoryForm";
import Header from "./components/Header";
import useCategories from "./hooks/useCategories";

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [archivedTodos, setArchivedTodos] = useState<Todo[]>([]);
  const [editingTodoId, setEditingTodoId] = useState<number | null>(null);
  const [toggleArchived, setToggleArchived] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const {
    categories,
    selectedFilter,
    createCategory,
    deleteCategory,
    updateCategory,
    selectFilter,
    editingCategory,
    toggleEditingCategory,
    isModalOpen,
    openModal,
    closeModal,
    error: categoriesError,
    isLoading: categoriesLoading,
    dialogRef,
  } = useCategories();

  const loadTodos = async () => {
    try {
      const result = await fetchTodos();
      setTodos(result);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong fetching todos",
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTodos();
  }, []);

  useEffect(() => {
    const loadArchivedTodos = async () => {
      try {
        const result = await fetchArchivedTodos();
        setArchivedTodos(result);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Something went wrong fetching archived todos",
        );
      } finally {
        setIsLoading(false);
      }
    };
    loadArchivedTodos();
  }, [toggleArchived]);

  const handleModalCancel = (e: React.SyntheticEvent) => {
    e.preventDefault();
    closeModal();
  };

  const handleToggleDone = async (id: number, isDone: boolean) => {
    try {
      setError(null);
      setIsLoading(true);
      const updated = await toggleDone(id, isDone);
      setTodos((prev) => prev.map((t) => (t.id === id ? updated : t)));
      setArchivedTodos((prev) => prev.map((t) => (t.id === id ? updated : t)));
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong marking done",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleEditTodo = (id: number) => {
    setEditingTodoId((prev) => (prev === id ? null : id));
  };

  const handleCreateTodo = async (data: CreateTodoRequest) => {
    try {
      setError(null);
      setIsLoading(true);
      const todo = await createTodo(data);
      setTodos((prev) => [...prev, todo]);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong when creating todo",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteTodo = async (id: number) => {
    try {
      setError(null);
      setIsLoading(true);
      await deleteTodo(id);
      setArchivedTodos((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong when deleting todo",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleArchiveTodo = async (id: number) => {
    try {
      setError(null);
      setIsLoading(true);
      await archiveTodo(id);
      setTodos((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong when archiving todo",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleArchived = () => {
    setError(null);
    setToggleArchived((prev) => !prev);
  };

  const handleUpdateTodo = async (id: number, data: UpdateTodoRequest) => {
    try {
      setError(null);
      setIsLoading(true);
      const todo = await updateTodo(id, data);
      setEditingTodoId(null);
      setTodos((prev) => prev.map((t) => (t.id === id ? todo : t)));
      setArchivedTodos((prev) => prev.map((t) => (t.id === id ? todo : t)));
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong when updating todo",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const visibleTodos =
    selectedFilter === null
      ? todos
      : todos.filter((t) => t.category === selectedFilter);

  return (
    <div className="mx-auto my-2 flex h-dvh w-full max-w-md flex-col items-center justify-center rounded-2xl border border-clay/50 bg-tan/30 px-2 shadow-sm sm:max-w-xl md:max-w-2xl md:px-4 lg:max-w-3xl">
      <Header>
        <CategoryPanel
          categories={categories}
          selectedFilter={selectedFilter}
          toggleArchived={toggleArchived}
          onDeleteCategory={deleteCategory}
          onSelectFilter={(name) => {
            selectFilter(name);
            setToggleArchived(false);
          }}
          onToggleArchived={handleToggleArchived}
          onOpenModal={openModal}
          onUpdateCategory={async (id, data) => {
            const updated = await updateCategory(id, data);
            if (updated) loadTodos();
          }}
          onToggleEditCategory={toggleEditingCategory}
          editCategory={editingCategory}
        >
          {isModalOpen && (
            <dialog
              ref={dialogRef}
              onCancel={handleModalCancel}
              onClose={closeModal}
              className="relative m-auto flex min-h-64 w-full max-w-sm flex-col justify-center rounded-2xl border border-clay/50 bg-bone p-4 shadow-lg backdrop:bg-ink/50 backdrop:backdrop-blur-sm"
            >
              <button
                aria-label="Close"
                onClick={closeModal}
                className="absolute right-3 top-3 rounded-full p-1.5 text-clay transition-all  hover:bg-tan hover:text-ink"
              >
                x
              </button>
              <h2 className="mb-3 pr-6 text-sm font-semibold uppercase tracking-wide text-ink">
                New category
              </h2>
              <CategoryForm handleCreateCategory={createCategory} />
            </dialog>
          )}
        </CategoryPanel>
      </Header>
      <TodoForm createTodo={handleCreateTodo} categories={categories} />
      {isLoading && <p className="text-clay">Loading...</p>}
      {categoriesLoading && <p className="text-clay">Loading...</p>}
      {error && <p className="text-red-700">{error}</p>}
      {categoriesError && <p className="text-red-700">{categoriesError}</p>}
      {todos.length === 0 && !isLoading && !toggleArchived && (
        <p className="text-clay">No Todos to show yet</p>
      )}
      {!isLoading &&
        (toggleArchived ? archivedTodos.length !== 0 : todos.length !== 0) && (
          <TodoList
            todos={visibleTodos}
            onToggleDone={handleToggleDone}
            onArchive={handleArchiveTodo}
            archivedTodos={archivedTodos}
            onDeleteTodo={handleDeleteTodo}
            toggleArchived={toggleArchived}
            onUpdateTodo={handleUpdateTodo}
            onToggleEdit={handleToggleEditTodo}
            editingTodoId={editingTodoId}
          />
        )}
    </div>
  );
}

export default App;
