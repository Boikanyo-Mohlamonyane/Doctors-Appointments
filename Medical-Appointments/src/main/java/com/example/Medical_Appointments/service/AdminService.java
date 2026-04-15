package com.example.Medical_Appointments.service;

import com.example.Medical_Appointments.dto.DoctorRequest;
import com.example.Medical_Appointments.model.Appointment;
import com.example.Medical_Appointments.model.Doctor;
import com.example.Medical_Appointments.model.Role;
import com.example.Medical_Appointments.model.User;
import com.example.Medical_Appointments.repository.AppointmentRepository;
import com.example.Medical_Appointments.repository.DoctorRepository;
import com.example.Medical_Appointments.repository.RoleRepository;
import com.example.Medical_Appointments.repository.UserRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepo;
    private final DoctorRepository doctorRepo;
    private final AppointmentRepository appointmentRepo;
    private final RoleRepository roleRepo;
    private final PasswordEncoder passwordEncoder;

    // 👤 USERS
    public List<User> getAllUsers() {
        return userRepo.findAll();
    }

    public void deleteUser(Long id) {
        userRepo.deleteById(id);
    }

    // 🩺 CREATE DOCTOR (FIXED)
    public Doctor addDoctor(DoctorRequest doctorRequest, String specialization) {

        // 1. Check if email exists
        if (userRepo.findByEmail(doctorRequest.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }

        // 2. Get DOCTOR role
        Role role = roleRepo.findByName("DOCTOR")
                .orElseThrow(() -> new RuntimeException("Role DOCTOR not found"));

        // 3. Create User (Doctor login account)
        User doctorUser = new User();
        doctorUser.setName(doctorRequest.getName());
        doctorUser.setEmail(doctorRequest.getEmail());
        doctorUser.setPassword(passwordEncoder.encode(doctorRequest.getPassword()));
        doctorUser.setRole(role);

        User savedUser = userRepo.save(doctorUser);

        // 4. Create Doctor profile
        Doctor doctor = new Doctor();
        doctor.setSpecialization(specialization);

        doctor.setName(doctorRequest.getName());
        doctor.setUser(savedUser);
        doctor.setSpecialization(specialization);

        return doctorRepo.save(doctor);
    }

    // 🩺 DOCTORS
    public List<Doctor> getAllDoctors() {
        return doctorRepo.findAll();
    }

    public void deleteDoctor(Long id) {
        doctorRepo.deleteById(id);
    }

    // 📅 APPOINTMENTS
    public List<Appointment> getAllAppointments() {
        return appointmentRepo.findAll();
    }
}