package com.banking360.ledger.controller;

import com.banking360.common.dto.ApiResponse;
import com.banking360.ledger.dto.LedgerEntryRequest;
// import com.banking360.ledger.dto.LedgerEntryResponse;
import com.banking360.ledger.service.LedgerEntryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/ledger")
@RequiredArgsConstructor
public class LedgerEntryController {

    private final LedgerEntryService service;

    @GetMapping
    public ResponseEntity<ApiResponse<?>> list(Pageable pageable) {
        return ResponseEntity.ok(service.list(pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<?>> get(@PathVariable String id) {
        return ResponseEntity.ok(service.get(id));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<?>> post(@Valid @RequestBody LedgerEntryRequest req) {
        return ResponseEntity.ok(service.post(req));
    }
}