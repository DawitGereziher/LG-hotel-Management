import connectDB from "../../../utils/db";
import Reservation from "../../models/reservation";
import Room from "../../models/room";
import { authenticate } from "../../middleware/auth";
import { NextResponse } from "next/server";
export async function PUT(req) {
  try {
    const authResponse = await authenticate(req);
    if (authResponse.error) return NextResponse.json(authResponse, { status: 401 });

    await connectDB();

    const searchParams = new URL(req.url).searchParams; // ✅ Fix for query params
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Reservation ID is required" }, { status: 400 });
    }

    const updates = await req.json(); // ✅ Fix to parse request body

    const updatedReservation = await Reservation.findByIdAndUpdate(id, updates, { new: true }).populate("room");

    if (!updatedReservation) {
      return NextResponse.json({ error: "Reservation not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Reservation updated successfully", reservation: updatedReservation }, { status: 200 });
  } catch (error) {
    console.error("Update reservation error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

