package com.example.todo;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.todo.common.exceptions.NotFoundException;
import com.example.todo.dtos.CreateTodoRequest;
import com.example.todo.dtos.TodoResponse;
import com.example.todo.dtos.UpdateTodoRequest;
import com.example.todo.entities.Todo;

import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;

@RestController
@RequestMapping("/todos")
@Tag(name = "Todos controller")
public class TodoController {

    private final TodoService todoService;

    public TodoController(TodoService todoService) {
        this.todoService = todoService;
    }

    @PostMapping()
    public ResponseEntity<TodoResponse> createTodo(@RequestBody @Valid CreateTodoRequest data) {
        Todo createdTodo = this.todoService.create(data);
        return new ResponseEntity<TodoResponse>(TodoResponse.of(createdTodo), HttpStatus.CREATED);
    }

    @GetMapping()
    public ResponseEntity<List<TodoResponse>> getTodos() {
        List<Todo> todos = this.todoService.getTodos();
        return ResponseEntity.ok(TodoResponse.of(todos));
    }

    @GetMapping("/archived")
    public ResponseEntity<List<TodoResponse>> getArchivedTodos() {
        List<Todo> todos = this.todoService.getArchivedTodos();
        return ResponseEntity.ok(TodoResponse.of(todos));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteById(@PathVariable Integer id) {
        boolean deleted = todoService.deleteById(id);
        if (!deleted) {
            throw new NotFoundException("No todo with id " + id);
        }
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}")
    public ResponseEntity<TodoResponse> updateTodoById(@PathVariable Integer id,
            @Valid @RequestBody UpdateTodoRequest data) {
        Todo result = this.todoService.updateById(id, data)
                .orElseThrow(() -> new NotFoundException("Could not find todo with id " + id));
        return ResponseEntity.ok(TodoResponse.of(result));
    }

}
