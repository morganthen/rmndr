package com.example.todo.category;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;

import com.example.todo.TodoRepository;
import com.example.todo.category.dtos.UpdateCategoryRequest;
import com.example.todo.category.entities.Category;
import com.example.todo.common.exceptions.ConflictException;
import com.example.todo.entities.Todo;

@ExtendWith(MockitoExtension.class)
public class CategoryServiceTest {

    @Mock
    private CategoryRepository categoryRepository;
    @Mock
    private TodoRepository todoRepository;

    @Spy
    @InjectMocks
    private CategoryService categoryService;

    private Category makeCategory(int id, String name) {
        Category c = new Category();
        c.setId(id);
        c.setName(name);
        return c;
    }

    // deleteById
    @Test
    public void deleteById_CategoryNotInDb_ReturnsFalse() {
        when(this.categoryRepository.findById(1)).thenReturn(Optional.empty());

        boolean result = this.categoryService.deleteById(1);

        assertFalse(result);
        verify(this.todoRepository, never()).findByCategoryId(1);
        verify(this.categoryRepository, never()).deleteById(1);
    }

    @Test
    public void deleteById_DefaultCategory_ThrowsConflict() {
        when(this.categoryRepository.findById(1)).thenReturn(Optional.of(makeCategory(1, "Uncategorized")));

        assertThrows(ConflictException.class, () -> this.categoryService.deleteById(1));
        verify(this.todoRepository, never()).findByCategoryId(1);
        verify(this.categoryRepository, never()).deleteById(1);
    }

    // the "archived or not" rule: findByCategoryId returns todos regardless of isArchived
    @Test
    public void deleteById_CategoryInUseByTodos_ThrowsConflict() {
        when(this.categoryRepository.findById(1)).thenReturn(Optional.of(makeCategory(1, "Work")));
        when(this.todoRepository.findByCategoryId(1)).thenReturn(List.of(new Todo()));

        assertThrows(ConflictException.class, () -> this.categoryService.deleteById(1));
        verify(this.categoryRepository, never()).deleteById(1);
    }

    @Test
    public void deleteById_CategoryNotInUse_DeletesAndReturnsTrue() {
        when(this.categoryRepository.findById(1)).thenReturn(Optional.of(makeCategory(1, "Work")));
        when(this.todoRepository.findByCategoryId(1)).thenReturn(List.of());

        boolean result = this.categoryService.deleteById(1);

        assertTrue(result);
        verify(this.categoryRepository).deleteById(1);
    }

    // updateById rename guard
    @Test
    public void updateById_DefaultCategory_ThrowsConflict() {
        when(this.categoryRepository.findById(1)).thenReturn(Optional.of(makeCategory(1, "Uncategorized")));

        UpdateCategoryRequest data = new UpdateCategoryRequest();
        data.setName("Work");

        assertThrows(ConflictException.class, () -> this.categoryService.updateById(data, 1));
        verify(this.categoryRepository, never()).save(org.mockito.ArgumentMatchers.any());
    }

    @Test
    public void updateById_CategoryNotInDb_ReturnsEmptyOptional() {
        when(this.categoryRepository.findById(1)).thenReturn(Optional.empty());

        UpdateCategoryRequest data = new UpdateCategoryRequest();
        data.setName("Work");

        assertTrue(this.categoryService.updateById(data, 1).isEmpty());
    }
}
