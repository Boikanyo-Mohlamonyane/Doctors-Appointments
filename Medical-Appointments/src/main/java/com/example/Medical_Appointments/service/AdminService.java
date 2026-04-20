package com.example.Medical_Appointments.service;

import com.example.Medical_Appointments.dto.AdminRequest;
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

import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepo;
    private final DoctorRepository doctorRepo;
    private final AppointmentRepository appointmentRepo;
    private final RoleRepository roleRepo;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;

    // 👤 USERS
    public List<User> getAllUsers() {
        return userRepo.findAll();
    }

    public void deleteUser(Long id) {
        userRepo.deleteById(id);
    }
    // ================= CREATE DOCTOR (ENTERPRISE VERSION) =================
    public Doctor addDoctor(DoctorRequest doctorRequest, String specialization) {

        // 1. Validate input
        if (doctorRequest.getName() == null || doctorRequest.getEmail() == null || doctorRequest.getPassword() == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "All fields (name, email, password) are required"
            );
        }

        // 2. Check if email already exists
        if (userRepo.findByEmail(doctorRequest.getEmail()).isPresent()) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Email already exists"
            );
        }

        // 3. Get DOCTOR role
        Role role = roleRepo.findByName("DOCTOR")
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Role DOCTOR not found"
                        )
                );

        // 4. Encode password
        String rawPassword = doctorRequest.getPassword();
        String encodedPassword = passwordEncoder.encode(rawPassword);

        // 5. Create User (Login Account)
        User doctorUser = new User();
        doctorUser.setName(doctorRequest.getName());
        doctorUser.setEmail(doctorRequest.getEmail());
        doctorUser.setPassword(encodedPassword);
        doctorUser.setRole(role);

        User savedUser = userRepo.save(doctorUser);

        // 6. Create Doctor Profile
        Doctor doctor = new Doctor();
        doctor.setName(doctorRequest.getName());
        doctor.setUser(savedUser);
        doctor.setSpecialization(specialization);

        Doctor savedDoctor = doctorRepo.save(doctor);

        // 7. SEND EMAIL (IMPORTANT)
        try {
            emailService.sendDoctorEmail(
                    savedUser.getEmail(),
                    savedUser.getName(),
                    rawPassword,   // send only initial password (optional)
                    specialization
            );
        } catch (Exception e) {
            // Do NOT fail doctor creation if email fails
            System.out.println("Email sending failed: " + e.getMessage());
        }

        return savedDoctor;
    }
    // ================= CREATE ADMIN (ENTERPRISE VERSION) =================
    public User registerAdmin(AdminRequest request) {

        // 1. VALIDATION
        if (request.getName() == null || request.getEmail() == null || request.getPassword() == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "All fields (name, email, password) are required"
            );
        }

        // 2. CHECK IF EMAIL EXISTS
        if (userRepo.findByEmail(request.getEmail()).isPresent()) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Email already exists"
            );
        }

        // 3. GET ADMIN ROLE (ID = 3)
        Role adminRole = roleRepo.findById(3L)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Admin role not found (ID=3)"
                        )
                );

        // 4. ENCODE PASSWORD
        String rawPassword = request.getPassword();
        String encodedPassword = passwordEncoder.encode(rawPassword);

        // 5. CREATE USER
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(encodedPassword);
        user.setRole(adminRole);

        User savedUser = userRepo.save(user);

        // 6. SEND EMAIL (SAFE - DOES NOT BREAK SYSTEM)
        try {
            emailService.sendAccountEmail(
                    savedUser.getEmail(),
                    savedUser.getName(),
                    rawPassword,
                    "ADMIN"
            );
        } catch (Exception e) {
            System.out.println("Admin email failed: " + e.getMessage());
        }

        return savedUser;
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