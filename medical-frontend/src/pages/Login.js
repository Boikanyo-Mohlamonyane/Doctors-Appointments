import React, { useState } from "react";
import { loginUser } from "../services/authService";
import { useNavigate } from "react-router-dom";

/* ================= MAIN LOGIN ================= */
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showRegister, setShowRegister] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await loginUser(email, password);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);

      const role = res.data.role;

      if (role === "ADMIN") navigate("/admin/dashboard");
      else if (role === "DOCTOR") navigate("/doctor/dashboard");
      else navigate("/user/dashboard");
    } catch (err) {
      setError("Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="min-h-screen flex flex-col lg:flex-row bg-gradient-to-br from-slate-50 to-slate-200">

        {/* ================= LEFT PANEL ================= */}
        <div className="hidden lg:flex w-1/2 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1580281657527-47f249e8f4d1')] bg-cover bg-center" />
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/90 to-slate-900/90" />

          <div className="relative z-10 flex flex-col justify-center px-10 xl:px-16 text-white">
            <h1 className="text-4xl xl:text-5xl font-bold leading-tight">
              Philadelphia Hospital
            </h1>

            <p className="mt-4 text-blue-100 text-base xl:text-lg">
              Advanced Medical Appointment & Patient Management System
            </p>

            <div className="mt-10 space-y-2 text-sm text-blue-100">
              <p>✔ Secure patient records</p>
              <p>✔ Doctor scheduling automation</p>
              <p>✔ Real-time appointment tracking</p>
              <p>✔ Enterprise healthcare security</p>
            </div>

            <div className="mt-10 text-xs text-blue-200">
              © {new Date().getFullYear()} Philadelphia Hospital System
            </div>
          </div>
        </div>

        {/* ================= LOGIN PANEL ================= */}
        <div className="flex w-full lg:w-1/2 items-center justify-center p-4 sm:p-6">

          <div className="w-full max-w-md bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-gray-100 p-6 sm:p-8 md:p-10">

            {/* HEADER */}
            <div className="text-center mb-6 sm:mb-8">

              <div className="mx-auto w-12 h-12 sm:w-14 sm:h-14 bg-blue-600 text-white rounded-2xl flex items-center justify-center text-lg sm:text-xl font-bold shadow-lg">
                PH
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold mt-4 text-gray-800">
                Welcome Back
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Sign in to your account
              </p>
            </div>

            {/* ERROR */}
            {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl text-center">
                  {error}
                </div>
            )}

            {/* FORM */}
            <form onSubmit={handleLogin} className="space-y-4 sm:space-y-5">

              {/* EMAIL */}
              <div>
                <label className="text-sm text-gray-600">Email Address</label>
                <input
                    type="email"
                    placeholder="doctor@hospital.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full mt-1 p-3 border rounded-xl text-sm sm:text-base focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                />
              </div>

              {/* PASSWORD */}
              <div>
                <label className="text-sm text-gray-600">Password</label>

                <div className="relative mt-1">
                  <input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full p-3 border rounded-xl text-sm sm:text-base focus:ring-2 focus:ring-blue-500 outline-none"
                      required
                  />

                  <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-xs text-blue-600 font-medium"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              {/* BUTTON */}
              <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md transition-all text-sm sm:text-base"
              >
                {loading ? "Authenticating..." : "Sign In"}
              </button>
            </form>

            {/* REGISTER */}
            <div className="mt-6 text-center text-sm text-gray-500">
              <p>
                Don’t have an account?{" "}
                <span
                    onClick={() => setShowRegister(true)}
                    className="text-blue-600 font-medium cursor-pointer hover:underline"
                >
                Create account
              </span>
              </p>
            </div>
          </div>
        </div>

        {/* ================= REGISTER MODAL ================= */}
        {showRegister && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">

              <div className="bg-white w-full max-w-md rounded-2xl sm:rounded-3xl shadow-2xl p-5 sm:p-6 relative">

                <button
                    onClick={() => setShowRegister(false)}
                    className="absolute top-3 right-3 text-gray-400 hover:text-red-500 text-xl"
                >
                  ✕
                </button>

                <RegisterPopup setShowRegister={setShowRegister} />
              </div>

            </div>
        )}
      </div>
  );
}

/* ================= REGISTER POPUP ================= */
function RegisterPopup({ setShowRegister }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("http://63.33.171.154:8080/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Registration failed");

      setMessage("Account created successfully 🎉");

      setTimeout(() => {
        setShowRegister(false);
      }, 1200);
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-center text-gray-800 mb-5">
          Create Account
        </h2>

        {message && (
            <p className="text-center text-sm text-blue-600 mb-3">
              {message}
            </p>
        )}

        <input
            name="name"
            placeholder="Full Name"
            onChange={handleChange}
            className="w-full p-3 mb-3 border rounded-xl text-sm sm:text-base"
        />

        <input
            name="email"
            placeholder="Email Address"
            onChange={handleChange}
            className="w-full p-3 mb-3 border rounded-xl text-sm sm:text-base"
        />

        <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            className="w-full p-3 mb-4 border rounded-xl text-sm sm:text-base"
        />

        <button
            onClick={handleRegister}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold text-sm sm:text-base"
        >
          {loading ? "Creating..." : "Create Account"}
        </button>
      </div>
  );
}