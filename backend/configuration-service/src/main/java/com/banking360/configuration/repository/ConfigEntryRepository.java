package com.banking360.configuration.repository;

import com.banking360.configuration.domain.ConfigEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ConfigEntryRepository extends JpaRepository<ConfigEntry, String> {
}
