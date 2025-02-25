import connectDB from "../../../utils/db";
import { NextResponse } from "next/server";
import Reservation from "../../models/reservation";
import Room from "../../models/room";

export async function GET() {
  try {
    await connectDB();
    const reservations = await Reservation.find({}).populate("room");

    return NextResponse.json(reservations, { status: 200 });
  } catch (error) {
    console.error("Fetch reservations error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
