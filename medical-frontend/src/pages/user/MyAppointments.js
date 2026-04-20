import React, { useEffect, useState } from "react";
import { getMyAppointments } from "../../services/appointmentService";
import Layout from "../../components/Layout";

const API = "http://localhost:8080/api/appointments";

export default function MyAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const res = await getMyAppointments();
      setAppointments(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  // ================= DELETE =================
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this appointment?")) return;

    try {
      await fetch(`${API}/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });

      setAppointments((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  // ================= RESCHEDULE =================
  const handleReschedule = async () => {
    try {
      await fetch(`${API}/reschedule/${selectedAppointment.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({
          date: newDate,
          time: newTime
        })
      });

      setSelectedAppointment(null);
      setNewDate("");
      setNewTime("");
      fetchAppointments();
    } catch (err) {
      console.log(err);
    }
  };

  // ================= STATUS STYLE =================
  const getStatusStyle = (status) => {
    switch (status) {
      case "APPROVED":
        return "bg-green-100 text-green-700";
      case "REJECTED":
        return "bg-red-100 text-red-700";
      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  // ================= FILTER =================
  const filtered = appointments.filter((a) => {
    const matchesSearch =
      a.doctor.name.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "ALL" ? true : a.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <Layout>
      <div className="p-6 bg-gray-50 min-h-screen">

        {/* HEADER */}
        <h1 className="text-3xl font-bold text-gray-800">
          My Appointments
        </h1>

        <p className="text-gray-500 mb-6">
          Manage your bookings
        </p>

        {/* ================= LOADING STATE (FIXED ESLINT WARNING) ================= */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-3 text-gray-600 text-sm">
              Loading appointments...
            </p>
          </div>
        )}

        {/* ================= CONTENT ================= */}
        {!loading && (
          <>

            {/* FILTER */}
            <div className="flex gap-3 mb-6">
              <input
                className="w-full p-3 border rounded-lg"
                placeholder="Search doctor..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              <select
                className="p-3 border rounded-lg"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="ALL">All</option>
                <option value="PENDING">Pending</option>
                <option value="APPROVED">Approved</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>

            {/* EMPTY STATE */}
            {filtered.length === 0 && (
              <div className="text-center py-10 bg-white rounded-xl shadow">
                <h3 className="text-lg font-semibold text-gray-700">
                  No appointments found
                </h3>
              </div>
            )}

            {/* CARDS */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">

              {filtered.map((a) => (
                <div key={a.id} className="bg-white p-5 rounded-xl shadow border">

                  <h2 className="text-lg font-semibold">{a.doctor.name}</h2>
                  <p className="text-sm text-gray-500">{a.doctor.specialization}</p>

                  <div className="flex justify-between text-sm mt-2 text-gray-600">
                    <span>{a.date}</span>
                    <span>{a.time}</span>
                  </div>

                  <span className={`inline-block mt-3 px-3 py-1 text-xs rounded-full ${getStatusStyle(a.status)}`}>
                    {a.status}
                  </span>

                  {/* ACTIONS */}
                  <div className="flex gap-2 mt-4">

                    <button
                      onClick={() => setSelectedAppointment(a)}
                      className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                    >
                      Reschedule
                    </button>

                    <button
                      onClick={() => handleDelete(a.id)}
                      className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700"
                    >
                      Delete
                    </button>

                  </div>

                </div>
              ))}

            </div>
          </>
        )}

        {/* ================= RESCHEDULE MODAL ================= */}
        {selectedAppointment && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

            <div className="bg-white p-6 rounded-xl w-full max-w-md">

              <h2 className="text-xl font-bold mb-4">
                Reschedule Appointment
              </h2>

              <input
                type="date"
                className="w-full p-3 border rounded-lg mb-3"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
              />

              <input
                type="time"
                className="w-full p-3 border rounded-lg mb-4"
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
              />

              <div className="flex gap-2">

                <button
                  onClick={handleReschedule}
                  className="flex-1 bg-green-600 text-white py-2 rounded-lg"
                >
                  Save
                </button>

                <button
                  onClick={() => setSelectedAppointment(null)}
                  className="flex-1 bg-gray-400 text-white py-2 rounded-lg"
                >
                  Cancel
                </button>

              </div>

            </div>

          </div>
        )}

      </div>
    </Layout>
  );
}