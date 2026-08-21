package com.banking360.ledger.service;

import com.banking360.common.dto.ApiResponse;
import com.banking360.common.exception.ApiException;
import com.banking360.common.security.Authz;
import com.banking360.ledger.domain.LedgerEntry;
import com.banking360.ledger.dto.LedgerEntryRequest;
import com.banking360.ledger.dto.LedgerEntryResponse;
import com.banking360.ledger.repository.LedgerEntryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class LedgerEntryService {

    private final LedgerEntryRepository repository;

    /** Ledger is high-integrity and immutable. Only admins may post entries. */
    public ApiResponse<Page<LedgerEntryResponse>> list(Pageable pageable) {
        Authz.requireAdmin();
        return ApiResponse.success(repository.findAll(pageable).map(this::toResponse));
    }

    public ApiResponse<LedgerEntryResponse> get(String id) {
        Authz.requireAdmin();
        LedgerEntry e = repository.findById(id)
            .orElseThrow(() -> ApiException.notFound("LedgerEntry", id));
        return ApiResponse.success(toResponse(e));
    }

    /**
     * Post a ledger entry. Entries are immutable; the same idempotency key
     * always returns the original entry instead of creating a duplicate.
     */
    public ApiResponse<LedgerEntryResponse> post(LedgerEntryRequest req) {
        Authz.requireAdmin();
        if (req.getAmount() == null || req.getAmount().compareTo(BigDecimal.ZERO) == 0) {
            throw ApiException.badRequest("INVALID_AMOUNT", "Ledger amount must be non-zero");
        }
        if (req.getIdempotencyKey() != null && !req.getIdempotencyKey().isBlank()) {
            LedgerEntry existing = repository.findByIdempotencyKey(req.getIdempotencyKey());
            if (existing != null) {
                return ApiResponse.success(toResponse(existing));
            }
        }
        LedgerEntry e = LedgerEntry.builder()
            .id(UUID.randomUUID().toString())
            .accountId(req.getAccountId())
            .type(req.getType())
            .amount(req.getAmount())
            .currency(req.getCurrency())
            .referenceId(req.getReferenceId())
            .idempotencyKey(req.getIdempotencyKey())
            .postedAt(Instant.now())
            .build();
        return ApiResponse.success(toResponse(repository.save(e)));
    }

    private LedgerEntryResponse toResponse(LedgerEntry e) {
        return LedgerEntryResponse.builder()
            .id(e.getId())
            .accountId(e.getAccountId())
            .type(e.getType())
            .amount(e.getAmount())
            .currency(e.getCurrency())
            .referenceId(e.getReferenceId())
            .idempotencyKey(e.getIdempotencyKey())
            .postedAt(e.getPostedAt())
            .createdAt(e.getCreatedAt())
            .build();
    }
}