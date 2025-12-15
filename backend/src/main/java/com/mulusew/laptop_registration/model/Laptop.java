
package com.mulusew.laptop_registration.model;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;
@Data
@NoArgsConstructor
@Document(collection = "laptops")
public class Laptop {
    @Id
    private String id;  // MongoDB will generate this automatically
    // Student Information
    private String studentName;
    private String studentId;
    private String phone;
    private String email;
    
    // Laptop Information
    private String serialNumber;
    private String macAddress;
    private String operatingSystem;
    private String laptopBrand;
    private Boolean antiVirusInstalled;
    
    // Status
    private Boolean verified = false;
    
    // Timestamps
    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt = LocalDateTime.now();
}