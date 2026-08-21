package com.banking360.cms.repository;

import com.banking360.cms.domain.CmsContent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CmsContentRepository extends JpaRepository<CmsContent, String> {
}
