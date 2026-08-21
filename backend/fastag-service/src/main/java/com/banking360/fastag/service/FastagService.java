package com.banking360.fastag.service;

import com.banking360.fastag.domain.Fastag;
import com.banking360.fastag.dto.FastagRequest;
import com.banking360.fastag.dto.FastagResponse;
import com.banking360.fastag.repository.FastagRepository;
import com.banking360.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class FastagService {

    private final FastagRepository repository;

    public ApiResponse<Page<FastagResponse>> list(Pageable pageable) {
        return ApiResponse.success(repository.findAll(pageable).map(this::toResponse));
    }

    public ApiResponse<FastagResponse> get(String id) {
        return ApiResponse.success(toResponse(repository.findById(id)
            .orElseThrow(() -> com.banking360.common.exception.ApiException.notFound("Fastag", id))));
    }

    public ApiResponse<FastagResponse> create(FastagRequest req) {
        Fastag e = toEntity(req);
        e.setId(UUID.randomUUID().toString());
        return ApiResponse.success(toResponse(repository.save(e)));
    }

    public ApiResponse<FastagResponse> update(String id, FastagRequest req) {
        Fastag e = repository.findById(id)
            .orElseThrow(() -> com.banking360.common.exception.ApiException.notFound("Fastag", id));
        apply(e, req);
        return ApiResponse.success(toResponse(repository.save(e)));
    }

    public ApiResponse<Void> delete(String id) {
        repository.deleteById(id);
        return ApiResponse.success(null);
    }

    private FastagResponse toResponse(Fastag e) {
        FastagResponse r = FastagResponse.builder()
            .id(e.getId())
            .customerId(e.getCustomerId())
            .vehicleNumber(e.getVehicleNumber())
            .status(e.getStatus())
            .balance(e.getBalance())
            .currency(e.getCurrency())
            .createdAt(e.getCreatedAt())
            .updatedAt(e.getUpdatedAt())
            .build();
        return r;
    }

    private Fastag toEntity(FastagRequest req) {
        Fastag e = new Fastag();
        apply(e, req);
        return e;
    }

    private void apply(Fastag e, FastagRequest req) {
        e.setCustomerId(req.getCustomerId());
        e.setVehicleNumber(req.getVehicleNumber());
        e.setStatus(req.getStatus());
        e.setBalance(req.getBalance());
        e.setCurrency(req.getCurrency());
    }
}
