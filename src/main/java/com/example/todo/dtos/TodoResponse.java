package com.example.todo.dtos;

import java.util.List;

import com.example.todo.entities.Todo;

public record TodoResponse(int id, String title, boolean isDone, boolean isArchived, String category) {

    public static TodoResponse of(Todo todo) {
        return new TodoResponse(todo.getId(), todo.getTitle(), todo.isDone(), todo.isArchived(),
                todo.getCategory() != null ? todo.getCategory().getName() : null);
    }

    public static List<TodoResponse> of(List<Todo> todos) {
        return todos.stream().map(t -> TodoResponse.of(t)).toList();
    }

}
