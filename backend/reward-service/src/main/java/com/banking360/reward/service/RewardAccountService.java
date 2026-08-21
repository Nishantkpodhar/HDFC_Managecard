package com.banking360.reward.service;

import com.banking360.reward.domain.RewardAccount;
import com.banking360.reward.dto.RewardAccountRequest;
import com.banking360.reward.dto.RewardAccountResponse;
import com.banking360.reward.repository.RewardAccountRepository;
import com.banking360.common.dto.ApiResponse;
import com.banking360.common.exception.ApiException;
import com.banking360.common.security.Authz;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RewardAccountService {

    private final RewardAccountRepository repository;

    public ApiResponse<Page<RewardAccountResponse>> list(Pageable pageable) {
        Authz.requireAdmin();
        return ApiResponse.success(repository.findAll(pageable).map(this::toResponse));
    }

    public ApiResponse<RewardAccountResponse> get(String id) {
        RewardAccount e = repository.findById(id)
            .orElseThrow(() -> ApiException.notFound("RewardAccount", id));
        Authz.assertCustomerAccess(e.getCustomerId());
        return ApiResponse.success(toResponse(e));
    }

    /** Returns the authenticated customer's reward balance (object-level scoped). */
    public ApiResponse<RewardAccountResponse> getForCustomer(String customerId) {
        Authz.assertCustomerAccess(customerId);
        RewardAccount e = repository.findByCustomerId(customerId);
        if (e == null) {
            // No reward account yet — return a zero balance rather than 404.
            return ApiResponse.success(RewardAccountResponse.builder()
                .customerId(customerId)
                .balance(java.math.BigDecimal.ZERO)
                .currency("INR")
                .build());
        }
        return ApiResponse.success(toResponse(e));
    }

    /**
     * Self-service endpoint for the customer rewards MF. Returns the caller's
     * reward account and a (currently empty) transaction list. The customerId is
     * derived from the gateway-propagated principal; never trusts client input.
     */
    public ApiResponse<?> getMe() {
        String customerId = Authz.currentUserId();
        RewardAccount e = repository.findByCustomerId(customerId);
        RewardAccountResponse account;
        if (e == null) {
            account = RewardAccountResponse.builder()
                .customerId(customerId)
                .balance(java.math.BigDecimal.ZERO)
                .currency("INR")
                .build();
        } else {
            account = toResponse(e);
        }
        return ApiResponse.success(java.util.Map.of("account", account, "transactions", java.util.List.of()));
    }

    public ApiResponse<RewardAccountResponse> create(RewardAccountRequest req) {
        if (req.getCustomerId() == null) throw ApiException.badRequest("INVALID", "customerId required");
        RewardAccount e = toEntity(req);
        e.setId(UUID.randomUUID().toString());
        return ApiResponse.success(toResponse(repository.save(e)));
    }

    public ApiResponse<RewardAccountResponse> update(String id, RewardAccountRequest req) {
        RewardAccount e = repository.findById(id)
            .orElseThrow(() -> ApiException.notFound("RewardAccount", id));
        Authz.assertCustomerAccess(e.getCustomerId());
        apply(e, req);
        return ApiResponse.success(toResponse(repository.save(e)));
    }

    public ApiResponse<Void> delete(String id) {
        RewardAccount e = repository.findById(id)
            .orElseThrow(() -> ApiException.notFound("RewardAccount", id));
        Authz.assertCustomerAccess(e.getCustomerId());
        repository.deleteById(id);
        return ApiResponse.success(null);
    }

    private RewardAccountResponse toResponse(RewardAccount e) {
        RewardAccountResponse r = RewardAccountResponse.builder()
            .id(e.getId())
            .customerId(e.getCustomerId())
            .balance(e.getBalance())
            .currency(e.getCurrency())
            .createdAt(e.getCreatedAt())
            .updatedAt(e.getUpdatedAt())
            .build();
        return r;
    }

    private RewardAccount toEntity(RewardAccountRequest req) {
        RewardAccount e = new RewardAccount();
        apply(e, req);
        return e;
    }

    private void apply(RewardAccount e, RewardAccountRequest req) {
        e.setCustomerId(req.getCustomerId());
        e.setBalance(req.getBalance());
        e.setCurrency(req.getCurrency());
    }
}
