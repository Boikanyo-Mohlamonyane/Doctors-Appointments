import api from "./api";

// ================= GET USERS =================
export const getUsers = (page = 0, size = 10, search = "", role = "") => {
  return api.get("/admin/users", {
    params: {
      page,
      size,
      search,
      role,
    },
  });
};

// ================= UPDATE USER ROLE =================
export const updateUserRole = (id, role) => {
  return api.put(`/admin/users/${id}`, {
    role,
  });
};

// ================= DELETE USER =================
export const deleteUser = (id) => {
  return api.delete(`/admin/users/${id}`);
};