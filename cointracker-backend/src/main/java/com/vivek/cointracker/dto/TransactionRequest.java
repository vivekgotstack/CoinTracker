package com.vivek.cointracker.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

import com.vivek.cointracker.entity.CategoryType;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TransactionRequest {

    @NotBlank
    private String name;

    private String icon;

    private LocalDate date;

    @NotNull
    private BigDecimal amount;

    @NotNull
    private CategoryType type;

    @NotNull
    private Long categoryId;
}