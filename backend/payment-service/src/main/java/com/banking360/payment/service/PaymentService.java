package com.banking360.payment.service;

import com.banking360.common.dto.ApiResponse;
import com.banking360.common.exception.ApiException;
import com.banking360.common.security.Authz;
import com.banking360.payment.domain.Payment;
import com.banking360.payment.dto.PaymentRequest;
import com.banking360.payment.dto.PaymentResponse;
import com.banking360.payment.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository repository;

    public ApiResponse<Page<PaymentResponse>> list(Pageable pageable) {
        Page<Payment> page = Authz.isAdmin()
                ? repository.findAll(pageable)
                : repository.findByCustomerId(Authz.currentUserId(), pageable);
        return ApiResponse.success(page.map(this::toResponse));
    }

    public ApiResponse<PaymentResponse> get(String id) {
        Payment e = repository.findById(id)
                .orElseThrow(() -> ApiException.notFound("Payment", id));
        Authz.assertCustomerAccess(e.getCustomerId());
        return ApiResponse.success(toResponse(e));
    }

    /**
     * Idempotent payment creation. Duplicate Idempotency-Key + customer
     * returns the original payment instead of creating a second one.
     */
    public ApiResponse<PaymentResponse> create(PaymentRequest req) {
        if (!Authz.isAdmin()) {
            // Customers may only create payments for their own account. The
            // customerId is derived from the gateway-propagated principal; if the
            // client omits or mismatches it, we bind to the principal instead of
            // trusting a client-supplied identifier.
            String principal = Authz.currentUserId();
            if (req.getCustomerId() == null || req.getCustomerId().isBlank()) {
                req.setCustomerId(principal);
            } else if (!req.getCustomerId().equals(principal)) {
                throw ApiException.forbidden(
                        "You are not authorized to create payments for another customer");
            }
        }
        Authz.assertCustomerAccess(req.getCustomerId());
        if (req.getAmount() == null || req.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
            throw ApiException.badRequest("INVALID_AMOUNT", "Amount must be positive");
        }
        if (req.getIdempotencyKey() != null && !req.getIdempotencyKey().isBlank()) {
            Payment existing = repository
                    .findByIdempotencyKeyAndCustomerId(req.getIdempotencyKey(), req.getCustomerId());
            if (existing != null) {
                return ApiResponse.success(toResponse(existing));
            }
        }
        Payment e = toEntity(req);
        e.setId(UUID.randomUUID().toString());
        if (e.getStatus() == null) {
            e.setStatus("PROCESSING");
        }
        return ApiResponse.success(toResponse(repository.save(e)));
    }

    public ApiResponse<PaymentResponse> update(String id, PaymentRequest req) {
        Payment e = repository.findById(id)
                .orElseThrow(() -> ApiException.notFound("Payment", id));
        Authz.assertCustomerAccess(e.getCustomerId());
        apply(e, req);
        return ApiResponse.success(toResponse(repository.save(e)));
    }

    public ApiResponse<Void> delete(String id) {
        Payment e = repository.findById(id)
                .orElseThrow(() -> ApiException.notFound("Payment", id));
        Authz.assertCustomerAccess(e.getCustomerId());
        repository.deleteById(id);
        return ApiResponse.success(null);
    }

    private PaymentResponse toResponse(Payment e) {
        return PaymentResponse.builder()
            .id(e.getId())
            .customerId(e.getCustomerId())
            .fromCardId(e.getFromCardId())
            .toAccount(e.getToAccount())
            .amount(e.getAmount())
            .currency(e.getCurrency())
            .status(e.getStatus())
            .idempotencyKey(e.getIdempotencyKey())
            .createdAt(e.getCreatedAt())
            .updatedAt(e.getUpdatedAt())
            .build();
    }

    private Payment toEntity(PaymentRequest req) {
        Payment e = new Payment();
        apply(e, req);
        return e;
    }

    private void apply(Payment e, PaymentRequest req) {
        e.setCustomerId(req.getCustomerId());
        e.setFromCardId(req.getFromCardId());
        e.setToAccount(req.getToAccount());
        e.setAmount(req.getAmount());
        e.setCurrency(req.getCurrency());
        e.setStatus(req.getStatus());
        e.setIdempotencyKey(req.getIdempotencyKey());
    }
}