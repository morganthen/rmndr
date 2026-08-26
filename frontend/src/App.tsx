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

  return (
    <div className="mx-auto my-2 flex h-dvh w-full max-w-md flex-col items-center justify-center rounded-2xl border border-clay/50 bg-tan/30 px-2 shadow-sm sm:max-w-xl md:max-w-2xl md:px-4 lg:max-w-3xl">
      <Header>
        <CategoryPanel
          categoriesDomain={categoriesDomain}
          onSelectFilter={(name) => {
            categoriesDomain.selectFilter(name);
            closeArchiveView();
          }}
          onUpdateCategory={async (id: number, data: CreateCategoryRequest) => {
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
      <TodoForm createTodo={createTodo} categories={categories} />
      {todosLoading && <p className="text-clay">Loading...</p>}
      {categoriesLoading && <p className="text-clay">Loading...</p>}
      {todosError && <p className="text-red-700">{todosError}</p>}
      {categoriesError && <p className="text-red-700">{categoriesError}</p>}
      {todos.length === 0 && !todosLoading && !showArchive && (
        <p className="text-clay">No Todos to show yet</p>
      )}
      {!todosLoading &&
        (showArchive ? archivedTodos.length !== 0 : todos.length !== 0) && (
          <TodoList todos={visibleTodos} todosDomain={todosDomain} />
        )}
    </div>
  );
}

export default App;
