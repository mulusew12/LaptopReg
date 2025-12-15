package com.mulusew.laptop_registration.controller;

import com.mulusew.laptop_registration.dto.LoginRequest;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"}, 
           allowedHeaders = "*",
           methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS},
           allowCredentials = "true")
public class AuthController {
    
    // ADD THIS LOGGER
    private static final Logger log = LoggerFactory.getLogger(AuthController.class);
    
    @Value("${admin.email}")
    private String adminEmail;
    
    @Value("${admin.password}")
    private String adminPassword;
    
    // ADD THIS METHOD TO VERIFY CONTROLLER IS LOADED
    @PostConstruct
    public void init() {
        log.info("🔥🔥🔥 AuthController LOADED! Admin email: {}", adminEmail);
        log.info("🔥🔥🔥 Endpoint available at: POST /api/auth/login");
    }
    
    // ADD A SIMPLE TEST ENDPOINT
    @GetMapping("/test")
    public String testEndpoint() {
        log.info("✅ Test endpoint called!");
        return "AuthController is working! Current time: " + System.currentTimeMillis();
    }
    
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        log.info("Login attempt for email: {}", request.getEmail());
        
        if (!adminEmail.equals(request.getEmail())) {
            return ResponseEntity.badRequest().body("Invalid email");
        }
        if (!adminPassword.equals(request.getPassword())) {
            return ResponseEntity.badRequest().body("Invalid password");
        }
        
        Map<String, String> response = new HashMap<>();
        response.put("message", "Admin login successful");
        log.info("✅ Successful login for: {}", request.getEmail());
        return ResponseEntity.ok(response);
    }
}