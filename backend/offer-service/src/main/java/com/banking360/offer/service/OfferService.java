package com.banking360.offer.service;

import com.banking360.offer.domain.Offer;
import com.banking360.offer.dto.OfferRequest;
import com.banking360.offer.dto.OfferResponse;
import com.banking360.offer.repository.OfferRepository;
import com.banking360.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class OfferService {

    private final OfferRepository repository;

    public ApiResponse<Page<OfferResponse>> list(Pageable pageable) {
        return ApiResponse.success(repository.findAll(pageable).map(this::toResponse));
    }

    public ApiResponse<OfferResponse> get(String id) {
        return ApiResponse.success(toResponse(repository.findById(id)
            .orElseThrow(() -> com.banking360.common.exception.ApiException.notFound("Offer", id))));
    }

    public ApiResponse<OfferResponse> create(OfferRequest req) {
        Offer e = toEntity(req);
        e.setId(UUID.randomUUID().toString());
        return ApiResponse.success(toResponse(repository.save(e)));
    }

    public ApiResponse<OfferResponse> update(String id, OfferRequest req) {
        Offer e = repository.findById(id)
            .orElseThrow(() -> com.banking360.common.exception.ApiException.notFound("Offer", id));
        apply(e, req);
        return ApiResponse.success(toResponse(repository.save(e)));
    }

    public ApiResponse<Void> delete(String id) {
        repository.deleteById(id);
        return ApiResponse.success(null);
    }

    private OfferResponse toResponse(Offer e) {
        OfferResponse r = OfferResponse.builder()
            .id(e.getId())
            .title(e.getTitle())
            .category(e.getCategory())
            .segment(e.getSegment())
            .status(e.getStatus())
            .minSpend(e.getMinSpend())
            .createdAt(e.getCreatedAt())
            .updatedAt(e.getUpdatedAt())
            .build();
        return r;
    }

    private Offer toEntity(OfferRequest req) {
        Offer e = new Offer();
        apply(e, req);
        return e;
    }

    private void apply(Offer e, OfferRequest req) {
        e.setTitle(req.getTitle());
        e.setCategory(req.getCategory());
        e.setSegment(req.getSegment());
        e.setStatus(req.getStatus());
        e.setMinSpend(req.getMinSpend());
    }
}
