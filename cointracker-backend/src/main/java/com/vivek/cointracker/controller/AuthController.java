package com.vivek.cointracker.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.vivek.cointracker.dto.AuthenticationResponse;
import com.vivek.cointracker.dto.ForgotPasswordRequest;
import com.vivek.cointracker.dto.LoginRequest;
import com.vivek.cointracker.dto.RefreshTokenRequest;
import com.vivek.cointracker.dto.RegisterRequest;
import com.vivek.cointracker.dto.ResetPasswordRequest;
import com.vivek.cointracker.service.AuthenticationService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/auth")
public class AuthController {
    private final AuthenticationService authenticationService;

    public AuthController(AuthenticationService authenticationService) {
        this.authenticationService = authenticationService;
    }

    @PostMapping("/refresh")
    public ResponseEntity<AuthenticationResponse> refreshToken(
            @Valid @RequestBody RefreshTokenRequest request) {

        return ResponseEntity.ok(
                authenticationService.refreshToken(
                        request.getRefreshToken()));
    }

    @PostMapping("/register")
    public ResponseEntity<AuthenticationResponse> registerProfile(@Valid @RequestBody RegisterRequest request) {
        AuthenticationResponse registeredProfile = authenticationService.registerProfile(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(registeredProfile);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthenticationResponse> loginProfile(@Valid @RequestBody LoginRequest request) {
        AuthenticationResponse response = authenticationService.loginProfile(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(
            @RequestBody ForgotPasswordRequest request) {

        authenticationService.forgotPassword(request.getEmail());
        return ResponseEntity.ok("Reset link sent");
    }

    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(
            @RequestBody ResetPasswordRequest request) {

        authenticationService.resetPassword(
                request.getToken(),
                request.getNewPassword());

        return ResponseEntity.ok("Password reset successful");
    }

    @GetMapping("/ping")
    public ResponseEntity<String> renderHack() {
        return ResponseEntity.ok("Service Alive");
    }
}
