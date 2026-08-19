package com.saferoute.controller;

import com.saferoute.dto.ActionRequest;
import com.saferoute.dto.IncidentDTO;
import com.saferoute.service.IncidentService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/authority")
@PreAuthorize("hasRole('TRANSPORT_AUTHORITY') or hasRole('ADMIN')")
public class AuthorityController {

    @Autowired
    private IncidentService incidentService;

    @GetMapping("/incidents")
    public ResponseEntity<List<IncidentDTO>> getVerifiedIncidentsForAuthority() {
        return ResponseEntity.ok(incidentService.getPublicVerifiedIncidents());
    }

    @PostMapping("/incidents/{id}/action")
    public ResponseEntity<IncidentDTO> recordAction(
            @PathVariable Long id,
            @Valid @RequestBody ActionRequest request) {
        return ResponseEntity.ok(incidentService.recordAction(id, request.getActionTaken(), request.getActionStatus()));
    }
}
