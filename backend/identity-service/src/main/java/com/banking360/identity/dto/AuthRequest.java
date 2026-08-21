package com.banking360.identity.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthRequest {
    @NotBlank
    private String mobile;
    private String otp;
    private String channel; // CUSTOMER, ADMIN
}