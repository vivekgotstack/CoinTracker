package com.vivek.cointracker.service;

import java.time.LocalDateTime;
import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.vivek.cointracker.dto.*;
import com.vivek.cointracker.entity.ProfileEntity;
import com.vivek.cointracker.entity.Role;
import com.vivek.cointracker.exception.CustomExceptions.*;
import com.vivek.cointracker.repository.ProfileRepository;
import com.vivek.cointracker.security.JwtService;
import com.vivek.cointracker.security.UserDetailsServiceImpl;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

        private final ProfileRepository profileRepository;
        private final PasswordEncoder passwordEncoder;
        private final JwtService jwtService;
        private final AuthenticationManager authenticationManager;
        private final NotificationService notificationService;

        @Value("${jwt.access-token-expiry}")
        private long accessTokenExpiry;

        @Value("${app.base-url}")
        private String baseUrl;

        private static final Logger log = LoggerFactory.getLogger(AuthenticationService.class);
        private final UserDetailsServiceImpl userDetailsServiceImpl;

        @Transactional
        public AuthenticationResponse registerProfile(RegisterRequest request) {

                profileRepository.findByEmail(request.getEmail())
                                .ifPresent(user -> {
                                        throw new DuplicateResourceException("Email already registered");
                                });

                ProfileEntity entity = ProfileEntity.builder()
                                .email(request.getEmail())
                                .password(passwordEncoder.encode(request.getPassword()))
                                .fullName(request.getFullName())
                                .active(false)
                                .role(Role.USER)
                                .build();

                entity.generateActivationToken(
                                UUID.randomUUID().toString(),
                                LocalDateTime.now().plusMinutes(15));

                ProfileEntity saved = profileRepository.save(entity);

                try {
                        notificationService.sendAccountActivationEmail(
                                        saved,
                                        saved.getActivationToken());
                } catch (EmailSendException e) {
                        log.warn("Email failed for {}: {}", saved.getEmail(), e.getMessage());
                }

                return buildRegisterResponse(saved);
        }

        @Transactional
        public AuthenticationResponse loginProfile(LoginRequest request) {

                try {
                        authenticationManager.authenticate(
                                        new UsernamePasswordAuthenticationToken(
                                                        request.getEmail(),
                                                        request.getPassword()));
                        // If successful, user gets authenticated. Now you issue access + refresh tokens
                        /*
                         * Spring Security:
                         * loads user via UserDetailsService
                         * checks password using PasswordEncoder
                         * If wrong → throws exception
                         * If correct → returns authenticated object
                         */
                } catch (BadCredentialsException ex) {
                        throw new UnauthorizedException("Invalid email or password");
                }

                ProfileEntity user = profileRepository.findByEmail(request.getEmail())
                                .orElseThrow(() -> new UnauthorizedException("Invalid email or password"));

                if (!Boolean.TRUE.equals(user.getActive())) {
                        throw new ForbiddenException("Account not activated");
                }

                String accessToken = jwtService.generateToken(user);
                String refreshToken = jwtService.generateRefreshToken(user);
                user.saveRefreshToken(
                                refreshToken,
                                LocalDateTime.now().plusSeconds(jwtService.getRefreshTokenExpirySeconds()));

                return buildLoginResponse(user, accessToken, refreshToken);
        }

        @Transactional
        public AuthenticationResponse refreshToken(String refreshToken) {

                String email;

                try {
                        email = jwtService.extractUsername(refreshToken);
                } catch (Exception e) {
                        throw new UnauthorizedException("Invalid refresh token");
                }

                ProfileEntity user = (ProfileEntity) userDetailsServiceImpl.loadUserByUsername(email);

                if (!jwtService.isTokenValid(refreshToken, user)) {
                        throw new UnauthorizedException("Refresh token expired or invalid");
                }
                if (!refreshToken.equals(user.getRefreshToken()) ||
                                user.getRefreshTokenExpiry() == null ||
                                user.getRefreshTokenExpiry().isBefore(LocalDateTime.now())) {
                        throw new UnauthorizedException("Refresh token expired or invalid");
                }

                String newAccessToken = jwtService.generateToken(user);
                String newRefreshToken = jwtService.generateRefreshToken(user);
                user.saveRefreshToken(
                                newRefreshToken,
                                LocalDateTime.now().plusSeconds(jwtService.getRefreshTokenExpirySeconds()));

                return AuthenticationResponse.builder()
                                .accessToken(newAccessToken)
                                .refreshToken(newRefreshToken)
                                .tokenType("Bearer")
                                .expiresIn(accessTokenExpiry)
                                .message("Token refreshed")
                                .user(AuthenticationResponse.UserInfo.builder()
                                                .id(user.getId())
                                                .email(user.getEmail())
                                                .fullName(user.getFullName())
                                                .role(user.getRole())
                                                .profileImageUrl(user.getProfileImageUrl())
                                                .build())
                                .build();
        }

        @Transactional
        public void forgotPassword(String email) {

                ProfileEntity user = profileRepository.findByEmail(email).orElse(null);

                if (user == null) {
                        return;
                }

                String token = UUID.randomUUID().toString();

                user.generateResetToken(
                                token,
                                LocalDateTime.now().plusMinutes(10));

                try {
                        notificationService.sendPasswordResetEmail(
                                        user,
                                        user.getResetToken());

                } catch (EmailSendException e) {
                        log.warn("Reset email failed for {}: {}", user.getEmail(), e.getMessage());
                }
        }

        @Transactional
        public void resetPassword(String resetToken, String newPassword) {

                ProfileEntity user = profileRepository.findByResetToken(resetToken)
                                .orElseThrow(() -> new ResourceNotFoundException("Invalid token"));

                if (user.getResetTokenExpiry() == null ||
                                user.getResetTokenExpiry().isBefore(LocalDateTime.now())) {
                        throw new BadRequestException("Token expired");
                }

                user.changePassword(passwordEncoder.encode(newPassword));
                user.clearResetToken();
        }

        private AuthenticationResponse buildRegisterResponse(ProfileEntity user) {
                return AuthenticationResponse.builder()
                                .message("User registered. Please activate your account.")
                                .user(AuthenticationResponse.UserInfo.builder()
                                                .id(user.getId())
                                                .email(user.getEmail())
                                                .fullName(user.getFullName())
                                                .role(user.getRole())
                                                .profileImageUrl(user.getProfileImageUrl())
                                                .build())
                                .build();
        }

        private AuthenticationResponse buildLoginResponse(ProfileEntity user,
                        String accessToken,
                        String refreshToken) {

                return AuthenticationResponse.builder()
                                .accessToken(accessToken)
                                .refreshToken(refreshToken)
                                .tokenType("Bearer")
                                .expiresIn(accessTokenExpiry)
                                .message("Login successful")
                                .user(AuthenticationResponse.UserInfo.builder()
                                                .id(user.getId())
                                                .email(user.getEmail())
                                                .fullName(user.getFullName())
                                                .role(user.getRole())
                                                .profileImageUrl(user.getProfileImageUrl())
                                                .build())
                                .build();
        }
}
