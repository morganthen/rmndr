package com.example.todo;

import java.util.List;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.example.todo.entities.Todo;

public interface TodoRepository extends JpaRepository<Todo, Integer> { // always takes two types <Entity, Id>

    @EntityGraph(attributePaths = "category")
    @Query("SELECT t FROM Todo t")
    List<Todo> findAllWithCategory();
}
