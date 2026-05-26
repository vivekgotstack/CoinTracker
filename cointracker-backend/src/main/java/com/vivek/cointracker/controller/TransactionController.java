package com.vivek.cointracker.controller;

import java.math.BigDecimal;
import java.time.LocalDate;

import org.springframework.data.domain.Page;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import com.vivek.cointracker.dto.TransactionRequest;
import com.vivek.cointracker.dto.TransactionResponse;
import com.vivek.cointracker.entity.CategoryType;
import com.vivek.cointracker.entity.ProfileEntity;
import com.vivek.cointracker.service.TransactionService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
public class TransactionController {

        private final TransactionService transactionService;

        // CREATE
        @PostMapping
        public ResponseEntity<TransactionResponse> create(
                        @AuthenticationPrincipal ProfileEntity user,
                        @Valid @RequestBody TransactionRequest dto) {

                return ResponseEntity.status(HttpStatus.CREATED).body(
                                transactionService.createTransaction(user.getId(), dto));
        }

        // GET (filterable)
        @GetMapping
        public ResponseEntity<Page<TransactionResponse>> getAll(
                        @AuthenticationPrincipal ProfileEntity user,
                        @RequestParam(required = false) CategoryType type,
                        @RequestParam(required = false) Long categoryId,
                        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate start,
                        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate end,
                        @RequestParam(required = false) String keyword,
                        @RequestParam(defaultValue = "0") int page,
                        @RequestParam(defaultValue = "10") int size,
                        @RequestParam(defaultValue = "date,desc") String sort) {

                return ResponseEntity.ok(
                                transactionService.getTransactions(
                                                user.getId(), start, end, categoryId, type, keyword, page, size, sort));
        }

        @GetMapping("/{id}")
        public ResponseEntity<TransactionResponse> getOne(
                        @PathVariable Long id,
                        @AuthenticationPrincipal ProfileEntity user) {

                return ResponseEntity.ok(
                                transactionService.getTransaction(id, user.getId()));
        }

        @PutMapping("/{id}")
        public ResponseEntity<TransactionResponse> update(
                        @PathVariable Long id,
                        @AuthenticationPrincipal ProfileEntity user,
                        @Valid @RequestBody TransactionRequest dto) {

                return ResponseEntity.ok(
                                transactionService.updateTransaction(id, user.getId(), dto));
        }

        @DeleteMapping("/{id}")
        public ResponseEntity<Void> delete(
                        @PathVariable Long id,
                        @AuthenticationPrincipal ProfileEntity user) {

                transactionService.deleteTransaction(id, user.getId());
                return ResponseEntity.noContent().build();
        }

        @GetMapping("/total")
        public ResponseEntity<BigDecimal> getTotalByType(
                        @AuthenticationPrincipal ProfileEntity user,
                        @RequestParam CategoryType type) {

                return ResponseEntity.ok(
                                transactionService.getTotalByType(user.getId(), type));
        }
}