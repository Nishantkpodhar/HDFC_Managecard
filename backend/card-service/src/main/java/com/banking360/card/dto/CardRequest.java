package com.banking360.card.dto;

import lombok.*;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CardRequest {
    private String customerId;
    private String maskedNumber;
    private String lastFour;
    private String cardHolderName;
    private String type;
    private String productName;
    private String status;
    private Integer expiryMonth;
    private Integer expiryYear;
    private BigDecimal creditLimit;
    private BigDecimal availableLimit;
    private BigDecimal annualFee;
    private String idempotencyKey;
}
