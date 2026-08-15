package com.example.todo.category.dtos;

import java.util.List;

import com.example.todo.category.entities.Category;

public record CategoryResponse(int id, String name) {

    public static CategoryResponse of(Category category) {
        return new CategoryResponse(category.getId(), category.getName());
    }

    public static List<CategoryResponse> of(List<Category> categories) {
        return categories.stream().map(c -> CategoryResponse.of(c)).toList();
    }

}
