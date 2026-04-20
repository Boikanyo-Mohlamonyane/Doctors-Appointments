package com.example.Medical_Appointments.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ================= PATIENT =================
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // ================= DOCTOR =================
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "doctor_id", nullable = false)
    private Doctor doctor;

    // ================= SCHEDULE =================
    private String date;
    private String time;

    // ================= STATUS =================
    @Column(nullable = false)
    private String status; // PENDING, APPROVED, REJECTED

    // ================= REJECTION DETAILS =================
    @Column(length = 500)
    private String rejectionReason;

    private Long rejectedBy;

    private LocalDateTime rejectedAt;

    // ================= BEST PRACTICE (AUDIT) =================

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    // ================= LIFECYCLE HOOKS =================
    @PrePersist
    public void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.status = this.status == null ? "PENDING" : this.status;
    }

    @PreUpdate
    public void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}