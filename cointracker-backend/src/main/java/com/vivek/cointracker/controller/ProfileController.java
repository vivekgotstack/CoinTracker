package com.vivek.cointracker.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.vivek.cointracker.dto.ProfilePreferencesRequest;
import com.vivek.cointracker.dto.ProfilePreferencesResponse;
import com.vivek.cointracker.dto.ProfileResponse;
import com.vivek.cointracker.dto.ProfileUpdateRequest;
import com.vivek.cointracker.service.ProfileService;

@RestController
public class ProfileController {
    private final ProfileService profileService;

    @Value("${app.frontend-url}")
    private String frontendUrl;

    public ProfileController(ProfileService profileService) {
        this.profileService = profileService;
    }

    @GetMapping(value = "/activate", produces = MediaType.TEXT_HTML_VALUE)
    public ResponseEntity<String> activateProfile(@RequestParam String token) {
        boolean isActive = profileService.activateProfile(token);
        if (isActive) {
            return ResponseEntity.ok(activationPage(
                    "Account activated",
                    "Your CoinTracker account is ready. Sign in and start tracking with confidence.",
                    "Continue to sign in",
                    frontendUrl + "/login",
                    true));
        }

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(activationPage(
                "Activation link expired",
                "This link is invalid, expired, or already used. Please sign in or create a fresh account.",
                "Back to CoinTracker",
                frontendUrl + "/login",
                false));
    }

    @GetMapping("/api/profile/preferences")
    public ResponseEntity<ProfilePreferencesResponse> getPreferences() {
        return ResponseEntity.ok(profileService.getCurrentPreferences());
    }

    @GetMapping("/api/profile")
    public ResponseEntity<ProfileResponse> getCurrentProfile() {
        return ResponseEntity.ok(profileService.getCurrentProfileResponse());
    }

    @PutMapping("/api/profile")
    public ResponseEntity<ProfileResponse> updateCurrentProfile(
            @RequestBody ProfileUpdateRequest request) {
        return ResponseEntity.ok(profileService.updateCurrentProfile(request));
    }

    @PutMapping("/api/profile/preferences")
    public ResponseEntity<ProfilePreferencesResponse> updatePreferences(
            @RequestBody ProfilePreferencesRequest request) {
        return ResponseEntity.ok(profileService.updateCurrentPreferences(request));
    }

    private String activationPage(
            String title,
            String message,
            String buttonText,
            String buttonLink,
            boolean success) {

        String accent = success ? "#0d9488" : "#e11d48";
        String soft = success ? "#e0f7ef" : "#fff1f2";
        String status = success ? "ACTIVE" : "EXPIRED";

        return """
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>%s</title>
                </head>
                <body style="margin:0;min-height:100vh;background:linear-gradient(135deg,#f3fbf8 0%%,#fff8eb 52%%,#f4ecff 100%%);font-family:Arial,sans-serif;color:#10201d;">
                    <main style="min-height:100vh;display:flex;align-items:center;justify-content:center;padding:28px 14px;box-sizing:border-box;">
                        <section style="width:min(100%%,640px);background:rgba(255,255,255,.92);border:1px solid #cfe7df;border-radius:24px;box-shadow:0 24px 80px rgba(8,16,15,.12);overflow:hidden;">
                            <div style="padding:28px 28px 18px;display:flex;gap:14px;align-items:center;">
                                <img src="%s" alt="CoinTracker" style="width:54px;height:54px;border-radius:18px;box-shadow:0 14px 32px rgba(13,148,136,.24);" />
                                <div>
                                    <div style="font-size:28px;font-weight:800;line-height:1;color:#10201d;">CoinTracker</div>
                                    <div style="margin-top:4px;font-size:13px;font-weight:600;color:#667c76;">Money, neatly in motion</div>
                                </div>
                            </div>
                            <div style="background:%s;padding:34px 28px;text-align:center;">
                                <div style="display:inline-block;border-radius:999px;background:#ffffff;color:%s;padding:8px 14px;font-size:12px;font-weight:800;letter-spacing:.08em;">%s</div>
                                <h1 style="margin:18px 0 10px;font-size:clamp(30px,8vw,46px);line-height:1;color:#10201d;">%s</h1>
                                <p style="max-width:470px;margin:0 auto;font-size:16px;line-height:1.7;color:#435954;">%s</p>
                            </div>
                            <div style="padding:26px;text-align:center;">
                                <a href="%s" style="display:inline-block;background:%s;color:#ffffff;text-decoration:none;padding:14px 24px;border-radius:12px;font-weight:800;">%s</a>
                                <p style="margin:22px 0 0;font-size:13px;color:#667c76;">Track income, expenses, categories, and daily summaries from one clean workspace.</p>
                            </div>
                        </section>
                    </main>
                </body>
                </html>
                """.formatted(
                title,
                frontendUrl + "/pwa-icon.svg",
                soft,
                accent,
                status,
                title,
                message,
                buttonLink,
                accent,
                buttonText);
    }
}
