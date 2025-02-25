"use client";
import Link from 'next/link';
import { Home, Calendar, Users, Mail, Settings } from 'lucide-react';
import { useState } from 'react';

const Sidebar = () => {

const [selected, setSelected] = useState('home')

  return (
    <aside className="w-64 bg-sidebar p-4">
      <h1 className="text-xl font-bold mb-4">LG Hotel</h1>
      <nav>
        <ul className="space-y-3">
          <li onClick={()=> setSelected('home')}>
            <Link href="/" className={selected === 'home' ? `flex items-center gap-3 p-3 rounded-lg bg-primary`:`flex items-center gap-3 p-3 rounded-lg`}>
              <Home size={20} /> Home
            </Link>
          </li>
          <li onClick={()=> setSelected('rooms')}>
            <Link href="/room" className={selected === 'rooms' ? `flex items-center gap-3 p-3 rounded-lg bg-primary`:`flex items-center gap-3 p-3 rounded-lg`}>
              <Calendar size={20} /> Rooms
            </Link>
          </li>
          <li onClick={()=> setSelected('guests')}>
            <Link href="/staff" className={selected === 'staff' ? `flex items-center gap-3 p-3 rounded-lg bg-primary`:`flex items-center gap-3 p-3 rounded-lg`}>
              <Users size={20} /> Staff
            </Link>
          </li>
          <li onClick={()=> setSelected('messages')}>
            <Link href="/messages" className={selected === 'messages' ? `flex items-center gap-3 p-3 rounded-lg bg-primary`:`flex items-center gap-3 p-3 rounded-lg`}>
              <Mail size={20} /> Messages
            </Link>
          </li>
          <li onClick={()=> setSelected('setting')}>
            <Link href="/settings" className={selected === 'setting' ? `flex items-center gap-3 p-3 rounded-lg bg-primary`:`flex items-center gap-3 p-3 rounded-lg`}>
              <Settings size={20} /> Settings
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
