package com.banking360.cms.service;

import com.banking360.cms.domain.CmsContent;
import com.banking360.cms.dto.CmsContentRequest;
import com.banking360.cms.dto.CmsContentResponse;
import com.banking360.cms.repository.CmsContentRepository;
import com.banking360.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CmsContentService {

    private final CmsContentRepository repository;

    public ApiResponse<Page<CmsContentResponse>> list(Pageable pageable) {
        return ApiResponse.success(repository.findAll(pageable).map(this::toResponse));
    }

    public ApiResponse<CmsContentResponse> get(String id) {
        return ApiResponse.success(toResponse(repository.findById(id)
            .orElseThrow(() -> com.banking360.common.exception.ApiException.notFound("CmsContent", id))));
    }

    public ApiResponse<CmsContentResponse> create(CmsContentRequest req) {
        CmsContent e = toEntity(req);
        e.setId(UUID.randomUUID().toString());
        return ApiResponse.success(toResponse(repository.save(e)));
    }

    public ApiResponse<CmsContentResponse> update(String id, CmsContentRequest req) {
        CmsContent e = repository.findById(id)
            .orElseThrow(() -> com.banking360.common.exception.ApiException.notFound("CmsContent", id));
        apply(e, req);
        return ApiResponse.success(toResponse(repository.save(e)));
    }

    public ApiResponse<Void> delete(String id) {
        repository.deleteById(id);
        return ApiResponse.success(null);
    }

    private CmsContentResponse toResponse(CmsContent e) {
        CmsContentResponse r = CmsContentResponse.builder()
            .id(e.getId())
            .type(e.getType())
            .title(e.getTitle())
            .body(e.getBody())
            .status(e.getStatus())
            .createdAt(e.getCreatedAt())
            .updatedAt(e.getUpdatedAt())
            .build();
        return r;
    }

    private CmsContent toEntity(CmsContentRequest req) {
        CmsContent e = new CmsContent();
        apply(e, req);
        return e;
    }

    private void apply(CmsContent e, CmsContentRequest req) {
        e.setType(req.getType());
        e.setTitle(req.getTitle());
        e.setBody(req.getBody());
        e.setStatus(req.getStatus());
    }
}
