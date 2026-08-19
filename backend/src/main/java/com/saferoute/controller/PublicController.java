package com.saferoute.controller;

import com.saferoute.dto.IncidentDTO;
import com.saferoute.service.IncidentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/public")
public class PublicController {

    @Autowired
    private IncidentService incidentService;

    @GetMapping("/incidents/verified")
    public ResponseEntity<List<IncidentDTO>> getPublicVerifiedIncidents() {
        return ResponseEntity.ok(incidentService.getPublicVerifiedIncidents());
    }
}
