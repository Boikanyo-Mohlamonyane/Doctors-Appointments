package com.example.Medical_Appointments.controller;

import com.example.Medical_Appointments.dto.AppointmentRequest;
import com.example.Medical_Appointments.model.Appointment;
import com.example.Medical_Appointments.service.AppointmentService;

import lombok.RequiredArgsConstructor;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/appointments")
@RequiredArgsConstructor
public class AppointmentController {

    private final AppointmentService service;

    // 👤 USER → BOOK APPOINTMENT
    @PostMapping
    @PreAuthorize("hasAuthority('USER')")
    public Appointment book(@RequestBody AppointmentRequest request) {
        return service.book(request);
    }
    // 👤 USER → VIEW OWN APPOINTMENTS
    @GetMapping("/my")
    @PreAuthorize("hasAuthority('USER')")
    public List<Appointment> getMyAppointments() {
        return service.getMyAppointments();
    }
    // 👑 ADMIN → VIEW ALL APPOINTMENTS
    @GetMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public List<Appointment> getAll() {
        return service.getAll();
    }

    // 🩺 DOCTOR → VIEW THEIR APPOINTMENTS
    @GetMapping("/doctor/{doctorId}")
    @PreAuthorize("hasAuthority('DOCTOR')")
    public List<Appointment> getByDoctor(@PathVariable Long doctorId) {
        return service.getByDoctor(doctorId);
    }

    // 🩺 DOCTOR → APPROVE
    @PutMapping("/approve/{id}")
    @PreAuthorize("hasAuthority('DOCTOR')")
    public Appointment approve(@PathVariable Long id) {
        return service.approve(id);
    }

    // 🩺 DOCTOR → REJECT
    @PutMapping("/reject/{id}")
    @PreAuthorize("hasAuthority('DOCTOR')")
    public Appointment reject(@PathVariable Long id) {
        return service.reject(id);
    }
}