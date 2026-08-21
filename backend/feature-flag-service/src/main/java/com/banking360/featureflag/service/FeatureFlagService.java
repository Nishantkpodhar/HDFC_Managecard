package com.banking360.featureflag.service;

import com.banking360.featureflag.domain.FeatureFlag;
import com.banking360.featureflag.dto.FeatureFlagRequest;
import com.banking360.featureflag.dto.FeatureFlagResponse;
import com.banking360.featureflag.repository.FeatureFlagRepository;
import com.banking360.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class FeatureFlagService {

    private final FeatureFlagRepository repository;

    public ApiResponse<Page<FeatureFlagResponse>> list(Pageable pageable) {
        return ApiResponse.success(repository.findAll(pageable).map(this::toResponse));
    }

    public ApiResponse<FeatureFlagResponse> get(String id) {
        return ApiResponse.success(toResponse(repository.findById(id)
            .orElseThrow(() -> com.banking360.common.exception.ApiException.notFound("FeatureFlag", id))));
    }

    public ApiResponse<FeatureFlagResponse> create(FeatureFlagRequest req) {
        FeatureFlag e = toEntity(req);
        e.setId(UUID.randomUUID().toString());
        return ApiResponse.success(toResponse(repository.save(e)));
    }

    public ApiResponse<FeatureFlagResponse> update(String id, FeatureFlagRequest req) {
        FeatureFlag e = repository.findById(id)
            .orElseThrow(() -> com.banking360.common.exception.ApiException.notFound("FeatureFlag", id));
        apply(e, req);
        return ApiResponse.success(toResponse(repository.save(e)));
    }

    public ApiResponse<Void> delete(String id) {
        repository.deleteById(id);
        return ApiResponse.success(null);
    }

    private FeatureFlagResponse toResponse(FeatureFlag e) {
        FeatureFlagResponse r = FeatureFlagResponse.builder()
            .id(e.getId())
            .name(e.getName())
            .enabled(e.getEnabled())
            .segment(e.getSegment())
            .createdAt(e.getCreatedAt())
            .updatedAt(e.getUpdatedAt())
            .build();
        return r;
    }

    private FeatureFlag toEntity(FeatureFlagRequest req) {
        FeatureFlag e = new FeatureFlag();
        apply(e, req);
        return e;
    }

    private void apply(FeatureFlag e, FeatureFlagRequest req) {
        e.setName(req.getName());
        e.setEnabled(req.getEnabled());
        e.setSegment(req.getSegment());
    }
}
