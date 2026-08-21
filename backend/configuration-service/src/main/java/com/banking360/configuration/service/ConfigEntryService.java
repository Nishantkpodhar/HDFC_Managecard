package com.banking360.configuration.service;

import com.banking360.configuration.domain.ConfigEntry;
import com.banking360.configuration.dto.ConfigEntryRequest;
import com.banking360.configuration.dto.ConfigEntryResponse;
import com.banking360.configuration.repository.ConfigEntryRepository;
import com.banking360.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ConfigEntryService {

    private final ConfigEntryRepository repository;

    public ApiResponse<Page<ConfigEntryResponse>> list(Pageable pageable) {
        return ApiResponse.success(repository.findAll(pageable).map(this::toResponse));
    }

    public ApiResponse<ConfigEntryResponse> get(String id) {
        return ApiResponse.success(toResponse(repository.findById(id)
            .orElseThrow(() -> com.banking360.common.exception.ApiException.notFound("ConfigEntry", id))));
    }

    public ApiResponse<ConfigEntryResponse> create(ConfigEntryRequest req) {
        ConfigEntry e = toEntity(req);
        e.setId(UUID.randomUUID().toString());
        return ApiResponse.success(toResponse(repository.save(e)));
    }

    public ApiResponse<ConfigEntryResponse> update(String id, ConfigEntryRequest req) {
        ConfigEntry e = repository.findById(id)
            .orElseThrow(() -> com.banking360.common.exception.ApiException.notFound("ConfigEntry", id));
        apply(e, req);
        return ApiResponse.success(toResponse(repository.save(e)));
    }

    public ApiResponse<Void> delete(String id) {
        repository.deleteById(id);
        return ApiResponse.success(null);
    }

    private ConfigEntryResponse toResponse(ConfigEntry e) {
        ConfigEntryResponse r = ConfigEntryResponse.builder()
            .id(e.getId())
            .key(e.getKey())
            .value(e.getValue())
            .category(e.getCategory())
            .createdAt(e.getCreatedAt())
            .updatedAt(e.getUpdatedAt())
            .build();
        return r;
    }

    private ConfigEntry toEntity(ConfigEntryRequest req) {
        ConfigEntry e = new ConfigEntry();
        apply(e, req);
        return e;
    }

    private void apply(ConfigEntry e, ConfigEntryRequest req) {
        e.setKey(req.getKey());
        e.setValue(req.getValue());
        e.setCategory(req.getCategory());
    }
}
