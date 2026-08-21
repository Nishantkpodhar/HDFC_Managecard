package com.banking360.card.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CardControlRequest {
    private Boolean domesticEnabled;
    private Boolean internationalEnabled;
    private Boolean onlineEnabled;
    private Boolean contactlessEnabled;
    private Boolean pinSet;
}