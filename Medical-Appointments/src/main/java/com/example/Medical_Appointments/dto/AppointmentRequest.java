package com.example.Medical_Appointments.dto;

import lombok.Data;

@Data
public class AppointmentRequest {

    private Long doctorId;

    private String date;
    private String time;
}