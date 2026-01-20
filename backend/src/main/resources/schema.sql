-- Create database if not exists
CREATE DATABASE IF NOT EXISTS laptopdb;
USE laptopdb;

-- Create laptops table (matches your Laptop.java entity)
CREATE TABLE IF NOT EXISTS laptops (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_name VARCHAR(255) NOT NULL,
    student_id VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(50),
    email VARCHAR(255),
    serial_number VARCHAR(255) NOT NULL UNIQUE,
    mac_address VARCHAR(255) NOT NULL UNIQUE,
    operating_system VARCHAR(100),
    laptop_brand VARCHAR(100),
    anti_virus_installed BOOLEAN DEFAULT FALSE,
    verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create users table for authentication
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'USER',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default admin user (password: 123458)
INSERT INTO users (email, password, role) 
VALUES ('admin@gmail.com', '$2a$10$ABCDEFGHIJKLMNOPQRSTUV', 'ADMIN')
ON DUPLICATE KEY UPDATE email=email;

-- Insert sample laptop data
INSERT INTO laptops (student_name, student_id, phone, email, serial_number, mac_address, operating_system, laptop_brand, anti_virus_installed, verified) VALUES
('John Doe', 'STU001', '+1234567890', 'john@example.com', 'SN-DELL-001', '00:1A:2B:3C:4D:5E', 'Windows 11', 'Dell', TRUE, TRUE),
('Jane Smith', 'STU002', '+0987654321', 'jane@example.com', 'SN-HP-001', '00:1B:2C:3D:4E:5F', 'Windows 10', 'HP', FALSE, TRUE),
('Bob Wilson', 'STU003', '+1122334455', 'bob@example.com', 'SN-LENOVO-001', '00:1C:2D:3E:4F:5A', 'Ubuntu 22.04', 'Lenovo', TRUE, FALSE),
('Alice Johnson', 'STU004', '+5566778899', 'alice@example.com', 'SN-MAC-001', '00:1D:2E:3F:4A:5B', 'macOS Ventura', 'Apple', TRUE, TRUE),
('Charlie Brown', 'STU005', '+9988776655', 'charlie@example.com', 'SN-ASUS-001', '00:1E:2F:3A:4B:5C', 'Windows 11', 'Asus', FALSE, FALSE);

SELECT 'Database setup complete!' AS Status;