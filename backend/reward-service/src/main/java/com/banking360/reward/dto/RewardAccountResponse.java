package com.banking360.reward.dto;

import lombok.*;
import java.math.BigDecimal;
import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RewardAccountResponse {
    private String id;
    private String customerId;
    private java.math.BigDecimal balance;
    private String currency;
    private Instant createdAt;
    private Instant updatedAt;
}
