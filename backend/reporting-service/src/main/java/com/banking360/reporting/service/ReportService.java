package com.banking360.reporting.service;

import com.banking360.reporting.domain.Report;
import com.banking360.reporting.dto.ReportRequest;
import com.banking360.reporting.dto.ReportResponse;
import com.banking360.reporting.repository.ReportRepository;
import com.banking360.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final ReportRepository repository;

    public ApiResponse<Page<ReportResponse>> list(Pageable pageable) {
        return ApiResponse.success(repository.findAll(pageable).map(this::toResponse));
    }

    public ApiResponse<ReportResponse> get(String id) {
        return ApiResponse.success(toResponse(repository.findById(id)
            .orElseThrow(() -> com.banking360.common.exception.ApiException.notFound("Report", id))));
    }

    public ApiResponse<ReportResponse> create(ReportRequest req) {
        Report e = toEntity(req);
        e.setId(UUID.randomUUID().toString());
        return ApiResponse.success(toResponse(repository.save(e)));
    }

    public ApiResponse<ReportResponse> update(String id, ReportRequest req) {
        Report e = repository.findById(id)
            .orElseThrow(() -> com.banking360.common.exception.ApiException.notFound("Report", id));
        apply(e, req);
        return ApiResponse.success(toResponse(repository.save(e)));
    }

    public ApiResponse<Void> delete(String id) {
        repository.deleteById(id);
        return ApiResponse.success(null);
    }

    private ReportResponse toResponse(Report e) {
        ReportResponse r = ReportResponse.builder()
            .id(e.getId())
            .name(e.getName())
            .type(e.getType())
            .status(e.getStatus())
            .createdAt(e.getCreatedAt())
            .updatedAt(e.getUpdatedAt())
            .build();
        return r;
    }

    private Report toEntity(ReportRequest req) {
        Report e = new Report();
        apply(e, req);
        return e;
    }

    private void apply(Report e, ReportRequest req) {
        e.setName(req.getName());
        e.setType(req.getType());
        e.setStatus(req.getStatus());
    }
}
