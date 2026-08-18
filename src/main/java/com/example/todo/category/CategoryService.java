package com.example.todo.category;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.example.todo.TodoRepository;
import com.example.todo.category.dtos.CreateCategoryRequest;
import com.example.todo.category.entities.Category;
import com.example.todo.common.exceptions.ConflictException;
import com.example.todo.entities.Todo;

@Service
public class CategoryService {
    private final CategoryRepository categoryRepository;
    private final TodoRepository todoRepository;

    public CategoryService(CategoryRepository categoryRepository, TodoRepository todoRepository) {
        this.categoryRepository = categoryRepository;
        this.todoRepository = todoRepository;
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

    public boolean deleteById(Integer id) {
        Optional<Category> result = categoryRepository.findById(id);
        if (result.isEmpty()) {
            return false;
        }
        Category foundCategory = result.get();

        if (foundCategory.getName().equals("Uncategorized")) {
            throw new ConflictException("The default category cannot be deleted");
        }

        List<Todo> foundTodos = todoRepository.findByCategoryId(id);

        if (!foundTodos.isEmpty()) {
            throw new ConflictException("Category is in use by " + foundTodos.size() + " todos");
        }

        categoryRepository.deleteById(id);
        return true;

    }
}
