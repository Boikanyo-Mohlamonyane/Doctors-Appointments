import axios from "axios";

const API = "http://63.33.171.154:8080/api/admin/users";

const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const getUsers = (page = 0, size = 10, search = "", role = "") => {
  return axios.get(
    `${API}?page=${page}&size=${size}&search=${search}&role=${role}`,
    authHeader()
  );
};

export const updateUserRole = (id, role) => {
  return axios.put(`${API}/${id}`, { role }, authHeader());
};

export const deleteUser = (id) => {
  return axios.delete(`${API}/${id}`, authHeader());
};