'use client';
import { useEffect, useState } from "react";
import axios from "axios";
import { Input } from "../../../components/input";
import { Button } from "../../../components/button";
import { CardContent, card } from "../../../components/Card";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";

export default function RoomManagement() {
  const [rooms, setRooms] = useState([]);
  const [search, setSearch] = useState("");
  const [formData, setFormData] = useState({ number: "", type: "single", price: "", status: "available", features: "" });
  const [image, setImage] = useState(null);


    useEffect(() => {
      const fetchRoomsWithImages = async () => {
        try {
          const res = await axios.get("/api/room/getAll");
          const roomsWithImages = await Promise.all(
            res.data.map(async (room) => {
              const image = await getImageFromDB(room.number);
              return { ...room, image };
            })
          );
          setRooms(roomsWithImages);
        } catch (error) {
          toast.error("Error fetching rooms");
        }
      };
      fetchRoomsWithImages();
    }, []);
    




  const openDB = () => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open("RoomImagesDB", 1);
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains("roomImages")) {
          db.createObjectStore("roomImages", { keyPath: "roomNumber" });
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  };
  
  const saveImageToDB = async (roomNumber, image) => {
    const db = await openDB();
    const tx = db.transaction("roomImages", "readwrite");
    const store = tx.objectStore("roomImages");
    store.put({ roomNumber, image });
  };
  
  const getImageFromDB = async (roomNumber) => {
    const db = await openDB();
    const tx = db.transaction("roomImages", "readonly");
    const store = tx.objectStore("roomImages");
    return new Promise((resolve) => {
      const request = store.get(roomNumber);
      request.onsuccess = () => resolve(request.result ? request.result.image : null);
    });
  };
  
  const deleteImageFromDB = async (roomNumber) => {
    const db = await openDB();
    const tx = db.transaction("roomImages", "readwrite");
    const store = tx.objectStore("roomImages");
    store.delete(roomNumber);
  };





 

  const handleSearch = async () => {
    if (!search) return fetchRooms();
    try {
      const res = await axios.get(`/api/room/[id]=${search}`);
      setRooms(res.data ? [res.data] : []);
    } catch (error) {
      toast.error("Room not found");
    }
  };

  const handleCreateOrUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/room/newRoom", formData);
      toast.success("Room saved successfully");
      fetchRoomsWithImages();
    } catch (error) {
      toast.error("Error saving room");
    }
  };
  
  const handleDelete = async (roomId, roomNumber) => {
    try {
      await axios.delete(`/api/rooms/${roomId}`);
      await deleteImageFromDB(roomNumber);
      toast.success("Room deleted");
      fetchRooms();
    } catch (error) {
      toast.error("Error deleting room");
    }
  };
  
  const handleImageChange = (e, roomNumber) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        await saveImageToDB(roomNumber, reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Room Management</h1>
      
      <div className="flex gap-4">
        <Input placeholder="Search by Room Number" value={search} onChange={(e) => setSearch(e.target.value)} required />
        <Button onClick={handleSearch}>Search</Button>
      </div>
      
      <form onSubmit={handleCreateOrUpdate} className="space-y-4 bg-gray-100 p-4 rounded-lg">
      <h1 className="text-2xl font-bold">Add New Room</h1>
        <Input placeholder="Room Number" value={formData.number} onChange={(e) => setFormData({ ...formData, number: e.target.value })} required />
        <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} required className="w-full p-2 border rounded">
          <option value="single">Single</option>
          <option value="double">Double</option>
          <option value="suite">Suite</option>
        </select>
        <Input placeholder="Price" type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} required />
        <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} required className="w-full p-2 border rounded">
          <option value="available">Available</option>
          <option value="occupied">Occupied</option>
          <option value="maintenance">Maintenance</option>
        </select>
        <Input placeholder="Features (comma-separated)" value={formData.features} onChange={(e) => setFormData({ ...formData, features: e.target.value.split(",") })} required />
        <input 
  type="file" 
  accept="image/*" 
  onChange={(e) => handleImageChange(e, formData.number)} 
  className="w-full p-2 border rounded" 
/>
        <Button type="submit">Save Room</Button>
      </form>
      <h1 className="text-2xl font-bold"><center>List of All Rooms</center></h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {rooms.map((room) => (
  <motion.div key={room._id} whileHover={{ scale: 1.05 }}>
    <card>
      <CardContent className="p-4">
        {room.image && <img src={room.image} alt={`Room ${room.number}`} className="w-full h-40 object-cover rounded" />}
        <h2 className="font-bold">Room {room.number}</h2>
        <p>Type: {room.type}</p>
        <p>Price: ${room.price}</p>
        <p>Status: {room.status}</p>
        <p>Features: {room.features.join(", ")}</p>
        <Button className="mt-2" onClick={() => handleDelete(room._id, room.number)}>Delete</Button>
      </CardContent>
    </card>
  </motion.div>
))}

      </div>
    </div>
  );
}
