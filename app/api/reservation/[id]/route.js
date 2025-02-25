import { NextResponse } from "next/server"; // ✅ Import NextResponse
import connectDB from "../../../utils/db";
import Reservation from "../../models/reservation";

export async function GET(req) {
  try {
    await connectDB();

    const searchParams = new URL(req.url).searchParams; // ✅ Fix for query params
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Reservation ID is required" }, { status: 400 });
    }

    const reservation = await Reservation.findById(id).populate("room");
    if (!reservation) {
      return NextResponse.json({ error: "Reservation not found" }, { status: 404 });
    }

    return NextResponse.json(reservation, { status: 200 });
  } catch (error) {
    console.error("Fetch Reservation error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
