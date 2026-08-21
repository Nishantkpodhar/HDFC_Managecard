package com.banking360.fastag.domain;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;

@Entity
@Table(name = "fastags")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Fastag {
    @Id
    private String id;

    @Column(name = "customer_id")
    private String customerId;

    @Column(name = "vehicle_number")
    private String vehicleNumber;

    private String status;

    private java.math.BigDecimal balance;

    private String currency;

    @Column(name = "created_at", updatable = false)
    private Instant createdAt = Instant.now();

    @Column(name = "updated_at")
    private Instant updatedAt = Instant.now();

    @PreUpdate
    void preUpdate() { this.updatedAt = Instant.now(); }
}
