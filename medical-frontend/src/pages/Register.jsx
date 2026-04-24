import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser, loginUser } from "../services/authService";

export default function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRegister = async () => {
    setLoading(true);
    setMessage("");

    try {
      // ✅ 1. REGISTER
      await registerUser(formData);

      // ✅ 2. AUTO LOGIN (clean + consistent)
      const loginData = await loginUser(
          formData.email,
          formData.password
      );

      // ✅ 3. SAVE TOKEN + ROLE
      localStorage.setItem("token", loginData.token);
      localStorage.setItem("role", loginData.role);

      setMessage("Account created successfully 🎉");

      // ✅ 4. REDIRECT BASED ON ROLE
      setTimeout(() => {
        if (loginData.role === "ADMIN") navigate("/admin/dashboard");
        else if (loginData.role === "DOCTOR") navigate("/doctor/dashboard");
        else navigate("/user/dashboard");
      }, 800);

    } catch (error) {
      setMessage(
          error.response?.data?.message || "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">

        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">

          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
            Create Account
          </h2>

          {message && (
              <div className="mb-4 text-center text-sm text-blue-600">
                {message}
              </div>
          )}

          {/* NAME */}
          <input
              name="name"
              placeholder="Full Name"
              onChange={handleChange}
              className="w-full px-4 py-3 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* EMAIL */}
          <input
              name="email"
              placeholder="Email Address"
              onChange={handleChange}
              className="w-full px-4 py-3 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* PASSWORD */}
          <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              className="w-full px-4 py-3 mb-6 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* BUTTON */}
          <button
              onClick={handleRegister}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition"
          >
            {loading ? "Creating Account..." : "Register"}
          </button>

          <p className="text-sm text-center text-gray-500 mt-4">
            Already have an account?{" "}
            <span className="text-blue-600 cursor-pointer hover:underline">
            Login
          </span>
          </p>

        </div>
      </div>
  );
}