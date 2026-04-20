package com.example.Medical_Appointments.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
public class AdminRequest {
    private String name;
    private String email;
    private String password;

    // getters and setters
}