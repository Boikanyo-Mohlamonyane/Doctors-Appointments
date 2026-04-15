package com.example.Medical_Appointments.controller;


import com.example.Medical_Appointments.dto.LoginRequest;
import com.example.Medical_Appointments.dto.LoginResponse;
import com.example.Medical_Appointments.dto.RegisterRequest;
import com.example.Medical_Appointments.model.User;
import com.example.Medical_Appointments.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public User register(@RequestBody RegisterRequest user) {
        return authService.register(user);
    }
    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest loginRequest) {
        return authService.login(
                loginRequest.getEmail(),
                loginRequest.getPassword()
        );
    }
}