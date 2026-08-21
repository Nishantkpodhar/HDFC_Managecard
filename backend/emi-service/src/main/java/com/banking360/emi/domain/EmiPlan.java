package com.banking360.emi.domain;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;

@Entity
@Table(name = "emi_plans")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmiPlan {
    @Id
    private String id;

    @Column(name = "customer_id")
    private String customerId;

    @Column(name = "card_id")
    private String cardId;

    private Integer tenure;

    private java.math.BigDecimal principal;

    @Column(name = "interest_rate")
    private java.math.BigDecimal interestRate;

    private String status;

    @Column(name = "created_at", updatable = false)
    private Instant createdAt = Instant.now();

    @Column(name = "updated_at")
    private Instant updatedAt = Instant.now();

    @PreUpdate
    void preUpdate() { this.updatedAt = Instant.now(); }
}
