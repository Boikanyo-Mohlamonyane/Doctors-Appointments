import React, { useEffect, useState } from "react";
import { getMyAppointments } from "../../services/appointmentService";
import Layout from "../../components/Layout";

export default function MyAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await getMyAppointments();
        setAppointments(res.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

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

  // ================= FILTER DATA =================
  const filtered = appointments.filter((a) => {
    const matchesSearch =
      a.doctor.name.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "ALL" ? true : a.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // ================= STATS =================
  const stats = {
    total: appointments.length,
    approved: appointments.filter((a) => a.status === "APPROVED").length,
    pending: appointments.filter((a) => a.status === "PENDING").length,
    rejected: appointments.filter((a) => a.status === "REJECTED").length,
  };

  return (
    <Layout>
      <div className="p-6 bg-gray-50 min-h-screen">

        {/* HEADER */}
        <h1 className="text-3xl font-bold text-gray-800">
          My Appointments
        </h1>

        <p className="text-gray-500 mb-6">
          Track and manage your bookings
        </p>

        {/* ================= STATS CARDS ================= */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">

          <div className="bg-white p-4 rounded-xl shadow">
            <p className="text-gray-500 text-sm">Total</p>
            <h2 className="text-2xl font-bold">{stats.total}</h2>
          </div>

          <div className="bg-green-50 p-4 rounded-xl shadow">
            <p className="text-green-600 text-sm">Approved</p>
            <h2 className="text-2xl font-bold text-green-700">
              {stats.approved}
            </h2>
          </div>

          <div className="bg-yellow-50 p-4 rounded-xl shadow">
            <p className="text-yellow-600 text-sm">Pending</p>
            <h2 className="text-2xl font-bold text-yellow-700">
              {stats.pending}
            </h2>
          </div>

          <div className="bg-red-50 p-4 rounded-xl shadow">
            <p className="text-red-600 text-sm">Rejected</p>
            <h2 className="text-2xl font-bold text-red-700">
              {stats.rejected}
            </h2>
          </div>

        </div>

        {/* ================= FILTER BAR ================= */}
        <div className="flex flex-col md:flex-row gap-3 mb-6">

          {/* SEARCH */}
          <input
            type="text"
            placeholder="Search doctor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-1/2 p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
          />

          {/* STATUS FILTER */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full md:w-1/4 p-3 border rounded-lg"
          >
            <option value="ALL">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
          </select>

        </div>

        {/* ================= LOADING ================= */}
        {loading && (
          <div className="grid gap-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="p-4 bg-white rounded-xl shadow animate-pulse"
              >
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        )}

        {/* ================= EMPTY ================= */}
        {!loading && filtered.length === 0 && (
          <div className="text-center py-10 bg-white rounded-xl shadow">
            <h3 className="text-lg font-semibold text-gray-700">
              No appointments found
            </h3>
          </div>
        )}

        {/* ================= CARDS ================= */}
        {!loading && filtered.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">

            {filtered.map((a) => (
              <div
                key={a.id}
                className="bg-white rounded-xl shadow hover:shadow-lg transition p-5 border"
              >

                <h2 className="text-lg font-semibold">
                  {a.doctor.name}
                </h2>

                <p className="text-sm text-gray-500 mb-2">
                  {a.doctor.specialization}
                </p>

                <div className="flex justify-between text-sm text-gray-600 mb-3">
                  <span>{a.date}</span>
                  <span>{a.time}</span>
                </div>

                <span
                  className={`px-3 py-1 text-xs rounded-full font-semibold ${getStatusStyle(
                    a.status
                  )}`}
                >
                  {a.status}
                </span>

              </div>
            ))}

          </div>
        )}

      </div>
    </Layout>
  );
}