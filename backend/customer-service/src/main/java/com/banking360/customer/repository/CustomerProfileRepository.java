package com.banking360.customer.repository;

import com.banking360.customer.domain.CustomerProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CustomerProfileRepository extends JpaRepository<CustomerProfile, String> {
    java.util.Optional<CustomerProfile> findByMobile(String mobile);
}
