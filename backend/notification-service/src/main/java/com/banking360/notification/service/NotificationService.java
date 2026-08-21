package com.banking360.notification.service;

import com.banking360.notification.domain.Notification;
import com.banking360.notification.dto.NotificationRequest;
import com.banking360.notification.dto.NotificationResponse;
import com.banking360.notification.repository.NotificationRepository;
import com.banking360.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository repository;

    public ApiResponse<Page<NotificationResponse>> list(Pageable pageable) {
        return ApiResponse.success(repository.findAll(pageable).map(this::toResponse));
    }

    public ApiResponse<NotificationResponse> get(String id) {
        return ApiResponse.success(toResponse(repository.findById(id)
            .orElseThrow(() -> com.banking360.common.exception.ApiException.notFound("Notification", id))));
    }

    public ApiResponse<NotificationResponse> create(NotificationRequest req) {
        Notification e = toEntity(req);
        e.setId(UUID.randomUUID().toString());
        return ApiResponse.success(toResponse(repository.save(e)));
    }

    public ApiResponse<NotificationResponse> update(String id, NotificationRequest req) {
        Notification e = repository.findById(id)
            .orElseThrow(() -> com.banking360.common.exception.ApiException.notFound("Notification", id));
        apply(e, req);
        return ApiResponse.success(toResponse(repository.save(e)));
    }

    public ApiResponse<Void> delete(String id) {
        repository.deleteById(id);
        return ApiResponse.success(null);
    }

    private NotificationResponse toResponse(Notification e) {
        NotificationResponse r = NotificationResponse.builder()
            .id(e.getId())
            .customerId(e.getCustomerId())
            .channel(e.getChannel())
            .template(e.getTemplate())
            .status(e.getStatus())
            .createdAt(e.getCreatedAt())
            .updatedAt(e.getUpdatedAt())
            .build();
        return r;
    }

    private Notification toEntity(NotificationRequest req) {
        Notification e = new Notification();
        apply(e, req);
        return e;
    }

    private void apply(Notification e, NotificationRequest req) {
        e.setCustomerId(req.getCustomerId());
        e.setChannel(req.getChannel());
        e.setTemplate(req.getTemplate());
        e.setStatus(req.getStatus());
    }
}
