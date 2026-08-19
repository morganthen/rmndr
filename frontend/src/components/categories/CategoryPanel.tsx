import type { ReactNode } from "react";
import type { Category } from "../../types/category";

interface CategoryPanelProps {
  children: ReactNode;
  categories: Category[];
  onDeleteCategory: (id: number) => void;
  onSelectFilter: (name: string | null) => void;
  onToggleArchived: () => void;
}

function CategoryPanel({
  children,
  categories,
  onDeleteCategory,
  onSelectFilter,
  onToggleArchived,
}: CategoryPanelProps) {
  return (
    <div>
      <button onClick={() => onSelectFilter(null)}>All</button>
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

      <button onClick={onToggleArchived}>Archived</button>
      {children}
    </div>
  );
}

export default CategoryPanel;
