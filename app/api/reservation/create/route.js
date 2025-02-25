import connectDB from "../../../utils/db";
import { NextResponse } from "next/server";
import Reservation from "../../models/reservation";
import Room from "../../models/room";
import { authenticate } from "../../../middleware/auth";

export async function POST(req) {
  try {
    const body = await req.json(); // ✅ Parse request body
    const authResponse = await authenticate(req);
    if (authResponse.error) return NextResponse.json(authResponse, { status: 401 });

    await connectDB();

    const { roomId, guestName, guestContact, guestAddress, guestIdNumber, checkInDate, checkOutDate, additionalServices, amountPaid } = body;

    const room = await Room.findById(roomId);
    if (!room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    if (room.status !== "available") {
      return NextResponse.json({ error: "Room is not available" }, { status: 400 });
    }

    const nightsStayed = Math.ceil((new Date(checkOutDate) - new Date(checkInDate)) / (1000 * 60 * 60 * 24));
    const totalAmount = (room.price * nightsStayed) + (additionalServices || 0);
    const balanceDue = totalAmount - (amountPaid || 0);
    const status = balanceDue === 0 ? "Paid" : (amountPaid > 0 ? "Partially Paid" : "Pending");

    const newReservation = await Reservation.create({
      room: roomId,
      guestName,
      guestContact,
      guestAddress,
      guestIdNumber,
      checkInDate,
      checkOutDate,
      additionalServices,
      totalAmount,
      amountPaid,
      balanceDue,
      status,
    });

    await Room.findByIdAndUpdate(roomId, { status: "occupied" });

    return NextResponse.json({ message: "Reservation created successfully", reservation: newReservation }, { status: 201 });
  } catch (error) {
    console.error("Reservation error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}