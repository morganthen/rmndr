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

const buttonBase = "rounded-md px-2 py-1 text-sm transition hover:bg-gray-100";
const activeClass = "bg-blue-100 font-medium text-blue-700";

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
    <div className="flex flex-wrap items-center gap-2">
      <button
        className={`${buttonBase} ${selectedFilter === null ? activeClass : "text-gray-700"}`}
        onClick={() => onSelectFilter(null)}
      >
        All
      </button>
      {categories.map((c) => (
        <span key={c.id} className="group flex items-center">
          <button
            className={`${buttonBase} ${selectedFilter === c.name ? activeClass : "text-gray-700"}`}
            onClick={() => onSelectFilter(c.name)}
          >
            {c.name}
          </button>
          {c.name !== "Uncategorized" && (
            <button
              aria-label={`Delete category ${c.name}`}
              className="rounded px-1 text-gray-400 opacity-0 transition hover:bg-red-50 hover:text-red-600 group-hover:opacity-100"
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
        className={`${buttonBase} ${toggleArchived ? activeClass : "text-gray-700"}`}
        onClick={onToggleArchived}
      >
        Archived
      </button>
      {children}
    </div>
  );
}

export default CategoryPanel;
