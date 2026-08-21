package com.banking360.emi.dto;

import lombok.*;
import java.math.BigDecimal;
import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmiPlanResponse {
    private String id;
    private String customerId;
    private String cardId;
    private Integer tenure;
    private java.math.BigDecimal principal;
    private java.math.BigDecimal interestRate;
    private String status;
    private Instant createdAt;
    private Instant updatedAt;
}
