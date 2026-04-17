import { Bell, User, Search } from "lucide-react";
import { logout, getRole } from "../utils/auth";

export default function Navbar() {
  const role = getRole();

  return (
    <header className="sticky top-0 z-50 h-14 bg-white border-b shadow-sm flex items-center justify-between px-6">

      {/* SEARCH */}
      <div className="relative w-full max-w-md">
        <Search
          size={16}
          className="absolute left-3 top-2.5 text-gray-400"
        />

        <input
          placeholder="Search patients, appointments, doctors..."
          className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm
                     focus:outline-none focus:ring-2 focus:ring-blue-500
                     transition bg-gray-50"
        />
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-4">

        {/* ROLE */}
        <span className="text-xs px-3 py-1 rounded-full bg-blue-50 text-blue-600 font-semibold tracking-wide uppercase">
          {role}
        </span>

        {/* NOTIFICATIONS */}
        <button className="relative p-2 rounded-lg hover:bg-gray-100 transition">
          <Bell size={18} />

          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
        </button>

        {/* USER MENU */}
        <div className="relative group">

          <button className="p-2 rounded-lg hover:bg-gray-100 transition">
            <User size={18} />
          </button>

          <div
            className="absolute right-0 mt-2 w-44 bg-white border rounded-xl shadow-lg
                       opacity-0 group-hover:opacity-100 group-hover:translate-y-0
                       translate-y-1 transition-all duration-200 pointer-events-none group-hover:pointer-events-auto"
          >

            <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50">
              Profile
            </button>

            <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50">
              Settings
            </button>

            <button
              onClick={logout}
              className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50"
            >
              Logout
            </button>

          </div>
        </div>

      </div>
    </header>
  );
}