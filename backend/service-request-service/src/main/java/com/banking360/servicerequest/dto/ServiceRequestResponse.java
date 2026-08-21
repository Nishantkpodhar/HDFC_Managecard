package com.banking360.servicerequest.dto;

import lombok.*;
import java.math.BigDecimal;
import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ServiceRequestResponse {
    private String id;
    private String customerId;
    private String type;
    private String status;
    private String description;
    private Instant createdAt;
    private Instant updatedAt;
}
