package com.banking360.loan.service;

import com.banking360.loan.domain.LoanApplication;
import com.banking360.loan.dto.LoanApplicationRequest;
import com.banking360.loan.dto.LoanApplicationResponse;
import com.banking360.loan.repository.LoanApplicationRepository;
import com.banking360.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class LoanApplicationService {

    private final LoanApplicationRepository repository;

    public ApiResponse<Page<LoanApplicationResponse>> list(Pageable pageable) {
        return ApiResponse.success(repository.findAll(pageable).map(this::toResponse));
    }

    public ApiResponse<LoanApplicationResponse> get(String id) {
        return ApiResponse.success(toResponse(repository.findById(id)
            .orElseThrow(() -> com.banking360.common.exception.ApiException.notFound("LoanApplication", id))));
    }

    public ApiResponse<LoanApplicationResponse> create(LoanApplicationRequest req) {
        LoanApplication e = toEntity(req);
        e.setId(UUID.randomUUID().toString());
        return ApiResponse.success(toResponse(repository.save(e)));
    }

    public ApiResponse<LoanApplicationResponse> update(String id, LoanApplicationRequest req) {
        LoanApplication e = repository.findById(id)
            .orElseThrow(() -> com.banking360.common.exception.ApiException.notFound("LoanApplication", id));
        apply(e, req);
        return ApiResponse.success(toResponse(repository.save(e)));
    }

    public ApiResponse<Void> delete(String id) {
        repository.deleteById(id);
        return ApiResponse.success(null);
    }

    private LoanApplicationResponse toResponse(LoanApplication e) {
        LoanApplicationResponse r = LoanApplicationResponse.builder()
            .id(e.getId())
            .customerId(e.getCustomerId())
            .product(e.getProduct())
            .amount(e.getAmount())
            .status(e.getStatus())
            .createdAt(e.getCreatedAt())
            .updatedAt(e.getUpdatedAt())
            .build();
        return r;
    }

    private LoanApplication toEntity(LoanApplicationRequest req) {
        LoanApplication e = new LoanApplication();
        apply(e, req);
        return e;
    }

    private void apply(LoanApplication e, LoanApplicationRequest req) {
        e.setCustomerId(req.getCustomerId());
        e.setProduct(req.getProduct());
        e.setAmount(req.getAmount());
        e.setStatus(req.getStatus());
    }
}
