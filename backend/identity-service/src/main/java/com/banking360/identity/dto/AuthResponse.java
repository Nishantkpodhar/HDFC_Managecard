package com.banking360.identity.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthResponse {
    private String token;
    private String otpReference;
    private String userId;
    private String role;
    private String status;
    private boolean requiresOtp;
}