import type { Category, CreateCategoryRequest } from "../types/category";

const BASE_URL = "http://localhost:8080/categories";

export const getAllCategories = async (): Promise<Category[]> => {
  const res = await fetch(BASE_URL);
  if (!res.ok) throw new Error("Failed to fetch category");
  return res.json();
};

export const createCategory = async (
  data: CreateCategoryRequest,
): Promise<Category> => {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create category");
  return res.json();
};
