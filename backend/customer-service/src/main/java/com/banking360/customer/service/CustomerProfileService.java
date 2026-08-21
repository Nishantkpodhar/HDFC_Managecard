package com.banking360.customer.service;

import com.banking360.customer.domain.CustomerProfile;
import com.banking360.customer.dto.CustomerProfileRequest;
import com.banking360.customer.dto.CustomerProfileResponse;
import com.banking360.customer.repository.CustomerProfileRepository;
import com.banking360.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CustomerProfileService {

    private final CustomerProfileRepository repository;

    public ApiResponse<Page<CustomerProfileResponse>> list(Pageable pageable) {
        return ApiResponse.success(repository.findAll(pageable).map(this::toResponse));
    }

    public ApiResponse<CustomerProfileResponse> get(String id) {
        return ApiResponse.success(toResponse(repository.findById(id)
            .orElseThrow(() -> com.banking360.common.exception.ApiException.notFound("CustomerProfile", id))));
    }

    public ApiResponse<CustomerProfileResponse> create(CustomerProfileRequest req) {
        CustomerProfile e = toEntity(req);
        e.setId(UUID.randomUUID().toString());
        return ApiResponse.success(toResponse(repository.save(e)));
    }

    public ApiResponse<CustomerProfileResponse> update(String id, CustomerProfileRequest req) {
        CustomerProfile e = repository.findById(id)
            .orElseThrow(() -> com.banking360.common.exception.ApiException.notFound("CustomerProfile", id));
        apply(e, req);
        return ApiResponse.success(toResponse(repository.save(e)));
    }

    public ApiResponse<Void> delete(String id) {
        repository.deleteById(id);
        return ApiResponse.success(null);
    }

    private String currentUserId() {
        var auth = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
        return auth != null ? auth.getName() : null;
    }

    public ApiResponse<CustomerProfileResponse> me() {
        String userId = currentUserId();
        if (userId == null) {
            throw com.banking360.common.exception.ApiException.badRequest("UNAUTHENTICATED", "Missing authenticated principal");
        }
        CustomerProfile e = repository.findByMobile(userId)
            .orElseThrow(() -> com.banking360.common.exception.ApiException.notFound("CustomerProfile", userId));
        return ApiResponse.success(toResponse(e));
    }

    private CustomerProfileResponse toResponse(CustomerProfile e) {
        CustomerProfileResponse r = CustomerProfileResponse.builder()
            .id(e.getId())
            .fullName(e.getFullName())
            .mobile(e.getMobile())
            .email(e.getEmail())
            .segment(e.getSegment())
            .status(e.getStatus())
            .createdAt(e.getCreatedAt())
            .updatedAt(e.getUpdatedAt())
            .build();
        return r;
    }

    private CustomerProfile toEntity(CustomerProfileRequest req) {
        CustomerProfile e = new CustomerProfile();
        apply(e, req);
        return e;
    }

    private void apply(CustomerProfile e, CustomerProfileRequest req) {
        e.setFullName(req.getFullName());
        e.setMobile(req.getMobile());
        e.setEmail(req.getEmail());
        e.setSegment(req.getSegment());
        e.setStatus(req.getStatus());
    }
}
