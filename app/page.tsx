'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [employeeID, setEmployeeID] = useState('');
  const [department, setDepartment] = useState('Reception');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const storedLogin = sessionStorage.getItem('isLoggedIn');
    if (storedLogin) {
      setIsLoggedIn(true);
      router.push('/dashboard');
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ employeeID, department, password }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Login failed');
      
      sessionStorage.setItem('isLoggedIn', 'true');
      setIsLoggedIn(true);
      router.push('/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold mb-4">Login</h1>
        <p className="text-gray-600 mb-4">Please use your employee ID and password to login</p>
        {error && <p className="text-red-500">{error}</p>}
        <form onSubmit={handleLogin} className="space-y-4">
          <input 
            type="text" 
            placeholder="Employee ID" 
            value={employeeID} 
            onChange={(e) => setEmployeeID(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
          <select 
            value={department} 
            onChange={(e) => setDepartment(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="Reception">Reception</option>
            <option value="Manager">Manager</option>
            <option value="Admin">Admin</option>
            <option value="Housekeeping">Housekeeping</option>
          </select>
          <input 
            type="password" 
            placeholder="Password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
          <button type="submit" className="w-full bg-purple-600 text-white p-2 rounded">LOGIN</button>
        </form>
      </div>
    </div>
  );
}
