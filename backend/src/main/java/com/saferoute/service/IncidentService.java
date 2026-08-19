package com.saferoute.service;

import com.saferoute.dto.IncidentDTO;
import com.saferoute.dto.IncidentRequest;
import com.saferoute.entity.Incident;
import com.saferoute.entity.IncidentCategory;
import com.saferoute.entity.User;
import com.saferoute.repository.IncidentCategoryRepository;
import com.saferoute.repository.IncidentRepository;
import com.saferoute.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class IncidentService {
    @Autowired
    private IncidentRepository incidentRepository;

    @Autowired
    private IncidentCategoryRepository categoryRepository;

    @Autowired
    private UserRepository userRepository;

    public IncidentDTO submitIncident(IncidentRequest request, String email) {
        Incident incident = new Incident();
        incident.setTitle(request.getTitle());
        incident.setDescription(request.getDescription());
        incident.setSeverity(request.getSeverity());
        incident.setTransportType(request.getTransportType());
        incident.setLatitude(request.getLatitude());
        incident.setLongitude(request.getLongitude());
        incident.setRouteName(request.getRouteName());
        incident.setVehicleNumber(request.getVehicleNumber());
        incident.setLocationName(request.getLocationName());
        incident.setIncidentDate(request.getIncidentDate());
        incident.setIsAnonymous(request.getIsAnonymous());
        incident.setStatus("Pending Review");

        IncidentCategory category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));
        incident.setCategory(category);

        User reporter = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        incident.setReporter(reporter);

        Incident savedIncident = incidentRepository.save(incident);
        return mapToDTO(savedIncident, true);
    }

    public Page<IncidentDTO> getMyIncidents(String email, Pageable pageable) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return incidentRepository.findByReporterId(user.getId(), pageable)
                .map(incident -> mapToDTO(incident, true));
    }

    public Page<IncidentDTO> getAllIncidentsForAdmin(Pageable pageable) {
        return incidentRepository.findAll(pageable)
                .map(incident -> mapToDTO(incident, true));
    }

    public IncidentDTO updateIncidentStatus(Long id, String status) {
        Incident incident = incidentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Incident not found"));
        incident.setStatus(status);
        Incident savedIncident = incidentRepository.save(incident);
        return mapToDTO(savedIncident, true);
    }

    public IncidentDTO recordAction(Long id, String actionTaken, String actionStatus) {
        Incident incident = incidentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Incident not found"));
        incident.setActionTaken(actionTaken);
        if (actionStatus != null && !actionStatus.isBlank()) {
            incident.setActionStatus(actionStatus);
        }
        Incident savedIncident = incidentRepository.save(incident);
        return mapToDTO(savedIncident, true);
    }

    public List<IncidentDTO> getPublicVerifiedIncidents() {
        return incidentRepository.findByStatus("Verified").stream()
                .map(incident -> mapToDTO(incident, false))
                .collect(Collectors.toList());
    }

    private IncidentDTO mapToDTO(Incident incident, boolean includeReporterInfo) {
        IncidentDTO dto = new IncidentDTO();
        dto.setId(incident.getId());
        dto.setTitle(incident.getTitle());
        dto.setDescription(incident.getDescription());
        dto.setCategoryName(incident.getCategory().getName());
        dto.setCategoryId(incident.getCategory().getId());
        dto.setSeverity(incident.getSeverity());
        dto.setStatus(incident.getStatus());
        dto.setTransportType(incident.getTransportType());
        dto.setLatitude(incident.getLatitude());
        dto.setLongitude(incident.getLongitude());
        dto.setRouteName(incident.getRouteName());
        dto.setVehicleNumber(incident.getVehicleNumber());
        dto.setLocationName(incident.getLocationName());
        dto.setIncidentDate(incident.getIncidentDate());
        dto.setIsAnonymous(incident.getIsAnonymous());
        dto.setActionTaken(incident.getActionTaken());
        dto.setActionStatus(incident.getActionStatus());
        dto.setCreatedAt(incident.getCreatedAt());
        dto.setUpdatedAt(incident.getUpdatedAt());

        if (includeReporterInfo) {
            if (incident.getReporter() != null) {
                dto.setReporterId(incident.getReporter().getId());
                dto.setReporterName(incident.getReporter().getFirstName() + " " + incident.getReporter().getLastName());
            }
        } else {
            if (Boolean.TRUE.equals(incident.getIsAnonymous())) {
                dto.setReporterName("Anonymous");
            } else if (incident.getReporter() != null) {
                dto.setReporterName(incident.getReporter().getFirstName()); // only first name for privacy
            }
        }
        return dto;
    }
}
