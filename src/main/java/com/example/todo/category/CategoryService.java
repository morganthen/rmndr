package com.example.todo.category;

import java.util.Optional;

import org.springframework.stereotype.Service;

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

}
