package com.vivek.cointracker.security;

import com.vivek.cointracker.repository.ProfileRepository;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    private static final Logger log = LoggerFactory.getLogger(UserDetailsServiceImpl.class);

    private final ProfileRepository profileRepository;

    public UserDetailsServiceImpl(ProfileRepository profileRepository) {
        this.profileRepository = profileRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        log.debug("Attempting authentication for: {}", username);

        return profileRepository.findByEmail(username)
                .map(user -> {
                    log.debug("User found: {}", user.getEmail());

                    if (!user.isEnabled()) {
                        throw new RuntimeException("User account is disabled");
                    }

                    if (!user.isAccountNonLocked()) {
                        throw new RuntimeException("User account is locked");
                    }

                    return user;
                })
                .orElseThrow(() -> {
                    log.warn("User not found: {}", username);
                    return new UsernameNotFoundException("User not found");
                });
    }
}