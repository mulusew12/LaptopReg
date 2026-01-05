package com.mulusew.laptop_registration.controller;

import com.mulusew.laptop_registration.model.Laptop;
import com.mulusew.laptop_registration.repository.LaptopRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/laptops")
@CrossOrigin(origins = {"http://localhost:5173", "https://laptop-reg.vercel.app"})
public class LaptopController {
    
    // MANUAL LOGGER
    private static final Logger log = LoggerFactory.getLogger(LaptopController.class);
    
    private final LaptopRepository laptopRepository;
    
    // MANUAL CONSTRUCTOR (required because @RequiredArgsConstructor isn't working)
    public LaptopController(LaptopRepository laptopRepository) {
        this.laptopRepository = laptopRepository;
    }
    
    // 1. Create new laptop registration
    @PostMapping("/register")
    public ResponseEntity<?> registerLaptop(@RequestBody Laptop laptop) {
        log.info("Registering new laptop for student: {}", laptop.getStudentName());
        
        // Check for duplicates
        Map<String, String> errors = new HashMap<>();
        
        if (laptopRepository.findByStudentId(laptop.getStudentId()).isPresent()) {
            errors.put("studentId", "This student already has a registered laptop");
        }
        
        if (laptopRepository.findBySerialNumber(laptop.getSerialNumber()).isPresent()) {
            errors.put("serialNumber", "This laptop is already registered");
        }
        
        if (laptopRepository.findByMacAddress(laptop.getMacAddress()).isPresent()) {
            errors.put("macAddress", "This MAC Address is already registered");
        }
        
        if (!errors.isEmpty()) {
            return ResponseEntity.badRequest().body(errors);
        }
        
        // Save to database (timestamps are handled by @CreationTimestamp and @UpdateTimestamp)
        Laptop savedLaptop = laptopRepository.save(laptop);
        log.info("Laptop registered successfully with ID: {}", savedLaptop.getId());
        
        return ResponseEntity.ok(savedLaptop);
    }
    
    // 2. Get all laptops
    @GetMapping
    public ResponseEntity<List<Laptop>> getAllLaptops() {
        List<Laptop> laptops = laptopRepository.findAll();
        log.info("Retrieved {} laptops", laptops.size());
        return ResponseEntity.ok(laptops);
    }
    
    // 3. Get laptop by ID - CHANGED from String to Long
    @GetMapping("/{id}")
    public ResponseEntity<Laptop> getLaptopById(@PathVariable Long id) {
        return laptopRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    // 4. Update laptop - CHANGED from String to Long
    @PutMapping("/{id}")
    public ResponseEntity<Laptop> updateLaptop(@PathVariable Long id, @RequestBody Laptop laptop) {
        return laptopRepository.findById(id)
                .map(existingLaptop -> {
                    // Update fields
                    existingLaptop.setStudentName(laptop.getStudentName());
                    existingLaptop.setStudentId(laptop.getStudentId());
                    existingLaptop.setPhone(laptop.getPhone());
                    existingLaptop.setEmail(laptop.getEmail());
                    existingLaptop.setSerialNumber(laptop.getSerialNumber());
                    existingLaptop.setMacAddress(laptop.getMacAddress());
                    existingLaptop.setOperatingSystem(laptop.getOperatingSystem());
                    existingLaptop.setLaptopBrand(laptop.getLaptopBrand());
                    existingLaptop.setAntiVirusInstalled(laptop.getAntiVirusInstalled());
                    
                    Laptop updated = laptopRepository.save(existingLaptop);
                    log.info("Updated laptop with ID: {}", id);
                    return ResponseEntity.ok(updated);
                })
                .orElse(ResponseEntity.notFound().build());
    }
    
    // 5. Delete laptop - CHANGED from String to Long
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLaptop(@PathVariable Long id) {
        if (laptopRepository.existsById(id)) {
            laptopRepository.deleteById(id);
            log.info("Deleted laptop with ID: {}", id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
    
    // 6. Verify laptop (admin only) - CHANGED from String to Long
    @PutMapping("/{id}/verify")
    public ResponseEntity<Laptop> verifyLaptop(@PathVariable Long id) {
        return laptopRepository.findById(id)
                .map(laptop -> {
                    laptop.setVerified(true);
                    Laptop verified = laptopRepository.save(laptop);
                    log.info("Verified laptop with ID: {}", id);
                    return ResponseEntity.ok(verified);
                })
                .orElse(ResponseEntity.notFound().build());
    }
    
    // 7. Search laptops
    @GetMapping("/search")
    public ResponseEntity<List<Laptop>> searchLaptops(@RequestParam(required = false) String query) {
        if (query == null || query.trim().isEmpty()) {
            return ResponseEntity.ok(laptopRepository.findAll());
        }
        
        List<Laptop> results = laptopRepository.findByStudentNameContainingIgnoreCase(query);
        log.info("Found {} laptops matching query: {}", results.size(), query);
        return ResponseEntity.ok(results);
    }
    
    // 8. Get stats - FIXED VERSION
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        long total = laptopRepository.count();
        long verified = laptopRepository.findByVerified(true).size(); // FIXED
        long notVerified = laptopRepository.findByVerified(false).size(); // FIXED
        
        Map<String, Object> stats = new HashMap<>();
        stats.put("total", total);
        stats.put("verified", verified);
        stats.put("notVerified", notVerified);
        
        return ResponseEntity.ok(stats);
    }
    
    // 9. Check duplicates before registration
    @PostMapping("/check-duplicates")
    public ResponseEntity<Map<String, Boolean>> checkDuplicates(@RequestBody Laptop laptop) {
        Map<String, Boolean> duplicates = new HashMap<>();
        
        duplicates.put("studentIdExists", 
            laptopRepository.findByStudentId(laptop.getStudentId()).isPresent());
        
        duplicates.put("serialNumberExists", 
            laptopRepository.findBySerialNumber(laptop.getSerialNumber()).isPresent());
        
        duplicates.put("macAddressExists", 
            laptopRepository.findByMacAddress(laptop.getMacAddress()).isPresent());
        
        return ResponseEntity.ok(duplicates);
    }
}