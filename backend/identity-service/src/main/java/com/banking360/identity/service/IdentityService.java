package com.banking360.identity.service;

import com.banking360.common.dto.ApiResponse;
import com.banking360.identity.domain.OtpChallenge;
import com.banking360.identity.dto.AuthRequest;
// import com.banking360.identity.dto.AuthResponse;
import com.banking360.identity.dto.LoginResult;
import com.banking360.identity.repository.OtpChallengeRepository;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.HexFormat;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Service
public class IdentityService {

    private final OtpChallengeRepository repository;
    private final SecretKey jwtKey;

    public IdentityService(OtpChallengeRepository repository,
                           @Value("${app.jwt.secret}") String jwtSecret) {
        this.repository = repository;
        this.jwtKey = Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
    }

    public ApiResponse<?> sendOtp(AuthRequest req) {
        String mobile = normalizeMobile(req.getMobile());
        String otp = generateOtp(mobile);
        OtpChallenge challenge = OtpChallenge.builder()
                .mobile(mobile)
                .otpHash(hashOtp(otp))
                .expiresAt(Instant.now().plus(5, ChronoUnit.MINUTES))
                .build();
        repository.save(challenge);
        // NOTE: In production, OTP is delivered via SMS/email provider. For this
        // development/demo, the OTP is logged only (never exposed in API response).
        System.out.println("[DEMO OTP] mobile=" + mobile + " otp=" + otp);
        return ApiResponse.success(Map.of("challengeId", challenge.getId().toString(), "expiresInSeconds", 300));
    }

    public ApiResponse<?> verifyOtp(AuthRequest req) {
        String mobile = normalizeMobile(req.getMobile());
        Optional<OtpChallenge> latest = repository.findTopByMobileOrderByCreatedAtDesc(mobile);
        OtpChallenge challenge = latest.orElseThrow(() -> new EntityNotFoundException("No OTP challenge found"));
        if (challenge.isVerified()) {
            return ApiResponse.error("ALREADY_VERIFIED", "OTP already verified");
        }
        if (challenge.getExpiresAt().isBefore(Instant.now())) {
            return ApiResponse.error("OTP_EXPIRED", "OTP has expired");
        }
        if (challenge.getAttemptCount() >= 5) {
            return ApiResponse.error("OTP_LOCKED", "Too many attempts");
        }
        if (!challenge.getOtpHash().equals(hashOtp(req.getOtp()))) {
            challenge.setAttemptCount(challenge.getAttemptCount() + 1);
            repository.save(challenge);
            return ApiResponse.error("INVALID_OTP", "Invalid OTP");
        }
        challenge.setVerified(true);
        repository.save(challenge);

        // Role is derived from the requested channel so the gateway/downstream
        // services receive a correct principal. Customers authenticate with
        // channel=CUSTOMER; administrators authenticate with channel=ADMIN.
        String channel = req.getChannel();
        String role = "CUSTOMER";
        if ("ADMIN".equalsIgnoreCase(channel)) {
            role = "SUPER_ADMIN";
        }
        String token = buildToken(mobile, role);
        LoginResult result = new LoginResult(token, mobile, role);
        return ApiResponse.success(result);
    }

    private String buildToken(String mobile, String role) {
        Instant now = Instant.now();
        return Jwts.builder()
                .subject(mobile)
                .claim("role", role)
                .issuedAt(java.util.Date.from(now))
                .expiration(java.util.Date.from(now.plus(2, ChronoUnit.HOURS)))
                .signWith(jwtKey)
                .compact();
    }

    private String generateOtp(String mobile) {
        // Development-only deterministic OTP for demo convenience.
        if (mobile.equals("9999999999") || mobile.equals("9999999998")) {
            return "123456";
        }
        return String.format("%06d", Math.abs(UUID.randomUUID().getLeastSignificantBits() % 1_000_000));
    }

    private String hashOtp(String otp) {
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            byte[] hash = md.digest(otp.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(hash);
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("SHA-256 unavailable", e);
        }
    }

    private String normalizeMobile(String mobile) {
        if (mobile == null) throw new IllegalArgumentException("mobile is required");
        return mobile.trim();
    }
}