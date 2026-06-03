package com.vivek.cointracker.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ProfilePreferencesResponse {
    private Boolean newsletterSubscribed;
    private Boolean digestEnabled;
    private String digestFrequency;
}
