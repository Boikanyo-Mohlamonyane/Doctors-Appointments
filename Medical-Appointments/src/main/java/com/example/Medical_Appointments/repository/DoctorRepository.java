package com.example.Medical_Appointments.repository;

import com.example.Medical_Appointments.model.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DoctorRepository extends JpaRepository<Doctor, Long> {
}