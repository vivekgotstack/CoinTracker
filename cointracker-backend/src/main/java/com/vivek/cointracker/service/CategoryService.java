package com.vivek.cointracker.service;

import java.util.List;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.vivek.cointracker.dto.CategoryResponse;
import com.vivek.cointracker.dto.CreateCategoryRequest;
import com.vivek.cointracker.dto.UpdateCategoryRequest;
import com.vivek.cointracker.entity.CategoryEntity;
import com.vivek.cointracker.entity.CategoryType;
import com.vivek.cointracker.entity.ProfileEntity;
import com.vivek.cointracker.exception.CustomExceptions.DuplicateResourceException;
import com.vivek.cointracker.exception.CustomExceptions.ResourceNotFoundException;
import com.vivek.cointracker.repository.CategoryRepository;
import com.vivek.cointracker.util.ProfileMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final ProfileMapper profileMapper;

    @Transactional
    public CategoryResponse createCategory(Long userId, CreateCategoryRequest request) {

        CategoryEntity entity = CategoryEntity.builder()
                .name(request.getName().trim())
                .type(request.getType())
                .icon(request.getIcon())
                .profile(ProfileEntity.builder().id(userId).build())
                .build();

        try {
            categoryRepository.save(entity);
            categoryRepository.flush();
            return profileMapper.mapToDto(entity);
        } catch (DataIntegrityViolationException ex) {
            throw new DuplicateResourceException("Category already exists");
        }
    }

    @Transactional(readOnly = true)
    public List<CategoryResponse> getCategories(Long userId) {
        return categoryRepository.findByProfileId(userId)
                .stream()
                .map(profileMapper::mapToDto)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<CategoryResponse> getCategoriesByType(Long userId, CategoryType type) {
        return categoryRepository.findByProfileIdAndType(userId, type)
                .stream()
                .map(profileMapper::mapToDto)
                .toList();
    }

    @Transactional(readOnly = true)
    public CategoryResponse getCategory(Long id, Long userId) {

        CategoryEntity category = categoryRepository
                .findByIdAndProfileId(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));

        return profileMapper.mapToDto(category);
    }

    @Transactional
    public CategoryResponse updateCategory(Long id, Long userId, UpdateCategoryRequest request) {

        CategoryEntity category = categoryRepository
                .findByIdAndProfileId(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));

        if (request.getName() != null && !request.getName().equals(category.getName())) {
            category.setName(request.getName());
        }

        if (request.getType() != null && request.getType() != category.getType()) {
            category.setType(request.getType());
        }

        if (request.getIcon() != null && !request.getIcon().equals(category.getIcon())) {
            category.setIcon(request.getIcon());
        }

        categoryRepository.flush();
        return profileMapper.mapToDto(category);
    }

    @Transactional
    public void deleteCategory(Long id, Long userId) {

        CategoryEntity category = categoryRepository
                .findByIdAndProfileId(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));

        categoryRepository.delete(category);
    }
}