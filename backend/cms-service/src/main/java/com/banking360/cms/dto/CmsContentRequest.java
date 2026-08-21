package com.banking360.cms.dto;

import jakarta.validation.constraints.*;
import lombok.*;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CmsContentRequest {
    private String type;
    private String title;
    private String body;
    private String status;
}
