package com.banking360.emi.dto;

import jakarta.validation.constraints.*;
import lombok.*;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmiPlanRequest {
    private String customerId;
    private String cardId;
    private Integer tenure;
    private java.math.BigDecimal principal;
    private java.math.BigDecimal interestRate;
    private String status;
}
