package com.vivek.cointracker.dto;

import com.vivek.cointracker.entity.CategoryType;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateCategoryRequest {
    @NotBlank
    private String name;

    @NotNull
    private CategoryType type;

    private String icon;
}