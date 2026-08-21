package com.banking360.offer.dto;

import jakarta.validation.constraints.*;
import lombok.*;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OfferRequest {
    private String title;
    private String category;
    private String segment;
    private String status;
    private java.math.BigDecimal minSpend;
}
