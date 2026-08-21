package com.banking360.customer.dto;

import lombok.*;
import java.math.BigDecimal;
import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CustomerProfileResponse {
    private String id;
    private String fullName;
    private String mobile;
    private String email;
    private String segment;
    private String status;
    private Instant createdAt;
    private Instant updatedAt;
}
