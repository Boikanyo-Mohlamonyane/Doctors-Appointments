package com.example.Medical_Appointments.controller;

import com.example.Medical_Appointments.dto.AppointmentRequest;
import com.example.Medical_Appointments.dto.RejectRequest;
import com.example.Medical_Appointments.dto.RescheduleRequest;
import com.example.Medical_Appointments.model.Appointment;
import com.example.Medical_Appointments.service.AppointmentService;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
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

    @PutMapping("/reject/{id}")
    @PreAuthorize("hasAuthority('DOCTOR')")
    public Appointment reject(
            @PathVariable Long id,
            @RequestBody RejectRequest request,
            Principal principal
    ) {
        return service.reject(
                id,
                request.getReason(), // OR request.getReason()
                principal.getName()
        );
    }
    // ================= DELETE APPOINTMENT =================
    @DeleteMapping("/user/{appID}")
    @PreAuthorize("hasAuthority('USER')")
    public ResponseEntity<String> deleteAppointment(@PathVariable Long appID) {

        service.deleteAppointment(appID);

        return ResponseEntity.ok("Appointment deleted successfully");
    }

    // ================= RESCHEDULE ENDPOINT =================
    @PutMapping("/reschedule/{id}")
    @PreAuthorize("hasAuthority('USER')")
    public ResponseEntity<Appointment> rescheduleAppointment(
            @PathVariable Long id,
            @RequestBody RescheduleRequest request
    ) {

        Appointment updated = service.rescheduleAppointment(id, request);

        return ResponseEntity.ok(updated);
    }
}