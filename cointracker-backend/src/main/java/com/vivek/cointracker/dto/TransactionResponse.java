package com.vivek.cointracker.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

import com.vivek.cointracker.entity.CategoryType;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TransactionResponse {

    private Long id;
    private String name;
    private String icon;
    private LocalDate date;
    private BigDecimal amount;
    private CategoryType type;
    private Long categoryId;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}