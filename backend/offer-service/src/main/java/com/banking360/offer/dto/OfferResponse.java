package com.banking360.offer.dto;

import lombok.*;
import java.math.BigDecimal;
import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OfferResponse {
    private String id;
    private String title;
    private String category;
    private String segment;
    private String status;
    private java.math.BigDecimal minSpend;
    private Instant createdAt;
    private Instant updatedAt;
}
