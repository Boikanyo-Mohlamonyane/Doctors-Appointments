package com.example.Medical_Appointments.service;

import com.example.Medical_Appointments.dto.AppointmentRequest;
import com.example.Medical_Appointments.dto.RescheduleRequest;
import com.example.Medical_Appointments.model.Appointment;
import com.example.Medical_Appointments.model.Doctor;
import com.example.Medical_Appointments.model.User;
import com.example.Medical_Appointments.repository.AppointmentRepository;
import com.example.Medical_Appointments.repository.DoctorRepository;
import com.example.Medical_Appointments.repository.UserRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AppointmentService {

    private final AppointmentRepository repo;
    private final UserRepository userRepo;
    private final DoctorRepository doctorRepo;

    // ✅ BOOK APPOINTMENT (FIXED)
    public Appointment book(AppointmentRequest request) {

        // 🔐 Get logged-in user from JWT
        String email = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();

        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Doctor doctor = doctorRepo.findById(request.getDoctorId())
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        Appointment appointment = new Appointment();
        appointment.setUser(user);
        appointment.setDoctor(doctor);
        appointment.setDate(request.getDate());
        appointment.setTime(request.getTime());
        appointment.setStatus("PENDING");

        return repo.save(appointment);
    }

    // 👑 ADMIN → GET ALL
    public List<Appointment> getAll() {
        return repo.findAll();
    }

    // 🩺 DOCTOR → GET THEIR APPOINTMENTS
    public List<Appointment> getByDoctor(Long doctorId) {
        return repo.findByDoctorId(doctorId);
    }

    // 🩺 DOCTOR → APPROVE
    public Appointment approve(Long id) {
        Appointment a = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        a.setStatus("APPROVED");
        return repo.save(a);
    }
    // User Deleting Appointment
    public void deleteAppointment(Long appID) {

        Appointment appointment = repo.findById(appID)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Appointment not found with ID: " + appID
                        )
                );

        repo.delete(appointment);
    }
    // ================= RESCHEDULE APPOINTMENT =================
    public Appointment rescheduleAppointment(Long appointmentId, RescheduleRequest request) {

        Appointment appointment = repo.findById(appointmentId)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Appointment not found with ID: " + appointmentId
                        )
                );

        // update fields
        appointment.setDate(request.getDate());
        appointment.setTime(request.getTime());

        // optional: update doctor if needed
        // appointment.setDoctor(... fetch doctor by request.getDoctorId())

        return repo.save(appointment);
    }

    public List<Appointment> getMyAppointments() {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        String email = auth.getName(); // logged-in username/email

        return repo.findByUserEmail(email);
    }

    // 🩺 REJECT APPOINTMENT
    public Appointment reject(Long id, String reason, String doctorEmail) {

        Appointment appointment = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        User doctor = userRepo.findByEmail(doctorEmail)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        // ================= UPDATE STATUS =================
        appointment.setStatus("REJECTED");

        // ================= AUDIT FIELDS =================
        appointment.setRejectionReason(reason);
        appointment.setRejectedBy(doctor.getId());
        appointment.setRejectedAt(LocalDateTime.now());

        return repo.save(appointment);
    }
}