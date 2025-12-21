package com.mulusew.laptop_registration.repository;

import com.mulusew.laptop_registration.model.Laptop;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LaptopRepository extends JpaRepository<Laptop, Long> {
    
    // Custom query methods
    Optional<Laptop> findByStudentId(String studentId);
    Optional<Laptop> findBySerialNumber(String serialNumber);
    Optional<Laptop> findByMacAddress(String macAddress);
    List<Laptop> findByVerified(Boolean verified);
    List<Laptop> findByStudentNameContainingIgnoreCase(String studentName);
    
    // ADD THESE TWO QUERIES THAT YOUR CONTROLLER NEEDS:
    @Query("SELECT COUNT(l) FROM Laptop l WHERE l.verified = true")
    Long countVerified();
    
    @Query("SELECT COUNT(l) FROM Laptop l WHERE l.verified = false")
    Long countNotVerified();
}