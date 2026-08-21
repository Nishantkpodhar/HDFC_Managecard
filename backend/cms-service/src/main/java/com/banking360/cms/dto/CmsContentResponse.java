package com.banking360.cms.dto;

import lombok.*;
import java.math.BigDecimal;
import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CmsContentResponse {
    private String id;
    private String type;
    private String title;
    private String body;
    private String status;
    private Instant createdAt;
    private Instant updatedAt;
}
