"use client";

import { useEffect, useState } from "react";
import axios from "axios";

const Reservations = () => {
  const [reservations, setReservations] = useState([]);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    guestName: "",
    guestContact: "",
    guestAddress: "",
    guestIdNumber: "",
    room: [],
    checkInDate: "",
    checkOutDate: "",
    additionalServices: 0,
    amountPaid: 0,
  });

  const API_URL = "http://localhost:3000/api/reservation";

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      const res = await axios.get(`${API_URL}/getAll`);
      setReservations(res.data);
    } catch (error) {
      console.error("Error fetching reservations:", error);
    }
  };

  const handleSearch = async () => {
    try {
      const res = await axios.get(`${API_URL}/search?name=${search}`);
      setReservations(res.data);
    } catch (error) {
      console.error("Error searching reservations:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreate = async (e) => {
    e.preventDefault(); 
    try {
      await axios.post(`${API_URL}/create`, formData);
      fetchReservations();
      resetForm();
    } catch (error) {
      console.error("Error creating reservation:", error);
    }
  };
  

  const handleUpdate = async () => {
    try {
      await axios.put(`${API_URL}/update/${editingId}`, formData);
      fetchReservations();
      resetForm();
    } catch (error) {
      console.error("Error updating reservation:", error);
    }
  };


  const handleEdit = (reservation) => {
    setEditingId(reservation._id);
    setFormData({
      guestName: reservation.guestName,
      guestContact: reservation.guestContact,
      guestAddress: reservation.guestAddress,
      guestIdNumber: reservation.guestIdNumber,
      room: reservation.room?._id || "",
      checkInDate: reservation.checkInDate.split("T")[0],
      checkOutDate: reservation.checkOutDate.split("T")[0],
      additionalServices: reservation.additionalServices,
      amountPaid: reservation.amountPaid,
    });
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/cancel/${id}`);
      fetchReservations();
    } catch (error) {
      console.error("Error deleting reservation:", error);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      guestName: "",
      guestContact: "",
      guestAddress: "",
      guestIdNumber: "",
      room: [],
      checkInDate: "",
      checkOutDate: "",
      additionalServices: 0,
      amountPaid: 0,
    });
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Reservations</h1>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by guest name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2"
        />
        <button onClick={handleSearch} className="bg-blue-500 text-white px-4 py-2 ml-2">
          Search
        </button>
      </div>

      <form onSubmit={handleCreate} className="border p-4 mb-4">
        <h2 className="text-xl font-bold">{editingId ? "Edit" : "New"} Reservation</h2>
        <input type="text" name="guestName" placeholder="Guest Name" value={formData.guestName} onChange={handleChange} required className="border p-2 block w-full mb-2" />
        <input type="text" name="guestContact" placeholder="Contact" value={formData.guestContact} onChange={handleChange} required className="border p-2 block w-full mb-2" />
        <input type="text" name="guestAddress" placeholder="Address" value={formData.guestAddress} onChange={handleChange} required className="border p-2 block w-full mb-2" />
        <input type="text" name="guestIdNumber" placeholder="ID Number" value={formData.guestIdNumber} onChange={handleChange} required className="border p-2 block w-full mb-2" />
        <input type="text" name="room" placeholder="Room ID" value={formData.room} onChange={handleChange} required className="border p-2 block w-full mb-2" />
        <input type="date" name="checkInDate" value={formData.checkInDate} onChange={handleChange} required className="border p-2 block w-full mb-2" />
        <input type="date" name="checkOutDate" value={formData.checkOutDate} onChange={handleChange} required className="border p-2 block w-full mb-2" />
        <input type="number" name="additionalServices" placeholder="Additional Charges" value={formData.additionalServices} onChange={handleChange} className="border p-2 block w-full mb-2" />
        <input type="number" name="amountPaid" placeholder="Amount Paid" value={formData.amountPaid} onChange={handleChange} className="border p-2 block w-full mb-2" />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2"> Create Reservation
        </button>
      </form>

      <ul>
        {reservations.map((res) => (
          <li key={res._id} className="border p-4 mb-2">
            <strong>{res.guestName}</strong> (Room: {res.room?.name || "N/A"}) - {res.status}
            <button onClick={() => handleEdit(res)} className="bg-yellow-500 text-white px-4 py-1 ml-2">
              Edit
            </button>
            <button onClick={() => handleDelete(res._id)} className="bg-red-500 text-white px-4 py-1 ml-2">
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Reservations;
