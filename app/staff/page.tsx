"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function StaffManagement() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [staff, setStaff] = useState(null);
  const [staffList, setStaffList] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [newStaff, setNewStaff] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    status: "active",
  });

  useEffect(() => {
    fetchStaffList();
  }, []);

  useEffect(() => {
    if (id) fetchStaff(id);
  }, [id]);

  const fetchStaffList = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/staff/getAll`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to fetch staff list");
      setStaffList(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchStaff = async (staffId) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/staff/${staffId}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to fetch staff details");
      setStaff(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteStaff = async (staffId) => {
    if (!confirm("Are you sure you want to delete this staff member?")) return;
    setLoading(true);
    try {
      const response = await fetch(`/api/staff/remove/${staffId}`, { method: "DELETE" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to delete staff");
      fetchStaffList();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateStaff = async (staffId, updates) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/staff/update/${staffId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to update staff");
      fetchStaffList();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addStaff = async () => {
    if (!newStaff.name || !newStaff.email || !newStaff.role || !newStaff.phone) {
      setError("All fields are required!");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/staff`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newStaff),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to add staff");
      fetchStaffList();
      setNewStaff({ name: "", email: "", phone: "", role: "", status: "active" });
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredStaff = staffList.filter((s) =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-2xl mx-auto p-4 border rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-4">Staff Management</h1>

      {error && <p className="text-red-500 mb-4">Error: {error}</p>}

      <input
        type="text"
        placeholder="Search Staff..."
        className="w-full p-2 border rounded mb-4"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {loading && <p className="text-blue-500">Loading...</p>}

      <ul>
        {filteredStaff.length > 0 ? (
          filteredStaff.map((s) => (
            <li key={s._id} className="mb-2 border p-2 rounded flex justify-between">
              <div>
                <p><strong>Name:</strong> {s.name}</p>
                <p><strong>Email:</strong> {s.email}</p>
                <p><strong>Phone:</strong> {s.phone}</p>
                <p><strong>Role:</strong> {s.role}</p>
                <p><strong>Status:</strong> {s.status}</p>
              </div>
              <div className="space-x-2">
                <button onClick={() => fetchStaff(s._id)} className="bg-blue-500 text-white p-1 rounded">View</button>
                <button onClick={() => deleteStaff(s._id)} className="bg-red-500 text-white p-1 rounded">Delete</button>
              </div>
            </li>
          ))
        ) : (
          <p className="text-gray-500">No staff found.</p>
        )}
      </ul>

      {staff && (
        <div className="mt-4 p-4 border rounded">
          <h2 className="text-xl font-bold">Staff Details</h2>
          <p><strong>Name:</strong> {staff.name}</p>
          <p><strong>Email:</strong> {staff.email}</p>
          <p><strong>Phone:</strong> {staff.phone}</p>
          <p><strong>Role:</strong> {staff.role}</p>
          <p><strong>Status:</strong> {staff.status}</p>
        </div>
      )}

      <div className="mt-4 p-4 border rounded">
        <h2 className="text-xl font-bold">Add New Staff</h2>
        <input
          type="text"
          placeholder="Name"
          className="w-full p-2 border rounded mb-2"
          value={newStaff.name}
          onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
        />
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 border rounded mb-2"
          value={newStaff.email}
          onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })}
        />
        <input
          type="text"
          placeholder="Phone"
          className="w-full p-2 border rounded mb-2"
          value={newStaff.phone}
          onChange={(e) => setNewStaff({ ...newStaff, phone: e.target.value })}
        />
        <select
          className="w-full p-2 border rounded mb-2"
          value={newStaff.role}
          onChange={(e) => setNewStaff({ ...newStaff, role: e.target.value })}
        >
          <option value="">Select Role</option>
          <option value="admin">Admin</option>
          <option value="manager">Manager</option>
          <option value="receptionist">Receptionist</option>
          <option value="housekeeping">Housekeeping</option>
        </select>
        <select
          className="w-full p-2 border rounded mb-2"
          value={newStaff.status}
          onChange={(e) => setNewStaff({ ...newStaff, status: e.target.value })}
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <button onClick={addStaff} className="bg-green-500 text-white p-2 rounded">Add Staff</button>
      </div>
    </div>
  );
}
