import { useRef, useState, type ReactNode } from "react";
import type { Category, CreateCategoryRequest } from "../../types/category";
import { MdOutlineDelete, MdOutlineEdit } from "react-icons/md";

interface CategoryPanelProps {
  children: ReactNode;
  categories: Category[];
  selectedFilter: string | null;
  toggleArchived: boolean;
  onDeleteCategory: (id: number) => void;
  onUpdateCategory: (id: number, data: CreateCategoryRequest) => void;
  onSelectFilter: (name: string | null) => void;
  onToggleArchived: () => void;
  onOpenModal: () => void;
  onToggleEditCategory: (id: number) => void;
  editCategory: number | null;
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
  onUpdateCategory,
  editCategory,
  onSelectFilter,
  onToggleArchived,
  onOpenModal,
  onToggleEditCategory,
}: CategoryPanelProps) {
  const [updatedCategoryName, setUpdatedCategoryName] = useState<string>("");

  const cancelledRef = useRef(false);

  return (
    <div className="flex w-full flex-col gap-2">
      <div className="flex flex-wrap self-start">
        <button
          className={`${buttonBase} ${selectedFilter === null ? activeClass : inactiveClass}`}
          onClick={() => onSelectFilter(null)}
        >
          All
        </button>
        {categories.map((c) => {
          const handleBlur = () => {
            if (cancelledRef.current) {
              cancelledRef.current = false;
              return;
            }
            if (
              updatedCategoryName.trim() === "" ||
              updatedCategoryName === c.name
            ) {
              onToggleEditCategory(c.id);
              return;
            }
            onUpdateCategory(c.id, { name: updatedCategoryName });
          };

          const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === "Enter") {
              if (
                updatedCategoryName.trim() === "" ||
                updatedCategoryName === c.name
              )
                return;
              e.currentTarget.blur(); // blur is the ONLY commit trigger
            } else if (e.key === "Escape") {
              cancelledRef.current = true;
              if (
                updatedCategoryName.trim() === "" ||
                updatedCategoryName === c.name
              )
                cancelledRef.current = true;
              onToggleEditCategory(c.id); // exit edit mode without saving
            }
          };
          return (
            <span key={c.id} className="group relative flex items-center">
              {editCategory === c.id ? (
                <input
                  placeholder={c.name}
                  className={`${buttonBase} placeholder:text-clay outline-none ring-2 ring-sage/40 w-24`}
                  value={updatedCategoryName}
                  onChange={(e) => setUpdatedCategoryName(e.target.value)}
                  onBlur={handleBlur}
                  onKeyDown={handleKeyDown}
                  autoFocus
                ></input>
              ) : (
                <>
                  <button
                    className={`${buttonBase} ${selectedFilter === c.name ? activeClass : inactiveClass}`}
                    onClick={() => onSelectFilter(c.name)}
                  >
                    {c.name}
                  </button>
                  {c.name !== "Uncategorized" && (
                    <>
                      <button
                        aria-label={`Delete category ${c.name}`}
                        className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-clay text-[10px] leading-none text-bone opacity-0 transition hover:bg-red-700 group-hover:opacity-100"
                        onClick={() => {
                          onDeleteCategory(c.id);
                        }}
                      >
                        <MdOutlineDelete className="h-4 w-4" />
                      </button>
                      <button
                        aria-label={`Edit category ${c.name}`}
                        className="absolute -right-1.5 -bottom-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-clay text-[10px] leading-none text-bone opacity-0 transition hover:bg-green-700 group-hover:opacity-100"
                        onClick={() => {
                          setUpdatedCategoryName(c.name);
                          onToggleEditCategory(c.id);
                          cancelledRef.current = false;
                        }}
                      >
                        <MdOutlineEdit className="h-4 w-4" />
                      </button>
                    </>
                  )}
                </>
              )}
            </span>
          );
        })}

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
