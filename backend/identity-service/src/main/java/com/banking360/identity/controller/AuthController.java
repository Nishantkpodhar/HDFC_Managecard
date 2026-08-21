package com.banking360.identity.controller;

import com.banking360.common.dto.ApiResponse;
import com.banking360.identity.dto.AuthRequest;
import com.banking360.identity.service.IdentityService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final IdentityService service;

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<?>> login(@Valid @RequestBody AuthRequest req) {
        return ResponseEntity.ok(service.sendOtp(req));
    }

    @PostMapping("/verify")
    public ResponseEntity<ApiResponse<?>> verify(@Valid @RequestBody AuthRequest req) {
        return ResponseEntity.ok(service.verifyOtp(req));
    }
}