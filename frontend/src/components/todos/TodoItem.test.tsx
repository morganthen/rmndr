import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import TodoItem, { type TodoItemProps } from "./TodoItem";
import type { Todo } from "../../types/todo";

function makeTodo(overrides: Partial<Todo> = {}) {
  return {
    id: 1,
    title: "Buy milk",
    isDone: false,
    isArchived: false,
    category: null,
    ...overrides,
  };
}

function renderTodo(overrides: Partial<TodoItemProps> = {}) {
  const props: TodoItemProps = {
    todo: makeTodo(),
    onToggleDone: vi.fn(),
    onArchive: vi.fn(),
    onDeleteTodo: vi.fn(),
    toggleArchived: false,
    onUpdateTodo: vi.fn(),
    onToggleEdit: vi.fn(),
    editingTodoId: null,
    ...overrides,
  };

  render(<TodoItem {...props} />);
  return props;
}

describe("Todo Item", () => {
  it("Should render", () => {
    renderTodo();
    expect(screen.getByText("Buy milk")).toBeInTheDocument();
  });

  it("Calls onToggleDone when checkbox is checked", async () => {
    const user = userEvent.setup();
    const props = renderTodo();
    await user.click(screen.getByRole("checkbox"));
    expect(props.onToggleDone).toHaveBeenCalledWith(1, true);
  });

  it("Shows Delete instead of Archive in archived view", async () => {
    renderTodo({ toggleArchived: true });
    expect(
      screen.getByRole("button", { name: /delete todo/i }),
    ).toBeInTheDocument();
  });

  it("Commits the new title on Enter", async () => {
    const user = userEvent.setup();
    const props = renderTodo({ editingTodoId: 1 });
    await user.click(screen.getByRole("button", { name: /edit todo/i }));
    await user.clear(screen.getByRole("textbox"));
    await user.type(screen.getByRole("textbox"), "Oat milk{Enter}");
    expect(props.onUpdateTodo).toHaveBeenCalledWith(1, { title: "Oat milk" });
  });

  it("Enters edit mode when the edit button is clicked", async () => {
    const user = userEvent.setup();
    const props = renderTodo();
    await user.click(screen.getByRole("button", { name: /edit todo/i }));
    expect(props.onToggleEdit).toHaveBeenCalledWith(1);
  });

  it("Calls onDeleteTodo with the id when in the archived view", async () => {
    const user = userEvent.setup();
    const props = renderTodo({ toggleArchived: true });
    await user.click(screen.getByRole("button", { name: /delete todo/i }));
    expect(props.onDeleteTodo).toHaveBeenCalledWith(1);
  });

  it("Applies strikethrough when the todo is done", () => {
    renderTodo({ todo: makeTodo({ isDone: true }) });
    expect(screen.getByText("Buy milk")).toHaveClass("line-through");
  });

  it("Calls onArchive with the id in the normal view", async () => {
    const user = userEvent.setup();
    const props = renderTodo();
    await user.click(screen.getByRole("button", { name: /archive todo/i }));
    expect(props.onArchive).toHaveBeenCalledWith(1);
  });

  it("Checks the box for a completed todo", () => {
    renderTodo({ todo: makeTodo({ isDone: true }) });
    expect(screen.getByRole("checkbox")).toBeChecked();
  });

  it("Renders the category badge when present", () => {
    renderTodo({ todo: makeTodo({ category: "Groceries" }) });
    expect(screen.getByText("Groceries")).toBeInTheDocument();
  });

  it("Renders 'Uncategorized' as the default badge", () => {
    renderTodo({ todo: makeTodo({ category: "Uncategorized" }) });
    expect(screen.getByText("Uncategorized")).toBeInTheDocument();
  });

  it("Does not save when Escape is pressed", async () => {
    const user = userEvent.setup();
    const props = renderTodo({ editingTodoId: 1 });
    await user.type(screen.getByRole("textbox"), "Oat milk{Escape}");
    expect(props.onUpdateTodo).not.toHaveBeenCalled();
    expect(props.onToggleEdit).toHaveBeenCalledWith(1);
  });

  it("Does not save an unchanged or blank title", async () => {
    const user = userEvent.setup();
    const props = renderTodo({ editingTodoId: 1 });
    await user.type(screen.getByRole("textbox"), "{Enter}");
    expect(props.onUpdateTodo).not.toHaveBeenCalled();
  });
});
