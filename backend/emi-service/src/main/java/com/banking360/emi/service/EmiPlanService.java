package com.banking360.emi.service;

import com.banking360.emi.domain.EmiPlan;
import com.banking360.emi.dto.EmiPlanRequest;
import com.banking360.emi.dto.EmiPlanResponse;
import com.banking360.emi.repository.EmiPlanRepository;
import com.banking360.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class EmiPlanService {

    private final EmiPlanRepository repository;

    public ApiResponse<Page<EmiPlanResponse>> list(Pageable pageable) {
        return ApiResponse.success(repository.findAll(pageable).map(this::toResponse));
    }

    public ApiResponse<EmiPlanResponse> get(String id) {
        return ApiResponse.success(toResponse(repository.findById(id)
            .orElseThrow(() -> com.banking360.common.exception.ApiException.notFound("EmiPlan", id))));
    }

    public ApiResponse<EmiPlanResponse> create(EmiPlanRequest req) {
        EmiPlan e = toEntity(req);
        e.setId(UUID.randomUUID().toString());
        return ApiResponse.success(toResponse(repository.save(e)));
    }

    public ApiResponse<EmiPlanResponse> update(String id, EmiPlanRequest req) {
        EmiPlan e = repository.findById(id)
            .orElseThrow(() -> com.banking360.common.exception.ApiException.notFound("EmiPlan", id));
        apply(e, req);
        return ApiResponse.success(toResponse(repository.save(e)));
    }

    public ApiResponse<Void> delete(String id) {
        repository.deleteById(id);
        return ApiResponse.success(null);
    }

    private EmiPlanResponse toResponse(EmiPlan e) {
        EmiPlanResponse r = EmiPlanResponse.builder()
            .id(e.getId())
            .customerId(e.getCustomerId())
            .cardId(e.getCardId())
            .tenure(e.getTenure())
            .principal(e.getPrincipal())
            .interestRate(e.getInterestRate())
            .status(e.getStatus())
            .createdAt(e.getCreatedAt())
            .updatedAt(e.getUpdatedAt())
            .build();
        return r;
    }

    private EmiPlan toEntity(EmiPlanRequest req) {
        EmiPlan e = new EmiPlan();
        apply(e, req);
        return e;
    }

    private void apply(EmiPlan e, EmiPlanRequest req) {
        e.setCustomerId(req.getCustomerId());
        e.setCardId(req.getCardId());
        e.setTenure(req.getTenure());
        e.setPrincipal(req.getPrincipal());
        e.setInterestRate(req.getInterestRate());
        e.setStatus(req.getStatus());
    }
}
