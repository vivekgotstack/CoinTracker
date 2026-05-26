package com.vivek.cointracker.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import com.vivek.cointracker.dto.*;
import com.vivek.cointracker.entity.CategoryType;
import com.vivek.cointracker.entity.ProfileEntity;
import com.vivek.cointracker.service.CategoryService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    @PostMapping
    public ResponseEntity<CategoryResponse> createCategory(
            @AuthenticationPrincipal ProfileEntity user, // Injects the currently logged-in user from Spring Security.
            @Valid @RequestBody CreateCategoryRequest request) {

        return ResponseEntity.status(HttpStatus.CREATED).body(
                categoryService.createCategory(user.getId(), request));
    }

    @GetMapping
    public ResponseEntity<List<CategoryResponse>> getCategories(
            @RequestParam(required = false) CategoryType type,
            @AuthenticationPrincipal ProfileEntity user) {

        if (type != null) {
            return ResponseEntity.ok(
                    categoryService.getCategoriesByType(user.getId(), type));
        }

        return ResponseEntity.ok(
                categoryService.getCategories(user.getId()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<CategoryResponse> getCategory(
            @PathVariable Long id,
            @AuthenticationPrincipal ProfileEntity user) {

        return ResponseEntity.ok(
                categoryService.getCategory(id, user.getId()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CategoryResponse> updateCategory(
            @PathVariable Long id,
            @AuthenticationPrincipal ProfileEntity user,
            @Valid @RequestBody UpdateCategoryRequest request) {

        return ResponseEntity.ok(
                categoryService.updateCategory(id, user.getId(), request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCategory(
            @PathVariable Long id,
            @AuthenticationPrincipal ProfileEntity user) {

        categoryService.deleteCategory(id, user.getId());
        return ResponseEntity.noContent().build();
    }
}