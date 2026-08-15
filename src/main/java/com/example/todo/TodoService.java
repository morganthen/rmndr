package com.example.todo;

import java.util.List;
import java.util.Optional;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import com.example.todo.category.CategoryService;
import com.example.todo.category.entities.Category;
import com.example.todo.common.exceptions.NotFoundException;
import com.example.todo.dtos.CreateTodoRequest;
import com.example.todo.dtos.UpdateTodoRequest;
import com.example.todo.entities.Todo;

@Service
public class TodoService {
    private final TodoRepository repo;
    private final ModelMapper mapper;
    private final CategoryService categoryService;

    public TodoService(TodoRepository repo, ModelMapper mapper, CategoryService categoryService) {
        this.repo = repo;
        this.mapper = mapper;
        this.categoryService = categoryService;

    }

    public Todo create(CreateTodoRequest data) {
        Integer id = data.getCategoryId();
        Optional<Category> category;
        if (id == null) {
            category = categoryService.getDefaultCategory();
        } else {
            category = categoryService.findById(id);
        }

        Todo todo = mapper.map(data, Todo.class);
        Category resolved = category.orElseThrow(() -> new NotFoundException("No category with id " + id));
        todo.setCategory(resolved);
        return repo.save(todo);

    }

    public List<Todo> getTodos() {
        return repo.findAllWithCategory();
    }

    public boolean deleteById(int id) {
        Optional<Todo> result = repo.findById(id);
        if (result.isEmpty()) {
            return false;
        }
        repo.delete(result.get());
        return true;

    }

    public Optional<Todo> findById(Integer id) {
        return this.repo.findById(id);
    }

    public Optional<Todo> updateById(Integer id, UpdateTodoRequest data) {
        Optional<Todo> result = this.findById(id);
        if (result.isEmpty()) {
            return result;
        }

        Todo foundTodo = result.get();

        this.mapper.map(data, foundTodo);

        if (data.getIsDone() != null) {
            foundTodo.setDone(data.getIsDone());
        }

        if (data.getIsArchived() != null) {
            foundTodo.setArchived(data.getIsArchived());
        }

        if (data.getCategoryId() != null) {
            Category resolved = categoryService.findById(data.getCategoryId())
                    .orElseThrow(() -> new NotFoundException("No category with id " + data.getCategoryId()));
            foundTodo.setCategory(resolved);
        }

        this.repo.saveAndFlush(foundTodo);
        return Optional.of(foundTodo);

    }
}
