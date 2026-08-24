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
});
