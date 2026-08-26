import { useCallback, useEffect, useState } from "react";
import type {
  Category,
  CreateCategoryRequest,
  UseCategoriesResult,
} from "../types/category";
import {
  createCategory as createCategoryRequest,
  deleteCategory as deleteCategoryRequest,
  getAllCategories,
  updateCategory as updateCategoryRequest,
} from "../services/category-services";

function useCategories(): UseCategoriesResult {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const [editingCategory, setEditingCategory] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const getCategories = useCallback(async () => {
    try {
      const res = await getAllCategories();
      setCategories(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Some problem occurred");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- async fetch on mount, not synchronous cascading setState
    getCategories();
  }, [getCategories]);

  const createCategory = async (data: CreateCategoryRequest) => {
    try {
      setError(null);
      setIsLoading(true);
      const { id, name } = await createCategoryRequest(data);
      setCategories((prev) => [...prev, { id, name }]);
      setIsModalOpen(false);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong when creating category",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const deleteCategory = async (id: number) => {
    try {
      setError(null);
      setIsLoading(true);
      await deleteCategoryRequest(id);
      setCategories((prev) => prev.filter((c) => c.id !== id));
      if (categories.find((c) => c.id === id)?.name === selectedFilter) {
        setSelectedFilter(null);
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong when deleting category",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const updateCategory = async (
    id: number,
    data: CreateCategoryRequest,
  ): Promise<Category | null> => {
    try {
      setError(null);
      setIsLoading(true);
      const updated = await updateCategoryRequest(id, data);
      if (categories.find((c) => c.id === id)?.name === selectedFilter) {
        setSelectedFilter(data.name);
      }
      setCategories((prev) =>
        prev.map((c) => (c.id === id ? { ...c, name: data.name } : c)),
      );
      setEditingCategory(null);
      return updated;
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong when updating category",
      );
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const toggleEditingCategory = (id: number) => {
    setEditingCategory((prev) => (prev === id ? null : id));
  };

  const selectFilter = (name: string | null) => {
    setError(null);
    setSelectedFilter(name);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  return {
    categories,
    selectedFilter,
    createCategory,
    deleteCategory,
    updateCategory,
    closeModal,
    openModal,
    selectFilter,
    editingCategory,
    toggleEditingCategory,
    isModalOpen,
    error,
    isLoading,
  };
}

export default useCategories;
