import { NextResponse } from "next/server";
import connectDB from "../../utils/db";
import Reservation from "../models/reservation";
import { authenticate } from "../../middleware/auth";

// ✅ Fix: Use named export for GET method
export async function GET(req) {
  try {
    // ✅ Authenticate User
    /*const authResult = await authenticate(req);
    if (!authResult.success) {
      return NextResponse.json({ error: authResult.error }, { status: 401 });
    }*/

    await connectDB();
    const reservations = await Reservation.find({});

    let totalRevenue = 0;
    let outstandingBalances = 0;
    let dailyRevenue = {};

    reservations.forEach(reservation => {
      const { checkInDate, checkOutDate, roomPrice, additionalCharges, amountPaid } = reservation;
      const nights = Math.ceil((new Date(checkOutDate) - new Date(checkInDate)) / (1000 * 60 * 60 * 24));

      const totalCost = roomPrice * nights + (additionalCharges || 0);
      totalRevenue += totalCost;
      outstandingBalances += Math.max(0, totalCost - amountPaid);

      const date = new Date(checkInDate).toISOString().split("T")[0];
      dailyRevenue[date] = (dailyRevenue[date] || 0) + totalCost;
    });

    return NextResponse.json({ totalRevenue, outstandingBalances, dailyRevenue }, { status: 200 });

  } catch (error) {
    console.error("Fetch financial data error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
