import { useEffect, useRef, useState } from "react";
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
import type { Category, CreateCategoryRequest } from "./types/category";
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  updateCategory,
} from "./services/category-services";
import CategoryForm from "./components/categories/CategoryForm";
import Header from "./components/Header";

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [archivedTodos, setArchivedTodos] = useState<Todo[]>([]);
  const [editingTodoId, setEditingTodoId] = useState<number | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const [toggleArchived, setToggleArchived] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [toggleCreateCategoryModal, setToggleCreateCategoryModal] =
    useState<boolean>(false);
  const [toggleEditCategory, setToggleEditCategory] = useState<number | null>(
    null,
  );
  const dialogRef = useRef<HTMLDialogElement>(null);

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

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (toggleCreateCategoryModal && !dialog.open) {
      dialog.showModal();
    } else if (!toggleCreateCategoryModal && dialog.open) {
      dialog.close();
    }
  }, [toggleCreateCategoryModal]);

  const handleModalCancel = (e: React.SyntheticEvent) => {
    e.preventDefault();
    setToggleCreateCategoryModal(false);
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

  const handleToggleEditCategory = (id: number) => {
    setToggleEditCategory((prev) => (prev === id ? null : id));
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

  const handleCreateCategory = async (data: CreateCategoryRequest) => {
    try {
      setError(null);
      setIsLoading(true);
      const { id, name } = await createCategory(data);
      setCategories((prev) => [...prev, { id, name }]);
      setToggleCreateCategoryModal(false);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong when creating category",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetSelectedFilter = (name: string | null) => {
    setError(null);
    setToggleArchived(false);
    setSelectedFilter(name);
  };

  const handleDeleteCategory = async (id: number) => {
    try {
      setError(null);
      setIsLoading(true);
      await deleteCategory(id);
      setCategories((prev) => prev.filter((c) => c.id !== id));
      if (categories.find((c) => c.id === id)?.name === selectedFilter) {
        setSelectedFilter(null);
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong when deleting category",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleArchived = () => {
    setError(null);
    setToggleArchived((prev) => !prev);
  };

  const handleUpdateCategory = async (
    id: number,
    data: CreateCategoryRequest,
  ) => {
    try {
      setError(null);
      setIsLoading(true);
      await updateCategory(id, data);
      if (categories.find((c) => c.id === id)?.name === selectedFilter) {
        setSelectedFilter(data.name);
      }
      setCategories((prev) =>
        prev.map((c) => (c.id === id ? { ...c, name: data.name } : c)),
      );
      setToggleEditCategory(null);
      loadTodos();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong when updating category",
      );
    } finally {
      setIsLoading(false);
    }
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

  useEffect(() => {
    const handleGetCategories = async () => {
      try {
        setError(null);
        const res = await getAllCategories();
        setCategories(res);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Some problem occured");
      } finally {
        setIsLoading(false);
      }
    };

    handleGetCategories();
  }, []);

  const handleOpenModal = () => {
    setToggleCreateCategoryModal((prev) => !prev);
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
          onDeleteCategory={handleDeleteCategory}
          onSelectFilter={handleSetSelectedFilter}
          onToggleArchived={handleToggleArchived}
          onOpenModal={handleOpenModal}
          onUpdateCategory={handleUpdateCategory}
          onToggleEditCategory={handleToggleEditCategory}
          editCategory={toggleEditCategory}
        >
          {toggleCreateCategoryModal && (
            <dialog
              ref={dialogRef}
              onCancel={handleModalCancel}
              onClose={() => setToggleCreateCategoryModal(false)}
              className="relative m-auto flex min-h-64 w-full max-w-sm flex-col justify-center rounded-2xl border border-clay/50 bg-bone p-4 shadow-lg backdrop:bg-ink/50 backdrop:backdrop-blur-sm"
            >
              <button
                aria-label="Close"
                onClick={() => setToggleCreateCategoryModal(false)}
                className="absolute right-3 top-3 rounded-full p-1.5 text-clay transition-all  hover:bg-tan hover:text-ink"
              >
                x
              </button>
              <h2 className="mb-3 pr-6 text-sm font-semibold uppercase tracking-wide text-ink">
                New category
              </h2>
              <CategoryForm handleCreateCategory={handleCreateCategory} />
            </dialog>
          )}
        </CategoryPanel>
      </Header>
      <TodoForm createTodo={handleCreateTodo} categories={categories} />
      {isLoading && <p className="text-clay">Loading...</p>}
      {error && <p className="text-red-700">{error}</p>}
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
