package com.example.Medical_Appointments.controller;

import com.example.Medical_Appointments.dto.DoctorRequest;
import com.example.Medical_Appointments.model.Doctor;
import com.example.Medical_Appointments.service.DoctorService;

import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/doctors")
@RequiredArgsConstructor
public class DoctorController {

    private final DoctorService service;

    // 🩺 CREATE DOCTOR (FIXED)
    @PostMapping
    public Doctor addDoctor(@RequestBody DoctorRequest request) {
        return service.addDoctor(request);
    }

    // 📋 GET ALL DOCTORS
    @GetMapping
    public List<Doctor> getDoctors() {
        return service.getAllDoctors();
    }

    // 🔍 GET DOCTOR BY ID
    @GetMapping("/{id}")
    public Doctor getDoctor(@PathVariable Long id) {
        return service.getDoctor(id);
    }
}