package com.example.Medical_Appointments.config;

import com.example.Medical_Appointments.model.Role;
import com.example.Medical_Appointments.model.User;
import com.example.Medical_Appointments.repository.RoleRepository;
import com.example.Medical_Appointments.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final RoleRepository roleRepo;
    private final UserRepository userRepo;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {

        // 🔐 Create roles if not exist
        Role adminRole = roleRepo.findByName("ADMIN")
                .orElseGet(() -> roleRepo.save(new Role(null, "ADMIN")));

        Role userRole = roleRepo.findByName("USER")
                .orElseGet(() -> roleRepo.save(new Role(null, "USER")));

        Role doctorRole = roleRepo.findByName("DOCTOR")
                .orElseGet(() -> roleRepo.save(new Role(null, "DOCTOR")));

        // 👑 Create default admin if not exists
        if (userRepo.findByEmail("admin@system.com").isEmpty()) {

            User admin = new User();
            admin.setName("System Admin");
            admin.setEmail("admin@system.com");
            admin.setPassword(passwordEncoder.encode("admin123")); // default password
            admin.setRole(adminRole);

            userRepo.save(admin);

            System.out.println("✔ Default Admin Created: admin@system.com / admin123");
        }
    }
}