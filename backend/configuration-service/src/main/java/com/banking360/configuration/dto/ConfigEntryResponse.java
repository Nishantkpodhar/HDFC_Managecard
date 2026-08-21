package com.banking360.configuration.dto;

import lombok.*;
import java.math.BigDecimal;
import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ConfigEntryResponse {
    private String id;
    private String key;
    private String value;
    private String category;
    private Instant createdAt;
    private Instant updatedAt;
}
