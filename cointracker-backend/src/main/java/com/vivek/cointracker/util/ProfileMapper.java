package com.vivek.cointracker.util;

import org.springframework.stereotype.Component;

import com.vivek.cointracker.dto.CategoryResponse;
import com.vivek.cointracker.dto.ProfileResponse;
import com.vivek.cointracker.entity.CategoryEntity;
import com.vivek.cointracker.entity.ProfileEntity;

@Component
public class ProfileMapper {
    public ProfileResponse toResponse(ProfileEntity p) {
        return ProfileResponse.builder()
                .id(p.getId())
                .email(p.getEmail())
                .fullName(p.getFullName())
                .profileImageUrl(p.getProfileImageUrl())
                .createdAt(p.getCreatedAt())
                .updatedAt(p.getUpdatedAt())
                .build();
    }
    
    public CategoryResponse mapToDto(CategoryEntity entity) {
        return CategoryResponse.builder()
                .id(entity.getId())
                .name(entity.getName())
                .type(entity.getType())
                .icon(entity.getIcon())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }
}