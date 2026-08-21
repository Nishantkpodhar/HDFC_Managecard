package com.banking360.audit.dto;

import jakarta.validation.constraints.*;
import lombok.*;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuditLogRequest {
    private String actor;
    private String action;
    private String entity;
    private String entityId;
    private String result;
}
