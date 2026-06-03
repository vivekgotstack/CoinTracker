package com.vivek.cointracker.dto;

import lombok.Data;

@Data
public class ProfilePreferencesRequest {
    private Boolean newsletterSubscribed;
    private Boolean digestEnabled;
    private String digestFrequency;
}
