import api from "./api";

/**
 * =========================================================
 * USER: GET MY APPOINTMENTS
 * =========================================================
 */
export const getMyAppointments = () => {
  return api.get("/appointments/my");
};

/**
 * =========================================================
 * ADMIN: GET ALL APPOINTMENTS
 * =========================================================
 */
export const getAllAppointments = () => {
  return api.get("/appointments");
};

/**
 * =========================================================
 * USER: BOOK APPOINTMENT
 * =========================================================
 */
export const bookAppointment = (data) => {
  return api.post("/appointments", data);
};


/**
 * DOCTOR: GET MY APPOINTMENTS (JWT BASED)
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