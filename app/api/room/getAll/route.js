import { NextResponse } from "next/server"; // ✅ Import NextResponse
import connectDB from "../../../utils/db";
import Room from "../../models/room";

export async function GET() {
  try {
    await connectDB();
    const rooms = await Room.find({});
    
    return NextResponse.json(rooms, { status: 200 });
  } catch (error) {
    console.error("Fetch rooms error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
