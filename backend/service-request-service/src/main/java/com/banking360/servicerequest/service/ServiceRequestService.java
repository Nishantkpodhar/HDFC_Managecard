package com.banking360.servicerequest.service;

import com.banking360.servicerequest.domain.ServiceRequest;
import com.banking360.servicerequest.dto.ServiceRequestRequest;
import com.banking360.servicerequest.dto.ServiceRequestResponse;
import com.banking360.servicerequest.repository.ServiceRequestRepository;
import com.banking360.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ServiceRequestService {

    private final ServiceRequestRepository repository;

    public ApiResponse<Page<ServiceRequestResponse>> list(Pageable pageable) {
        return ApiResponse.success(repository.findAll(pageable).map(this::toResponse));
    }

    public ApiResponse<ServiceRequestResponse> get(String id) {
        return ApiResponse.success(toResponse(repository.findById(id)
            .orElseThrow(() -> com.banking360.common.exception.ApiException.notFound("ServiceRequest", id))));
    }

    public ApiResponse<ServiceRequestResponse> create(ServiceRequestRequest req) {
        ServiceRequest e = toEntity(req);
        e.setId(UUID.randomUUID().toString());
        return ApiResponse.success(toResponse(repository.save(e)));
    }

    public ApiResponse<ServiceRequestResponse> update(String id, ServiceRequestRequest req) {
        ServiceRequest e = repository.findById(id)
            .orElseThrow(() -> com.banking360.common.exception.ApiException.notFound("ServiceRequest", id));
        apply(e, req);
        return ApiResponse.success(toResponse(repository.save(e)));
    }

    public ApiResponse<Void> delete(String id) {
        repository.deleteById(id);
        return ApiResponse.success(null);
    }

    private ServiceRequestResponse toResponse(ServiceRequest e) {
        ServiceRequestResponse r = ServiceRequestResponse.builder()
            .id(e.getId())
            .customerId(e.getCustomerId())
            .type(e.getType())
            .status(e.getStatus())
            .description(e.getDescription())
            .createdAt(e.getCreatedAt())
            .updatedAt(e.getUpdatedAt())
            .build();
        return r;
    }

    private ServiceRequest toEntity(ServiceRequestRequest req) {
        ServiceRequest e = new ServiceRequest();
        apply(e, req);
        return e;
    }

    private void apply(ServiceRequest e, ServiceRequestRequest req) {
        e.setCustomerId(req.getCustomerId());
        e.setType(req.getType());
        e.setStatus(req.getStatus());
        e.setDescription(req.getDescription());
    }
}
