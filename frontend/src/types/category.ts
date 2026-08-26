export interface Category {
  id: number;
  name: string;
}

export interface CreateCategoryRequest {
  name: string;
}

export interface UseCategoriesResult {
  categories: Category[];
  selectedFilter: string | null;
  createCategory: (data: CreateCategoryRequest) => Promise<void>;
  deleteCategory: (id: number) => Promise<void>;
  updateCategory: (
    id: number,
    data: CreateCategoryRequest,
  ) => Promise<Category | null>;
  selectFilter: (name: string | null) => void;
  editingCategory: number | null;
  toggleEditingCategory: (id: number) => void;
  isModalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
  error: string | null;
  isLoading: boolean;
}
