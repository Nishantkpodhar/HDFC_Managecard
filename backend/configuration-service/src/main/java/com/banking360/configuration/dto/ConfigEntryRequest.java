package com.banking360.configuration.dto;

import jakarta.validation.constraints.*;
import lombok.*;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ConfigEntryRequest {
    private String key;
    private String value;
    private String category;
}
