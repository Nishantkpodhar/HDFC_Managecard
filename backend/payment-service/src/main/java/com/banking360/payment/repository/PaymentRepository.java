package com.banking360.payment.repository;

import com.banking360.payment.domain.Payment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, String> {
    Page<Payment> findByCustomerId(String customerId, Pageable pageable);
    Payment findByIdempotencyKeyAndCustomerId(String idempotencyKey, String customerId);
}