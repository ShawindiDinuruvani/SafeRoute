package com.saferoute.controller;

import com.saferoute.dto.CreateUserRequest;
import com.saferoute.dto.IncidentDTO;
import com.saferoute.dto.UserDTO;
import com.saferoute.service.IncidentService;
import com.saferoute.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Autowired
    private IncidentService incidentService;

    @Autowired
    private UserService userService;

    @GetMapping("/incidents")
    public ResponseEntity<Page<IncidentDTO>> getAllIncidents(
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

    @GetMapping("/users")
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @PostMapping("/users")
    public ResponseEntity<UserDTO> createUser(@Valid @RequestBody CreateUserRequest request) {
        return ResponseEntity.ok(userService.createUser(request));
    }

    @PutMapping("/users/{id}/role")
    public ResponseEntity<UserDTO> updateUserRole(
            @PathVariable Long id,
            @RequestParam String role) {
        return ResponseEntity.ok(userService.updateUserRole(id, role));
    }
}
