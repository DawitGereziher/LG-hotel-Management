import { NextResponse } from "next/server"; // ✅ Import NextResponse
import connectDB from "../../../utils/db";
import Room from "../../models/room";

export async function GET(req) {
  try {
    await connectDB();

    const id = req.nextUrl.searchParams.get("id"); // ✅ Correct way to get ID in App Router

    if (!id) {
      return NextResponse.json({ error: "Room ID is required" }, { status: 400 });
    }

    const room = await Room.findById(id);
    if (!room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    return NextResponse.json(room, { status: 200 });
  } catch (error) {
    console.error("Fetch room error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
