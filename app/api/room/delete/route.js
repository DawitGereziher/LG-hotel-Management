import { NextResponse } from "next/server";
import connectDB from "../../../utils/db";
import Room from "../../models/room";
import { authenticate } from "../../middleware/auth";

export async function DELETE(req) {
  try {
    const authResult = await authenticate(req);
    if (authResult.error) {
      return NextResponse.json(authResult, { status: authResult.status });
    }

    if (authResult.user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }

    await connectDB();

    const id = req.nextUrl.searchParams.get("id"); 

    const deletedRoom = await Room.findByIdAndDelete(id);
    if (!deletedRoom) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Room deleted successfully" }, { status: 200 });

  } catch (error) {
    console.error("Delete room error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
