package com.mulusew.laptop_registration.model;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.LocalDateTime;
@Entity
@Table(name = "laptops")
public class Laptop {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    // Student Information
    @Column(name = "student_name", nullable = false)
    private String studentName;
    
    @Column(name = "student_id", nullable = false, unique = true)
    private String studentId;
    
    @Column(name = "phone")
    private String phone;
    
    @Column(name = "email")
    private String email;
    
    // Laptop Information
    @Column(name = "serial_number", nullable = false, unique = true)
    private String serialNumber;
    
    @Column(name = "mac_address", nullable = false, unique = true)
    private String macAddress;
    
    @Column(name = "operating_system")
    private String operatingSystem;
    
    @Column(name = "laptop_brand")
    private String laptopBrand;
    
    @Column(name = "anti_virus_installed")
    private Boolean antiVirusInstalled = false;
    
    // Status
    @Column(name = "verified")
    private Boolean verified = false;
    
    // Timestamps
    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    // Constructors
    public Laptop() {}
    
    public Laptop(String studentName, String studentId, String serialNumber, String macAddress) {
        this.studentName = studentName;
        this.studentId = studentId;
        this.serialNumber = serialNumber;
        this.macAddress = macAddress;
    }
    
    // MANUALLY ADDED GETTERS AND SETTERS (Because Lombok isn't working)
    
    // Getters
    public Long getId() { return id; }
    public String getStudentName() { return studentName; }
    public String getStudentId() { return studentId; }
    public String getPhone() { return phone; }
    public String getEmail() { return email; }
    public String getSerialNumber() { return serialNumber; }
    public String getMacAddress() { return macAddress; }
    public String getOperatingSystem() { return operatingSystem; }
    public String getLaptopBrand() { return laptopBrand; }
    public Boolean getAntiVirusInstalled() { return antiVirusInstalled; }
    public Boolean getVerified() { return verified; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    
    // Setters
    public void setId(Long id) { this.id = id; }
    public void setStudentName(String studentName) { this.studentName = studentName; }
    public void setStudentId(String studentId) { this.studentId = studentId; }
    public void setPhone(String phone) { this.phone = phone; }
    public void setEmail(String email) { this.email = email; }
    public void setSerialNumber(String serialNumber) { this.serialNumber = serialNumber; }
    public void setMacAddress(String macAddress) { this.macAddress = macAddress; }
    public void setOperatingSystem(String operatingSystem) { this.operatingSystem = operatingSystem; }
    public void setLaptopBrand(String laptopBrand) { this.laptopBrand = laptopBrand; }
    public void setAntiVirusInstalled(Boolean antiVirusInstalled) { this.antiVirusInstalled = antiVirusInstalled; }
    public void setVerified(Boolean verified) { this.verified = verified; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}