package com.banking360.admin.service;

import com.banking360.admin.domain.AdminUser;
import com.banking360.admin.dto.AdminUserRequest;
import com.banking360.admin.dto.AdminUserResponse;
import com.banking360.admin.repository.AdminUserRepository;
import com.banking360.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AdminUserService {

    private final AdminUserRepository repository;

    public ApiResponse<Page<AdminUserResponse>> list(Pageable pageable) {
        return ApiResponse.success(repository.findAll(pageable).map(this::toResponse));
    }

    public ApiResponse<AdminUserResponse> get(String id) {
        return ApiResponse.success(toResponse(repository.findById(id)
            .orElseThrow(() -> com.banking360.common.exception.ApiException.notFound("AdminUser", id))));
    }

    public ApiResponse<AdminUserResponse> create(AdminUserRequest req) {
        AdminUser e = toEntity(req);
        e.setId(UUID.randomUUID().toString());
        return ApiResponse.success(toResponse(repository.save(e)));
    }

    public ApiResponse<AdminUserResponse> update(String id, AdminUserRequest req) {
        AdminUser e = repository.findById(id)
            .orElseThrow(() -> com.banking360.common.exception.ApiException.notFound("AdminUser", id));
        apply(e, req);
        return ApiResponse.success(toResponse(repository.save(e)));
    }

    public ApiResponse<Void> delete(String id) {
        repository.deleteById(id);
        return ApiResponse.success(null);
    }

    private AdminUserResponse toResponse(AdminUser e) {
        AdminUserResponse r = AdminUserResponse.builder()
            .id(e.getId())
            .username(e.getUsername())
            .role(e.getRole())
            .email(e.getEmail())
            .status(e.getStatus())
            .createdAt(e.getCreatedAt())
            .updatedAt(e.getUpdatedAt())
            .build();
        return r;
    }

    private AdminUser toEntity(AdminUserRequest req) {
        AdminUser e = new AdminUser();
        apply(e, req);
        return e;
    }

    private void apply(AdminUser e, AdminUserRequest req) {
        e.setUsername(req.getUsername());
        e.setRole(req.getRole());
        e.setEmail(req.getEmail());
        e.setStatus(req.getStatus());
    }
}
