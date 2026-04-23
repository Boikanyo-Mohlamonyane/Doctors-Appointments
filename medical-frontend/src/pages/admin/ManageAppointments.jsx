import React, { useEffect, useState, useCallback } from "react";
import Layout from "../../components/Layout";
import axios from "axios";
import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

const API =   process.env.REACT_APP_API_URL || "http://63.33.171.154:8080/api/appointments";

export default function AdminDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  // ================= FETCH =================
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);

      const res = await axios.get(API, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setAppointments(res.data);
    } catch (err) {
      setError("Failed to load system data");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ================= EXPORT PDF =================
  const exportPDF = () => {
    const doc = new jsPDF();

    doc.text("Hospital Appointment Report", 14, 10);

    const rows = appointments.map((a) => [
      a.id,
      a.user?.name,
      a.doctor?.name,
      a.date,
      a.time,
      a.status,
      a.rejectionReason || "-",
    ]);

    doc.autoTable({
      head: [["ID", "Patient", "Doctor", "Date", "Time", "Status", "Reason"]],
      body: rows,
    });

    doc.save("hospital-report.pdf");
  };

  // ================= EXPORT EXCEL =================
  const exportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      appointments.map((a) => ({
        ID: a.id,
        Patient: a.user?.name,
        Doctor: a.doctor?.name,
        Date: a.date,
        Time: a.time,
        Status: a.status,
        RejectionReason: a.rejectionReason || "",
      }))
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Report");

    XLSX.writeFile(workbook, "hospital-report.xlsx");
  };

  return (
    <Layout>
      <div className="p-6 bg-gray-50 min-h-screen">

        {/* HEADER */}
        <div className="flex justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">
              Admin Reporting Dashboard
            </h1>
            <p className="text-gray-500">
              Monitor system activity & generate reports
            </p>
          </div>

          <div className="flex gap-2">
            <button onClick={exportPDF} className="bg-red-600 text-white px-4 py-2 rounded">
              Export PDF
            </button>

            <button onClick={exportExcel} className="bg-green-600 text-white px-4 py-2 rounded">
              Export Excel
            </button>
          </div>
        </div>

        {/* ERROR */}
        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* LOADING */}
        {loading ? (
          <div className="bg-white p-6 rounded shadow">
            Loading system data...
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow overflow-hidden">

            <table className="w-full text-left">

              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3">Patient</th>
                  <th className="p-3">Doctor</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Doctor Notes</th>
                </tr>
              </thead>

              <tbody>
                {appointments.map((a) => (
                  <tr key={a.id} className="border-t">

                    <td className="p-3 font-medium">
                      {a.user?.name}
                    </td>

                    <td className="p-3">
                      {a.doctor?.name}
                    </td>

                    <td className="p-3">
                      {a.date} {a.time}
                    </td>

                    <td className="p-3">
                      <span className={`px-2 py-1 text-xs rounded ${
                        a.status === "APPROVED"
                          ? "bg-green-100 text-green-700"
                          : a.status === "REJECTED"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}>
                        {a.status}
                      </span>
                    </td>

                    {/* IMPORTANT: REASON FROM DOCTOR */}
                    <td className="p-3 text-sm text-gray-600">
                      {a.rejectionReason ? (
                        <span className="text-red-600">
                          {a.rejectionReason}
                        </span>
                      ) : (
                        "-"
                      )}
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