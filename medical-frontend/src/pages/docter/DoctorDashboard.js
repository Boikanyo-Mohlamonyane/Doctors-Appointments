import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import Layout from "../../components/Layout";

export default function DoctorDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(null);

  const [rejectModal, setRejectModal] = useState(null);
  const [rejectReason, setRejectReason] = useState("");

  const token = localStorage.getItem("token");
  const API = "http://localhost:8080/api";

  // ================= FETCH =================
  const fetchAppointments = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const res = await axios.get(`${API}/appointments`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setAppointments(res.data);
    } catch (err) {
      setError("Failed to load appointments");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  // ================= APPROVE =================
  const approveAppointment = async (id) => {
    const previous = [...appointments];

    try {
      setActionLoading(id);

      setAppointments((prev) =>
        prev.map((a) =>
          a.id === id ? { ...a, status: "APPROVED" } : a
        )
      );

      await axios.put(
        `${API}/appointments/approve/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (err) {
      setAppointments(previous);
      setError("Failed to approve appointment");
    } finally {
      setActionLoading(null);
    }
  };

  // ================= OPEN REJECT =================
  const openRejectModal = (id) => {
    setRejectModal(id);
    setRejectReason("");
  };

  // ================= CONFIRM REJECT (FIXED PAYLOAD) =================
  const confirmReject = async () => {
    if (!rejectReason.trim()) {
      setError("Rejection reason is required");
      return;
    }

    const id = rejectModal;
    const previous = [...appointments];

    try {
      setActionLoading(id);

      setAppointments((prev) =>
        prev.map((a) =>
          a.id === id
            ? {
                ...a,
                status: "REJECTED",
                rejectionReason: rejectReason,
              }
            : a
        )
      );

      await axios.put(
        `${API}/appointments/reject/${id}`,
        {
          rejection_reason: rejectReason, // ✅ MATCHES YOUR POSTMAN
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setRejectModal(null);
      setRejectReason("");
    } catch (err) {
      setAppointments(previous);
      setError("Failed to reject appointment");
    } finally {
      setActionLoading(null);
    }
  };

  // ================= STATUS STYLE =================
  const getStatusStyle = (status) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-700 px-2 py-1 rounded";
      case "APPROVED":
        return "bg-green-100 text-green-700 px-2 py-1 rounded";
      case "REJECTED":
        return "bg-red-100 text-red-700 px-2 py-1 rounded";
      default:
        return "bg-gray-100 text-gray-600 px-2 py-1 rounded";
    }
  };

  // ================= UI =================
  return (
    <Layout>
      <div className="p-6 bg-gray-50 min-h-screen">

        <h1 className="text-3xl font-bold mb-2">Doctor Dashboard</h1>
        <p className="text-gray-500 mb-6">
          Approve or reject appointments
        </p>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
            {error}
          </div>
        )}

        {loading ? (
          <div className="bg-white p-6 rounded shadow">
            Loading...
          </div>
        ) : (
          <div className="bg-white shadow rounded overflow-hidden">

            <table className="w-full text-left">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3">Patient</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Time</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>

              <tbody>
                {appointments.map((a) => (
                  <tr key={a.id} className="border-t">

                    <td className="p-3">{a.user?.name}</td>
                    <td className="p-3">{a.user?.email}</td>
                    <td className="p-3">{a.date}</td>
                    <td className="p-3">{a.time}</td>

                    <td className="p-3">
                      <span className={getStatusStyle(a.status)}>
                        {a.status}
                      </span>

                      {a.rejectionReason && (
                        <div className="text-xs text-red-500 mt-1">
                          Reason: {a.rejectionReason}
                        </div>
                      )}
                    </td>

                    <td className="p-3 flex gap-2">

                      <button
                        onClick={() => approveAppointment(a.id)}
                        disabled={actionLoading === a.id}
                        className="bg-green-600 text-white px-3 py-1 rounded"
                      >
                        Approve
                      </button>

                      <button
                        onClick={() => openRejectModal(a.id)}
                        disabled={actionLoading === a.id}
                        className="bg-red-600 text-white px-3 py-1 rounded"
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

        {/* ================= MODAL ================= */}
        {rejectModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center">

            <div className="bg-white p-6 rounded-xl w-96">

              <h2 className="text-lg font-bold mb-3">
                Reject Appointment
              </h2>

              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Enter rejection reason..."
                className="w-full border p-3 rounded h-28"
              />

              <div className="flex justify-end gap-2 mt-4">

                <button
                  onClick={() => setRejectModal(null)}
                  className="px-4 py-2 bg-gray-300 rounded"
                >
                  Cancel
                </button>

                <button
                  onClick={confirmReject}
                  className="px-4 py-2 bg-red-600 text-white rounded"
                >
                  Confirm Reject
                </button>

              </div>

            </div>

          </div>
        )}

      </div>
    </Layout>
  );
}