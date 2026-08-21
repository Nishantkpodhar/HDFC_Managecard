package com.banking360.loan.dto;

import jakarta.validation.constraints.*;
import lombok.*;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoanApplicationRequest {
    private String customerId;
    private String product;
    private java.math.BigDecimal amount;
    private String status;
}
