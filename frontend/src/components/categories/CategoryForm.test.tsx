import { describe, expect, it, vi } from "vitest";
import CategoryForm, { type CategoryFormProps } from "./CategoryForm";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

function renderCategoryForm() {
  const props: CategoryFormProps = {
    createCategory: vi.fn(),
  };
  render(<CategoryForm {...props} />);
  return props;
}

describe("Categories form", () => {
  it("Should render", () => {
    renderCategoryForm();
    expect(
      screen.getByRole("form", { name: "create-category-form" }),
    ).toBeInTheDocument();
  });
  it("Should not submit if textbox is empty", async () => {
    const user = userEvent.setup();
    const props = renderCategoryForm();
    await user.type(screen.getByRole("textbox"), "{Enter}");
    expect(props.createCategory).not.toHaveBeenCalled();
    expect(
      screen.getByText("Please create a category first"),
    ).toBeInTheDocument();
  });
  it("Should submit when textbox isn't empty", async () => {
    const user = userEvent.setup();
    const props = renderCategoryForm();
    await user.type(screen.getByRole("textbox"), "Personal{Enter}");
    expect(props.createCategory).toHaveBeenCalledWith({ name: "Personal" });
  });
  it("Should have an empty input", async () => {
    renderCategoryForm();
    expect(screen.getByRole("textbox")).toHaveValue("");
  });
  it("Should update the value when user types", async () => {
    const user = userEvent.setup();
    renderCategoryForm();
    await user.type(screen.getByRole("textbox"), "Hello");
    expect(screen.getByRole("textbox")).toHaveValue("Hello");
  });
});
