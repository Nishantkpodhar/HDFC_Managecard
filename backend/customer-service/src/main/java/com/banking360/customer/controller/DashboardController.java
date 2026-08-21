package com.banking360.customer.controller;

import com.banking360.common.dto.ApiResponse;
import com.banking360.customer.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Customer dashboard composite view. Aggregates data owned by other
 * microservices (cards, transactions, payments) into a single response for the
 * customer shell dashboard micro-frontend. Authorization is enforced both here
 * (object-level via Authz) and downstream in each owning service.
 */
@RestController
@RequestMapping("/api/v1/customer")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<?>> dashboard() {
        return ResponseEntity.ok(ApiResponse.success(dashboardService.getDashboard()));
    }
}