package com.example.Medical_Appointments.service;

import com.example.Medical_Appointments.dto.LoginResponse;
import com.example.Medical_Appointments.dto.RegisterRequest;
import com.example.Medical_Appointments.model.Role;
import com.example.Medical_Appointments.model.User;
import com.example.Medical_Appointments.repository.RoleRepository;
import com.example.Medical_Appointments.repository.UserRepository;
import com.example.Medical_Appointments.security.JwtUtil;

import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepo;
    private final RoleRepository roleRepo;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    private EmailService emailService;

    // 👤 REGISTER USER (DEFAULT = USER ROLE)
    public User register(RegisterRequest request) {

        if (userRepo.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }

        Role role = roleRepo.findByName("USER")
                .orElseThrow(() -> new RuntimeException("Role USER not found"));

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(role);

        return userRepo.save(user);
    }

    // 🔐 LOGIN + JWT TOKEN
    public LoginResponse login(String email, String password) {

        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        String token = jwtUtil.generateToken(
                user.getEmail(),
                user.getRole().getName()
        );

        return new LoginResponse(token,user.getRole().getName());
    }
}