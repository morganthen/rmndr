import type { ReactNode } from "react";
import type { Category } from "../../types/category";

interface CategoryPanelProps {
  children: ReactNode;
  categories: Category[];
  selectedFilter: string | null;
  toggleArchived: boolean;
  onDeleteCategory: (id: number) => void;
  onSelectFilter: (name: string | null) => void;
  onToggleArchived: () => void;
}

const buttonBase = "rounded-md px-2 py-1 text-sm transition";
const activeClass = "bg-sage font-medium text-bone";
const inactiveClass = "text-clay hover:bg-bone";

function CategoryPanel({
  children,
  categories,
  selectedFilter,
  toggleArchived,
  onDeleteCategory,
  onSelectFilter,
  onToggleArchived,
}: CategoryPanelProps) {
  return (
    <div className="flex w-full flex-wrap items-center gap-2">
      <button
        className={`${buttonBase} ${selectedFilter === null ? activeClass : inactiveClass}`}
        onClick={() => onSelectFilter(null)}
      >
        All
      </button>
      {categories.map((c) => (
        <span key={c.id} className="group flex items-center">
          <button
            className={`${buttonBase} ${selectedFilter === c.name ? activeClass : inactiveClass}`}
            onClick={() => onSelectFilter(c.name)}
          >
            {c.name}
          </button>
          {c.name !== "Uncategorized" && (
            <button
              aria-label={`Delete category ${c.name}`}
              className="rounded px-1 text-clay opacity-0 transition hover:bg-bone hover:text-red-700 group-hover:opacity-100"
              onClick={() => {
                onDeleteCategory(c.id);
              }}
            >
              x
            </button>
          )}
        </span>
      ))}

      <button
        className={`${buttonBase} ${toggleArchived ? activeClass : inactiveClass}`}
        onClick={onToggleArchived}
      >
        Archived
      </button>
      {children}
    </div>
  );
}

export default CategoryPanel;
