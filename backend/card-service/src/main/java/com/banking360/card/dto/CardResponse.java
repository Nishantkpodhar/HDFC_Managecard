package com.banking360.card.dto;

import com.banking360.card.domain.Card;
import lombok.*;
import java.math.BigDecimal;
import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CardResponse {
    private String id;
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
    private Boolean domesticEnabled;
    private Boolean internationalEnabled;
    private Boolean onlineEnabled;
    private Boolean contactlessEnabled;
    private Boolean pinSet;
    private Instant createdAt;
    private Instant updatedAt;

    public static CardResponse from(Card e) {
        return CardResponse.builder()
            .id(e.getId())
            .customerId(e.getCustomerId())
            .maskedNumber(e.getMaskedNumber())
            .lastFour(e.getLastFour())
            .cardHolderName(e.getCardHolderName())
            .type(e.getType())
            .productName(e.getProductName())
            .status(e.getStatus())
            .expiryMonth(e.getExpiryMonth())
            .expiryYear(e.getExpiryYear())
            .creditLimit(e.getCreditLimit())
            .availableLimit(e.getAvailableLimit())
            .annualFee(e.getAnnualFee())
            .domesticEnabled(e.getDomesticEnabled())
            .internationalEnabled(e.getInternationalEnabled())
            .onlineEnabled(e.getOnlineEnabled())
            .contactlessEnabled(e.getContactlessEnabled())
            .pinSet(e.getPinSet())
            .createdAt(e.getCreatedAt())
            .updatedAt(e.getUpdatedAt())
            .build();
    }
}