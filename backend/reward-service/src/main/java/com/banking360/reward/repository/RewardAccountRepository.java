package com.banking360.reward.repository;

import com.banking360.reward.domain.RewardAccount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RewardAccountRepository extends JpaRepository<RewardAccount, String> {
    RewardAccount findByCustomerId(String customerId);
}
