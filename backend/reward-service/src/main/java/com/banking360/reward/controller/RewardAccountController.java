package com.banking360.reward.controller;

import com.banking360.reward.dto.RewardAccountRequest;
import com.banking360.reward.dto.RewardAccountResponse;
import com.banking360.reward.service.RewardAccountService;
import com.banking360.common.dto.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/rewards")
@RequiredArgsConstructor
public class RewardAccountController {

    private final RewardAccountService service;

    @GetMapping
    public ResponseEntity<ApiResponse<?>> list(Pageable pageable) {
        return ResponseEntity.ok(service.list(pageable));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<?>> me() {
        return ResponseEntity.ok(service.getMe());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<?>> get(@PathVariable String id) {
        return ResponseEntity.ok(service.get(id));
    }

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<ApiResponse<?>> getForCustomer(@PathVariable String customerId) {
        return ResponseEntity.ok(service.getForCustomer(customerId));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<?>> create(@Valid @RequestBody RewardAccountRequest req) {
        return ResponseEntity.ok(service.create(req));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<?>> update(@PathVariable String id,
                                                 @Valid @RequestBody RewardAccountRequest req) {
        return ResponseEntity.ok(service.update(id, req));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<?>> delete(@PathVariable String id) {
        return ResponseEntity.ok(service.delete(id));
    }
}
