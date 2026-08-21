package com.banking360.servicerequest.dto;

import jakarta.validation.constraints.*;
import lombok.*;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ServiceRequestRequest {
    private String customerId;
    private String type;
    private String status;
    private String description;
}
