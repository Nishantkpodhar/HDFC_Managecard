package com.banking360.ledger.dto;

import lombok.*;
import java.math.BigDecimal;
import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LedgerEntryResponse {
    private String id;
    private String accountId;
    private String type;
    private BigDecimal amount;
    private String currency;
    private String referenceId;
    private String idempotencyKey;
    private Instant postedAt;
    private Instant createdAt;
}