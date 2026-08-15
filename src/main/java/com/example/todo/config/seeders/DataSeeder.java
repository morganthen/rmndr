package com.example.todo.config.seeders;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import com.example.todo.category.CategoryRepository;
import com.example.todo.category.entities.Category;

@Component
@Profile({ "dev" })
public class DataSeeder implements CommandLineRunner {

    private final CategoryRepository repo;

    public DataSeeder(CategoryRepository repo) {
        this.repo = repo;

    }

    @Override
    public void run(String... args) throws Exception {
        if (repo.count() == 0) {
            Category uncategorized = new Category();
            uncategorized.setName("Uncategorized");
            repo.save(uncategorized);
        }
    }
}
