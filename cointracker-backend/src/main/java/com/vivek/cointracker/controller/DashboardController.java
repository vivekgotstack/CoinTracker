package com.vivek.cointracker.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import com.vivek.cointracker.dto.DashboardResponse;
import com.vivek.cointracker.entity.ProfileEntity;
import com.vivek.cointracker.service.DashboardService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping
    public ResponseEntity<DashboardResponse> getDashboard(
            @AuthenticationPrincipal ProfileEntity user) {

        return ResponseEntity.ok(dashboardService.getDashboard(user.getId()));
    }
}