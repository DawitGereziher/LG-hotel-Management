import { NextResponse } from "next/server"; // ✅ Import NextResponse
import connectDB from "../../../utils/db";
import Staff from "../../models/staff";
import { authenticate } from "../../middleware/auth";

export async function GET(req) {
  try {
    await connectDB();

    // Authenticate admin before proceeding
    const isAdmin = await authenticate(req);
    if (!isAdmin) {
      return NextResponse.json({ error: "Forbidden: Access denied" }, { status: 403 });
    }

    // Fetch staff list excluding passwords
    const staffList = await Staff.find({}, "-password");

    return NextResponse.json(staffList, { status: 200 });
  } catch (error) {
    console.error("Fetch staff error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
