import TodoList from "./components/todos/TodoList";
import TodoForm from "./components/todos/TodoForm";
import CategoryPanel from "./components/categories/CategoryPanel";
import CategoryForm from "./components/categories/CategoryForm";
import Header from "./components/Header";
import useCategories from "./hooks/useCategories";
import type { CreateCategoryRequest } from "./types/category";
import useTodos from "./hooks/useTodos";
import Modal from "./components/ui/Modal";

function App() {
  const todosDomain = useTodos();
  const categoriesDomain = useCategories();

  const {
    categories,
    createCategory,
    isModalOpen,
    closeModal,
    selectedFilter,
    error: categoriesError,
    isLoading: categoriesLoading,
  } = categoriesDomain;

  const {
    todos,
    archivedTodos,
    loadTodos,
    showArchive,
    isLoading: todosLoading,
    error: todosError,
    createTodo,
    toggleArchivedView,
    closeArchiveView,
  } = todosDomain;

  const visibleTodos =
    selectedFilter === null
      ? todos
      : todos.filter((t) => t.category === selectedFilter);

  const errorMessage = todosError ?? categoriesError ?? null;
  const isLoading = todosLoading || categoriesLoading;

  return (
    <div className="mx-auto my-2 flex min-h-dvh w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-clay/50 bg-tan/30 shadow-sm md:h-dvh md:flex-row">
      {/* Sidebar — pinned to top on mobile (sticky), left column on desktop */}
      <aside className="sticky top-0 z-10 w-full shrink-0 border-b border-clay/50 bg-bone/95 p-4 backdrop-blur md:static md:z-auto md:h-dvh md:w-72 md:overflow-y-auto md:border-b-0 md:border-r">
        <Header>
          <CategoryPanel
            categoriesDomain={categoriesDomain}
            onSelectFilter={(name) => {
              categoriesDomain.selectFilter(name);
              closeArchiveView();
            }}
            onUpdateCategory={async (
              id: number,
              data: CreateCategoryRequest
            ) => {
              const updated = await categoriesDomain.updateCategory(id, data);
              if (updated) loadTodos();
            }}
            toggleArchived={showArchive}
            onToggleArchived={toggleArchivedView}
          >
            <Modal
              isModalOpen={isModalOpen}
              onClose={closeModal}
              heading="New Category"
            >
              <CategoryForm createCategory={createCategory} />
            </Modal>
          </CategoryPanel>
        </Header>
      </aside>

      {/* Main — renders below the header on mobile, right column on desktop */}
      <main className="flex min-w-0 flex-1 flex-col gap-2 p-4 md:h-dvh md:overflow-y-auto">
        <TodoForm createTodo={createTodo} categories={categories} />

        {errorMessage && (
          <p className="rounded-md border border-red-700/30 bg-red-100 px-3 py-2 text-sm text-red-700">
            {errorMessage}
          </p>
        )}
        {!errorMessage && isLoading && (
          <p className="text-sm text-clay">Loading...</p>
        )}

        {todos.length === 0 && !todosLoading && !showArchive && (
          <p className="text-clay">No Todos to show yet</p>
        )}
        {!todosLoading &&
          (showArchive
            ? archivedTodos.length !== 0
            : todos.length !== 0) && (
            <TodoList todos={visibleTodos} todosDomain={todosDomain} />
          )}
      </main>
    </div>
  );
}

export default App;
