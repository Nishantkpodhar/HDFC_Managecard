package com.banking360.notification.dto;

import lombok.*;
import java.math.BigDecimal;
import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotificationResponse {
    private String id;
    private String customerId;
    private String channel;
    private String template;
    private String status;
    private Instant createdAt;
    private Instant updatedAt;
}
