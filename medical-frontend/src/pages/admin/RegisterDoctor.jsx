import React, { useState } from "react";
import Layout from "../../components/Layout";
import { registerDoctor } from "../../services/doctorService";

export default function RegisterDoctor() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    specialization: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  // ================= HANDLE CHANGE =================
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // ================= VALIDATION =================
  const validate = () => {
    if (!form.name || !form.email || !form.password || !form.specialization) {
      setError("All fields are required");
      return false;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      return false;
    }

    return true;
  };

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!validate()) return;

    setLoading(true);

    try {
      await registerDoctor(form);

      setSuccess("Doctor registered successfully 🎉");

      setForm({
        name: "",
        email: "",
        password: "",
        specialization: "",
      });

      // auto clear success
      setTimeout(() => setSuccess(""), 3000);

    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Failed to register doctor"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 flex justify-center items-start p-6">

        <div className="w-full max-w-xl">

          {/* HEADER */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-800">
              Register Doctor
            </h1>
            <p className="text-gray-500">
              Add medical professionals to the system
            </p>
          </div>

          {/* ERROR */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          {/* SUCCESS */}
          {success && (
            <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg">
              {success}
            </div>
          )}

          {/* FORM */}
          <form
            onSubmit={handleSubmit}
            className="bg-white shadow-xl rounded-2xl p-6 space-y-5"
          >

            {/* NAME */}
            <div>
              <label className="text-sm font-medium">Full Name</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Dr John Doe"
                className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* EMAIL */}
            <div>
              <label className="text-sm font-medium">Email</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="doctor@email.com"
                className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* PASSWORD */}
            <div>
              <label className="text-sm font-medium">Password</label>

              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter password"
                  className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-sm text-blue-600"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {/* SPECIALIZATION */}
            <div>
              <label className="text-sm font-medium">Specialization</label>
              <input
                name="specialization"
                value={form.specialization}
                onChange={handleChange}
                placeholder="Cardiology, Neurology..."
                className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full p-3 rounded-lg text-white font-semibold transition
                ${loading
                  ? "bg-blue-300 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
                }
              `}
            >
              {loading ? "Registering..." : "Register Doctor"}
            </button>

          </form>
        </div>
      </div>
    </Layout>
  );
}