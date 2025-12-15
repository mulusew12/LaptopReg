package com.mulusew.laptop_registration.dto;

// Add these imports
import com.fasterxml.jackson.annotation.JsonProperty;

public class LoginRequest {
    
    @JsonProperty("email")  // Explicitly map JSON field
    private String email;
    
    @JsonProperty("password")  // Explicitly map JSON field
    private String password;

    // Add constructors
    public LoginRequest() {}  // Required by Jackson
    
    public LoginRequest(String email, String password) {
        this.email = email;
        this.password = password;
    }

    // Getters and setters remain the same
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}