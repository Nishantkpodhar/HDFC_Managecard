package com.banking360.fastag.repository;

import com.banking360.fastag.domain.Fastag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FastagRepository extends JpaRepository<Fastag, String> {
}
