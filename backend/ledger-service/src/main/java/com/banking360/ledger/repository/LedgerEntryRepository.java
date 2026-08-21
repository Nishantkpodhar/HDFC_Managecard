package com.banking360.ledger.repository;

import com.banking360.ledger.domain.LedgerEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LedgerEntryRepository extends JpaRepository<LedgerEntry, String> {
    LedgerEntry findByIdempotencyKey(String idempotencyKey);
}