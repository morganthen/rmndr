import type { Category } from "../types/category";

const BASE_URL = "http://localhost:8080/categories";

export const getAllCategories = async (): Promise<Category[]> => {
  const res = await fetch(BASE_URL);
  if (!res.ok) throw new Error("Failed to fetch category");
  return res.json();
};
