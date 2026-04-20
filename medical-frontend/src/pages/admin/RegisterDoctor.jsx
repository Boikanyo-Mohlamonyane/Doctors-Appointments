import React, { useState } from "react";
import Layout from "../../components/Layout";
import { registerDoctor, registerAdmin } from "../../services/doctorService";

export default function RegisterDoctor() {
  const [activeTab, setActiveTab] = useState("DOCTOR");

  const [doctorForm, setDoctorForm] = useState({
    name: "",
    email: "",
    password: "",
    specialization: "",
  });

  const [adminForm, setAdminForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  // ================= HANDLERS =================
  const handleDoctorChange = (e) => {
    setDoctorForm({ ...doctorForm, [e.target.name]: e.target.value });
  };

  const handleAdminChange = (e) => {
    setAdminForm({ ...adminForm, [e.target.name]: e.target.value });
  };

  // ================= VALIDATION =================
  const validateDoctor = () => {
    if (!doctorForm.name || !doctorForm.email || !doctorForm.password || !doctorForm.specialization) {
      setError("All doctor fields are required");
      return false;
    }
    return true;
  };

  const validateAdmin = () => {
    if (!adminForm.name || !adminForm.email || !adminForm.password) {
      setError("All admin fields are required");
      return false;
    }
    return true;
  };

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      if (activeTab === "DOCTOR") {
        if (!validateDoctor()) {
          setLoading(false);
          return;
        }

        await registerDoctor(doctorForm);

        setDoctorForm({
          name: "",
          email: "",
          password: "",
          specialization: "",
        });

        setSuccess("Doctor successfully registered");
      }

      if (activeTab === "ADMIN") {
        if (!validateAdmin()) {
          setLoading(false);
          return;
        }

        await registerAdmin(adminForm);

        setAdminForm({
          name: "",
          email: "",
          password: "",
        });

        setSuccess("Administrator successfully created");
      }

      setTimeout(() => setSuccess(""), 4000);

    } catch (err) {
      setError(err?.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-100 p-6">

        {/* HEADER */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            Hospital Staff Management
          </h1>
          <p className="text-gray-500">
            Securely register and manage hospital personnel
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">

          {/* LEFT PANEL */}
          <div className="bg-gradient-to-br from-blue-700 to-blue-500 text-white p-6 rounded-2xl shadow-lg">
            <h2 className="text-xl font-semibold mb-4">
              Staff Roles Overview
            </h2>

            <div className="space-y-4 text-sm">

              <div>
                <p className="font-semibold">👨‍⚕️ Doctors</p>
                <p className="text-blue-100">
                  Manage patient care, consultations, and appointments.
                </p>
              </div>

              <div>
                <p className="font-semibold">🛡️ Administrators</p>
                <p className="text-blue-100">
                  Oversee system operations, users, and reporting.
                </p>
              </div>

              <div className="pt-4 border-t border-blue-300 text-xs text-blue-100">
                Enterprise-grade hospital system with role-based access control.
              </div>

            </div>
          </div>

          {/* RIGHT PANEL */}
          <div className="md:col-span-2 bg-white rounded-2xl shadow-lg border">

            {/* TABS */}
            <div className="flex border-b">
              <button
                onClick={() => setActiveTab("DOCTOR")}
                className={`flex-1 p-4 font-semibold transition ${
                  activeTab === "DOCTOR"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500 hover:bg-gray-50"
                }`}
              >
                Doctor Registration
              </button>

              <button
                onClick={() => setActiveTab("ADMIN")}
                className={`flex-1 p-4 font-semibold transition ${
                  activeTab === "ADMIN"
                    ? "text-red-600 border-b-2 border-red-600"
                    : "text-gray-500 hover:bg-gray-50"
                }`}
              >
                Admin Registration
              </button>
            </div>

            {/* FORM */}
            <form onSubmit={handleSubmit} className="p-6 space-y-5">

              {/* ALERTS */}
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {success && (
                <div className="p-3 bg-green-50 border border-green-200 text-green-600 rounded-lg text-sm">
                  {success}
                </div>
              )}

              {/* DOCTOR FORM */}
              {activeTab === "DOCTOR" && (
                <>
                  <Input label="Full Name" name="name" value={doctorForm.name} onChange={handleDoctorChange} />
                  <Input label="Email Address" name="email" type="email" value={doctorForm.email} onChange={handleDoctorChange} />
                  <PasswordInput
                    label="Password"
                    name="password"
                    value={doctorForm.password}
                    onChange={handleDoctorChange}
                    show={showPassword}
                    toggle={() => setShowPassword(!showPassword)}
                  />
                  <PasswordStrength password={doctorForm.password} />
                  <Input label="Specialization" name="specialization" value={doctorForm.specialization} onChange={handleDoctorChange} />
                </>
              )}

              {/* ADMIN FORM */}
              {activeTab === "ADMIN" && (
                <>
                  <Input label="Full Name" name="name" value={adminForm.name} onChange={handleAdminChange} />
                  <Input label="Email Address" name="email" type="email" value={adminForm.email} onChange={handleAdminChange} />
                  <PasswordInput
                    label="Password"
                    name="password"
                    value={adminForm.password}
                    onChange={handleAdminChange}
                    show={showPassword}
                    toggle={() => setShowPassword(!showPassword)}
                  />
                  <PasswordStrength password={adminForm.password} />
                </>
              )}

              {/* SUBMIT */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 rounded-lg text-white font-semibold transition ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : activeTab === "ADMIN"
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {loading ? "Processing..." : `Register ${activeTab}`}
              </button>

            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
}

/* ================= INPUT ================= */
function Input({ label, ...props }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        {...props}
        className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
      />
    </div>
  );
}

/* ================= PASSWORD INPUT ================= */
function PasswordInput({ label, show, toggle, ...props }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="relative mt-1">
        <input
          {...props}
          type={show ? "text" : "password"}
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="button"
          onClick={toggle}
          className="absolute right-3 top-3 text-sm text-blue-600"
        >
          {show ? "Hide" : "Show"}
        </button>
      </div>
    </div>
  );
}

/* ================= PASSWORD STRENGTH ================= */
function PasswordStrength({ password }) {
  if (!password) return null;

  let strength = "Weak";
  let color = "text-red-500";

  if (password.length >= 6) {
    strength = "Medium";
    color = "text-yellow-500";
  }
  if (password.length >= 10) {
    strength = "Strong";
    color = "text-green-600";
  }

  return (
    <p className={`text-xs mt-1 ${color}`}>
      Password strength: {strength}
    </p>
  );
}