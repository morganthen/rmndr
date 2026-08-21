import { useState } from "react";

import type { CreateCategoryRequest } from "../../types/category";

interface CategoryFormProps {
  handleCreateCategory: (data: CreateCategoryRequest) => void;
}

function CategoryForm({ handleCreateCategory }: CategoryFormProps) {
  const [newCategory, setNewCategory] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    if (newCategory.length === 0) {
      setError("Please create a category first");
      return;
    }
    const createdCategory = {
      name: newCategory,
    };
    handleCreateCategory(createdCategory);
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex gap-2 px-3 pb-3">
        <div className="flex flex-col">
          <input
            value={newCategory}
            placeholder="e.g. Personal"
            onChange={(e) => setNewCategory(e.target.value)}
            className="flex-1 rounded-lg border border-clay/60 bg-bone px-3 py-2 text-sm placeholder:text-clay focus:outline-none focus:ring-2 focus:ring-sage/60"
          ></input>
          <p className="h-5 w-full text-sm text-red-700">{error}</p>
        </div>

        <button
          type="submit"
          className="h-10 shrink-0 whitespace-nowrap rounded-lg bg-sage px-4 py-2 text-sm font-medium text-bone transition hover:bg-ink"
        >
          Create Category
        </button>
      </form>
    </div>
  );
}

export default CategoryForm;
