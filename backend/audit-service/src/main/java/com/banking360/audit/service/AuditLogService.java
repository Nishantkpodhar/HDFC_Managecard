package com.banking360.audit.service;

import com.banking360.audit.domain.AuditLog;
import com.banking360.audit.dto.AuditLogRequest;
import com.banking360.audit.dto.AuditLogResponse;
import com.banking360.audit.repository.AuditLogRepository;
import com.banking360.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuditLogService {

    private final AuditLogRepository repository;

    public ApiResponse<Page<AuditLogResponse>> list(Pageable pageable) {
        return ApiResponse.success(repository.findAll(pageable).map(this::toResponse));
    }

    public ApiResponse<AuditLogResponse> get(String id) {
        return ApiResponse.success(toResponse(repository.findById(id)
            .orElseThrow(() -> com.banking360.common.exception.ApiException.notFound("AuditLog", id))));
    }

    public ApiResponse<AuditLogResponse> create(AuditLogRequest req) {
        AuditLog e = toEntity(req);
        e.setId(UUID.randomUUID().toString());
        return ApiResponse.success(toResponse(repository.save(e)));
    }

    public ApiResponse<AuditLogResponse> update(String id, AuditLogRequest req) {
        AuditLog e = repository.findById(id)
            .orElseThrow(() -> com.banking360.common.exception.ApiException.notFound("AuditLog", id));
        apply(e, req);
        return ApiResponse.success(toResponse(repository.save(e)));
    }

    public ApiResponse<Void> delete(String id) {
        repository.deleteById(id);
        return ApiResponse.success(null);
    }

    private AuditLogResponse toResponse(AuditLog e) {
        AuditLogResponse r = AuditLogResponse.builder()
            .id(e.getId())
            .actor(e.getActor())
            .action(e.getAction())
            .entity(e.getEntity())
            .entityId(e.getEntityId())
            .result(e.getResult())
            .createdAt(e.getCreatedAt())
            .updatedAt(e.getUpdatedAt())
            .build();
        return r;
    }

    private AuditLog toEntity(AuditLogRequest req) {
        AuditLog e = new AuditLog();
        apply(e, req);
        return e;
    }

    private void apply(AuditLog e, AuditLogRequest req) {
        e.setActor(req.getActor());
        e.setAction(req.getAction());
        e.setEntity(req.getEntity());
        e.setEntityId(req.getEntityId());
        e.setResult(req.getResult());
    }
}
