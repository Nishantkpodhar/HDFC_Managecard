package com.banking360.customer.dto;

import jakarta.validation.constraints.*;
import lombok.*;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CustomerProfileRequest {
    private String fullName;
    private String mobile;
    private String email;
    private String segment;
    private String status;
}
