import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

import {
  getMyAppointments,
  deleteAppointment,
  rescheduleAppointment,
} from "../../services/appointmentService";

export default function MyAppointments() {

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");

  const userId = localStorage.getItem("userId");

  // ================= FETCH =================
  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const res = await getMyAppointments();
      setAppointments(res.data);
    } catch (err) {
      console.log(err?.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  // ================= DELETE =================
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this appointment?"))
      return;

    try {
      await deleteAppointment(userId, id);

      setAppointments((prev) =>
          prev.filter((a) => a.id !== id)
      );

    } catch (err) {
      console.log(err?.response?.data || err.message);
    }
  };

  // ================= RESCHEDULE =================
  const handleReschedule = async () => {
    try {
      await rescheduleAppointment(selectedAppointment.id, {
        date: newDate,
        time: newTime,
      });

      setSelectedAppointment(null);
      setNewDate("");
      setNewTime("");
      fetchAppointments();

    } catch (err) {
      console.log(err?.response?.data || err.message);
    }
  };

  // ================= DRAG RESCHEDULE =================
  const handleEventDrop = async (info) => {
    const updatedDate = info.event.startStr;

    const day = new Date(updatedDate).getDay();

    if (day === 0 || day === 6) {
      alert("Hospital only allows Monday–Friday appointments");
      info.revert();
      return;
    }

    try {
      await rescheduleAppointment(info.event.id, {
        date: updatedDate,
        time: info.event.extendedProps.time,
      });

    } catch (err) {
      console.log(err);
      info.revert();
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

  // ================= CALENDAR =================
  const calendarEvents = appointments.map((a) => ({
    id: a.id,
    title: a.doctor.name,
    date: a.date,
    extendedProps: {
      time: a.time,
      status: a.status,
    },
  }));

  return (
      <Layout>
        <div className="p-6 bg-gray-50 min-h-screen">

          <h1 className="text-3xl font-bold text-gray-800">
            My Appointments
          </h1>

          {/* CALENDAR */}
          <div className="bg-white p-4 rounded-xl shadow mb-6">
            <FullCalendar
                plugins={[dayGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                editable={true}
                events={calendarEvents}
                eventDrop={handleEventDrop}
                height="auto"
            />
          </div>

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

          {/* CARDS */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">

            {filtered.map((a) => (
                <div key={a.id} className="bg-white p-5 rounded-xl shadow border">

                  <h2 className="text-lg font-semibold">
                    {a.doctor.name}
                  </h2>

                  <p className="text-sm text-gray-500">
                    {a.doctor.specialization}
                  </p>

                  <div className="flex justify-between text-sm mt-2 text-gray-600">
                    <span>{a.date}</span>
                    <span>{a.time}</span>
                  </div>

                  <span className="text-xs mt-2 block">
                {a.status}
              </span>

                  <div className="flex gap-2 mt-4">

                    <button
                        onClick={() => setSelectedAppointment(a)}
                        className="flex-1 bg-blue-600 text-white py-2 rounded-lg"
                    >
                      Reschedule
                    </button>

                    <button
                        onClick={() => handleDelete(a.id)}
                        className="flex-1 bg-red-600 text-white py-2 rounded-lg"
                    >
                      Delete
                    </button>

                  </div>

                </div>
            ))}

          </div>

          {/* MODAL */}
          {selectedAppointment && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center">

                <div className="bg-white p-6 rounded-xl w-96">

                  <input
                      type="date"
                      className="w-full border p-2 mb-2"
                      value={newDate}
                      onChange={(e) => setNewDate(e.target.value)}
                  />

                  <input
                      type="time"
                      className="w-full border p-2 mb-2"
                      value={newTime}
                      onChange={(e) => setNewTime(e.target.value)}
                  />

                  <button
                      onClick={handleReschedule}
                      className="w-full bg-green-600 text-white p-2 mb-2"
                  >
                    Save
                  </button>

                  <button
                      onClick={() => setSelectedAppointment(null)}
                      className="w-full bg-gray-400 text-white p-2"
                  >
                    Cancel
                  </button>

                </div>

              </div>
          )}

        </div>
      </Layout>
  );
}