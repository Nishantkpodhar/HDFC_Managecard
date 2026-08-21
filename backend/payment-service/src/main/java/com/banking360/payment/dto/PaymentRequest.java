package com.banking360.payment.dto;

import jakarta.validation.constraints.*;
import lombok.*;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentRequest {
    private String customerId;
    private String fromCardId;
    private String toAccount;
    private java.math.BigDecimal amount;
    private String currency;
    private String status;
    private String idempotencyKey;
}
