package com.saferoute.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "incident_categories")
public class IncidentCategory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 100)
    private String name;

    public IncidentCategory() {}
    public IncidentCategory(Long id, String name) { this.id = id; this.name = name; }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
}
