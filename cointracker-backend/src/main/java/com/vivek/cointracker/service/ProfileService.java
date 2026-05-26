package com.vivek.cointracker.service;

import java.time.LocalDateTime;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.vivek.cointracker.dto.ProfileResponse;
import com.vivek.cointracker.entity.ProfileEntity;
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

    public ProfileResponse getProfileByEmail(String email) {
        ProfileEntity user = profileRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
        return profileMapper.toResponse(user);
    }
}
