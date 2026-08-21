package com.banking360.emi.repository;

import com.banking360.emi.domain.EmiPlan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EmiPlanRepository extends JpaRepository<EmiPlan, String> {
}
