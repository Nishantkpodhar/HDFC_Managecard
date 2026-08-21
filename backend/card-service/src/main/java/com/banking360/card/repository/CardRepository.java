package com.banking360.card.repository;

import com.banking360.card.domain.Card;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CardRepository extends JpaRepository<Card, String> {
    List<Card> findByCustomerId(String customerId);
    boolean existsByCustomerIdAndId(String customerId, String id);
    Card findByIdempotencyKey(String idempotencyKey);
}