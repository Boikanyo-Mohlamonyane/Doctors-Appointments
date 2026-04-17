import api from "./api";

// GET ALL DOCTORS (ADMIN)
export const getAllDoctors = () => {
  return api.get("/admin/doctors");
};

// REGISTER DOCTOR (ADMIN)
export const registerDoctor = (data) => {
  return api.post("/admin/doctors", data);
};

// OPTIONAL: DELETE DOCTOR
export const deleteDoctor = (id) => {
  return api.delete(`/admin/doctors/${id}`);
};