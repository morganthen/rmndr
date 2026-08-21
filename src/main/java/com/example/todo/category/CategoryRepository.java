package com.example.todo.category;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.todo.category.entities.Category;

public interface CategoryRepository extends JpaRepository<Category, Integer> {

    Optional<Category> findByName(String name);

    Optional<Category> findById(Integer id);

}
