package com.banking360.card.domain;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.Instant;

/**
 * Card aggregate. Never stores CVV, CVV2 or PIN — only masked metadata.
 */
@Entity
@Table(name = "cards")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Card {
    @Id
    private String id;

    private String customerId;
    private String maskedNumber;
    private String lastFour;
    private String cardHolderName;
    private String type; // CREDIT | DEBIT
    private String productName;
    private String status; // ACTIVE | INACTIVE | BLOCKED | HOTLISTED | CLOSED | EXPIRED

    private Integer expiryMonth;
    private Integer expiryYear;

    private BigDecimal creditLimit;
    private BigDecimal availableLimit;
    private BigDecimal annualFee;

    // Card controls
    private Boolean domesticEnabled = true;
    private Boolean internationalEnabled = true;
    private Boolean onlineEnabled = true;
    private Boolean contactlessEnabled = true;
    private Boolean pinSet = false;

    private String idempotencyKey;

    @Column(updatable = false)
    private Instant createdAt = Instant.now();
    private Instant updatedAt = Instant.now();

    @PreUpdate
    @PrePersist
    void touch() { this.updatedAt = Instant.now(); }
}