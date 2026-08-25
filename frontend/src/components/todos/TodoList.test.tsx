import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import TodoList, { type TodoListProps } from "./TodoList";
import type { Todo, UseTodosResult } from "../../types/todo";

function makeTodo(overrides: Partial<Todo> = {}): Todo {
  return {
    id: 1,
    title: "Buy milk",
    isDone: false,
    isArchived: false,
    category: null,
    ...overrides,
  };
}

function makeTodosDomain(
  overrides: Partial<UseTodosResult> = {},
): UseTodosResult {
  return {
    todos: [],
    archivedTodos: [],
    loadTodos: vi.fn(),
    editingTodoId: null,
    showArchive: false,
    isLoading: false,
    error: null,
    toggleDone: vi.fn(),
    toggleEdit: vi.fn(),
    createTodo: vi.fn(),
    deleteTodo: vi.fn(),
    updateTodo: vi.fn(),
    archiveTodo: vi.fn(),
    toggleArchivedView: vi.fn(),
    loadArchivedTodos: vi.fn(),
    closeArchiveView: vi.fn(),
    ...overrides,
  };
}

function renderTodoList(overrides: Partial<TodoListProps> = {}) {
  const props: TodoListProps = {
    todos: [makeTodo()],
    todosDomain: makeTodosDomain(),
    ...overrides,
  };
  render(<TodoList {...props} />);
  return props;
}

describe("Todo List", () => {
  it("Should render each active todo's title", async () => {
    renderTodoList({
      todos: [makeTodo(), makeTodo({ id: 2, title: "Call mum" })],
    });
    expect(screen.getByText("Buy milk")).toBeInTheDocument();
    expect(screen.getByText("Call mum")).toBeInTheDocument();
  });

  it("renders archived todos when showArchive is true", () => {
    renderTodoList({
      todos: [makeTodo({ title: "Active thing" })],
      todosDomain: makeTodosDomain({
        showArchive: true,
        archivedTodos: [makeTodo({ title: "Old thing" })],
      }),
    });
    expect(screen.getByText("Old thing")).toBeInTheDocument();
    expect(screen.queryByText("Active thing")).not.toBeInTheDocument();
  });
  it("renders normal view when showArchive is false", () => {
    renderTodoList({
      todos: [makeTodo({ title: "Active thing" })],
      todosDomain: makeTodosDomain({
        showArchive: false,
        archivedTodos: [makeTodo({ title: "Old thing" })],
      }),
    });
    expect(screen.queryByText("Old thing")).not.toBeInTheDocument();
    expect(screen.getByText("Active thing")).toBeInTheDocument();
  });

  it("Renders nothing when no todos are present", () => {
    renderTodoList({
      todos: [],
    });
    expect(screen.queryByText("Buy milk")).not.toBeInTheDocument();
  });

  it("Render one item per todo", () => {
    renderTodoList({
      todos: [
        makeTodo(),
        makeTodo({
          id: 2,
          title: "Make music",
        }),
        makeTodo({
          id: 3,
          title: "Refactor code",
        }),
      ],
    });
    expect(screen.getByText("Buy milk")).toBeInTheDocument();
    expect(screen.getByText("Make music")).toBeInTheDocument();
    expect(screen.getByText("Refactor code")).toBeInTheDocument();
  });
});
