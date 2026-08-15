package com.example.todo.dtos;

import jakarta.validation.constraints.NotBlank;

public class CreateTodoRequest {
    @NotBlank
    private String title;

    private Integer categoryId;

    public CreateTodoRequest() {

    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Integer getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(Integer categoryId) {
        this.categoryId = categoryId;
    }

}
