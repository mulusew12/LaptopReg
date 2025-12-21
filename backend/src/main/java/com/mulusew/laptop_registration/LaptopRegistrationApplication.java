package com.mulusew.laptop_registration;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
@SpringBootApplication
@ComponentScan(basePackages = {
    
    "com.mulusew.laptop_registration",
    "com.mulusew.laptop_registration.controller",
    "com.mulusew.laptop_registration.dto"
})
public class LaptopRegistrationApplication {
    public static void main(String[] args) {
        SpringApplication.run(LaptopRegistrationApplication.class, args);
    }
}