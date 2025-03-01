"use client";

import { Bell, Crown, Plus, Search } from "lucide-react";
import Image from "next/image";

export default function Header() {
  return (
    <header className="flex items-center justify-between bg-white shadow-md px-6 py-3">
      {/* Left Section */}
      <div className="flex items-center gap-4">
                {/* Logo */}
                <div className="flex justify-center md:justify-start mb-6">
          <Image src="/logo.png" alt="Logo" width={40} height={40} />
        </div>
        {/* Greeting */}
        <h1 className="text-lg font-medium ">Good Morning Dawit 👋</h1>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        {/* Upgrade Button */}
        <button className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg text-sm">
          <Crown className="w-4 h-4 text-yellow-400" />
          Upgrade Premium
        </button>

        {/* Add New Button */}
        <button className="flex items-center gap-2 border px-4 py-2 rounded-lg text-sm">
          <Plus className="w-4 h-4" />
          Add New
        </button>

        {/* Icons */}
        <Search className="w-5 h-5 cursor-pointer text-gray-600" />
        <Bell className="w-5 h-5 cursor-pointer text-gray-600" />

        {/* Profile Avatar */}
        <div className="w-8 h-8 rounded-full overflow-hidden">
          <Image src="/avatar.png" alt="Profile" width={32} height={32} />
        </div>
      </div>
    </header>
  );
}
