import { jwtDecode } from "jwt-decode";

// 🔍 check if token expired
export const isTokenExpired = (token) => {
  if (!token) return true;

  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;

    return decoded.exp < currentTime;
  } catch (error) {
    return true;
  }
};

// 🚪 logout function
export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  window.location.href = "/";
};

// 👤 ADD THIS (FIX)
export const getRole = () => {
  return localStorage.getItem("role");
};