package com.banking360.transaction.dto;

import jakarta.validation.constraints.*;
import lombok.*;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TransactionRequest {
    private String customerId;
    private String cardId;
    private String description;
    private java.math.BigDecimal amount;
    private String currency;
    private String state;
}
