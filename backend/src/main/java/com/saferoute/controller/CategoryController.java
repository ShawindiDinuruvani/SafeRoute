package com.saferoute.controller;

import com.saferoute.entity.IncidentCategory;
import com.saferoute.repository.IncidentCategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/categories")
public class CategoryController {
    @Autowired
    private IncidentCategoryRepository categoryRepository;

    @GetMapping
    public ResponseEntity<List<IncidentCategory>> getAllCategories() {
        return ResponseEntity.ok(categoryRepository.findAll());
    }
}
