package com.example.Medical_Appointments.dto;

import lombok.Data;

@Data
public class DoctorRequest {

    private String name;
    private String email;
    private String password;
    private String specialization;
}