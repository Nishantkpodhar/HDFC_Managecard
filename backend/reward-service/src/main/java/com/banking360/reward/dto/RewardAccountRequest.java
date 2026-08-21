package com.banking360.reward.dto;

import jakarta.validation.constraints.*;
import lombok.*;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RewardAccountRequest {
    private String customerId;
    private java.math.BigDecimal balance;
    private String currency;
}
