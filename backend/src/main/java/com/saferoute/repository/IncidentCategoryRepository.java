package com.saferoute.repository;

import com.saferoute.entity.IncidentCategory;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IncidentCategoryRepository extends JpaRepository<IncidentCategory, Long> {
}
