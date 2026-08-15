package com.example.todo.dtos;

import jakarta.validation.constraints.Pattern;

public class UpdateTodoRequest {

    @Pattern(regexp = ".*\\S.*", message = "Title cannot be empty")
    private String title;

    private Boolean isDone;

    private Boolean isArchived;

    private Integer categoryId;

    public UpdateTodoRequest() {

    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Boolean getIsDone() {
        return isDone;
    }

    public void setIsDone(Boolean isDone) {
        this.isDone = isDone;
    }

    public Boolean getIsArchived() {
        return isArchived;
    }

    public void setIsArchived(Boolean isArchived) {
        this.isArchived = isArchived;
    }

    public Integer getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(Integer categoryId) {
        this.categoryId = categoryId;
    }

}
