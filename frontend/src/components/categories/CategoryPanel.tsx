import type { ReactNode } from "react";
import type { Category } from "../../types/category";

interface CategoryPanel {
  children: ReactNode;
  categories: Category[];
  onDeleteCategory: (id: number) => void;
  onSelectFilter: (name: string) => void;
}

function CategoryPanel({
  children,
  categories,
  onDeleteCategory,
  onSelectFilter,
}: CategoryPanel) {
  return (
    <div>
      {categories.map((c) => (
        <span key={c.id}>
          <button onClick={() => onSelectFilter(c.name)}>{c.name}</button>
          {c.name !== "Uncategorized" && (
            <button
              onClick={() => {
                onDeleteCategory(c.id);
              }}
            >
              x
            </button>
          )}
        </span>
      ))}
      {children}
    </div>
  );
}

export default CategoryPanel;
