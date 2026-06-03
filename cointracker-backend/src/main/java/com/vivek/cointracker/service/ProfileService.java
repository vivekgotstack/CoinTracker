package com.vivek.cointracker.service;

import java.time.LocalDateTime;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.vivek.cointracker.dto.ProfileResponse;
import com.vivek.cointracker.dto.ProfilePreferencesRequest;
import com.vivek.cointracker.dto.ProfilePreferencesResponse;
import com.vivek.cointracker.dto.ProfileUpdateRequest;
import com.vivek.cointracker.entity.ProfileEntity;
import com.vivek.cointracker.exception.CustomExceptions.BadRequestException;
import com.vivek.cointracker.exception.CustomExceptions.ResourceNotFoundException;
import com.vivek.cointracker.repository.ProfileRepository;
import com.vivek.cointracker.util.ProfileMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProfileService {

    private final ProfileRepository profileRepository;
    private final ProfileMapper profileMapper;

    @Transactional
    public boolean activateProfile(String activationToken) {
        return profileRepository.findByActivationToken(activationToken)
                .map(profile -> {
                    if (Boolean.TRUE.equals(profile.getActive())) {
                        return false;
                    }
                    if (profile.getActivationTokenExpiry() == null
                            || profile.getActivationTokenExpiry().isBefore(LocalDateTime.now())) {
                        return false;
                    }
                    profile.activate();
                    return true;
                }).orElse(false);
    }

    public ProfileEntity getCurrentProfile() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return profileRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
    }

    public ProfileResponse getCurrentProfileResponse() {
        return profileMapper.toResponse(getCurrentProfile());
    }

    @Transactional
    public ProfileResponse updateCurrentProfile(ProfileUpdateRequest request) {
        ProfileEntity user = getCurrentProfile();
        user.updateProfile(
                request.getFullName(),
                normalizeProfileImageUrl(request.getProfileImageUrl()));
        return profileMapper.toResponse(user);
    }

    public ProfilePreferencesResponse getCurrentPreferences() {
        return toPreferencesResponse(getCurrentProfile());
    }

    @Transactional
    public ProfilePreferencesResponse updateCurrentPreferences(ProfilePreferencesRequest request) {
        ProfileEntity user = getCurrentProfile();
        String digestFrequency = normalizeDigestFrequency(request.getDigestFrequency());

        user.updateEmailPreferences(
                request.getNewsletterSubscribed(),
                request.getDigestEnabled(),
                digestFrequency);

        return toPreferencesResponse(user);
    }

    public ProfileResponse getProfileByEmail(String email) {
        ProfileEntity user = profileRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
        return profileMapper.toResponse(user);
    }

    private ProfilePreferencesResponse toPreferencesResponse(ProfileEntity user) {
        return ProfilePreferencesResponse.builder()
                .newsletterSubscribed(user.getNewsletterSubscribed())
                .digestEnabled(user.getDigestEnabled())
                .digestFrequency(user.getDigestFrequency())
                .build();
    }

    private String normalizeDigestFrequency(String digestFrequency) {
        if (digestFrequency == null) {
            return null;
        }

        String normalized = digestFrequency.toLowerCase();
        if (!normalized.equals("daily") && !normalized.equals("weekly") && !normalized.equals("monthly")) {
            throw new BadRequestException("Invalid digest frequency");
        }
        return normalized;
    }

    private String normalizeProfileImageUrl(String profileImageUrl) {
        if (profileImageUrl == null || profileImageUrl.isBlank()) {
            return null;
        }
        return profileImageUrl.trim();
    }
}
