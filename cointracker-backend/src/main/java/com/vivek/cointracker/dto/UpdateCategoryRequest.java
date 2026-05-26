package com.vivek.cointracker.dto;

import com.vivek.cointracker.entity.CategoryType;

import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UpdateCategoryRequest {
    @Size(min = 1)
    private String name;
    private CategoryType type;
    private String icon;
}