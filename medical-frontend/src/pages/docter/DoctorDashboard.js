import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import Layout from "../../components/Layout";

export default function DoctorDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(null);

  const token = localStorage.getItem("token");
  const API = "http://localhost:8080/api";

  const doctorId = 4;

  // ================= FETCH =================
  const fetchAppointments = useCallback(async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        `${API}/appointments/doctor/${doctorId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAppointments(res.data);
    } catch (err) {
      setError("Failed to load appointments");
    } finally {
      setLoading(false);
    }
  }, [token, doctorId]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  // ================= UPDATE STATUS =================
  const updateStatus = async (id, action) => {
    try {
      setActionLoading(id);

      const url =
        action === "approve"
          ? `${API}/appointments/approve/${id}`
          : `${API}/appointments/reject/${id}`;

      await axios.put(url, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setAppointments((prev) =>
        prev.map((a) =>
          a.id === id
            ? {
                ...a,
                status: action === "approve" ? "APPROVED" : "REJECTED",
              }
            : a
        )
      );

    } catch (err) {
      alert("Failed to update appointment status");
    } finally {
      setActionLoading(null);
    }
  };

  // ================= STATUS STYLE =================
  const getStatusStyle = (status) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-700 border border-yellow-200";
      case "APPROVED":
        return "bg-green-100 text-green-700 border border-green-200";
      case "REJECTED":
        return "bg-red-100 text-red-700 border border-red-200";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <Layout>
      <div className="p-6 bg-gray-50 min-h-screen">

        {/* HEADER */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            Doctor Dashboard
          </h1>
          <p className="text-gray-500 mt-1">
            Approve or reject patient appointments
          </p>
        </div>

        {/* ERROR */}
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* LOADING */}
        {loading && (
          <div className="bg-white p-6 rounded-xl shadow animate-pulse text-gray-500">
            Loading appointments...
          </div>
        )}

        {/* EMPTY STATE */}
        {!loading && appointments.length === 0 && (
          <div className="bg-white p-6 rounded-xl shadow text-gray-500 text-center">
            No appointments found.
          </div>
        )}

        {/* TABLE */}
        {!loading && appointments.length > 0 && (
          <div className="bg-white shadow-lg rounded-2xl overflow-hidden">

            {/* TABLE HEADER */}
            <div className="p-4 border-b bg-gray-50">
              <h2 className="font-semibold text-gray-700">
                Appointments List
              </h2>
            </div>

            <table className="w-full text-left">

              <thead className="bg-gray-100 text-gray-600 text-sm">
                <tr>
                  <th className="p-4">Patient</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Time</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-center">Actions</th>
                </tr>
              </thead>

              <tbody>
                {appointments.map((a) => (
                  <tr
                    key={a.id}
                    className="border-t hover:bg-gray-50 transition"
                  >

                    <td className="p-4 font-medium text-gray-800">
                      {a.user?.name}
                    </td>

                    <td className="p-4 text-gray-600">
                      {a.user?.email}
                    </td>

                    <td className="p-4">{a.date}</td>
                    <td className="p-4">{a.time}</td>

                    {/* STATUS */}
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusStyle(a.status)}`}>
                        {a.status}
                      </span>
                    </td>

                    {/* ACTIONS */}
                    <td className="p-4 flex gap-2 justify-center">

                      <button
                        onClick={() => updateStatus(a.id, "approve")}
                        disabled={actionLoading === a.id || a.status !== "PENDING"}
                        className="px-3 py-1 text-xs rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:opacity-40 transition"
                      >
                        {actionLoading === a.id ? "..." : "Approve"}
                      </button>

                      <button
                        onClick={() => updateStatus(a.id, "reject")}
                        disabled={actionLoading === a.id || a.status !== "PENDING"}
                        className="px-3 py-1 text-xs rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-40 transition"
                      >
                        Reject
                      </button>

                    </td>

                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        )}

      </div>
    </Layout>
  );
}