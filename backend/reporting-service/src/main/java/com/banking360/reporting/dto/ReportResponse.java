package com.banking360.reporting.dto;

import lombok.*;
import java.math.BigDecimal;
import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReportResponse {
    private String id;
    private String name;
    private String type;
    private String status;
    private Instant createdAt;
    private Instant updatedAt;
}
