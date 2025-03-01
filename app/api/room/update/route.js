import { NextResponse } from "next/server"; // ✅ Import NextResponse
import connectDB from "../../../utils/db";
import Room from "../../models/room";
import { authenticate } from "../../middleware/auth";

export async function PUT(req) {
  try {
    const authResult = await authenticate(req);
    if (authResult.error) {
      return NextResponse.json(authResult, { status: authResult.status });
    }

    if (authResult.user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }

    await connectDB();

    const id = req.nextUrl.searchParams.get("id"); // ✅ Get ID from URL params
    const updates = await req.json(); // ✅ Get request body

    const updatedRoom = await Room.findByIdAndUpdate(id, updates, { new: true });

    if (!updatedRoom) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Room updated successfully", room: updatedRoom }, { status: 200 });

  } catch (error) {
    console.error("Update room error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
