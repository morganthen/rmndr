package com.example.todo.category;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.todo.category.dtos.CategoryResponse;
import com.example.todo.category.dtos.CreateCategoryRequest;
import com.example.todo.category.dtos.UpdateCategoryRequest;
import com.example.todo.category.entities.Category;
import com.example.todo.common.exceptions.NotFoundException;

import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/categories")
@Tag(name = "Categories controller")
public class CategoryController {

    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @GetMapping()
    public ResponseEntity<List<CategoryResponse>> getCategories() {
        List<Category> categories = this.categoryService.findAll();
        return ResponseEntity.ok(CategoryResponse.of(categories));
    }

    @PostMapping()
    public ResponseEntity<CategoryResponse> createCategory(@RequestBody @Valid CreateCategoryRequest data) {
        Category createdCategory = this.categoryService.createCategory(data);
        return new ResponseEntity<CategoryResponse>(CategoryResponse.of(createdCategory), HttpStatus.CREATED);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteById(@PathVariable Integer id) {
        boolean deleted = categoryService.deleteById(id);
        if (!deleted) {
            throw new NotFoundException("No category with id " + id);
        }
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}")
    public ResponseEntity<CategoryResponse> updateById(@PathVariable Integer id,
            @Valid @RequestBody UpdateCategoryRequest data) {
        Category updated = categoryService.updateById(data, id)
                .orElseThrow(() -> new NotFoundException("Could not find category with id " + id));
        return ResponseEntity.ok(CategoryResponse.of(updated));

    }

}
