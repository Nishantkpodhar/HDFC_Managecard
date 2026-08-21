package com.banking360.product.service;

import com.banking360.product.domain.Product;
import com.banking360.product.dto.ProductRequest;
import com.banking360.product.dto.ProductResponse;
import com.banking360.product.repository.ProductRepository;
import com.banking360.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository repository;

    public ApiResponse<Page<ProductResponse>> list(Pageable pageable) {
        return ApiResponse.success(repository.findAll(pageable).map(this::toResponse));
    }

    public ApiResponse<ProductResponse> get(String id) {
        return ApiResponse.success(toResponse(repository.findById(id)
            .orElseThrow(() -> com.banking360.common.exception.ApiException.notFound("Product", id))));
    }

    public ApiResponse<ProductResponse> create(ProductRequest req) {
        Product e = toEntity(req);
        e.setId(UUID.randomUUID().toString());
        return ApiResponse.success(toResponse(repository.save(e)));
    }

    public ApiResponse<ProductResponse> update(String id, ProductRequest req) {
        Product e = repository.findById(id)
            .orElseThrow(() -> com.banking360.common.exception.ApiException.notFound("Product", id));
        apply(e, req);
        return ApiResponse.success(toResponse(repository.save(e)));
    }

    public ApiResponse<Void> delete(String id) {
        repository.deleteById(id);
        return ApiResponse.success(null);
    }

    private ProductResponse toResponse(Product e) {
        ProductResponse r = ProductResponse.builder()
            .id(e.getId())
            .name(e.getName())
            .category(e.getCategory())
            .eligibility(e.getEligibility())
            .active(e.getActive())
            .createdAt(e.getCreatedAt())
            .updatedAt(e.getUpdatedAt())
            .build();
        return r;
    }

    private Product toEntity(ProductRequest req) {
        Product e = new Product();
        apply(e, req);
        return e;
    }

    private void apply(Product e, ProductRequest req) {
        e.setName(req.getName());
        e.setCategory(req.getCategory());
        e.setEligibility(req.getEligibility());
        e.setActive(req.getActive());
    }
}
