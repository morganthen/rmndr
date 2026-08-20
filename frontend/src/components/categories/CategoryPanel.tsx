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
  onOpenModal: () => void;
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
  onOpenModal,
}: CategoryPanelProps) {
  return (
    <div className="flex w-full flex-col gap-2">
      <div className="flex flex-wrap self-start">
        <button
          className={`${buttonBase} ${selectedFilter === null ? activeClass : inactiveClass}`}
          onClick={() => onSelectFilter(null)}
        >
          All
        </button>
        {categories.map((c) => (
          <span key={c.id} className="group relative flex items-center">
            <button
              className={`${buttonBase} ${selectedFilter === c.name ? activeClass : inactiveClass}`}
              onClick={() => onSelectFilter(c.name)}
            >
              {c.name}
            </button>
            {c.name !== "Uncategorized" && (
              <button
                aria-label={`Delete category ${c.name}`}
                className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-clay text-[10px] leading-none text-bone opacity-0 transition hover:bg-red-700 group-hover:opacity-100"
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
        <button
          aria-label="Create category"
          title="Create category"
          className="text-clay hover:text-slate-700"
          onClick={onOpenModal}
        >
          +
        </button>
      </div>
      <div className="self-end">{children}</div>
    </div>
  );
}

export default CategoryPanel;
