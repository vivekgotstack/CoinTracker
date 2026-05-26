package com.vivek.cointracker.service;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.vivek.cointracker.dto.DashboardResponse;
import com.vivek.cointracker.dto.TransactionResponse;
import com.vivek.cointracker.entity.CategoryType;
import com.vivek.cointracker.repository.TransactionRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final TransactionRepository transactionRepository;
    private final TransactionService transactionService;

    @Transactional(readOnly = true)
    public DashboardResponse getDashboard(Long userId) {

        BigDecimal totalIncome =
                transactionRepository.sumAmountByType(userId, CategoryType.INCOME)
                        .orElse(BigDecimal.ZERO);

        BigDecimal totalExpense =
                transactionRepository.sumAmountByType(userId, CategoryType.EXPENSE)
                        .orElse(BigDecimal.ZERO);

        BigDecimal totalBalance = totalIncome.subtract(totalExpense);

        List<TransactionResponse> recentTransactions =
                transactionRepository.findTop5ByProfileIdOrderByDateDesc(userId)
                        .stream()
                        .map(transactionService::mapToResponse)
                        .toList();

        List<TransactionResponse> recentExpenses =
                transactionRepository
                        .findTop5ByProfileIdAndTypeOrderByDateDesc(
                                userId,
                                CategoryType.EXPENSE)
                        .stream()
                        .map(transactionService::mapToResponse)
                        .toList();

        List<TransactionResponse> recentIncomes =
                transactionRepository
                        .findTop5ByProfileIdAndTypeOrderByDateDesc(
                                userId,
                                CategoryType.INCOME)
                        .stream()
                        .map(transactionService::mapToResponse)
                        .toList();

        return DashboardResponse.builder()
                .totalBalance(totalBalance)
                .totalIncome(totalIncome)
                .totalExpense(totalExpense)
                .recentExpenses(recentExpenses)
                .recentIncomes(recentIncomes)
                .recentTransactions(recentTransactions)
                .build();
    }
}