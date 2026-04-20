import { useState } from "react";
import { getRole } from "../utils/auth";
import { Home, Users, Calendar, Stethoscope, Menu } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
  const [open, setOpen] = useState(true);
  const role = getRole()?.toUpperCase();
  const location = useLocation();

  const menu = {
    ADMIN: [
      { name: "Dashboard", path: "/admin/dashboard", icon: Home },
      { name: "Users", path: "/admin/users", icon: Users },
      { name: "Registrations", path: "/admin/register", icon: Stethoscope },
      { name: "Appointments", path: "/admin/appointments", icon: Calendar },
    ],
    DOCTOR: [
      { name: "Dashboard", path: "/doctor/dashboard", icon: Home },
      { name: "Appointments", path: "/doctor/appointments", icon: Calendar },
    ],
    USER: [
      { name: "Dashboard", path: "/user/dashboard", icon: Home },
      { name: "My Appointments", path: "/user/mybooks", icon: Calendar },
    ],
  };

  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <aside
      className={`fixed left-0 top-0 h-screen bg-white border-r shadow-md 
      flex flex-col transition-all duration-300 z-50
      ${open ? "w-64" : "w-20"}`}
    >

      {/* ================= HEADER ================= */}
      <div className="flex items-center justify-between px-4 py-4 border-b">

        {/* BRAND */}
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold shadow">
            M
          </div>

          {open && (
            <div className="leading-tight">
              <p className="font-bold text-blue-600">MedCare</p>
              <p className="text-xs text-gray-400">Enterprise</p>
            </div>
          )}
        </div>

        {/* TOGGLE */}
        <button
          onClick={() => setOpen(!open)}
          className="p-2 rounded-lg hover:bg-gray-100 transition"
        >
          <Menu size={20} />
        </button>
      </div>

      {/* ================= NAVIGATION ================= */}
      <nav className="flex-1 px-2 py-4 space-y-1">

        {menu[role]?.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`relative flex items-center gap-3 px-3 py-2 rounded-lg transition-all group
              ${
                active
                  ? "bg-blue-50 text-blue-600 font-medium"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >

              {/* ACTIVE BAR */}
              {active && (
                <span className="absolute left-0 w-1 h-6 bg-blue-600 rounded-r-full" />
              )}

              {/* ICON */}
              <Icon size={20} className="shrink-0" />

              {/* LABEL */}
              {open && (
                <span className="text-sm">{item.name}</span>
              )}

              {/* TOOLTIP WHEN COLLAPSED */}
              {!open && (
                <span className="absolute left-14 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
                  {item.name}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* ================= FOOTER ================= */}
      <div className="border-t p-3 text-xs text-gray-400">
        {open && "© MedCare Enterprise System"}
      </div>

    </aside>
  );
}