package com.saferoute.repository;

import com.saferoute.entity.IncidentStatusHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface IncidentStatusHistoryRepository extends JpaRepository<IncidentStatusHistory, Long> {
    List<IncidentStatusHistory> findByIncidentIdOrderByChangedAtDesc(Long incidentId);
}
