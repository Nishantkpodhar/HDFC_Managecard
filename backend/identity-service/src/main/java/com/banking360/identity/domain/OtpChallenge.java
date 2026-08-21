package com.banking360.identity.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "otp_challenge")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OtpChallenge {
    @Id
    @GeneratedValue
    private UUID id;

    @Column(nullable = false, length = 20)
    private String mobile;

    @Column(name = "otp_hash", nullable = false, length = 128)
    private String otpHash;

    @Column(length = 20)
    @Builder.Default
    private String channel = "SMS";

    @Builder.Default
    private boolean verified = false;

    @Column(name = "expires_at", nullable = false)
    private Instant expiresAt;

    @Column(name = "created_at")
    @Builder.Default
    private Instant createdAt = Instant.now();

    @Column(name = "attempt_count")
    @Builder.Default
    private int attemptCount = 0;
}