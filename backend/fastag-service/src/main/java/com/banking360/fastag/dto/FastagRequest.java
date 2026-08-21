package com.banking360.fastag.dto;

import jakarta.validation.constraints.*;
import lombok.*;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FastagRequest {
    private String customerId;
    private String vehicleNumber;
    private String status;
    private java.math.BigDecimal balance;
    private String currency;
}
