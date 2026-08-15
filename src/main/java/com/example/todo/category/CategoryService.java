package com.example.todo.category;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.example.todo.category.dtos.CreateCategoryRequest;
import com.example.todo.category.entities.Category;

@Service
public class CategoryService {
    private final CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    public Optional<Category> findById(Integer id) {
        return categoryRepository.findById(id);

    }

    public Optional<Category> getDefaultCategory() {
        return categoryRepository.findByName("Uncategorized");
    }

    public List<Category> findAll() {
        return this.categoryRepository.findAll();
    }

    public Category createCategory(CreateCategoryRequest data) {
        Category category = new Category();
        category.setName(data.getName());
        return this.categoryRepository.save(category);
    }

}
