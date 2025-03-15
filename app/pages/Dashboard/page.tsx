'use client';
import { useEffect, useState } from 'react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import AuthGuard from '../authGuard';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ArcElement);

export default AuthGuard(function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/dashboard');
        const data = await response.json();
        setDashboardData(data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    }
    fetchData();
  }, []);

  if (!dashboardData) return <p>Loading...</p>;

  const {
    availableRoomsCount,
    newReservationsCount,
    checkInCount,
    checkOutCount,
    activeStaffCount,
    inactiveStaffCount,
    totalRevenue,
    outstandingBalances,
    paymentsReceivedThisWeek,
  } = dashboardData;

  const lineOptions = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: { y: { beginAtZero: true, display: false }, x: { display: false } },
  };

  return (
    <div className="flex flex-col p-6">
      {/* Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[ 
          { label: "New Booking", value: newReservationsCount, color: "bg-gradient-to-r from-blue-500 to-cyan-500" },
          { label: "Available Rooms", value: availableRoomsCount, color: "bg-gradient-to-r from-purple-500 to-indigo-500" },
          { label: "Check In", value: checkInCount, color: "bg-gradient-to-r from-green-500 to-teal-500" },
          { label: "Check Out", value: checkOutCount, color: "bg-gradient-to-r from-pink-500 to-rose-500" }
        ].map(({ label, value, color }) => (
          <div key={label} className={`relative overflow-hidden rounded-lg shadow-md p-4 w-full max-w-[300px] mx-auto ${color}`}>
            <div className="relative z-10 text-white">
              <h2 className="text-sm font-semibold">{label}</h2>
              <p className="text-lg font-bold">{value}</p>
            </div>
            <div className="h-16 mt-2 relative z-10">
              <Line 
                data={{ 
                  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], 
                  datasets: [{ 
                    label, 
                    data: [12, 19, 15, 25, 30, 45, 50], 
                    fill: true, 
                    backgroundColor: "rgba(255,255,255,0.3)", 
                    borderColor: "rgba(255,255,255,0.8)", 
                    tension: 0.4 
                  }] 
                }} 
                options={lineOptions} 
              />
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
       {/* Staff Status Doughnut Chart */}
<div className="bg-white p-4 rounded-lg shadow-md h-64 flex flex-col items-center">
  <h2 className="text-lg font-semibold mb-2">Staff Status</h2>
  <div className="w-40 h-40"> {/* Restrict the size of the chart */}
    <Doughnut 
      data={{
        labels: ['Active Staff', 'Inactive Staff'],
        datasets: [{
          data: [activeStaffCount, inactiveStaffCount],
          backgroundColor: ['#4CAF50', '#F44336'],
          hoverOffset: 4,
        }],
      }}
      options={{
        maintainAspectRatio: false, // Allow manual resizing
        responsive: true,
        cutout: '60%', // Adjusts the inner circle size (smaller values make the chart smaller)
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              boxWidth: 10, // Make legend indicator smaller
            },
          },
        },
      }}
    />
  </div>
</div>


        {/* Payment Analytics Bar Chart */}
        <div className="bg-white p-4 rounded-lg shadow-md h-64 flex flex-col items-center">
          <h2 className="text-lg font-semibold mb-2">Payments Overview</h2>
          <Bar 
            data={{
              labels: ['Total Revenue', 'Outstanding Balances', 'Payments Received'],
              datasets: [{
                label: 'Amount ($)',
                data: [totalRevenue, outstandingBalances, paymentsReceivedThisWeek],
                backgroundColor: [
                  'linear-gradient(90deg, rgba(66,165,245,1) 0%, rgba(33,150,243,1) 100%)', // Blue
                  'linear-gradient(90deg, rgba(255,202,40,1) 0%, rgba(255,193,7,1) 100%)', // Yellow
                  'linear-gradient(90deg, rgba(102,187,106,1) 0%, rgba(76,175,80,1) 100%)'  // Green
                ],
                borderWidth: 2,
                borderColor: ['#1976D2', '#FFA000', '#388E3C'],
                borderRadius: 10,
              }],
            }} 
            options={{ responsive: true, indexAxis: 'y', maintainAspectRatio: false }}
          />
        </div>
      </div>
    </div>
  );
});
