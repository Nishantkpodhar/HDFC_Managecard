package com.banking360.loan.dto;

import lombok.*;
import java.math.BigDecimal;
import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoanApplicationResponse {
    private String id;
    private String customerId;
    private String product;
    private java.math.BigDecimal amount;
    private String status;
    private Instant createdAt;
    private Instant updatedAt;
}
