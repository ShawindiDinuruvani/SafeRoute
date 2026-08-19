package com.saferoute.controller;

import com.saferoute.dto.IncidentDTO;
import com.saferoute.entity.Incident;
import com.saferoute.repository.IncidentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/public")
public class PublicController2 {

    @Autowired
    private IncidentRepository incidentRepository;

    @GetMapping("/health")
    public ResponseEntity<String> healthCheck() {
        return ResponseEntity.ok("OK");
    }
}
