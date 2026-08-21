package com.banking360.featureflag.dto;

import jakarta.validation.constraints.*;
import lombok.*;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FeatureFlagRequest {
    private String name;
    private Boolean enabled;
    private String segment;
}
