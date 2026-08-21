package com.banking360.payment.dto;

import lombok.*;
import java.math.BigDecimal;
import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentResponse {
    private String id;
    private String customerId;
    private String fromCardId;
    private String toAccount;
    private java.math.BigDecimal amount;
    private String currency;
    private String status;
    private String idempotencyKey;
    private Instant createdAt;
    private Instant updatedAt;
}
