package com.vivek.cointracker.dto;

import java.time.LocalDateTime;

import com.vivek.cointracker.entity.CategoryType;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@AllArgsConstructor
@Builder
public class CategoryResponse {
    private Long id;
    private String name;
    private CategoryType type;
    private String icon;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
