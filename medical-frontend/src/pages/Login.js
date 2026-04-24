import React, { useState } from "react";
import { loginUser } from "../services/authService";
import { useNavigate } from "react-router-dom";

export default function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = await loginUser(email, password);

      // ✅ FIXED: correct response usage
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);

      if (data.role === "ADMIN") navigate("/admin/dashboard");
      else if (data.role === "DOCTOR") navigate("/doctor/dashboard");
      else navigate("/user/dashboard");

    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
      <form onSubmit={handleLogin}>
        <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email"
        />

        <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="password"
        />

        <button disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        {error && <p>{error}</p>}
      </form>
  );
}