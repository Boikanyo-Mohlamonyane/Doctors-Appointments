import React, { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../../components/Layout";

export default function UserDashboard() {
  const [doctors, setDoctors] = useState([]);
  const [doctorId, setDoctorId] = useState("");

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const [loading, setLoading] = useState(false);
  const [loadingDoctors, setLoadingDoctors] = useState(true);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(null);

  const token = localStorage.getItem("token");

  // ================= FETCH DOCTORS =================
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoadingDoctors(true);

        const res = await axios.get(
          "http://localhost:8080/api/admin/doctors",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setDoctors(res.data);
      } catch (err) {
        setError("Failed to load doctors");
      } finally {
        setLoadingDoctors(false);
      }
    };

    fetchDoctors();
  }, [token]);

  // ================= BOOK APPOINTMENT =================
  const handleBooking = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    setSuccess(null);

    try {
      const res = await axios.post(
        "http://localhost:8080/api/appointments",
        {
          doctorId: Number(doctorId),
          date,
          time,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccess(res.data);

      // reset form
      setDoctorId("");
      setDate("");
      setTime("");
    } catch (err) {
      setError("Failed to book appointment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="p-6 max-w-xl">

        {/* HEADER */}
        <h1 className="text-2xl font-bold text-gray-800">
          Book Appointment
        </h1>

        <p className="text-gray-500 text-sm mb-4">
          Choose a doctor and schedule your appointment
        </p>

        {/* ERROR */}
        {error && (
          <div className="bg-red-100 text-red-600 p-3 rounded mb-3">
            {error}
          </div>
        )}

        {/* SUCCESS */}
        {success && (
          <div className="bg-green-100 text-green-700 p-3 rounded mb-3">
            Appointment booked successfully 🎉
            <div className="text-sm mt-1">
              ID: {success.id} | Status: {success.status}
            </div>
          </div>
        )}

        {/* FORM */}
        <form
          onSubmit={handleBooking}
          className="bg-white p-6 rounded-xl shadow space-y-4"
        >

          {/* DOCTOR DROPDOWN */}
          <div>
            <label className="text-sm text-gray-600">
              Select Doctor
            </label>

            <select
              value={doctorId}
              onChange={(e) => setDoctorId(e.target.value)}
              className="w-full border p-2 rounded mt-1"
              required
            >
              <option value="">-- Choose a Doctor --</option>

              {loadingDoctors ? (
                <option>Loading doctors...</option>
              ) : (
                doctors.map((doc) => (
                  <option key={doc.id} value={doc.id}>
                    {doc.name} ({doc.specialization})
                  </option>
                ))
              )}
            </select>
          </div>

          {/* DATE */}
          <div>
            <label className="text-sm text-gray-600">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full border p-2 rounded mt-1"
              required
            />
          </div>

          {/* TIME */}
          <div>
            <label className="text-sm text-gray-600">Time</label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full border p-2 rounded mt-1"
              required
            />
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 flex items-center justify-center"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              "Book Appointment"
            )}
          </button>

        </form>

      </div>
    </Layout>
  );
}