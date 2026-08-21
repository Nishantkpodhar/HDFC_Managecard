package com.banking360.audit.dto;

import lombok.*;
import java.math.BigDecimal;
import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuditLogResponse {
    private String id;
    private String actor;
    private String action;
    private String entity;
    private String entityId;
    private String result;
    private Instant createdAt;
    private Instant updatedAt;
}
