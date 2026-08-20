import type { Category, CreateCategoryRequest } from "../types/category";
import { throwFromResponse } from "./api-error";

const BASE_URL = "http://localhost:8080/categories";

export const getAllCategories = async (): Promise<Category[]> => {
  const res = await fetch(BASE_URL);
  if (!res.ok) await throwFromResponse(res, "Failed to fetch category");
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
  if (!res.ok) await throwFromResponse(res, "Failed to create category");
  return res.json();
};

export const deleteCategory = async (id: number): Promise<void> => {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) await throwFromResponse(res, "Failed to delete category");
};
