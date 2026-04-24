import api from "./api";

/**
 * USER: GET MY APPOINTMENTS
 */
export const getMyAppointments = () => {
  return api.get("/appointments/my");
};

/**
 * ADMIN: GET ALL APPOINTMENTS
 */
export const getAllAppointments = (params = {}) => {
  return api.get("/appointments", { params });
};

/**
 * USER: BOOK APPOINTMENT
 */
export const bookAppointment = (data) => {
  return api.post("/appointments", data);
};

/**
 * DOCTOR: GET MY APPOINTMENTS
 */
export const getDoctorAppointments = () => {
  return api.get("/appointments/doctor/my");
};

/**
 * APPROVE
 */
export const approveAppointment = (id) => {
  return api.put(`/appointments/approve/${id}`);
};

/**
 * REJECT
 */
export const rejectAppointment = (id) => {
  return api.put(`/appointments/reject/${id}`);
};

/**
 * DELETE APPOINTMENT (USER)
 */
export const deleteAppointment = (userId, appointmentId) => {
  return api.delete(`/appointments/user/${userId}`, {
    data: { appointmentId },
  });
};

/**
 * RESCHEDULE APPOINTMENT
 */
export const rescheduleAppointment = (id, data) => {
  return api.put(`/appointments/reschedule/${id}`, data);
};