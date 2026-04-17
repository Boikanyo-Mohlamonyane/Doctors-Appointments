import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import UserDashboard from "./pages/user/UserDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import DoctorDashboard from "./pages/docter/DoctorDashboard";
import ManageUsers from "./pages/admin/ManageUsers";
import ManageAppointments from "./pages/admin/ManageAppointments";
import ProtectedRoute from "./components/ProtectedRoute";
import RegisterDoctor from "./pages/admin/RegisterDoctor";
import MyAppointments from "./pages/user/MyAppointments";
import { useEffect } from "react";
import { isTokenExpired, logout } from "./utils/auth";

function App() {

  // 🔐 AUTO LOGOUT CHECK (JWT EXPIRY)
  useEffect(() => {
    const interval = setInterval(() => {
      const token = localStorage.getItem("token");

      if (token && isTokenExpired(token)) {
        alert("Session expired. Logging out...");
        logout();
      }
    }, 10000); // check every 10 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <BrowserRouter>
      <Routes>

        {/* PUBLIC ROUTE */}
        <Route path="/" element={<Login />} />

        {/* USER ROUTE */}
        <Route
          path="/user/dashboard"
          element={
            <ProtectedRoute role="USER">
              <UserDashboard />
            </ProtectedRoute>
          }
        />

        <Route
         path="/user/mybooks"
         element = {
          <ProtectedRoute role="USER">
           <MyAppointments />
          </ProtectedRoute>
         }
        />


        {/* DOCTOR ROUTE */}
        <Route
          path="/doctor/dashboard"
          element={
            <ProtectedRoute role="DOCTOR">
              <DoctorDashboard />
            </ProtectedRoute>
          }
        />

    
        {/* ================= ADMIN ROUTES ================= */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute role="ADMIN">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/users"
          element={
            <ProtectedRoute role="ADMIN">
              <ManageUsers />

            </ProtectedRoute>
          }
        />
        <Route
        path="/admin/register"
        element={
          <ProtectedRoute role="ADMIN">
            <RegisterDoctor/>
          </ProtectedRoute>
        }
       />
         <Route
          path="/admin/appointments"
          element={
            <ProtectedRoute role="ADMIN">
             <ManageAppointments />
           </ProtectedRoute>
  }
/>

      </Routes>
    </BrowserRouter>
  );
}

export default App;