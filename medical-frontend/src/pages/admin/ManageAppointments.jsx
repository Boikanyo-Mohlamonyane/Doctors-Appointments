import React, { useEffect, useState, useCallback, useMemo } from "react";
import Layout from "../../components/Layout";
import { getAllAppointments } from "../../services/appointmentService";

export default function ManageAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ================= FETCH =================
  const fetchAppointments = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const res = await getAllAppointments();
      setAppointments(res.data);

    } catch (err) {
      setError("Failed to load appointments");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  // ================= STATUS BADGES (MEMOIZED) =================
  const getStatusClass = useMemo(() => {
    return {
      PENDING: "bg-yellow-100 text-yellow-700",
      APPROVED: "bg-green-100 text-green-700",
      REJECTED: "bg-red-100 text-red-700",
      CANCELLED: "bg-gray-100 text-gray-700",
    };
  }, []);

  // ================= EMPTY STATE =================
  const isEmpty = !loading && appointments.length === 0;

  return (
    <Layout>
      <div className="p-6 bg-gray-50 min-h-screen">

        {/* HEADER */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            Appointment Management
          </h1>
          <p className="text-gray-500">
            Admin control panel for all bookings
          </p>
        </div>

        {/* ERROR */}
        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* LOADING STATE (SKELETON STYLE) */}
        {loading && (
          <div className="bg-white p-6 rounded-xl shadow animate-pulse">
            Loading appointments...
          </div>
        )}

        {/* EMPTY STATE */}
        {isEmpty && (
          <div className="bg-white p-6 rounded-xl shadow text-gray-500">
            No appointments found.
          </div>
        )}

        {/* TABLE */}
        {!loading && !isEmpty && (
          <div className="bg-white shadow rounded-xl overflow-hidden">

            <table className="w-full text-left">

              {/* HEADER */}
              <thead className="bg-gray-100 text-gray-600 text-sm">
                <tr>
                  <th className="p-3">ID</th>
                  <th className="p-3">Patient</th>
                  <th className="p-3">Doctor</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Time</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>

              {/* BODY */}
              <tbody>
                {appointments.map((app) => (
                  <tr
                    key={app.id}
                    className="border-t hover:bg-gray-50 transition"
                  >

                    {/* ID */}
                    <td className="p-3 font-medium">
                      #{app.id}
                    </td>

                    {/* USER */}
                    <td className="p-3">
                      <div className="font-medium text-gray-800">
                        {app.user?.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {app.user?.email}
                      </div>
                    </td>

                    {/* DOCTOR */}
                    <td className="p-3">
                      <div className="font-medium text-gray-800">
                        {app.doctor?.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {app.doctor?.specialization}
                      </div>
                    </td>

                    {/* DATE */}
                    <td className="p-3">{app.date}</td>

                    {/* TIME */}
                    <td className="p-3">{app.time}</td>

                    {/* STATUS */}
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          getStatusClass[app.status] ||
                          "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {app.status}
                      </span>
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