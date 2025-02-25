import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import axios from 'axios';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/dashboard');
        setData(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch data');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  const dailyRevenueData = Object.keys(data.dailyRevenue).map((date) => ({
    day: date,
    revenue: data.dailyRevenue[date],
  }));

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Financial Dashboard</h1>

      {/* Total Revenue and Outstanding Balances */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold">Total Revenue</h2>
          <p className="text-xl">{`$${data.totalRevenue.toFixed(2)}`}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold">Outstanding Balances</h2>
          <p className="text-xl">{`$${data.outstandingBalances.toFixed(2)}`}</p>
        </div>
      </div>

      {/* Daily Revenue Bar Chart */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold">Daily Revenue</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={dailyRevenueData}>
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="revenue" fill="#22C55E" name="Revenue" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Dashboard;
