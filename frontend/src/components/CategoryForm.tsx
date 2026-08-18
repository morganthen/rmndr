import { useState } from "react";

import type { CreateCategoryRequest } from "../types/category";

interface CategoryFormProps {
  setSelectedCategory: (data: string) => void;
  handleCreateCategory: (data: CreateCategoryRequest) => void;
}

function CategoryForm({
  setSelectedCategory,
  handleCreateCategory,
}: CategoryFormProps) {
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
        <input
          value={newCategory}
          placeholder="e.g. Personal"
          onChange={(e) => setNewCategory(e.target.value)}
          className="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        ></input>
        {error && <p className="w-full text-sm text-red-600">{error}</p>}
        <button
          type="button"
          onClick={() => setSelectedCategory("")}
          className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
        >
          Go back
        </button>
        <button
          type="submit"
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
        >
          Create Category
        </button>
      </form>
    </div>
  );
}

export default CategoryForm;
