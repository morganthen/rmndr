package com.example.todo.category;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.todo.category.entities.Category;

public interface CategoryRepository extends JpaRepository<Category, Integer> {

}
