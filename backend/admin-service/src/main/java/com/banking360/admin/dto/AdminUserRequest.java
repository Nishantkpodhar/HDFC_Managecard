package com.banking360.admin.dto;

import jakarta.validation.constraints.*;
import lombok.*;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminUserRequest {
    private String username;
    private String role;
    private String email;
    private String status;
}
