import { describe, expect, it, vi } from "vitest";
import CategoryPanel, { type CategoryPanelProps } from "./CategoryPanel";
import type { Category, UseCategoriesResult } from "../../types/category";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

function makeCategory(overrides: Partial<Category> = {}): Category {
  return {
    id: 1,
    name: "Uncategorized",
    ...overrides,
  };
}

function makeCategoriesDomain(
  overrides: Partial<UseCategoriesResult> = {},
): UseCategoriesResult {
  return {
    categories: [makeCategory()],
    selectedFilter: null,
    createCategory: vi.fn(),
    deleteCategory: vi.fn(),
    updateCategory: vi.fn(),
    selectFilter: vi.fn(),
    editingCategory: null,
    toggleEditingCategory: vi.fn(),
    isModalOpen: false,
    openModal: vi.fn(),
    closeModal: vi.fn(),
    error: null,
    isLoading: false,
    dialogRef: { current: null },
    ...overrides,
  };
}

function renderCategoryPanel(overrides: Partial<CategoryPanelProps> = {}) {
  const props: CategoryPanelProps = {
    children: <div />,
    categoriesDomain: makeCategoriesDomain(),
    onSelectFilter: vi.fn(),
    onUpdateCategory: vi.fn(),
    toggleArchived: false,
    onToggleArchived: vi.fn(),
    ...overrides,
  };
  render(<CategoryPanel {...props} />);
  return props;
}

describe("Category panel", () => {
  it("Should render", () => {
    renderCategoryPanel();
    expect(screen.getByText("All")).toBeInTheDocument();
    expect(screen.getByText("Uncategorized")).toBeInTheDocument();
    expect(screen.getByText("Archived")).toBeInTheDocument();
  });

  it("Should render non-default categories", () => {
    renderCategoryPanel({
      categoriesDomain: makeCategoriesDomain({
        categories: [
          makeCategory(),
          { id: 2, name: "Music" },
          { id: 3, name: "Personal" },
        ],
      }),
    });
    expect(screen.getByText("All")).toBeInTheDocument();
    expect(screen.getByText("Uncategorized")).toBeInTheDocument();
    expect(screen.getByText("Music")).toBeInTheDocument();
    expect(screen.getByText("Personal")).toBeInTheDocument();
    expect(screen.getByText("Archived")).toBeInTheDocument();
  });

  it("Should NOT have an edit or delete button given just Uncategorized", () => {
    renderCategoryPanel();
    expect(
      screen.queryByRole("button", { name: /delete category uncategorized/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /edit category uncategorized/i }),
    ).not.toBeInTheDocument();
  });

  it("Should have the activeClass applied when selectedFilter is not null", () => {
    renderCategoryPanel({
      categoriesDomain: makeCategoriesDomain({
        categories: [
          makeCategory(),
          makeCategory({
            id: 2,
            name: "Work",
          }),
        ],
        selectedFilter: "Work",
      }),
    });
    expect(screen.getByRole("button", { name: "Work" })).toHaveClass(
      "bg-sage font-medium text-bone",
    );
  });

  it("Should fire deleteCategory on non-Uncategorized category", async () => {
    const user = userEvent.setup();
    const props = renderCategoryPanel({
      categoriesDomain: makeCategoriesDomain({
        categories: [
          makeCategory(),
          makeCategory({
            id: 2,
            name: "Work",
          }),
        ],
        selectedFilter: "Work",
      }),
    });
    const deleteButton = screen.getByRole("button", {
      name: /delete category work/i,
    });
    await user.click(deleteButton);
    expect(props.categoriesDomain.deleteCategory).toHaveBeenCalled();
  });

  it("Should render an input with prefilled category name when in edit mode", async () => {
    renderCategoryPanel({
      categoriesDomain: makeCategoriesDomain({
        categories: [makeCategory(), makeCategory({ id: 2, name: "Work" })],
        editingCategory: 2,
      }),
    });

    expect(screen.queryByRole("textbox")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Work")).toBeInTheDocument();
  });
});
