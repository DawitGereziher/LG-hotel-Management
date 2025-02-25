'use client';
import { useState } from 'react';
import Card from '../components/Card';
import BookingStats from '../components/BookingStats';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

export default function Dashboard() {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <div className="flex-1 p-6 bg-gray-100">
        {/* Header */}
        <Header />
        
        {/* Dashboard Grid */}
        <div className="grid grid-cols-4 gap-4 mt-6">
          <div className="col-span-4 grid grid-cols-4 gap-4">
            <Card title="New Booking" value="172" />
            <Card title="Available Rooms" value="103" />
            <Card title="Check In" value="71" />
            <Card title="Check Out" value="29" />
          </div>
          
          <div className="col-span-2 bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold">US Occupancy Up Year Over Year</h2>
            <BookingStats />
          </div>
          
          <div className="col-span-1 bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold">Room Service Stats</h2>
            {/* Pie chart component */}
          </div>
          
          <div className="col-span-1 bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold">Additional Analytics</h2>
            {/* Placeholder for additional widgets */}
          </div>
        </div>
      </div>
    </div>
  );
}
