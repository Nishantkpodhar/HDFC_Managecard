package com.banking360.identity.repository;

import com.banking360.identity.domain.OtpChallenge;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface OtpChallengeRepository extends JpaRepository<OtpChallenge, java.util.UUID> {
    Optional<OtpChallenge> findTopByMobileOrderByCreatedAtDesc(String mobile);
}