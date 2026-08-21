package com.banking360.featureflag.dto;

import lombok.*;
import java.math.BigDecimal;
import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FeatureFlagResponse {
    private String id;
    private String name;
    private Boolean enabled;
    private String segment;
    private Instant createdAt;
    private Instant updatedAt;
}
