import React, { useState } from "react";
import { loginUser } from "../services/authService";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50">

      {/* LEFT PANEL (BRANDING) */}
      <div className="hidden md:flex w-1/2 bg-gradient-to-br from-blue-700 via-blue-600 to-blue-500 text-white items-center justify-center p-12">
        <div className="max-w-md">
          <h1 className="text-4xl font-bold leading-tight">
            MediCare Hospital System
          </h1>

          <p className="mt-4 text-blue-100 text-lg">
            Secure, scalable, and intelligent appointment management for modern healthcare systems.
          </p>

          <div className="mt-8 space-y-2 text-sm text-blue-100">
            <p>✔ Doctor scheduling system</p>
            <p>✔ Real-time appointment tracking</p>
            <p>✔ Role-based access control</p>
            <p>✔ Enterprise-grade security</p>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL (FORM) */}
      <div className="flex w-full md:w-1/2 items-center justify-center p-6">

        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 p-8">

          {/* HEADER */}
          <div className="text-center mb-6">
            <div className="mx-auto w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center font-bold text-lg">
              M
            </div>

            <h2 className="text-2xl font-bold mt-3 text-gray-800">
              Welcome back
            </h2>

            <p className="text-sm text-gray-500">
              Sign in to your dashboard
            </p>
          </div>

          {/* ERROR */}
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm text-center">
              {error}
            </div>
          )}

          {/* FORM */}
          <form onSubmit={handleLogin} className="space-y-5">

            {/* EMAIL */}
            <div>
              <label className="text-sm text-gray-600">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full mt-1 p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* PASSWORD */}
            <div>
              <label className="text-sm text-gray-600">Password</label>

              <div className="relative mt-1">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-xs text-blue-600 hover:underline"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {/* OPTIONS */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-gray-600">
                <input type="checkbox" />
                Remember me
              </label>

              <Link
                to="/forgot-password"
                className="text-blue-600 hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-lg text-white font-medium transition flex items-center justify-center ${
                loading
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* FOOTER LINKS */}
          <div className="mt-6 text-center text-xs text-gray-500 space-y-3">

            <div className="flex justify-center gap-4">
              <Link className="hover:text-blue-600" to="/about">
                About
              </Link>
              <Link className="hover:text-blue-600" to="/help">
                Help
              </Link>
              <Link className="hover:text-blue-600" to="/contact">
                Contact
              </Link>
            </div>

            <p>© {new Date().getFullYear()} MediCare Systems</p>
          </div>

          {/* SIGNUP */}
          <p className="text-center text-sm mt-4 text-gray-600">
            Don’t have an account?{" "}
            <Link to="/register" className="text-blue-600 hover:underline">
              Create account
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}