package com.example.Medical_Appointments.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RejectRequest {
    @JsonProperty("rejection_reason")
    private String reason;
}