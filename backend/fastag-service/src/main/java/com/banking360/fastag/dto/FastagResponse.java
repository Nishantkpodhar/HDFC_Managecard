package com.banking360.fastag.dto;

import lombok.*;
import java.math.BigDecimal;
import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FastagResponse {
    private String id;
    private String customerId;
    private String vehicleNumber;
    private String status;
    private java.math.BigDecimal balance;
    private String currency;
    private Instant createdAt;
    private Instant updatedAt;
}
