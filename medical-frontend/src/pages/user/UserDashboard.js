import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";

import { getAllDoctors } from "../../services/doctorService";
import { bookAppointment } from "../../services/appointmentService";
import { timeSlots } from "../../utils/timeSlots";

export default function UserDashboard() {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const [search, setSearch] = useState("");

  const [form, setForm] = useState({
    date: "",
    time: "",
  });

  const [step, setStep] = useState(1);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(null);

  // ================= FETCH DOCTORS =================
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await getAllDoctors();
        setDoctors(res.data);
      } catch (err) {
        setError("Failed to load doctors");
      }
    };

    fetchDoctors();
  }, []);

  // ================= FILTER DOCTORS =================
  const filteredDoctors = doctors.filter((doc) =>
    doc.name.toLowerCase().includes(search.toLowerCase())
  );

  // ================= HANDLE INPUT =================
  const handleDateChange = (e) => {
    setForm({ ...form, date: e.target.value });
    setStep(2);
  };

  // ================= SELECT TIME =================
  const selectTime = (time) => {
    setForm({ ...form, time });
    setStep(3);
  };

  // ================= BOOK APPOINTMENT =================
  const handleBooking = async () => {
    if (!selectedDoctor || !form.date || !form.time) {
      setError("Please complete all steps");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess(null);

    try {
      const res = await bookAppointment({
        doctorId: selectedDoctor.id,
        date: form.date,
        time: form.time,
      });

      setSuccess(res.data);

      // reset
      setSelectedDoctor(null);
      setForm({ date: "", time: "" });
      setStep(1);
    } catch (err) {
      setError("Failed to book appointment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 p-6">

        {/* HEADER */}
        <h1 className="text-3xl font-bold text-gray-800">
          Book Appointment
        </h1>

        <p className="text-gray-500 mb-6">
          Select doctor → date → time → confirm
        </p>

        {/* STEP INDICATOR */}
        <div className="flex gap-2 mb-6">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`w-10 h-10 flex items-center justify-center rounded-full text-white
                ${step >= s ? "bg-blue-600" : "bg-gray-300"}
              `}
            >
              {s}
            </div>
          ))}
        </div>

        {/* ERROR */}
        {error && (
          <div className="bg-red-100 text-red-600 p-3 mb-4 rounded">
            {error}
          </div>
        )}

        {/* SUCCESS */}
        {success && (
          <div className="bg-green-100 text-green-700 p-3 mb-4 rounded">
            Appointment booked successfully 🎉
          </div>
        )}

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* LEFT: DOCTORS */}
          <div className="lg:col-span-2">

            <input
              type="text"
              placeholder="Search doctor..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full p-3 border rounded mb-4 focus:ring-2 focus:ring-blue-400"
            />

            <div className="grid md:grid-cols-2 gap-4">

              {filteredDoctors.map((doc) => (
                <div
                  key={doc.id}
                  onClick={() => {
                    setSelectedDoctor(doc);
                    setStep(2);
                  }}
                  className={`p-4 rounded-xl border cursor-pointer transition
                    ${selectedDoctor?.id === doc.id
                      ? "bg-blue-50 border-blue-600"
                      : "bg-white hover:shadow-md"
                    }
                  `}
                >
                  <h3 className="font-semibold">{doc.name}</h3>
                  <p className="text-sm text-gray-500">
                    {doc.specialization}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: BOOKING PANEL */}
          <div className="bg-white p-5 rounded-xl shadow sticky top-6">

            <h2 className="text-xl font-bold mb-3">
              Booking Summary
            </h2>

            {/* DOCTOR */}
            {selectedDoctor ? (
              <div className="p-3 bg-blue-50 rounded mb-3">
                <p className="font-semibold">{selectedDoctor.name}</p>
                <p className="text-sm text-gray-500">
                  {selectedDoctor.specialization}
                </p>
              </div>
            ) : (
              <p className="text-gray-400 mb-3">
                No doctor selected
              </p>
            )}

            {/* DATE */}
            <input
              type="date"
              value={form.date}
              onChange={handleDateChange}
              className="w-full p-3 border rounded mb-3"
            />

            {/* TIME SLOTS */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              {timeSlots.map((t) => (
                <button
                  key={t}
                  onClick={() => selectTime(t)}
                  className={`p-2 text-sm rounded border
                    ${form.time === t
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100"
                    }
                  `}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* CONFIRM */}
            <button
              onClick={handleBooking}
              disabled={loading}
              className={`w-full p-3 rounded text-white font-semibold
                ${loading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"}
              `}
            >
              {loading ? "Booking..." : "Confirm Appointment"}
            </button>

          </div>

        </div>
      </div>
    </Layout>
  );
}