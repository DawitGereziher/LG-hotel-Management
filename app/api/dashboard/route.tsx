import { NextResponse } from "next/server";
import connectDB from "../../utils/db";
import Reservation from "../models/reservation";
import Room from "../models/room";
import Staff from "../models/staff";
import { authenticate } from "../middleware/auth";
import { NextApiRequest, NextApiResponse } from "next";

// Helper function to get start and end date of the current week
function getCurrentWeekDates() {
  const today = new Date();
  const firstDayOfWeek = today.getDate() - today.getDay(); // Get the first day of the week (Sunday)
  const lastDayOfWeek = firstDayOfWeek + 6; // Get the last day of the week (Saturday)

  const startOfWeek = new Date(today.setDate(firstDayOfWeek));
  const endOfWeek = new Date(today.setDate(lastDayOfWeek));

  return { startOfWeek, endOfWeek };
}

export async function GET(req) {
  try {
    // Authenticate user
    /*
    const authResult = await authenticate(req);
    if (!authResult.Authorization) {
      return NextResponse.json({ error: authResult.error }, { status: 401 });
    }
*/
    // Connect to the database
    await connectDB();

    // Get current week's start and end date
    const { startOfWeek, endOfWeek } = getCurrentWeekDates();

    // 1. Available Rooms
    const availableRoomsCount = await Room.countDocuments({ status: "available" });

    // 2. New Reservations (for this week)
    const newReservationsCount = await Reservation.countDocuments({
      checkInDate: { $gte: startOfWeek, $lte: endOfWeek },
    });

    // 3. Check-ins (for this week)
    const checkInCount = await Reservation.countDocuments({
      checkInDate: { $gte: startOfWeek, $lte: endOfWeek },
      status: "Paid", // Assuming "Paid" means checked-in
    });

    // 4. Check-outs (for this week)
    const checkOutCount = await Reservation.countDocuments({
      checkOutDate: { $gte: startOfWeek, $lte: endOfWeek },
    });

    // 5. Active vs Inactive Staff
    const activeStaffCount = await Staff.countDocuments({ status: "active" });
    const inactiveStaffCount = await Staff.countDocuments({ status: "inactive" });

    // 6. Payment Analytics
    const reservations = await Reservation.find({}); // Fetch all reservations
    let totalRevenue = 0;
    let outstandingBalances = 0;
    let paymentsReceivedThisWeek = 0;

    reservations.forEach((reservation) => {
      const { totalAmount, amountPaid, checkInDate } = reservation;

      totalRevenue += totalAmount;
      outstandingBalances += Math.max(0, totalAmount - amountPaid);

      // If the reservation's check-in date is within the current week, add to payments received
      if (new Date(checkInDate) >= startOfWeek && new Date(checkInDate) <= endOfWeek) {
        paymentsReceivedThisWeek += amountPaid;
      }
    });

    // Return the response with all necessary data for the dashboard
    return NextResponse.json({
      availableRoomsCount,
      newReservationsCount,
      checkInCount,
      checkOutCount,
      activeStaffCount,
      inactiveStaffCount,
      totalRevenue,
      outstandingBalances,
      paymentsReceivedThisWeek,
    }, { status: 200 });

  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
