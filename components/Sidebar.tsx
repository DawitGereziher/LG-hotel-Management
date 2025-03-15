"use client";

import Link from "next/link";
import { useState } from "react";
import {
  LayoutGrid,
  Calendar,
  Users,
  Mail,
  LogOut,
  Settings,
} from "lucide-react";
import axios from "axios";

const Sidebar = () => {
  const [selected, setSelected] = useState("dashboard");
  
  const logout = () => {
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
    window.location.href = "/login"; 
    sessionStorage.clear();
  };

  return (
    <aside className="w-20 md:w-20 bg-white-900 text-black h-screen flex flex-col justify-between p-4">
      {/* Top Section */}
      <div>

        {/* Navigation Menu */}
        <nav>
          <ul className="space-y-4">
            <li onClick={() => setSelected("dashboard")}>
              <Link
                href="/pages/Dashboard"
                className={`flex items-center gap-3 p-3 rounded-lg ${
                  selected === "dashboard"
                    ? "bg-blue-500"
                    : "hover:bg-gray-700"
                }`}
              >
                <LayoutGrid size={20} />
              </Link>
            </li>
            <li onClick={() => setSelected("calendar")}>
              <Link
                href="/pages/reservation"
                className={`flex items-center gap-3 p-3 rounded-lg ${
                  selected === "calendar" ? "bg-blue-500" : "hover:bg-gray-700"
                }`}
              >
                <Calendar size={20} />
              </Link>
            </li>
            <li onClick={() => setSelected("staff")}>
              <Link
                href="/pages/staff"
                className={`flex items-center gap-3 p-3 rounded-lg ${
                  selected === "staff" ? "bg-blue-500" : "hover:bg-gray-700"
                }`}
              >
                <Users size={20} />
              </Link>
            </li>
            <li onClick={() => setSelected("messages")}>
              <Link
                href="/pages/room"
                className={`flex items-center gap-3 p-3 rounded-lg ${
                  selected === "messages" ? "bg-blue-500" : "hover:bg-gray-700"
                }`}
              >
                <Mail size={20} />
              </Link>
            </li>
            <li onClick={() => setSelected("settings")}>
              <Link
                href="/pages/settings"
                className={`flex items-center gap-3 p-3 rounded-lg ${
                  selected === "settings" ? "bg-blue-500" : "hover:bg-gray-700"
                }`}
              >
                <Settings size={20} /> 
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      {/* Bottom Section - Logout */}
      <div>
        <button className="flex items-center gap-3 p-3 rounded-lg hover:bg-red-600 w-full" onClick={logout}>
          <LogOut size={20} />
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
