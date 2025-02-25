import { NextResponse } from "next/server"; // ✅ Import NextResponse
import connectDB from "../../../utils/db";
import Room from "../../models/room";
import { authenticate } from "../../../middleware/auth";

export async function POST(req) {
  try {
   /* const authResult = await authenticate(req);
    if (authResult.error) {
      return NextResponse.json(authResult, { status: authResult.status });
    }

    if (authResult.user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }*/

    await connectDB();

    const { number, type, price, features } = await req.json(); // ✅ Use `await req.json()`
    
    // Ensure room number is unique
    const existingRoom = await Room.findOne({ number });
    if (existingRoom) {
      return NextResponse.json({ error: "Room number already exists" }, { status: 400 });
    }

    // Create new room
    const newRoom = await Room.create({ number, type, price, features });

    return NextResponse.json({ message: "Room added successfully", room: newRoom }, { status: 201 });

  } catch (error) {
    console.error("Add room error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
