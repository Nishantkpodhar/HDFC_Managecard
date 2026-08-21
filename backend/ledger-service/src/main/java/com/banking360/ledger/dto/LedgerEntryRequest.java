package com.banking360.ledger.dto;

import jakarta.validation.constraints.*;
import lombok.*;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LedgerEntryRequest {
    @NotBlank private String accountId;
    @NotBlank private String type;
    @NotNull private BigDecimal amount;
    @NotBlank private String currency;
    private String referenceId;
    private String idempotencyKey;
}