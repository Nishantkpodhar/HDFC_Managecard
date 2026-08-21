package com.banking360.admin.dto;

import lombok.*;
import java.math.BigDecimal;
import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminUserResponse {
    private String id;
    private String username;
    private String role;
    private String email;
    private String status;
    private Instant createdAt;
    private Instant updatedAt;
}
