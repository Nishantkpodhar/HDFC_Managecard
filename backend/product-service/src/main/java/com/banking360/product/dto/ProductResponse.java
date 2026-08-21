package com.banking360.product.dto;

import lombok.*;
import java.math.BigDecimal;
import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductResponse {
    private String id;
    private String name;
    private String category;
    private String eligibility;
    private Boolean active;
    private Instant createdAt;
    private Instant updatedAt;
}
