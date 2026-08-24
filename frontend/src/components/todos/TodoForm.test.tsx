import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { TodoFormProps } from "./TodoForm";
import type { Category } from "../../types/category";
import TodoForm from "./TodoForm";
import userEvent from "@testing-library/user-event";

function makeCategories(): Category[] {
  return [
    {
      id: 1,
      name: "Uncategorized",
    },
    { id: 2, name: "Work" },
    {
      id: 3,
      name: "Personal",
    },
  ];
}

function renderTodoForm() {
  const props: TodoFormProps = {
    createTodo: vi.fn(),
    categories: makeCategories(),
  };

  render(<TodoForm {...props} />);
  return props;
}

function setup() {
  const user = userEvent.setup();
  const props = renderTodoForm();
  return { user, props };
}

describe("Todo Form", () => {
  it("Should render", () => {
    renderTodoForm();
    expect(screen.getByRole("form")).toBeInTheDocument();
  });

  it("Submits a todo with null categoryId when Uncategorized is selected", async () => {
    const { user, props } = setup();

    await user.type(
      screen.getByPlaceholderText("Create a new task..."),
      "Buy milk",
    );
    await user.click(screen.getByRole("button", { name: /add task/i }));
    expect(props.createTodo).toHaveBeenCalledWith({
      title: "Buy milk",
      categoryId: null,
    });
  });

  it("Submits with the selected category's id", async () => {
    const { user, props } = setup();
    await user.type(
      screen.getByPlaceholderText("Create a new task..."),
      "Write music",
    );
    await user.selectOptions(screen.getByRole("combobox"), "2");
    await user.click(screen.getByRole("button", { name: /add task/i }));
    expect(props.createTodo).toHaveBeenCalledWith({
      title: "Write music",
      categoryId: 2,
    });
  });

  it("Shows an error and does not submit on empty input", async () => {
    const { user, props } = setup();
    await user.type(screen.getByRole("textbox"), "{Enter}");
    expect(props.createTodo).not.toHaveBeenCalled();
    expect(screen.getByText("Please create a todo")).toBeInTheDocument();
  });

  it("Should clear the input upon a successful submit", async () => {
    const { user } = setup();
    const input = screen.getByPlaceholderText("Create a new task...");
    await user.type(input, "Buy milk");
    await user.click(screen.getByRole("button", { name: /add task/i }));
    expect(input).toHaveValue("");
  });
});
