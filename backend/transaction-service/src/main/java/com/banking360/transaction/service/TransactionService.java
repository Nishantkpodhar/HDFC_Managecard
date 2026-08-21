package com.banking360.transaction.service;

import com.banking360.common.dto.ApiResponse;
import com.banking360.common.exception.ApiException;
import com.banking360.common.security.Authz;
import com.banking360.transaction.domain.Transaction;
import com.banking360.transaction.dto.TransactionRequest;
import com.banking360.transaction.dto.TransactionResponse;
import com.banking360.transaction.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TransactionService {

    private final TransactionRepository repository;

    /** Allowed state transitions for the transaction lifecycle. */
    private static final Map<String, Set<String>> TRANSITIONS = Map.of(
        "AUTHORIZED", Set.of("SETTLED", "BILLED", "PENDING", "UNSETTLED", "FAILED", "REVERSED"),
        "PENDING", Set.of("AUTHORIZED", "UNSETTLED", "SETTLED", "FAILED"),
        "UNSETTLED", Set.of("SETTLED", "FAILED"),
        "SETTLED", Set.of("BILLED", "REFUNDED", "REVERSED"),
        "BILLED", Set.of(),
        "REFUNDED", Set.of(),
        "REVERSED", Set.of(),
        "FAILED", Set.of()
    );

    public ApiResponse<Page<TransactionResponse>> list(Pageable pageable) {
        Page<Transaction> page = Authz.isAdmin()
                ? repository.findAll(pageable)
                : repository.findByCustomerId(Authz.currentUserId(), pageable);
        return ApiResponse.success(page.map(this::toResponse));
    }

    public ApiResponse<TransactionResponse> get(String id) {
        Transaction e = repository.findById(id)
            .orElseThrow(() -> ApiException.notFound("Transaction", id));
        Authz.assertCustomerAccess(e.getCustomerId());
        return ApiResponse.success(toResponse(e));
    }

    public ApiResponse<Page<TransactionResponse>> listByCustomer(String customerId, Pageable pageable) {
        Authz.assertCustomerAccess(customerId);
        Page<Transaction> page = repository.findByCustomerId(customerId, pageable);
        return ApiResponse.success(page.map(this::toResponse));
    }

    public ApiResponse<TransactionResponse> create(TransactionRequest req) {
        Authz.assertCustomerAccess(req.getCustomerId());
        if (req.getAmount() == null || req.getAmount().compareTo(BigDecimal.ZERO) == 0) {
            throw ApiException.badRequest("INVALID_AMOUNT", "Amount must be non-zero");
        }
        Transaction e = toEntity(req);
        e.setId(UUID.randomUUID().toString());
        if (e.getState() == null || e.getState().isBlank()) {
            e.setState("PENDING");
        }
        validateInitialState(e.getState());
        return ApiResponse.success(toResponse(repository.save(e)));
    }

    public ApiResponse<TransactionResponse> update(String id, TransactionRequest req) {
        Transaction e = repository.findById(id)
            .orElseThrow(() -> ApiException.notFound("Transaction", id));
        Authz.assertCustomerAccess(e.getCustomerId());
        if (req.getState() != null && !req.getState().equals(e.getState())) {
            validateTransition(e.getState(), req.getState());
            e.setState(req.getState());
        }
        e.setDescription(req.getDescription());
        e.setAmount(req.getAmount());
        e.setCurrency(req.getCurrency());
        e.setCardId(req.getCardId());
        return ApiResponse.success(toResponse(repository.save(e)));
    }

    public ApiResponse<Void> delete(String id) {
        Transaction e = repository.findById(id)
            .orElseThrow(() -> ApiException.notFound("Transaction", id));
        Authz.assertCustomerAccess(e.getCustomerId());
        repository.deleteById(id);
        return ApiResponse.success(null);
    }

    private void validateInitialState(String state) {
        if (!TRANSITIONS.containsKey(state)) {
            throw ApiException.badRequest("INVALID_STATE",
                "Unknown transaction state: " + state);
        }
    }

    private void validateTransition(String from, String to) {
        Set<String> allowed = TRANSITIONS.getOrDefault(from, Set.of());
        if (!allowed.contains(to)) {
            throw ApiException.badRequest("ILLEGAL_TRANSITION",
                "Illegal transaction state transition: " + from + " -> " + to);
        }
    }

    private TransactionResponse toResponse(Transaction e) {
        return TransactionResponse.builder()
            .id(e.getId())
            .customerId(e.getCustomerId())
            .cardId(e.getCardId())
            .description(e.getDescription())
            .amount(e.getAmount())
            .currency(e.getCurrency())
            .state(e.getState())
            .createdAt(e.getCreatedAt())
            .updatedAt(e.getUpdatedAt())
            .build();
    }

    private Transaction toEntity(TransactionRequest req) {
        Transaction e = new Transaction();
        e.setCustomerId(req.getCustomerId());
        e.setCardId(req.getCardId());
        e.setDescription(req.getDescription());
        e.setAmount(req.getAmount());
        e.setCurrency(req.getCurrency());
        e.setState(req.getState());
        return e;
    }
}