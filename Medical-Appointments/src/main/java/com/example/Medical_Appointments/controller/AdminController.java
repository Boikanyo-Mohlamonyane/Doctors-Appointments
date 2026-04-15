package com.example.Medical_Appointments.controller;

import com.example.Medical_Appointments.dto.DoctorRequest;
import com.example.Medical_Appointments.model.Appointment;
import com.example.Medical_Appointments.model.Doctor;
import com.example.Medical_Appointments.model.User;
import com.example.Medical_Appointments.service.AdminService;

import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService service;

    // 👤 USERS
    @GetMapping("/users")
    public List<User> getUsers() {
        return service.getAllUsers();
    }

    @DeleteMapping("/users/{id}")
    public void deleteUser(@PathVariable Long id) {
        service.deleteUser(id);
    }

    // 🩺 DOCTORS (FIXED)
    @PostMapping("/doctors")
    public Doctor addDoctor(@RequestBody DoctorRequest request) {
        return service.addDoctor(request, request.getSpecialization());
    }

    @GetMapping("/doctors")
    public List<Doctor> getDoctors() {
        return service.getAllDoctors();
    }

    @DeleteMapping("/doctors/{id}")
    public void deleteDoctor(@PathVariable Long id) {
        service.deleteDoctor(id);
    }

    // 📅 APPOINTMENTS
    @GetMapping("/appointments")
    public List<Appointment> getAppointments() {
        return service.getAllAppointments();
    }
}