package com.banking360.transaction.dto;

import lombok.*;
import java.math.BigDecimal;
import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TransactionResponse {
    private String id;
    private String customerId;
    private String cardId;
    private String description;
    private java.math.BigDecimal amount;
    private String currency;
    private String state;
    private Instant createdAt;
    private Instant updatedAt;
}
