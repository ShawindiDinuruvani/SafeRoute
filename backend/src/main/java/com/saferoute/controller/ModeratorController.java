package com.saferoute.controller;

import com.saferoute.dto.IncidentDTO;
import com.saferoute.service.IncidentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/moderator")
@PreAuthorize("hasRole('MODERATOR') or hasRole('ADMIN')")
public class ModeratorController {

    @Autowired
    private IncidentService incidentService;

    @GetMapping("/incidents")
    public ResponseEntity<Page<IncidentDTO>> getIncidentsForModeration(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return ResponseEntity.ok(incidentService.getAllIncidentsForAdmin(pageable));
    }

    @PutMapping("/incidents/{id}/status")
    public ResponseEntity<IncidentDTO> updateIncidentStatus(
            @PathVariable Long id,
            @RequestParam String status) {
        return ResponseEntity.ok(incidentService.updateIncidentStatus(id, status));
    }
}
