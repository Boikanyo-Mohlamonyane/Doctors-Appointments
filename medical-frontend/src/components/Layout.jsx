import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">

      {/* FIXED SIDEBAR */}
      <Sidebar />

      {/* MAIN CONTENT WRAPPER */}
      <div className="ml-64 transition-all duration-300">

        {/* TOP NAVBAR */}
        <Navbar />

        {/* PAGE CONTENT AREA */}
        <main className="p-6">
          {children}
        </main>

      </div>

    </div>
  );
}