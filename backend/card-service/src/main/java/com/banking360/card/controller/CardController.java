package com.banking360.card.controller;

import com.banking360.card.dto.CardControlRequest;
import com.banking360.card.dto.CardRequest;
import com.banking360.card.dto.CardResponse;
import com.banking360.card.service.CardService;
import com.banking360.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageRequest;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

@RestController
@RequestMapping("/api/v1/cards")
@RequiredArgsConstructor
public class CardController {

    private final CardService service;

    @GetMapping
    public ApiResponse<?> list(@RequestParam(defaultValue = "0") int page,
                               @RequestParam(defaultValue = "20") int size) {
        return service.list(PageRequest.of(page, size));
    }

    @GetMapping("/customer/{customerId}")
    public ApiResponse<?> listByCustomer(@PathVariable String customerId) {
        return service.listByCustomer(customerId);
    }

    @GetMapping("/{id}")
    public ApiResponse<?> get(@PathVariable String id) {
        return service.get(id);
    }

    @PostMapping
    public ApiResponse<?> create(@RequestBody CardRequest req) {
        return service.create(req);
    }

    @PutMapping("/{id}")
    public ApiResponse<?> update(@PathVariable String id, @RequestBody CardRequest req) {
        return service.update(id, req);
    }

    @DeleteMapping("/{id}")
    public ApiResponse<?> delete(@PathVariable String id) {
        return service.delete(id);
    }

    @PatchMapping("/{id}/controls")
    public ApiResponse<?> controls(@PathVariable String id, @RequestBody CardControlRequest req) {
        return service.updateControls(id, req);
    }

    @PostMapping("/{id}/status")
    public ApiResponse<?> status(@PathVariable String id, @RequestParam String status) {
        return service.setStatus(id, status);
    }

    @PostMapping("/{id}/limit-enhancement")
    public ApiResponse<?> limit(@PathVariable String id, @RequestBody java.util.Map<String, BigDecimal> body) {
        return service.limitEnhancement(id, body.get("limit"));
    }
}