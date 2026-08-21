package com.banking360.card.service;

import com.banking360.card.domain.Card;
import com.banking360.card.dto.CardControlRequest;
import com.banking360.card.dto.CardRequest;
import com.banking360.card.dto.CardResponse;
import com.banking360.card.repository.CardRepository;
import com.banking360.common.dto.ApiResponse;
import com.banking360.common.exception.ApiException;
import com.banking360.common.security.Authz;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CardService {

    private final CardRepository repository;

    /** Allowed card status transitions (state machine). */
    private static final Map<String, Set<String>> STATUS_TRANSITIONS = Map.of(
        "ACTIVE", Set.of("INACTIVE", "BLOCKED", "HOTLISTED", "CLOSED", "EXPIRED"),
        "INACTIVE", Set.of("ACTIVE", "BLOCKED", "HOTLISTED", "CLOSED", "EXPIRED"),
        "BLOCKED", Set.of("ACTIVE", "HOTLISTED", "CLOSED"),
        "HOTLISTED", Set.of("CLOSED"),
        "CLOSED", Set.of(),
        "EXPIRED", Set.of()
    );

    public ApiResponse<Page<CardResponse>> list(Pageable pageable) {
        // Customers see only their own cards; admins see all.
        Page<Card> page = Authz.isAdmin()
                ? repository.findAll(pageable)
                : new org.springframework.data.domain.PageImpl<>(
                    repository.findByCustomerId(Authz.currentUserId()), pageable,
                    repository.findByCustomerId(Authz.currentUserId()).size());
        return ApiResponse.success(page.map(CardResponse::from));
    }

    public ApiResponse<List<CardResponse>> listByCustomer(String customerId) {
        Authz.assertCustomerAccess(customerId);
        return ApiResponse.success(repository.findByCustomerId(customerId).stream()
                .map(CardResponse::from).collect(Collectors.toList()));
    }

    public ApiResponse<CardResponse> get(String id) {
        Card e = repository.findById(id)
                .orElseThrow(() -> ApiException.notFound("Card", id));
        Authz.assertCustomerAccess(e.getCustomerId());
        return ApiResponse.success(CardResponse.from(e));
    }

    public ApiResponse<CardResponse> create(CardRequest req) {
        // Object-level: a customer may only create cards under their own id.
        Authz.assertCustomerAccess(req.getCustomerId());
        if (req.getIdempotencyKey() != null && !req.getIdempotencyKey().isBlank()) {
            Card existing = repository.findByIdempotencyKey(req.getIdempotencyKey());
            if (existing != null) {
                return ApiResponse.success(CardResponse.from(existing));
            }
        }
        Card e = toEntity(req);
        e.setId(UUID.randomUUID().toString());
        if (e.getStatus() == null) {
            e.setStatus("ACTIVE");
        }
        return ApiResponse.success(CardResponse.from(repository.save(e)));
    }

    public ApiResponse<CardResponse> update(String id, CardRequest req) {
        Card e = repository.findById(id)
                .orElseThrow(() -> ApiException.notFound("Card", id));
        Authz.assertCustomerAccess(e.getCustomerId());
        apply(e, req);
        return ApiResponse.success(CardResponse.from(repository.save(e)));
    }

    public ApiResponse<Void> delete(String id) {
        Card e = repository.findById(id)
                .orElseThrow(() -> ApiException.notFound("Card", id));
        Authz.assertCustomerAccess(e.getCustomerId());
        repository.deleteById(id);
        return ApiResponse.success(null);
    }

    // ---- Card control operations ----

    public ApiResponse<CardResponse> updateControls(String id, CardControlRequest req) {
        Card e = repository.findById(id)
                .orElseThrow(() -> ApiException.notFound("Card", id));
        Authz.assertCustomerAccess(e.getCustomerId());
        if (req.getDomesticEnabled() != null) e.setDomesticEnabled(req.getDomesticEnabled());
        if (req.getInternationalEnabled() != null) e.setInternationalEnabled(req.getInternationalEnabled());
        if (req.getOnlineEnabled() != null) e.setOnlineEnabled(req.getOnlineEnabled());
        if (req.getContactlessEnabled() != null) e.setContactlessEnabled(req.getContactlessEnabled());
        if (req.getPinSet() != null) e.setPinSet(req.getPinSet());
        return ApiResponse.success(CardResponse.from(repository.save(e)));
    }

    public ApiResponse<CardResponse> setStatus(String id, String status) {
        Card e = repository.findById(id)
                .orElseThrow(() -> ApiException.notFound("Card", id));
        Authz.assertCustomerAccess(e.getCustomerId());
        if (status == null || status.isBlank()) {
            throw ApiException.badRequest("INVALID_STATUS", "Status is required");
        }
        Set<String> allowed = STATUS_TRANSITIONS.getOrDefault(e.getStatus(), Set.of());
        if (!allowed.contains(status)) {
            throw ApiException.badRequest("ILLEGAL_STATUS_TRANSITION",
                "Illegal card status transition: " + e.getStatus() + " -> " + status);
        }
        // Audit-worthy control transition (BLOCK/HOTLIST/CLOSE/ACTIVATE).
        e.setStatus(status);
        return ApiResponse.success(CardResponse.from(repository.save(e)));
    }

    public ApiResponse<CardResponse> limitEnhancement(String id, java.math.BigDecimal newLimit) {
        Card e = repository.findById(id)
                .orElseThrow(() -> ApiException.notFound("Card", id));
        Authz.assertCustomerAccess(e.getCustomerId());
        if (newLimit == null || newLimit.compareTo(java.math.BigDecimal.ZERO) <= 0) {
            throw ApiException.badRequest("INVALID_LIMIT", "Invalid limit");
        }
        e.setCreditLimit(newLimit);
        e.setAvailableLimit(newLimit);
        return ApiResponse.success(CardResponse.from(repository.save(e)));
    }

    private Card toEntity(CardRequest req) {
        Card e = new Card();
        apply(e, req);
        return e;
    }

    private void apply(Card e, CardRequest req) {
        e.setCustomerId(req.getCustomerId());
        e.setMaskedNumber(req.getMaskedNumber());
        e.setLastFour(req.getLastFour());
        e.setCardHolderName(req.getCardHolderName());
        e.setType(req.getType());
        e.setProductName(req.getProductName());
        e.setStatus(req.getStatus());
        e.setExpiryMonth(req.getExpiryMonth());
        e.setExpiryYear(req.getExpiryYear());
        e.setCreditLimit(req.getCreditLimit());
        e.setAvailableLimit(req.getAvailableLimit());
        e.setAnnualFee(req.getAnnualFee());
        e.setIdempotencyKey(req.getIdempotencyKey());
    }
}