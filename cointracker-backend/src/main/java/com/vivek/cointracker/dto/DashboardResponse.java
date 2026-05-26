package com.vivek.cointracker.dto;

import java.math.BigDecimal;
import java.util.List;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardResponse {

    private BigDecimal totalBalance;
    private BigDecimal totalIncome;
    private BigDecimal totalExpense;

    private List<TransactionResponse> recentTransactions;
    private List<TransactionResponse> recentExpenses;
    private List<TransactionResponse> recentIncomes;
}