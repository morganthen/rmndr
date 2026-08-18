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

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const createCategory = {
      name: newCategory,
    };
    handleCreateCategory(createCategory);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          value={newCategory}
          placeholder="e.g. Personal"
          onChange={(e) => setNewCategory(e.target.value)}
        ></input>
        <button type="button" onClick={() => setSelectedCategory("")}>
          Go back
        </button>
        <button type="submit">Create Category</button>
      </form>
    </div>
  );
}

export default CategoryForm;
