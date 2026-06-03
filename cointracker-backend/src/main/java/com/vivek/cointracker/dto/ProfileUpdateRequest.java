package com.vivek.cointracker.dto;

import lombok.Data;

@Data
public class ProfileUpdateRequest {
    private String fullName;
    private String profileImageUrl;
}
