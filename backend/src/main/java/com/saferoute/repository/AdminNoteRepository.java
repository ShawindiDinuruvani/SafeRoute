package com.saferoute.repository;

import com.saferoute.entity.AdminNote;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AdminNoteRepository extends JpaRepository<AdminNote, Long> {
    List<AdminNote> findByIncidentIdOrderByCreatedAtDesc(Long incidentId);
}
