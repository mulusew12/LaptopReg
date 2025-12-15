package com.mulusew.laptop_registration.repository;
import com.mulusew.laptop_registration.model.Laptop;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface LaptopRepository extends MongoRepository<Laptop, String> {
    
    // Check if student already has a laptop
    Optional<Laptop> findByStudentId(String studentId);
    
    // Check if serial number exists
    Optional<Laptop> findBySerialNumber(String serialNumber);
    
    // Check if MAC address exists
    Optional<Laptop> findByMacAddress(String macAddress);
    
    // Find all laptops
    List<Laptop> findAll();
    
    // Search by student name
    List<Laptop> findByStudentNameContainingIgnoreCase(String name);
    
    // Find by brand
    List<Laptop> findByLaptopBrand(String brand);
    
    // Find by OS
    List<Laptop> findByOperatingSystem(String os);
    
    // Find verified/unverified laptops
    List<Laptop> findByVerified(Boolean verified);
}