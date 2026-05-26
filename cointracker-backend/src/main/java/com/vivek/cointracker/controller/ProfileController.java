package com.vivek.cointracker.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.vivek.cointracker.service.ProfileService;

@RestController
@RequestMapping("/activate")
public class ProfileController {
    private final ProfileService profileService;

    public ProfileController(ProfileService profileService) {
        this.profileService = profileService;
    }

    @GetMapping
    public ResponseEntity<String> activateProfile(@RequestParam String token) {
        boolean isActive = profileService.activateProfile(token);
        if (isActive) {
            return ResponseEntity.ok("User account activated");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid, expired, or already used token");
        }
    }
}