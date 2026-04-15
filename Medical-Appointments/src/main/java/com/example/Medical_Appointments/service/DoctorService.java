package com.example.Medical_Appointments.service;

import com.example.Medical_Appointments.dto.DoctorRequest;
import com.example.Medical_Appointments.model.Doctor;
import com.example.Medical_Appointments.model.Role;
import com.example.Medical_Appointments.model.User;
import com.example.Medical_Appointments.repository.DoctorRepository;
import com.example.Medical_Appointments.repository.RoleRepository;
import com.example.Medical_Appointments.repository.UserRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DoctorService {

    private final DoctorRepository doctorRepo;
    private final UserRepository userRepo;
    private final RoleRepository roleRepo;
    private final PasswordEncoder passwordEncoder;

    // 🩺 CREATE DOCTOR (WITH LOGIN ACCOUNT)
    public Doctor addDoctor(DoctorRequest request) {

        // check if email exists
        if (userRepo.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }

        // get DOCTOR role
        Role role = roleRepo.findByName("DOCTOR")
                .orElseThrow(() -> new RuntimeException("Role not found"));

        // create user account
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(role);

        userRepo.save(user);

        // create doctor profile
        Doctor doctor = new Doctor();
        doctor.setName(request.getName());
        doctor.setSpecialization(request.getSpecialization());

        return doctorRepo.save(doctor);
    }

    // 📋 GET ALL DOCTORS
    public List<Doctor> getAllDoctors() {
        return doctorRepo.findAll();
    }

    // 🔍 GET ONE DOCTOR
    public Doctor getDoctor(Long id) {
        return doctorRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));
    }
}