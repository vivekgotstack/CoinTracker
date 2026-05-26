package com.vivek.cointracker.service;

import java.math.BigDecimal;
import java.time.LocalDate;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.vivek.cointracker.dto.TransactionRequest;
import com.vivek.cointracker.dto.TransactionResponse;
import com.vivek.cointracker.entity.CategoryEntity;
import com.vivek.cointracker.entity.CategoryType;
import com.vivek.cointracker.entity.ProfileEntity;
import com.vivek.cointracker.entity.TransactionEntity;
import com.vivek.cointracker.exception.CustomExceptions.*;
import com.vivek.cointracker.repository.CategoryRepository;
import com.vivek.cointracker.repository.TransactionRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final CategoryRepository categoryRepository;

    @Transactional
    public TransactionResponse createTransaction(Long userId, TransactionRequest dto) {

        CategoryEntity category = categoryRepository.findById(dto.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));

        if (!category.getProfile().getId().equals(userId)) {
            throw new ForbiddenException("Category does not belong to user");
        }

        TransactionEntity entity = TransactionEntity.builder()
                .name(dto.getName())
                .icon(dto.getIcon())
                .amount(dto.getAmount())
                .date(dto.getDate() != null ? dto.getDate() : LocalDate.now())
                .type(dto.getType())
                .category(category)
                .profile(ProfileEntity.builder().id(userId).build()) // no DB hit
                .build();

        return mapToResponse(transactionRepository.saveAndFlush(entity));
    }

    public Page<TransactionResponse> getTransactions(
            Long userId,
            LocalDate start,
            LocalDate end,
            Long categoryId,
            CategoryType type,
            String keyword,
            int page,
            int size,
            String sort) {

        String[] sortParts = sort.split(",");
        Sort sortObj = Sort.by(sortParts[0]); // Creates sorting object like: ORDER BY date

        if (sortParts.length > 1 && sortParts[1].equalsIgnoreCase("desc")) { // Checks sorting direction
            sortObj = sortObj.descending();
        } else {
            sortObj = sortObj.ascending();
        }

        Pageable pageable = PageRequest.of(page, size, sortObj);

        Specification<TransactionEntity> spec = (root, query, cb) -> cb.equal(root.get("profile").get("id"), userId);
        // Base specification - This ALWAYS filters by current user.

        // cb -> CriteriaBuilder(Query constructor engine), query -> query being built,
        // root -> entity

        if (keyword != null && !keyword.isBlank()) {
            spec = spec.and((root, query, cb) -> cb.like(
                    cb.lower(root.get("name")),
                    "%" + keyword.toLowerCase() + "%"));
        }   // Equivalent SQL: AND LOWER(name) LIKE '%pizza%'

        if (type != null) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("type"), type));
        }   // Equivalent SQL Condition: AND type = 'EXPENSE'

        if (categoryId != null) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("category").get("id"), categoryId));
        }   // Equivalent SQL Condition: AND category_id = ?

        if (start != null && end != null) {
            spec = spec.and((root, query, cb) -> cb.between(root.get("date"), start, end));
        }    // Equivalent SQL Condition: AND date BETWEEN start AND end

        Page<TransactionEntity> result = transactionRepository.findAll(spec, pageable);
        // Spring Data JPA automatically generates SQL from: Specification & Pageable

        return result.map(this::mapToResponse);
    }

    @Transactional(readOnly = true)
    public BigDecimal getTotalByType(Long userId, CategoryType type) {
        return transactionRepository
                .sumAmountByType(userId, type)
                .orElse(BigDecimal.ZERO);
    }

    @Transactional
    public TransactionResponse updateTransaction(Long id, Long userId, TransactionRequest dto) {

        TransactionEntity tx = transactionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found"));

        if (!tx.getProfile().getId().equals(userId)) {
            throw new ForbiddenException("Access denied");
        }

        CategoryEntity category = categoryRepository.findById(dto.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));

        if (!category.getProfile().getId().equals(userId)) {
            throw new ForbiddenException("Category does not belong to user");
        }

        tx = TransactionEntity.builder()
                .id(tx.getId())
                .name(dto.getName())
                .icon(dto.getIcon())
                .amount(dto.getAmount())
                .date(dto.getDate())
                .type(dto.getType())
                .category(category)
                .profile(tx.getProfile())
                .createdAt(tx.getCreatedAt())
                .build();

        return mapToResponse(transactionRepository.saveAndFlush(tx));
    }

    @Transactional(readOnly = true)
    public TransactionResponse getTransaction(Long id, Long userId) {

        TransactionEntity tx = transactionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found"));

        if (!tx.getProfile().getId().equals(userId)) {
            throw new ForbiddenException("Access denied");
        }

        return mapToResponse(tx);
    }

    @Transactional
    public void deleteTransaction(Long id, Long userId) {

        TransactionEntity tx = transactionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found"));

        if (!tx.getProfile().getId().equals(userId)) {
            throw new ForbiddenException("Access denied");
        }

        transactionRepository.delete(tx);
    }

    public TransactionResponse mapToResponse(TransactionEntity e) {
        return TransactionResponse.builder()
                .id(e.getId())
                .name(e.getName())
                .icon(e.getIcon())
                .amount(e.getAmount())
                .date(e.getDate())
                .type(e.getType())
                .categoryId(e.getCategory().getId())
                .createdAt(e.getCreatedAt())
                .updatedAt(e.getUpdatedAt())
                .build();
    }
}