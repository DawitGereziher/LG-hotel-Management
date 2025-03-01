import { NextResponse } from "next/server"; // ✅ Import NextResponse
import connectDB from "../../../utils/db";
import Reservation from "../../models/reservation";
import Room from "../../models/room";
import { authenticate } from "../../middleware/auth";

export async function DELETE(req) {
  try {
    const authResponse = await authenticate(req);
    if (authResponse.error) return NextResponse.json(authResponse, { status: 401 });

    await connectDB();

    const searchParams = new URL(req.url).searchParams; // ✅ Fix for query params
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Reservation ID is required" }, { status: 400 });
    }

    const reservation = await Reservation.findById(id);
    if (!reservation) {
      return NextResponse.json({ error: "Reservation not found" }, { status: 404 });
    }

    await Room.findByIdAndUpdate(reservation.room, { status: "available" });
    await Reservation.findByIdAndDelete(id);

    return NextResponse.json({ message: "Reservation canceled successfully" }, { status: 200 });
  } catch (error) {
    console.error("Cancel reservation error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

